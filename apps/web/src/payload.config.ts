import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Enquiries } from './collections/Enquiries'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Services } from './collections/Services'
import { Topics } from './collections/Topics'
import { Users } from './collections/Users'
import { Work } from './collections/Work'
import { Home } from './globals/Home'
import { AboutPage, ContactPage, JournalPage, ServicesPage, WorkPage } from './globals/Pages'
import { Site } from './globals/Site'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' | Pixeldev' },
  },
  collections: [Services, Work, Posts, Topics, Enquiries, Media, Users],
  globals: [Site, Home, ServicesPage, WorkPage, AboutPage, ContactPage, JournalPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./payload.db' },
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  upload: { limits: { fileSize: 10_000_000 } },
})
