// Brings a copy of the live Payload SQLite DB up to the current schema without Payload's interactive
// dev push (which asks "create or rename?" for every new table and breaks rebuilding tables).
//   node scripts/db-prep.mjs <target.db> <reference.db>
// <reference.db> is an empty DB the current config has pushed its schema into (see CLAUDE.md).
// Drops retired tables and columns, creates new tables and indexes, adds new columns, then rebuilds
// any table whose definition still differs, copying rows across. Runs in one transaction.
import { DatabaseSync } from 'node:sqlite'
const [targetPath, refPath] = process.argv.slice(2)
const db = new DatabaseSync(targetPath)
const ref = new DatabaseSync(refPath)
const skip = (n) => n.startsWith('sqlite_') || n.startsWith('__drizzle') || n.startsWith('__new_')
const tables = (d) =>
  new Map(
    d.prepare("select name, sql from sqlite_master where type='table'").all().filter((r) => !skip(r.name)).map((r) => [r.name, r.sql]),
  )
const cols = (d, t) => d.prepare(`pragma table_info("${t}")`).all().map((c) => c.name)
const T = tables(db)
const R = tables(ref)
db.exec('PRAGMA foreign_keys=OFF')
db.exec('BEGIN')
const log = []
for (const t of T.keys()) {
  if (!R.has(t)) {
    db.exec(`DROP TABLE "${t}"`)
    log.push(`drop table ${t}`)
    continue
  }
  const keep = cols(ref, t)
  for (const c of cols(db, t)) {
    if (!keep.includes(c)) {
      for (const i of db.prepare(`pragma index_list("${t}")`).all()) {
        if (db.prepare(`pragma index_info("${i.name}")`).all().some((x) => x.name === c)) db.exec(`DROP INDEX "${i.name}"`)
      }
      db.exec(`ALTER TABLE "${t}" DROP COLUMN "${c}"`)
      log.push(`drop column ${t}.${c}`)
    }
  }
}
const refIndexes = ref.prepare("select name, tbl_name, sql from sqlite_master where type='index' and sql is not null").all()
for (const [t, sql] of R) {
  if (!T.has(t)) {
    db.exec(sql)
    for (const i of refIndexes.filter((x) => x.tbl_name === t)) db.exec(i.sql)
    log.push(`create table ${t}`)
    continue
  }
  const have = cols(db, t)
  for (const c of cols(ref, t)) {
    if (have.includes(c)) continue
    const def = sql.split('\n').map((l) => l.trim().replace(/,$/, '')).find((l) => l.startsWith(`\`${c}\``))
    if (!def) throw new Error(`no definition for ${t}.${c}`)
    const fk = sql.match(new RegExp(`FOREIGN KEY \\(\`${c}\`\\) REFERENCES (\`\\w+\`\\(\`\\w+\`\\))( ON UPDATE [a-z ]+? ON DELETE (?:set null|cascade|no action|restrict))`))
    db.exec(`ALTER TABLE "${t}" ADD COLUMN ${def}${fk ? ` REFERENCES ${fk[1]}${fk[2]}` : ''}`)
    for (const i of refIndexes.filter((x) => x.tbl_name === t)) {
      const exists = db.prepare("select 1 from sqlite_master where type='index' and name=?").get(i.name)
      if (!exists && i.sql.includes(`\`${c}\``)) db.exec(i.sql)
    }
    log.push(`add column ${t}.${c}`)
  }
}
// Tables whose definition still differs (column defaults, constraints): rebuild them in the
// reference shape and copy the rows across, so the schema ends up identical to the reference.
const norm = (s) => s.replace(/\s+/g, ' ').trim()
for (const [t, sql] of R) {
  const cur = db.prepare("select sql from sqlite_master where type='table' and name=?").get(t)?.sql
  if (!cur || norm(cur) === norm(sql)) continue
  const shared = cols(ref, t).filter((c) => cols(db, t).includes(c)).map((c) => `"${c}"`).join(', ')
  const tmp = `__prep_${t}`
  db.exec(sql.replace(/^CREATE TABLE `[^`]+`/, `CREATE TABLE \`${tmp}\``))
  db.exec(`INSERT INTO "${tmp}" (${shared}) SELECT ${shared} FROM "${t}"`)
  db.exec(`DROP TABLE "${t}"`)
  db.exec(`ALTER TABLE "${tmp}" RENAME TO "${t}"`)
  for (const i of refIndexes.filter((x) => x.tbl_name === t)) {
    if (!db.prepare("select 1 from sqlite_master where type='index' and name=?").get(i.name)) db.exec(i.sql)
  }
  log.push(`rebuild table ${t}`)
}
const fkErrors = db.prepare('PRAGMA foreign_key_check').all()
if (fkErrors.length) throw new Error(`foreign key problems: ${JSON.stringify(fkErrors.slice(0, 5))}`)
db.exec('COMMIT')
console.log(log.join('\n'))
console.log(`${log.length} changes`)
