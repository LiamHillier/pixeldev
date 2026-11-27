@AGENTS.md

# Pixeldev site

`apps/web` is pixeldev.com.au: Next.js App Router plus Payload CMS on SQLite. Pages are statically rendered with ISR (`revalidate = 60`).

## Deploying

Pushing to `main` deploys nothing: the Dokploy service has autodeploy off and runs an image built on the server. Deploy only when the user asks. Every step below is the deploy; a deploy is done when step 8 passes.

**Where things live**
- Server: SSH alias `vultrserver`, folder `/home/deploy/pixeldev-next/`.
  - `src/`: the code the image is built from. It is a plain upload, not a git checkout.
  - `data/payload.db`: the live DB, mounted at `/data`.
  - `media/`: uploads.
  - `compose.yml`, `.env`.
- Dokploy UI (tailnet): http://100.79.106.4:3000/dashboard/project/vFtOIrZsDACNS9Odfj3of/environment/9CUDZg92VuD5Bi5TNOYCl/services/compose/LtWEXhViKqN4lA9rPRI3B
  - Project "Pixeldev-Websites", compose service "pixeldev", image `pixeldev-web:latest`, container `pixeldevwebsites-pixeldev-7mtsho-web-1`.
- The Dockerfile reads `apps/web/payload.db` at build time, because static pages render from it. The build context must hold a DB with the schema of the code being built.

**Steps** (`D=/home/deploy/pixeldev-next`; `<tag>` is the date plus a letter, e.g. `20261128a`)
1. Commit and push `main`.
2. Snapshot the live DB: `ssh vultrserver "md5sum $D/data/payload.db"` and keep the hash, then copy `data/payload.db` down to a local scratch folder.
3. Prepare the DB for the build:
   - If the schema changed (fields in `src/collections`, `src/globals` or `src/fields`), run "Schema changes" below on the local copy.
   - If the copy in `src/seed/copy` changed, run `DATABASE_URL=file:<copy> PAYLOAD_SECRET=x pnpm sync:copy` in `apps/web`.
   - Otherwise the unchanged live copy is the build DB.
4. Upload:
   - `git archive main | ssh vultrserver "rm -rf $D/src-new && mkdir $D/src-new && tar -x -C $D/src-new"`.
   - Put the build DB at `$D/src-new/apps/web/payload.db`.
   - If the DB changed, also upload it as `$D/payload.db.new`.
5. Build on the server:
   - `docker tag pixeldev-web:latest pixeldev-web:rollback-<tag>`
   - `nohup docker build -t pixeldev-web:latest src-new > build-<tag>.log 2>&1 &` (run in `$D`).
   - Done when the log shows `naming to docker.io/library/pixeldev-web:latest done`. `pgrep` on the build command also matches itself, so read the log instead.
6. Swap, in `$D`:
   - If the DB changed, the live md5 must still equal the step 2 hash; if it moved, an enquiry or admin edit landed, so start again from step 2. Then `cp -p data/payload.db data/payload.db.bak-<tag>` and `cp payload.db.new data/payload.db`.
   - Then `mv src src.bak-<tag> && mv src-new src`.
7. Redeploy: in the Dokploy UI, click **Deploy**, then **Confirm**. Do this straight after a DB swap, because the running container keeps writing to the old file until it restarts.
8. Verify:
   - `docker inspect <container> --format '{{.Image}}'` matches the new image.
   - Every public page, `/admin`, `/llms.txt` and `/sitemap.xml` return 200.
   - The changed copy shows on the live HTML.
   - `docker logs --since 10m <container>` shows no errors.

**Content-only edits** (copy, no code): update the live DB in place and skip the deploy. Pages re-render within a minute.
- Back up `data/payload.db` first.
- The server has no `sqlite3` CLI. Use `docker exec <container> node --experimental-sqlite -e "…"` with `node:sqlite` on `/data/payload.db`.
- Mirror the change in `src/seed/copy`, so the next `sync:copy` keeps it.

**Schema changes.** Production runs with Payload's schema push off (`push: NODE_ENV !== 'production'`). The dev push is interactive: it asks "create or rename?" and hangs unattended, and it fails rebuilding tables when defaults change. So migrate the DB copy with the repo script:
1. Create a reference DB with the new schema: `DATABASE_URL=file:<empty-new>.db PAYLOAD_SECRET=x pnpm sync:copy` on a path that doesn't exist yet. The "service not found" lines are expected.
2. `node scripts/db-prep.mjs <live-copy>.db <empty-new>.db`. It drops retired tables and columns, which loses their data on purpose, so read its log and confirm each drop is intended.
3. `pnpm sync:copy` against the live copy. It should finish with no prompts, then the copy is the build DB.

**Rollback:** retag `pixeldev-web:rollback-<tag>` as `latest`, restore `data/payload.db.bak-<tag>` and `src.bak-<tag>`, then Deploy in Dokploy.
