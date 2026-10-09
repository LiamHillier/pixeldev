/**
 * Seeds the CMS with the content from the Pixeldev design.
 *
 *   pnpm seed              first run, or when the content collections are empty
 *   RESET=1 pnpm seed      wipe services, work, posts, topics and re-seed (globals are always overwritten)
 *
 * Square-bracket placeholders like [YEAR] are intentional: fill them in the admin.
 */
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '@payload-config'
import { h2, ol, p, richText } from './lexical'
import { upsertMedia } from './media'
import { seedSeo, siteSeo } from './seo'

const log = (msg: string) => console.log(`[seed] ${msg}`)

async function run() {
  log('starting')
  const payload = await getPayload({ config })
  log('payload ready')
  const reset = process.env.RESET === '1'

  // Admin user ---------------------------------------------------------------
  const users = await payload.count({ collection: 'users' })
  if (users.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
    const password = process.env.SEED_ADMIN_PASSWORD || 'change-me'
    await payload.create({ collection: 'users', data: { email, password, name: 'Liam Hillier' } })
    log(`admin user created: ${email}`)
  }

  // Globals ------------------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site',
    data: {
      name: 'Pixeldev',
      ownerName: 'Liam Hillier',
      tagline:
        'Software, AI and integrations for businesses that have outgrown their spreadsheets.',
      locationLine: 'Melbourne, working Australia-wide.',
      email: 'hello@pixeldev.com.au',
      supportEmail: 'support@pixeldev.com.au',
      linkedin: 'https://www.linkedin.com',
      abn: '[YOUR ABN]',
      nav: [
        { label: 'Services', href: '/services' },
        { label: 'Work', href: '/work' },
        { label: 'Journal', href: '/journal' },
        { label: 'About', href: '/about' },
      ],
      headerCtaLabel: 'Start a project',
      products: [
        { label: 'SquareSync for Woo', href: 'https://squaresyncforwoo.com' },
        { label: 'CloudPerch', href: 'https://cloudperch.io' },
        { label: 'OnCloudWine', href: '/work' },
      ],
      legalLinks: [
        { label: 'Privacy', href: '/' },
        { label: 'Terms', href: '/' },
      ],
      ...siteSeo,
    },
  })
  log('site global')

  // Content collections ------------------------------------------------------
  const existing = await payload.count({ collection: 'services' })
  if (existing.totalDocs > 0 && !reset) {
    log('content already present; skipping collections (RESET=1 to wipe and re-seed)')
  } else {
    if (reset) {
      for (const collection of ['posts', 'topics', 'work', 'services'] as const) {
        await payload.delete({ collection, where: { id: { exists: true } } })
      }
      log('content collections wiped')
    }
    await seedCollections(payload)
  }

  await seedPageGlobals(payload)
  await seedSeo(payload)
  log('seo')
  log('done')
  process.exit(0)
}

type P = Awaited<ReturnType<typeof getPayload>>

