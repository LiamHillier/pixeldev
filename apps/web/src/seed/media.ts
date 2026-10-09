import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import type { getPayload } from 'payload'

type P = Awaited<ReturnType<typeof getPayload>>

/** Uploads a local image to Media, or replaces the file and alt text if one with that name exists. */
export async function upsertMedia(payload: P, path: string, alt: string, name = basename(path)) {
  const found = await payload.find({
    collection: 'media',
    where: { filename: { equals: name } },
    limit: 1,
    depth: 0,
  })
  const data = await readFile(path)
  const mimetype = name.endsWith('.jpg') ? 'image/jpeg' : 'image/png'
  const file = { data, name, mimetype, size: data.length }
  const doc = found.docs[0]
    ? await payload.update({
        collection: 'media',
        id: found.docs[0].id,
        data: { alt },
        file,
        overwriteExistingFiles: true,
      })
    : await payload.create({ collection: 'media', data: { alt }, file })
  return doc.id
}
