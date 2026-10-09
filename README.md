# Pixeldev monorepo

pnpm workspaces + Turborepo. The marketing site lives in `apps/web`: Next.js 16 with Payload CMS 3 running inside it (admin at `/admin`, REST at `/api`).

## Getting started

```sh
pnpm install
cp apps/web/.env.example apps/web/.env   # set PAYLOAD_SECRET and the seed admin login
pnpm seed                                 # creates the admin user and loads the site content
pnpm dev                                  # http://localhost:3000, admin at /admin
```

`pnpm seed` is safe to re-run: it skips the content collections when they already have documents and always refreshes the page globals. `RESET=1 pnpm seed` wipes services, work, journal posts and topics and loads them again.

## Layout

```
apps/web
  src/payload.config.ts      Payload config (SQLite via libsql, Lexical editor)
  src/collections            services, work, posts, topics, enquiries, media, users
  src/globals                site settings, home, services/work/about/contact/journal pages
  src/fields                 shared field builders (slug, figure, cta, stats)
  src/seed                   content seed, written from the design
  src/app/(payload)          Payload admin + API routes (generated, leave alone)
  src/app/(frontend)         the public site
  src/components             header, footer, figure, rich text, cards, ui primitives
  src/lib                    data access (cached Payload local API calls) and helpers
packages/                    shared packages go here as the monorepo grows
```

## Content model

- **Services** (`/services/[slug]`): listing copy for the home page and index, plus a full page (hero, figure, pain points, offerings, approach, optional plans, related work, FAQs, closing CTA).
- **Work** (`/work`, `/work/[slug]`): products, client projects and anonymised projects. Toggle "Publish a case study page" to get a full case study with narrative sections, stats, quote and sidebar.
- **Posts** (`/journal`, `/journal/[slug]`): drafts and publishing, topics, cover, Lexical body. The article sidebar table of contents is built from the H2/H3 headings.
- **Enquiries**: contact form submissions. The form is a server action; a honeypot field drops bots. Each new enquiry is emailed to `ENQUIRY_NOTIFY_TO` (or the Site settings email) with Reply-To set to the sender.
- **Media**: uploads with `card` and `wide` sizes. Every image field has a placeholder note that renders in a grey box until an image is uploaded.

Square-bracket placeholders in the seeded copy (`[YEAR]`, `[N]`, `[YOUR ABN]`) are meant to be filled in through the admin.

## Email

Sent through Postmark's API by a small adapter in `src/lib/postmark.ts` (no extra dependencies). Set `POSTMARK_SERVER_TOKEN`, `EMAIL_FROM_ADDRESS` and `EMAIL_FROM_NAME` in `.env`; the from address must be a verified sender signature or on a verified domain in Postmark. With no token set, Payload logs emails to the console instead. This covers enquiry notifications and the admin's password reset emails.

## SEO

- Every page, service, case study and post has an **SEO** group in the admin (title, description, share image, hide from search). Blank fields fall back to the page heading and intro.
- **Site settings → Business details** feeds the `ProfessionalService` structured data (Melbourne, VIC, areas served). Add a phone number and postcode there.
- Generated routes: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/og?title=` (share cards), `/logo.png`.
- `robots.txt` blocks everything unless `NODE_ENV=production` and `NEXT_PUBLIC_SERVER_URL` is the live domain, so previews stay out of Google.
- Melbourne-targeted titles and descriptions live in `src/seed/seo.ts`.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | dev servers via Turbo |
| `pnpm build` | production build (`output: standalone`) |
| `pnpm lint` / `pnpm typecheck` | ESLint / `tsc --noEmit` |
| `pnpm web generate:types` | regenerate `payload-types.ts` after changing collections |
| `pnpm web generate:importmap` | regenerate the admin import map after adding custom admin components |

## Database

Local development uses a SQLite file (`apps/web/payload.db`, gitignored). Schema changes are pushed automatically in development (`push: true`). For production, either keep libsql with a Turso URL or switch to `@payloadcms/db-postgres` and run `payload migrate`.