async function seedCollections(payload: P) {
  // Work -----------------------------------------------------------------------
  const squaresync = await payload.create({
    collection: 'work',
    data: {
      title: 'SquareSync for Woo',
      slug: 'squaresync-for-woo',
      kind: 'product',
      featured: true,
      order: 10,
      category: 'Plugin, WooCommerce and Square',
      summary:
        'Keeps products, stock and orders in step between WooCommerce and Square, both directions. Handles the ugly parts: webhooks that go missing, WP cron that doesn’t fire, Square API limits.',
      externalUrl: 'https://squaresyncforwoo.com',
      image: { placeholder: 'Screenshot: SquareSync sync log and settings' },
      stats: [
        { value: '[N]', label: 'paying subscribers' },
        { value: '[N]', label: 'countries' },
      ],
    },
  })

  await payload.create({
    collection: 'work',
    data: {
      title: 'OnCloudWine',
      slug: 'oncloudwine',
      kind: 'product',
      order: 20,
      category: 'SaaS, wine industry',
      summary:
        'A wine club management platform for wineries. [One or two lines on what it does for members, releases and payments.]',
      image: { placeholder: 'Screenshot: OnCloudWine member dashboard' },
      stats: [
        { value: '[N]', label: 'wineries' },
        { value: '[N]', label: 'club members managed' },
      ],
    },
  })

  const cloudperch = await payload.create({
    collection: 'work',
    data: {
      title: 'CloudPerch',
      slug: 'cloudperch',
      kind: 'product',
      featured: true,
      order: 30,
      category: 'Hosting, Next.js portal and Stripe',
      summary:
        'Managed WordPress hosting on Sydney servers with Cloudflare in front, a custom Next.js customer portal and Stripe billing. Four plans, from a single site to agency fleets.',
      externalUrl: 'https://cloudperch.io',
      image: { placeholder: 'Screenshot: CloudPerch customer portal' },
      stats: [
        { value: '[N]', label: 'sites hosted' },
        { value: '[99.9%]', label: 'uptime, last 12 months' },
      ],
    },
  })

  const bowery = await payload.create({
    collection: 'work',
    data: {
      title: 'Investor onboarding for Bowery',
      slug: 'bowery-investor-onboarding',
      kind: 'client',
      featured: true,
      order: 50,
      category: 'Workflow automation, private credit',
      summary:
        'An onboarding workflow for a private credit fund manager that takes an investor from first contact to a completed application, with the document collection, checks and follow-ups handled by the system rather than by email.',
      image: { placeholder: 'Screenshot: investor onboarding application flow' },
      stats: [
        { value: '[N days]', label: 'enquiry to completed application' },
        { value: '[N]', label: 'manual steps removed' },
      ],
    },
  })

  const aceRadio = await payload.create({
    collection: 'work',
    data: {
      title: 'ACE Radio Broadcasters',
      slug: 'ace-radio-broadcasters',
      kind: 'client',
      order: 60,
      category: 'WordPress, radio broadcasting',
      summary:
        'WordPress theme development for a regional radio network. [One or two lines on the scope: station sites, theme system, what changed for the team.]',
      image: { placeholder: 'Screenshot: ACE Radio station site' },
      stats: [{ value: '[N]', label: 'station sites' }],
    },
  })

  const takeshape = await payload.create({
    collection: 'work',
    data: {
      title: 'TakeShape Adventures CRM',
      slug: 'takeshape-adventures-crm',
      kind: 'client',
      featured: true,
      order: 40,
      category: 'Custom CRM, Next.js, adventure travel',
      summary:
        'A custom CRM and event operations dashboard for an adventure travel company whose members book through a mobile app. Events, attendees, memberships and the day-to-day ops in one place instead of four.',
      image: { placeholder: 'Screenshot: TSA CRM event operations dashboard' },
      stats: [
        { value: '[N]', label: 'events managed' },
        { value: '[N hrs]', label: 'admin saved per week' },
      ],
      caseStudy: {
        enabled: true,
        heading: 'A CRM built around how TakeShape Adventures actually runs its events.',
        intro:
          'An adventure travel company with members booking through a mobile app, and an ops team managing events across spreadsheets, inboxes and a generic CRM that didn’t know what an event was. I built the one that does.',
        meta: [
          { label: 'Client', value: 'TakeShape Adventures' },
          { label: 'Industry', value: 'Adventure travel' },
          { label: 'Services', value: 'Custom software, integrations' },
          { label: 'Stack', value: 'Next.js, [DATABASE], [HOSTING]' },
          { label: 'Timeline', value: '[N weeks], [YEAR]' },
        ],
        hero: {
          placeholder: 'Screenshot: TSA CRM event operations dashboard, full width',
          caption:
            'The event dashboard: capacity, attendees, logistics and communications for every upcoming trip in one view.',
        },
        bigStats: [
          { value: '[N]', label: 'events managed through the system' },
          { value: '[N hrs]', label: 'admin time saved each week' },
          { value: '[N] to 1', label: 'tools replaced by one system' },
        ],
        sections: [
          {
            heading: 'The problem',
            body: richText(
              p(
                'TakeShape runs group adventures. Members book into events through a mobile app, but everything after the booking lived somewhere else: attendee lists in spreadsheets, questions in email, and a generic CRM that treated an event like any other deal. [One or two lines in the client’s words about what that cost them day to day.]',
              ),
              p(
                'The team didn’t need a bigger CRM. They needed one that understood events, attendees and memberships as first-class things, and that talked to the app their members already used.',
              ),
            ),
          },
          {
            heading: 'What I built',
            body: richText(
              p(
                'A custom CRM in Next.js with an event operations dashboard at the centre of it. Each event carries its attendees, capacity, logistics and communications; each member carries their history across events. The booking app feeds it directly, so nothing is retyped.',
              ),
            ),
            steps: [
              {
                text: 'Event management: capacity, attendee lists, logistics and status in one view per event.',
              },
              { text: 'Member records that follow a person across every event they’ve booked.' },
              {
                text: 'Integration with the booking app, so a booking creates the attendee record the moment it happens.',
              },
              {
                text: 'Foundations for a paid membership tier: event discounts, member-only resources and a community dashboard.',
              },
            ],
            figure: {
              placeholder: 'Screenshot: single event view with attendee list',
              caption:
                'A single event, with its attendees, capacity and the notes the guides need on the day.',
            },
          },
          {
            heading: 'How it went',
            body: richText(
              p(
                'The team saw a working staging site in week [N] and used it alongside the old process until it had earned their trust. [What changed first, what they stopped doing, what surprised them.] The membership work is the next phase, built on the same records rather than bolted on.',
              ),
            ),
          },
        ],
        quote: {
          text: '[Client quote: one or two sentences in their own words about working with Liam and what the system changed.]',
          attribution: '[Name], [Role], TakeShape Adventures',
        },
        atAGlance: [
          { label: 'What they had', value: 'Spreadsheets, email and a generic CRM' },
          {
            label: 'What they have now',
            value: 'One CRM built around events and members, fed by the booking app',
          },
          { label: 'Still involved?', value: 'Yes. Hosting, support and the membership phase.' },
          { label: 'Built with', value: 'Next.js, [DATABASE], [HOSTING], the booking app’s API' },
        ],
        asideCta: {
          heading: 'Running a business on spreadsheets and goodwill?',
          body: 'Tell me how it works today and I’ll tell you what I’d build.',
          ctaLabel: 'Start a project',
        },
        moreWork: [bowery.id, squaresync.id],
      },
    },
  })

  const brokerage = await payload.create({
    collection: 'work',
    data: {
      title: 'Lead-to-settlement automation for a growing brokerage',
      slug: 'brokerage-automation',
      kind: 'anonymised',
      order: 70,
      category: 'Mortgage brokerage, automation',
      summary:
        'Enquiries qualified, documents collected and status updates sent without a broker touching a keyboard until a human decision was needed.',
      stats: [
        { value: '15 hrs', label: 'admin saved per week' },
        { value: '2×', label: 'applications processed' },
      ],
    },
  })

  const lawFirm = await payload.create({
    collection: 'work',
    data: {
      title: 'Automated intake and matter creation for a law firm',
      slug: 'law-firm-intake',
      kind: 'anonymised',
      order: 80,
      category: 'Law firm, AI intake',
      summary:
        'New enquiries read, classified and turned into draft matters in the practice system, with a lawyer approving each one before it goes live.',
      stats: [
        { value: '80%', label: 'less manual intake work' },
        { value: 'Same day', label: 'enquiry to matter' },
      ],
    },
  })

  const propertyGroup = await payload.create({
    collection: 'work',
    data: {
      title: 'Custom operations platform for a property group',
      slug: 'property-group-platform',
      kind: 'anonymised',
      order: 90,
      category: 'Property group, custom platform',
      summary:
        'Six disconnected tools replaced by one system built around how the team actually ran properties, with everyone looking at the same data.',
      stats: [
        { value: '6 to 1', label: 'tools replaced by one system' },
        { value: '100%', label: 'of data in one place' },
      ],
    },
  })
  log('work')

  // Services -------------------------------------------------------------------
  const ai = await payload.create({
    collection: 'services',
    data: {
      title: 'AI and automation',
      slug: 'ai-automation',
      order: 10,
      summary:
        'Document processing, enquiry routing and workflow automation with a person checking the parts that matter. Built around how you already work.',
      examples:
        'Invoices read into Xero. Enquiries sorted before anyone opens them. The Monday report built overnight.',
      indexIntro:
        'The admin that eats your week, done by software, with a person checking the parts that matter. I start from the process you already have, not from a demo of what AI can do.',
      indexItems: [
        { text: 'Document extraction into your CRM or accounting system' },
        { text: 'Enquiry classification and routing' },
        { text: 'AI agents with human-in-the-loop review' },
        { text: 'Onboarding, approvals and notification workflows' },
        { text: 'Automated reporting and reconciliation' },
        { text: 'Internal assistants trained on your own documents' },
      ],
      indexLinkLabel: 'About AI and automation',
      hero: {
        heading: 'AI that does the admin, with a person checking the parts that matter.',
        intro:
          'Document processing, enquiry handling, approvals and reporting, built into the tools you already use. I start from your process, not from a demo of what AI can do.',
        primaryCta: { label: 'Start a project', href: '/contact' },
        secondaryCta: { label: 'See related work', href: '/work' },
      },
      figure: {
        placeholder:
          'Diagram or screenshot: an intake queue with items routed automatically and one waiting for a person',
        caption:
          'The shape of most of this work: software handles the routine cases, a person handles the exceptions, and everything is logged.',
      },
      painPoints: {
        heading: 'Sound familiar?',
        items: [
          {
            title: 'Someone retypes PDFs into the CRM',
            body: 'Invoices, applications, signed forms. The data is right there, and a person keys it in anyway.',
          },
          {
            title: 'Enquiries wait for a human to triage them',
            body: 'Hot leads sit in the same inbox as spam and supplier newsletters until someone gets to it.',
          },
          {
            title: 'Monday is report-building day',
            body: 'Six exports, one spreadsheet, two hours. Every week. The same numbers in the same cells.',
          },
          {
            title: 'You tried ChatGPT and it didn’t stick',
            body: 'Chat isn’t a workflow. The useful version runs in the background, inside your systems, and only asks a person when it’s unsure.',
          },
        ],
      },
      offerings: {
        heading: 'What I build',
        intro:
          'Each of these plugs into the systems you already run. Nothing here needs you to move to a new platform.',
        items: [
          {
            title: 'Document extraction',
            body: 'PDFs, scans and emails read into structured records in your CRM, accounting or practice system, with a review queue for anything uncertain.',
          },
          {
            title: 'Enquiry classification and routing',
            body: 'Inbound email and forms sorted by intent and urgency, sent to the right person with the context already attached.',
          },
          {
            title: 'AI agents with a human in the loop',
            body: 'Multi-step tasks like drafting a quote or preparing an application, done by an agent and approved by a person before anything leaves the building.',
          },
          {
            title: 'Workflow automation',
            body: 'Onboarding, approvals, notifications and follow-ups that happen because a record changed, not because someone remembered.',
          },
          {
            title: 'Automated reporting and reconciliation',
            body: 'The Monday report built from the source systems and in your inbox before you are.',
          },
          {
            title: 'Internal assistants on your own documents',
            body: 'Staff asking questions of your policies, procedures and past work, with answers that cite where they came from.',
          },
        ],
      },
      approach: {
        heading: 'How I approach it',
        items: [
          {
            title: 'Human in the loop by default',
            body: 'Anything that touches money, clients or compliance gets a review step until the system has earned the right to skip it. You decide when that is.',
          },
          {
            title: 'Fail loudly, never silently',
            body: 'Logs, retries, confidence thresholds and alerts. When the model isn’t sure, it says so and a person gets a notification, not a wrong record.',
          },
          {
            title: 'Clear about where data goes',
            body: 'Which provider sees what, what gets stored and for how long, written into the scope before anything is built. [Add your data handling policy or link.]',
          },
        ],
      },
      relatedWork: [lawFirm.id, brokerage.id],
      faqs: [
        {
          question: 'Do I need to replace my CRM or accounting system?',
          answer:
            'No. Almost all of this sits around the systems you already have and writes into them. If a system genuinely needs replacing, I’ll say so, but that’s a separate conversation.',
        },
        {
          question: 'What does it cost to run?',
          answer:
            'Model usage is usually small next to the admin it replaces, but it’s not zero. I estimate the monthly running cost in the scope so there are no surprises on the first bill.',
        },
        {
          question: 'What happens when the AI gets it wrong?',
          answer:
            'That’s what the review step is for. Nothing irreversible happens without a person until you decide the system has earned it, and even then every action is logged so it can be traced and undone.',
        },
      ],
      closing: {
        heading: 'Which part of your week should a system be doing?',
        body: 'Describe the manual process and I’ll tell you what I’d automate first, and what I’d leave alone.',
        ctaLabel: 'Start a project',
      },
    },
  })

  const integrations = await payload.create({
    collection: 'services',
    data: {
      title: 'Integrations',
      slug: 'integrations',
      order: 20,
      summary:
        'APIs, webhooks and two-way sync between the systems you already pay for, with the logging and retries a chain of Zaps doesn’t have.',
      examples: 'WooCommerce, Square, Xero, MYOB, HubSpot, Stripe, and whatever comes next.',
      indexIntro:
        'Your systems already hold the data. The problem is that someone retypes it between them. I connect them properly, with error handling, logs and retries, so it keeps working when you’re not watching.',
      indexItems: [
        { text: 'WooCommerce to Square, Xero, MYOB and HubSpot' },
        { text: 'Custom API and webhook work' },
        { text: 'Two-way data sync with conflict handling' },
        { text: 'Stripe and payment platform integration' },
        { text: 'Replacing fragile Zapier and Make chains with code' },
        { text: 'Legacy system bridges and migrations' },
      ],
      indexLinkLabel: 'About integrations',
      hero: {
        heading: 'Your systems should talk to each other. Properly.',
        intro:
          'APIs, webhooks and two-way sync between the tools you already pay for, with the logging, retries and error handling that a chain of Zaps doesn’t have.',
        primaryCta: { label: 'Start a project', href: '/contact' },
        secondaryCta: { label: 'See related work', href: '/work' },
      },
      figure: {
        placeholder:
          'Diagram: WooCommerce, web forms and a booking app on the left, an integration layer with a queue in the middle, Square, Xero and HubSpot on the right',
        caption:
          'One small service in the middle, so every system talks to one place instead of to each other.',
      },
      painPoints: {
        heading: 'Sound familiar?',
        items: [
          {
            title: 'Orders here, invoices there, stock somewhere else',
            body: 'Three systems that each think they’re the source of truth, and a person reconciling them at the end of the week.',
          },
          {
            title: 'A Zapier chain that breaks at 2am',
            body: 'And nobody finds out until a customer asks where their order is.',
          },
          {
            title: 'Weekly CSV exports and imports by hand',
            body: 'It worked at 50 records a week. It doesn’t at 500.',
          },
          {
            title: 'A vendor API nobody wants to touch',
            body: 'Thin docs, odd rate limits, a sandbox that behaves differently to production. I’ve met a few.',
          },
        ],
      },
      offerings: {
        heading: 'What I build',
        intro:
          'Integrations that run as code you own, on your hosting or mine, with a log you can read when something looks off.',
        items: [
          {
            title: 'WooCommerce and Square sync',
            body: 'Products, inventory and orders kept in step in both directions. I wrote a plugin that does this for stores worldwide, so the edge cases are familiar.',
          },
          {
            title: 'Accounting: Xero and MYOB',
            body: 'Invoices, payments and contacts created from the systems where the work actually happens, reconciled automatically.',
          },
          {
            title: 'CRM sync: HubSpot, Salesforce and custom',
            body: 'Contacts, deals and activity flowing in from forms, email, your site and your billing system, without duplicates.',
          },
          {
            title: 'Payments: Stripe and Square',
            body: 'Subscriptions, invoicing, webhooks and the reconciliation that goes with them. I run my own products on Stripe billing.',
          },
          {
            title: 'Replacing no-code chains with code',
            body: 'When Zapier or Make has become load-bearing, I move it into a small service with proper error handling and a monthly bill that doesn’t scale with tasks.',
          },
          {
            title: 'Legacy bridges and migrations',
            body: 'Getting data out of the old system and into the new one, or keeping both alive while you move. Including the systems that only export CSVs.',
          },
        ],
      },
      approach: {
        heading: 'How I approach it',
        items: [
          {
            title: 'Safe to rerun, always logged',
            body: 'Every sync can be run twice without creating duplicates, and every record carries a trail of where it came from and when.',
          },
          {
            title: 'Built for the failure case',
            body: 'APIs go down, webhooks go missing, rate limits bite. Queues, retries and alerts mean you hear about it before your customer does.',
          },
          {
            title: 'Done this at scale',
            body: 'SquareSync runs for WooCommerce stores around the world. I know Square’s API quirks, WordPress cron, and what happens when a webhook arrives twice.',
          },
        ],
      },
      relatedWork: [squaresync.id, propertyGroup.id],
      faqs: [
        {
          question: 'Can you work with a system you haven’t used before?',
          answer:
            'If it has an API, a database, or even a CSV export, yes. The first step is a short look at the docs so I can tell you what’s possible before you commit to anything.',
        },
        {
          question: 'Why not just use Zapier?',
          answer:
            'For a simple one-way push, do. For anything involving money, stock, two directions or more than a few hundred records a month, you want code you own, with logs you can read.',
        },
        {
          question: 'Where does it run, and what does it cost monthly?',
          answer:
            'On your hosting or mine. If it’s mine, a care plan covers the server, monitoring and keeping it working as the APIs on either side change.',
        },
      ],
      closing: {
        heading: 'Which two systems should be talking already?',
        body: 'Name them and I’ll tell you how I’d connect them, what it would cost, and what could go wrong.',
        ctaLabel: 'Start a project',
      },
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      title: 'Custom software and CRMs',
      slug: 'custom-software',
      order: 30,
      summary:
        'Portals, CRMs, dashboards and internal tools in Next.js, for when the off-the-shelf option has you working around it.',
      examples:
        'The spreadsheet that became the business, replaced by something that knows what an event, a matter or an investor is.',
      indexIntro:
        'When the off-the-shelf tool makes you work around it, I build the one that fits. Portals, CRMs, dashboards and internal tools in Next.js, designed around how your team actually operates.',
      indexItems: [
        { text: 'Custom CRMs and pipeline tools' },
        { text: 'Client, member and investor portals' },
        { text: 'Operations dashboards and reporting' },
        { text: 'Booking, event and membership systems' },
        { text: 'Admin tools that replace the spreadsheet' },
        { text: 'SaaS products, from MVP to paying customers' },
      ],
      indexLinkLabel: 'About custom software',
      hero: {
        heading: 'Software that fits your business, instead of the other way around.',
        intro:
          'Portals, CRMs, dashboards and internal tools built in Next.js, designed around how your team actually operates. For when the off-the-shelf tool has you working around it.',
        primaryCta: { label: 'Start a project', href: '/contact' },
        secondaryCta: { label: 'Read a case study', href: '/work/takeshape-adventures-crm' },
      },
      figure: {
        placeholder: 'Screenshot: the TakeShape Adventures CRM, an event with its attendee list',
        caption:
          'A CRM that knows what an event is, because it was built for a business that runs them.',
      },
      painPoints: {
        heading: 'Sound familiar?',
        items: [
          {
            title: 'The spreadsheet has become the business',
            body: 'Forty tabs, three people who understand it, and a quiet fear of what happens if it breaks.',
          },
          {
            title: 'A CRM you pay for and work around',
            body: 'It thinks everything is a deal. Your business has events, matters, properties or members, and the CRM doesn’t know what those are.',
          },
          {
            title: 'Clients email for updates you could show them',
            body: '“Where’s my application up to?” is a portal, not an inbox.',
          },
          {
            title: 'The process lives in people’s heads',
            body: 'When they’re on leave, things stop. Software that encodes the process means it keeps running.',
          },
        ],
      },
      offerings: {
        heading: 'What I build',
        intro:
          'Plain, well-structured Next.js applications with a proper database, authentication, and the integrations your business already depends on. You own the code.',
        items: [
          {
            title: 'Custom CRMs and pipeline tools',
            body: 'Built around your actual objects: events, matters, properties, investors, members. Not deals and contacts with custom fields bolted on.',
          },
          {
            title: 'Client, member and investor portals',
            body: 'Secure logins where people can see their status, upload documents, make payments and stop emailing you for updates.',
          },
          {
            title: 'Operations dashboards',
            body: 'The numbers that matter, pulled live from the systems that hold them, on one screen the whole team trusts.',
          },
          {
            title: 'Booking, event and membership systems',
            body: 'Capacity, waitlists, renewals, discounts and the admin behind them, connected to your app or site.',
          },
          {
            title: 'Internal tools that replace the spreadsheet',
            body: 'Small, focused apps for the one process that’s outgrown Excel, built in weeks rather than months.',
          },
          {
            title: 'SaaS products, from MVP to paying customers',
            body: 'I’ve taken my own products from idea to subscribers, with billing, support and hosting. I can do it for yours.',
          },
        ],
      },
      approach: {
        heading: 'How I approach it',
        items: [
          {
            title: 'Start with the process, not the screens',
            body: 'The first week is spent understanding how work actually flows through your business today, including the workarounds. The software is designed to that, not to a feature list.',
          },
          {
            title: 'Ship a working slice early',
            body: 'One real process working end to end on a staging site before the rest gets built. You use it, you find what’s wrong, and the next slice is better for it.',
          },
          {
            title: 'Built to be maintained',
            body: 'Standard Next.js, a normal database, documented, no exotic stack. Another developer can pick it up. So can I, in two years, without archaeology.',
          },
        ],
      },
      relatedWork: [takeshape.id, bowery.id],
      faqs: [
        {
          question: 'Should I build custom or buy something off the shelf?',
          answer:
            'If a product fits 80% of what you do, buy it and I’ll integrate it. Custom is for when the other 20% is the business. I’ll tell you which one you’re in on the first call, even if the answer is “don’t hire me”.',
        },
        {
          question: 'Who owns the code?',
          answer:
            'You do. It lives in a repository you have access to from day one, and you can take it to another developer whenever you like.',
        },
        {
          question: 'What happens after launch?',
          answer:
            'I host it, monitor it and keep it patched under a care plan, with a block of hours each month for the next improvements. Or hand it to your team with documentation. Your call.',
        },
      ],
      closing: {
        heading: 'What’s the spreadsheet you’re afraid of?',
        body: 'Show me how the process works today and I’ll tell you what I’d build to replace it, and whether it’s worth it.',
        ctaLabel: 'Start a project',
      },
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      title: 'Websites and WooCommerce',
      slug: 'websites',
      order: 40,
      summary:
        'WordPress and WooCommerce done properly: fast, maintainable, and built so the next person can work on it without fear.',
      examples:
        'Custom blocks, checkout extensions, plugin work, migrations and large catalogue imports.',
      indexIntro:
        'WordPress and WooCommerce done properly: fast, maintainable, and built so the next developer (or you) can work on it without fear. Years of plugin and theme work behind it.',
      indexItems: [
        { text: 'New WordPress and WooCommerce builds' },
        { text: 'Custom blocks, ACF and theme development' },
        { text: 'Checkout extensions and plugin development' },
        { text: 'Performance and security fixes on existing sites' },
        { text: 'Shopify and multisite WordPress' },
        { text: 'Migrations and large catalogue imports' },
      ],
      indexLinkLabel: 'About websites',
      hero: {
        heading: 'WordPress and WooCommerce, built like software.',
        intro:
          'Fast, maintainable sites with custom blocks, checkout extensions and plugin work, from someone who has spent years inside WooCommerce and writes a plugin that stores around the world rely on.',
        primaryCta: { label: 'Start a project', href: '/contact' },
        secondaryCta: { label: 'See related work', href: '/work' },
      },
      figure: {
        placeholder:
          'Screenshot: a recent WordPress build, home page on desktop and phone side by side',
        caption:
          '[Project name]: a custom block theme, a checkout with pickup slots, and a nightly import of 2,400 products from a supplier feed.',
      },
      painPoints: {
        heading: 'Sound familiar?',
        items: [
          {
            title: 'A page-builder site that’s slow and fragile',
            body: 'Forty plugins, a theme nobody dares update, and a homepage that takes six seconds on a phone.',
          },
          {
            title: 'A checkout that needs something plugins don’t do',
            body: 'Pickup windows, deposits, trade pricing, custom fields that flow through to the order. The gap between “nearly” and “exactly”.',
          },
          {
            title: 'Thousands of products to import or move',
            body: 'Supplier feeds, a Shopify to Woo migration, or a catalogue that’s never been consistent.',
          },
          {
            title: 'The developer who built it has vanished',
            body: 'Most of my website work starts with a site someone else built. I’ll tell you honestly whether to fix it or start again.',
          },
        ],
      },
      offerings: {
        heading: 'What I build',
        intro:
          'Fewer plugins, more code you own, and an editing experience that makes sense to the person updating the site on a Tuesday afternoon.',
        items: [
          {
            title: 'New WordPress and WooCommerce builds',
            body: 'Custom themes built on the block editor, so editors get real blocks rather than a page builder’s idea of them.',
          },
          {
            title: 'Custom blocks, ACF and theme development',
            body: 'Blocks that match your content, ACF where it earns its place, and themes driven by design tokens so a restyle is a settings change.',
          },
          {
            title: 'Checkout extensions and plugin development',
            body: 'The exact checkout behaviour you need, written as a proper plugin with filters and hooks, not a snippet in functions.php.',
          },
          {
            title: 'Performance and security fixes on existing sites',
            body: 'Plugin audits, caching, image handling, Core Web Vitals, and cleaning up after a compromise when it’s already happened.',
          },
          {
            title: 'Shopify and multisite WordPress',
            body: 'Shopify builds and apps where that’s the right platform, and multisite networks for groups with many brands or locations.',
          },
          {
            title: 'Migrations and large catalogue imports',
            body: 'Moving platforms without losing orders or rankings, and scheduled imports from supplier feeds that keep thousands of products current.',
          },
        ],
      },
      approach: {
        heading: 'How I approach it',
        items: [
          {
            title: 'Lean builds',
            body: 'Every plugin is a dependency someone else controls. I’d rather write forty lines of code than install one that does a thousand things you don’t need.',
          },
          {
            title: 'Editors can actually edit',
            body: 'Custom blocks with the options you need and none you don’t. You shouldn’t need to call me to change a heading.',
          },
          {
            title: 'Measured, not guessed',
            body: 'Core Web Vitals on real devices before and after. If I tell you it’s faster, there’s a number behind it.',
          },
        ],
      },
      relatedWork: [aceRadio.id, squaresync.id],
      faqs: [
        {
          question: 'WordPress, or something else?',
          answer:
            'WordPress for content-heavy sites and WooCommerce for most stores; Shopify when its ecosystem fits better; Next.js when it’s really an app with a website attached. I’ll recommend the one that suits, not the one I feel like building.',
        },
        {
          question: 'Can you work with our designer?',
          answer:
            'Yes. Hand me the Figma file and I’ll build it faithfully, including the bits that are hard. If you don’t have a designer, I’ll put together a clean, structured layout and we’ll refine it on staging.',
        },
        {
          question: 'Can you fix a site someone else built?',
          answer:
            'That’s most of what comes through the door. I’ll look at it first and tell you plainly whether it’s worth fixing or faster to rebuild, with a price for each.',
        },
      ],
      closing: {
        heading: 'Send me the URL.',
        body: 'I’ll have a look at what’s there and come back with what I’d fix, what I’d leave, and what it would cost.',
        ctaLabel: 'Start a project',
      },
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      title: 'Hosting and ongoing care',
      slug: 'hosting',
      order: 50,
      summary:
        'Managed hosting on infrastructure I run, plus updates, backups, monitoring and a person to call when something breaks.',
      examples: 'Through CloudPerch for WordPress, dedicated servers for everything else.',
      indexIntro:
        'I run my own hosting business, CloudPerch, on infrastructure I manage. Your site or app can live there, with updates, backups, monitoring and someone who knows the code when something goes wrong.',
      indexItems: [
        { text: 'Managed WordPress hosting in Sydney' },
        { text: 'App hosting on dedicated servers with Docker' },
        { text: 'Updates, backups and uptime monitoring' },
        { text: 'Cloudflare, DNS and email deliverability' },
        { text: 'Monthly care plans with a block of dev hours' },
        { text: 'Security clean-ups and incident response' },
      ],
      indexLinkLabel: 'About hosting and care',
      hero: {
        heading: 'Hosting from someone who knows the code.',
        intro:
          'Managed WordPress hosting through CloudPerch, app hosting on dedicated servers, and monthly care plans so your site stays fast, patched and online. When something breaks, you talk to the person who can fix it.',
        primaryCta: { label: 'Talk about hosting', href: '/contact' },
        secondaryCta: { label: 'Visit CloudPerch', href: 'https://cloudperch.io' },
      },
      figure: {
        placeholder:
          'Screenshot: the CloudPerch customer portal, a site’s overview with backups, updates and uptime',
        caption:
          'The CloudPerch portal. I built it, I run the servers behind it, and I answer the support emails.',
      },
      painPoints: {
        heading: 'Sound familiar?',
        items: [
          {
            title: 'The host blames the site, the developer blames the host',
            body: 'And you’re in the middle with a site that’s down. When I host what I built, there’s nobody to pass it to.',
          },
          {
            title: 'Updates nobody runs',
            body: 'Because the last one broke the checkout. Updates should go to staging first, then live, every week, without you thinking about it.',
          },
          {
            title: 'No backup until the day you need one',
            body: 'Daily, off-site, and actually restored now and then to prove they work.',
          },
          {
            title: 'Your emails land in spam',
            body: 'SPF, DKIM and DMARC set up properly, and sending moved off the web server to something built for it.',
          },
        ],
      },
      offerings: {
        heading: 'What’s included',
        intro:
          'Boring, well-run infrastructure. Sydney servers for WordPress through CloudPerch, dedicated servers running Docker for custom apps, Cloudflare in front of everything.',
        items: [
          {
            title: 'Managed WordPress hosting',
            body: 'Through CloudPerch: Sydney-based servers, OpenLiteSpeed, Cloudflare, Stripe billing and a customer portal I built myself. Four plans from a single site to an agency fleet.',
          },
          {
            title: 'App hosting on dedicated servers',
            body: 'Next.js apps, integrations and services deployed with Docker on dedicated hardware I manage. No surprise cloud bills.',
          },
          {
            title: 'Updates, backups and monitoring',
            body: 'Weekly updates via staging, daily off-site backups, uptime checks that page me, not you.',
          },
          {
            title: 'Cloudflare, DNS and email deliverability',
            body: 'Domains, DNS, WAF rules and the SPF, DKIM and DMARC records that keep your email out of spam. I’ve moved hundreds of domains; it holds no fear.',
          },
          {
            title: 'Monthly care plans with dev hours',
            body: 'Hosting plus a block of development hours each month for the small changes you’d otherwise put off, with the same developer every time.',
          },
          {
            title: 'Security clean-ups and incident response',
            body: 'Compromised site, suspicious redirects, injected scripts. I find the source, clean it, and close the door it came through.',
          },
        ],
      },
      plans: {
        heading: 'CloudPerch plans',
        intro:
          'WordPress hosting runs under its own brand with its own portal. Full details and sign-up are on cloudperch.io.',
        items: [
          {
            name: 'Roost',
            price: '[$X a month]',
            body: '[One site, who it’s for]',
            href: 'https://cloudperch.io',
          },
          {
            name: 'Perch Pro',
            price: '[$X a month]',
            body: '[Sites, who it’s for]',
            href: 'https://cloudperch.io',
          },
          {
            name: 'Flock',
            price: '[$X a month]',
            body: '[Sites, who it’s for]',
            href: 'https://cloudperch.io',
          },
          {
            name: 'Aerie',
            price: '[$X a month]',
            body: '[Sites, who it’s for]',
            href: 'https://cloudperch.io',
          },
        ],
      },
      relatedWork: [cloudperch.id],
      faqs: [
        {
          question: 'Can you host a site someone else built?',
          answer:
            'Yes, after I’ve had a look at it. I migrate it, run it on staging, and tell you if there’s anything that needs fixing before it goes live on the new server.',
        },
        {
          question: 'Where is the data stored?',
          answer:
            'WordPress hosting is in Sydney. Custom app hosting runs on dedicated servers in [LOCATION]. Backups are stored off-site in [LOCATION]. Happy to put it in writing for your privacy policy.',
        },
        {
          question: 'What exactly is in a care plan?',
          answer:
            'Hosting, weekly updates via staging, daily backups, uptime monitoring, security patches, and [N] hours of development each month that roll into whatever you need done. No lock-in; cancel monthly.',
        },
      ],
      closing: {
        heading: 'Want someone to just look after it?',
        body: 'Tell me what you’re running and where. I’ll come back with a plan and a monthly price.',
        ctaLabel: 'Talk about hosting',
      },
    },
  })
  log('services')

  // Journal --------------------------------------------------------------------
  const topicNames = [
    'AI and automation',
    'Integrations',
    'WooCommerce',
    'Hosting',
    'Custom software',
    'Running a product',
  ]
  const topics: Record<string, number> = {}
  for (const name of topicNames) {
    const t = await payload.create({ collection: 'topics', data: { name } })
    topics[name] = t.id
  }

  const day = (d: string) => new Date(d).toISOString()

  await payload.create({
    collection: 'posts',
    data: {
      title: 'Why your Zapier chain breaks at 2am, and what to do instead',
      slug: 'why-your-zapier-chain-breaks-at-2am',
      _status: 'published',
      publishedAt: day('2026-09-22'),
      topic: topics['Integrations'],
      readingMinutes: 7,
      featured: true,
      excerpt:
        'No-code automation is brilliant until it becomes load-bearing. Here’s how to tell when you’ve crossed that line, and what a boring, reliable replacement looks like.',
      cover: {
        placeholder:
          'Cover image or diagram: a chain of Zaps on one side, one small service with a queue on the other',
      },
      content: richText(
        p(
          'Every business I work with has a Zap somewhere. A form submission creates a contact. A new order posts to Slack. A row lands in a sheet. These are good. They take ten minutes to set up and they get a job off someone’s plate.',
        ),
        p(
          'The trouble starts when one of them quietly becomes the way money moves. The order-to-invoice Zap. The one that updates stock. The one with six steps, two filters and a formatter in the middle that nobody remembers configuring. When that one fails at 2am, nothing tells you. You find out when a customer asks where their order is.',
        ),
        h2('How you know it’s load-bearing'),
        p(
          'A rough test. If any of these are true, the automation has outgrown the tool it lives in:',
        ),
        ol([
          'It touches money, stock, or a customer-facing status.',
          'It runs more than a few hundred times a month, and the bill now has its own line in the budget.',
          'Data flows in both directions, so a retry can create a duplicate.',
          'Nobody can explain, from memory, what every step does.',
        ]),
        h2('What the boring replacement looks like'),
        p(
          'Not a platform. A small service, a few hundred lines of code, that does the one job. It receives the webhook, puts it on a queue, processes it, and writes a log line you can read. If the API on the other side is down, it waits and tries again. If it fails three times, it tells a human. If the same event arrives twice, it notices and does nothing.',
        ),
        p(
          'That log is the whole point. When something looks wrong, you or I can read it and know what happened, in order, with timestamps. A Zap history page tells you a step “errored”. A log tells you why.',
        ),
        h2('When to keep Zapier'),
        p(
          'For one-way, low-volume, low-stakes pushes, keep it. A new lead posting to a channel does not need a queue. The point isn’t that no-code is bad. It’s that the tool should match the stakes, and the stakes tend to creep up without anyone deciding they should.',
        ),
        p(
          'If you’ve got a chain you’re a little nervous about, [send me a screenshot of it](/contact). I’ll tell you honestly whether it’s fine where it is.',
        ),
      ),
      tags: [
        { tag: 'Integrations' },
        { tag: 'Zapier' },
        { tag: 'Webhooks' },
        { tag: 'Reliability' },
      ],
      relatedService: integrations.id,
    },
  })

  const stubs: Array<{
    title: string
    topic: string
    excerpt: string
    date: string
    service?: number
  }> = [
    {
      title: 'Square and WooCommerce: the five sync problems every store hits',
      topic: 'WooCommerce',
      excerpt:
        'Missing webhooks, WP cron that doesn’t fire, variations that don’t map, and two other things I’ve fixed more times than I’d like.',
      date: '2026-09-08',
      service: integrations.id,
    },
    {
      title: 'Human in the loop: where AI automation should stop and ask',
      topic: 'AI and automation',
      excerpt:
        'A simple rule for deciding which steps a model can do on its own, and which ones need a person, with examples from real workflows.',
      date: '2026-08-25',
      service: ai.id,
    },
    {
      title: 'SPF, DKIM and DMARC in plain English',
      topic: 'Hosting',
      excerpt:
        'Why your invoices land in spam, and the three DNS records that fix it. No acronyms left unexplained.',
      date: '2026-08-11',
    },
    {
      title: 'Buy or build? A simple test for custom software',
      topic: 'Custom software',
      excerpt:
        'The 80/20 question I ask on every first call, and the two situations where custom is clearly the right answer.',
      date: '2026-07-28',
    },
    {
      title: 'What I learned moving 500 domains to Cloudflare',
      topic: 'Hosting',
      excerpt: 'Bulk transfers, .au quirks, and the checklist I now use for every domain move.',
      date: '2026-07-14',
    },
  ]
  for (const s of stubs) {
    await payload.create({
      collection: 'posts',
      data: {
        title: s.title,
        _status: 'published',
        publishedAt: day(s.date),
        topic: topics[s.topic],
        readingMinutes: 5,
        excerpt: s.excerpt,
        content: richText(p(s.excerpt), p('[Draft. Replace this placeholder with the article.]')),
        relatedService: s.service,
      },
    })
  }
  log('journal')
}

async function seedPageGlobals(payload: P) {
  await payload.updateGlobal({
    slug: 'home',
    data: {
      hero: {
        eyebrow: 'Melbourne software developer',
        heading: 'I build the software your business runs on.',
        intro:
          'Websites, custom software, AI automation and the integrations between them. One engineer from the first conversation to launch, and the same one who picks up the phone afterwards.',
        primaryCta: { label: 'Start a project', href: '/contact' },
        secondaryCta: { label: 'See recent work', href: '/work' },
        facts: [
          { label: 'Liam Hillier', value: 'Melbourne' },
          { label: 'Sole trader', value: 'Since [YEAR]' },
          { label: 'Replies', value: 'Within one business day' },
        ],
      },
      figure: {
        image: await upsertMedia(
          payload,
          fileURLToPath(new URL('./home-collage.jpg', import.meta.url)),
          'A wall of product screens from recent projects: sync dashboards, release and payment flows, booking calendars, onboarding checklists and chat.',
        ),
        placeholder: 'Collage of product screens from recent work',
        caption:
          'Screens from recent work: Square Sync for Woo, OnCloudWine, TakeShape Adventures, Bowery, KIR, Flo and Vinoshipper for WooCommerce.',
      },
      servicesSection: {
        eyebrow: 'What I do',
        note: 'Most projects use two or three of these together',
      },
      workSection: { heading: 'Selected work', linkLabel: 'All case studies' },
      process: {
        heading: 'How a project runs',
        steps: [
          {
            title: 'A call, not a pitch',
            body: 'Thirty minutes. You tell me what’s slow, manual or broken. I tell you what I’d build and roughly what it costs.',
          },
          {
            title: 'Scope and quote',
            body: 'A short written plan: what gets built, what it costs, and what’s left for a later phase.',
          },
          {
            title: 'Build in the open',
            body: 'A staging link early, so you see it working as it grows instead of waiting for a big reveal.',
          },
          {
            title: 'Launch, then look after it',
            body: 'Hosting, monitoring, fixes and the next phase when you’re ready. I don’t disappear at launch.',
          },
        ],
      },
      about: {
        heading: 'I’m Liam. I work solo on purpose.',
        body: 'It means the person you talk to on the first call is the person writing the code, hosting it, and answering the email when something’s wrong. I also run three software products of my own, which is the best proof I have that I build things that keep working.',
        linkLabel: 'More about how I work',
        photo: { placeholder: 'Photo: Liam' },
      },
      testimonial: {
        quote:
          'They didn’t sell us AI. [Full quote from the current site.] We stopped copying data between systems within the first month.',
        attribution: 'Operations Director, finance and lending',
      },
      closing: {
        heading: 'Tell me what’s slow.',
        body: 'A few lines in your own words is enough. I’ll reply within one business day with what I’d do about it.',
        ctaLabel: 'Start a project',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'services-page',
    data: {
      eyebrow: 'Services',
      heading: 'Five things I build. Usually two or three at once.',
      intro:
        'A new website that feeds a CRM. A CRM that talks to Xero. An AI step that reads the PDF nobody wants to retype. The services are listed separately below, but most projects cross the lines.',
      engagement: {
        heading: 'Ways to work together',
        intro: 'Pick the shape that fits the job.',
        options: [
          {
            title: 'Fixed-scope project',
            price: '[From $X], written quote',
            body: 'For a defined build: a site, an integration, a portal. You get a scope, a price and a timeline before I start, and the price doesn’t move unless the scope does.',
          },
          {
            title: 'Hourly',
            price: '[$X an hour], billed as used',
            body: 'For smaller jobs, investigations and the “can you just look at this” work. Time tracked, invoiced at the end of the month, no minimum.',
          },
          {
            title: 'Monthly care plan',
            price: '[From $X a month], hosting included',
            body: 'Hosting, updates, monitoring and a block of development hours each month for the things you’d otherwise put off.',
          },
        ],
      },
      closing: {
        heading: 'Not sure which one you need?',
        body: 'Most people aren’t. Describe the problem in plain words and I’ll tell you what I’d build and roughly what it costs.',
        ctaLabel: 'Describe the problem',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'work-page',
    data: {
      eyebrow: 'Work',
      heading: 'Things I’ve shipped, and the ones I still look after.',
      intro:
        'Three kinds of work below: products I own and support myself, client projects I can name, and a few where the client would rather stay anonymous.',
      products: {
        heading: 'Products I own and run',
        intro:
          'Real software with paying customers. I build it, host it, and answer the support emails. It’s the best proof I have that I ship things that keep working.',
      },
      clients: {
        heading: 'Client projects',
        intro:
          'Named with the client’s permission. Each one is a business that had a process running on spreadsheets, email and goodwill, and needed software that fit how they already worked.',
        note: '[Confirm permission and figures with each client before launch]',
      },
      anonymised: {
        heading: 'Anonymised',
        intro:
          'Some clients would rather their competitors didn’t know what they’ve automated. Fair enough. The numbers are theirs; the names aren’t.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      eyebrow: 'About',
      heading: 'I’m Liam. I build software for a living, and I run some of it too.',
      intro:
        'I’m a Melbourne-based developer trading as Pixeldev. I build websites, custom software, AI automation and the integrations between them for businesses around Australia, and I run three software products of my own on the side.',
      body: 'I work solo on purpose. It means the person you talk to on the first call is the person writing the code, hosting it, and answering the email when something’s wrong. [Add a line or two in your own words about why you went out on your own.]',
      photo: {
        placeholder: 'Photo: Liam, at a desk or on site. Natural light, no stock-photo energy.',
        caption: '',
      },
      facts: [
        { label: 'Based', value: 'Melbourne, VIC. Remote-first, Australia-wide.' },
        { label: 'Trading as', value: 'Pixeldev, sole trader. ABN [YOUR ABN].' },
        { label: 'Building since', value: '[YEAR]' },
        { label: 'Products', value: 'SquareSync for Woo, OnCloudWine, CloudPerch' },
      ],
      background: {
        heading: 'What shaped how I work',
        items: [
          {
            title: 'Years inside WordPress and WooCommerce',
            body: 'Custom blocks, ACF, checkout extensions, plugin filters, multisite networks, catalogue imports. I know where the bodies are buried, because I’ve dug a few of them up.',
          },
          {
            title: 'Backend work that taught me structure',
            body: 'Time spent in .NET with proper architecture, plus Shopify and Next.js, means I bring real software habits to projects that are usually built as a pile of plugins.',
          },
          {
            title: 'Running my own products',
            body: 'SquareSync for Woo has paying subscribers around the world, and I answer every support email myself. Nothing teaches you to build carefully like being the one who gets the 6am “it’s broken” message.',
          },
          {
            title: 'Running my own servers',
            body: 'Dedicated servers, Docker, Cloudflare, DNS for hundreds of domains. I host what I build, so I design it to be hosted well.',
          },
        ],
      },
      promises: {
        heading: 'A few things you can count on',
        items: [
          {
            title: 'Plain language',
            body: 'I’ll explain what I’m building and why in words you’d use, not jargon. If I can’t explain it simply, I don’t understand it well enough yet.',
          },
          {
            title: 'A written scope before a dollar changes hands',
            body: 'What’s being built, what it costs, what’s out of this phase. You’ll know before I start.',
          },
          {
            title: 'Honest about fit',
            body: 'If an off-the-shelf tool will do the job, I’ll say so. If I’m not the right person, I’ll say that too.',
          },
          {
            title: 'Around after launch',
            body: 'I host, monitor and keep improving what I build. The relationship doesn’t end at the invoice.',
          },
        ],
      },
      solo: {
        heading: 'I’m one person. That’s the point, and the limit.',
        body: 'If you need a ten-person team on site next Monday, I’m not it. If you want one engineer who’ll understand your whole business, build the right thing, and still be around in two years, that’s the job I’m set up for. For bigger builds I bring in people I’ve worked with before, and I stay the one you talk to.',
      },
      closing: {
        heading: 'Let’s talk about what you’re running.',
        body: 'A thirty-minute call, no pitch. You describe the problem, I tell you what I’d do about it.',
        ctaLabel: 'Book a call',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      eyebrow: 'Contact',
      heading: 'Tell me what’s slow.',
      intro:
        'A few lines in your own words is enough. I’ll reply within one business day with what I’d do about it and whether I’m the right person to do it.',
      form: {
        needOptions: [
          { label: 'Not sure yet, that’s why I’m here' },
          { label: 'AI and automation' },
          { label: 'Connecting two or more systems' },
          { label: 'Custom software or a CRM' },
          { label: 'A website or WooCommerce store' },
          { label: 'Hosting or looking after an existing site' },
        ],
        budgetOptions: [
          { label: 'Prefer not to say yet' },
          { label: '[Under $X]' },
          { label: '[$X to $Y]' },
          { label: '[$Y to $Z]' },
          { label: '[Over $Z]' },
        ],
        submitLabel: 'Send it',
        submitNote: 'No newsletter, no follow-up sequence. Just a reply from me.',
        successHeading: 'Got it. Thanks.',
        successBody:
          'I’ll read it properly and reply within one business day, usually with a couple of questions.',
      },
      nextSteps: {
        heading: 'What happens next',
        items: [
          {
            text: 'I read it and reply within one business day, usually with a couple of questions.',
          },
          { text: 'A thirty-minute call where you walk me through how it works today. No slides.' },
          { text: 'A short written scope and quote, or an honest “you don’t need me for this”.' },
        ],
      },
      aside: {
        directHeading: 'Or directly',
        directNote: 'Melbourne, VIC. Working with businesses across Australia, in your time zone.',
        supportHeading: 'Already a client or a SquareSync customer?',
        supportNote: 'Support goes to the support address so it lands in the right queue:',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'journal-page',
    data: {
      eyebrow: 'The Systems Brief',
      heading: 'Notes from building and running software for small businesses.',
      intro:
        'Practical, specific, occasionally opinionated. The things I end up explaining on calls, written down once.',
    },
  })
  log('page globals')
}

try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
