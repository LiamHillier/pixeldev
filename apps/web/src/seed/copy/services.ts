/**
 * Copy for the services index and the five service pages, from the Inline design.
 *
 * Exports and targets:
 *   servicesPageCopy  → payload.updateGlobal({ slug: 'services-page', data: servicesPageCopy })
 *   servicesCopy      → for each { slug, data }:
 *                       payload.update({ collection: 'services', where: { slug: { equals: slug } }, data })
 *
 * Left out on purpose, so they keep their current values: `figure` (holds an upload), `relatedWork`
 * (a relationship), `order`, `slug` and `seo`.
 */
import type { Service, ServicesPage } from '@/payload-types'

const contact = { label: 'Talk about your business', href: '/contact' }
const relatedWork = { label: 'See related work', href: '/work' }

export const servicesPageCopy = {
  eyebrow: 'Services',
  heading: '*Five ways to make your business* {toggle} easier to run.',
  intro:
    'Most people come to us with a frustration, not a project: the double handling, the Friday report, the spreadsheet everyone’s afraid of. The services below are the tools we use to fix it. Most jobs use two or three together.',
  engagement: {
    heading: 'Ways to *work together*',
    intro: 'Pick the shape that fits the job.',
    options: [
      {
        title: 'Fixed-scope project',
        price: 'From $4,000, written quote',
        body: 'For a defined build: a site, an integration, a portal. You get a scope, a price and a timeline before we start, and the price doesn’t move unless the scope does.',
      },
      {
        title: 'Hourly',
        price: '$150 an hour, billed as used',
        body: 'For smaller jobs, investigations and the “can you just look at this” work. Time tracked, invoiced at the end of the month, no minimum.',
      },
      {
        title: 'Monthly care plan',
        price: 'From $290 a month, hosting included',
        body: 'Hosting, updates, monitoring and a block of development hours each month for the things you’d otherwise put off.',
      },
    ],
  },
  closing: {
    heading: '~Not sure~ *which one you need?*',
    body: 'Most people aren’t. Describe the problem in plain words and we’ll tell you what we’d build and roughly what it costs.',
    ctaLabel: 'Describe the problem',
  },
} satisfies Partial<ServicesPage>

const sections = {
  soundFamiliar: 'Sound familiar?',
  build: 'What we *build*',
  approach: 'How we *approach it*',
  related: 'Related *work*',
  faqs: 'Questions *we get asked*',
}

export const servicesCopy: { slug: string; data: Partial<Service> }[] = [
  // AI and automation ------------------------------------------------------------------------------
  {
    slug: 'ai-automation',
    data: {
      title: 'AI and automation',
      summary:
        'Document processing, enquiry routing and workflow automation with a person checking the parts that matter. Built around how you already work.',
      examples:
        'Invoices read into Xero. Enquiries sorted before anyone opens them. The Monday report built overnight.',
      indexIntro:
        'The admin that eats your week, done by software, with a person checking the parts that matter. We start from the process you already have, not from a demo of what AI can do.',
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
        heading: 'AI that does the admin, {toggle} *with a person checking the parts that matter.*',
        intro:
          'Document processing, enquiry handling, approvals and reporting, built into the tools you already use. We start from your process, not from a demo of what AI can do.',
        primaryCta: contact,
        secondaryCta: relatedWork,
      },
      diagram: {
        inputs: [{ label: 'Invoice PDF' }, { label: 'New enquiry' }, { label: 'Signed form' }],
        hubTitle: 'AI reads and sorts',
        hubNote: 'Extract, classify, draft',
        outputs: [
          { label: 'Entered in your CRM', waiting: false },
          { label: 'Routed to the right person', waiting: false },
          { label: 'Waiting for your OK', waiting: true },
        ],
        caption:
          'The shape of most of this work: software handles the routine cases, a person handles the exceptions, and everything is logged.',
      },
      painPoints: {
        heading: sections.soundFamiliar,
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
        heading: sections.build,
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
        heading: sections.approach,
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
            body: 'Which provider sees what, what gets stored and for how long, written into the scope before anything is built. Client data stays in Australian regions wherever the provider offers one, and nothing is used to train a model.',
          },
        ],
      },
      relatedHeading: sections.related,
      faqsHeading: sections.faqs,
      faqs: [
        {
          question: 'Do I need to replace my CRM or accounting system?',
          answer:
            'No. Almost all of this sits around the systems you already have and writes into them. If a system genuinely needs replacing, we’ll say so, but that’s a separate conversation.',
        },
        {
          question: 'What does it cost to run?',
          answer:
            'Model usage is usually small next to the admin it replaces, but it’s not zero. We estimate the monthly running cost in the scope so there are no surprises on the first bill.',
        },
        {
          question: 'What happens when the AI gets it wrong?',
          answer:
            'That’s what the review step is for. Nothing irreversible happens without a person until you decide the system has earned it, and even then every action is logged so it can be traced and undone.',
        },
      ],
      closing: {
        heading: '~Which part of your week~ *should a system be doing?*',
        body: 'Describe the manual process and we’ll tell you what we’d automate first, and what we’d leave alone.',
        ctaLabel: 'Talk about your business',
      },
    },
  },

  // Integrations -----------------------------------------------------------------------------------
  {
    slug: 'integrations',
    data: {
      title: 'Integrations',
      summary:
        'APIs, webhooks and two-way sync between the systems you already pay for, with the logging and retries a chain of Zaps doesn’t have.',
      examples: 'WooCommerce, Square, Xero, MYOB, HubSpot, Stripe, and whatever comes next.',
      indexIntro:
        'Your systems already hold the data. The problem is that someone retypes it between them. We connect them properly, with error handling, logs and retries, so it keeps working when you’re not watching.',
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
        heading: 'Your systems should talk to each other. {sync} *Properly.*',
        intro:
          'APIs, webhooks and two-way sync between the tools you already pay for, with the logging, retries and error handling that a chain of Zaps doesn’t have.',
        primaryCta: contact,
        secondaryCta: relatedWork,
      },
      diagram: {
        inputs: [{ label: 'WooCommerce' }, { label: 'Web forms' }, { label: 'Booking app' }],
        hubTitle: 'Integration layer',
        hubNote: 'One queue in the middle',
        outputs: [
          { label: 'Square', waiting: false },
          { label: 'Xero', waiting: false },
          { label: 'HubSpot', waiting: false },
        ],
        caption:
          'One small service in the middle, so every system talks to one place instead of to each other.',
      },
      painPoints: {
        heading: sections.soundFamiliar,
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
            body: 'Thin docs, odd rate limits, a sandbox that behaves differently to production. We’ve met a few.',
          },
        ],
      },
      offerings: {
        heading: sections.build,
        intro:
          'Integrations that run as code you own, on your hosting or ours, with a log you can read when something looks off.',
        items: [
          {
            title: 'WooCommerce and Square sync',
            body: 'Products, inventory and orders kept in step in both directions. We wrote a plugin that does this for stores worldwide, so the edge cases are familiar.',
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
            body: 'Subscriptions, invoicing, webhooks and the reconciliation that goes with them. We run our own products on Stripe billing.',
          },
          {
            title: 'Replacing no-code chains with code',
            body: 'When Zapier or Make has become load-bearing, we move it into a small service with proper error handling and a monthly bill that doesn’t scale with tasks.',
          },
          {
            title: 'Legacy bridges and migrations',
            body: 'Getting data out of the old system and into the new one, or keeping both alive while you move. Including the systems that only export CSVs.',
          },
        ],
      },
      approach: {
        heading: sections.approach,
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
            body: 'SquareSync runs for WooCommerce stores around the world. We know Square’s API quirks, WordPress cron, and what happens when a webhook arrives twice.',
          },
        ],
      },
      relatedHeading: sections.related,
      faqsHeading: sections.faqs,
      faqs: [
        {
          question: 'Can you work with a system you haven’t used before?',
          answer:
            'If it has an API, a database, or even a CSV export, yes. The first step is a short look at the docs so we can tell you what’s possible before you commit to anything.',
        },
        {
          question: 'Why not just use Zapier?',
          answer:
            'For a simple one-way push, do. For anything involving money, stock, two directions or more than a few hundred records a month, you want code you own, with logs you can read.',
        },
        {
          question: 'Where does it run, and what does it cost monthly?',
          answer:
            'On your hosting or ours. If it’s ours, a care plan covers the server, monitoring and keeping it working as the APIs on either side change.',
        },
      ],
      closing: {
        heading: '~Which two systems~ *should be talking already?*',
        body: 'Name them and we’ll tell you how we’d connect them, what it would cost, and what could go wrong.',
        ctaLabel: 'Talk about your business',
      },
    },
  },

  // Custom software and CRMs -----------------------------------------------------------------------
  {
    slug: 'custom-software',
    data: {
      title: 'Custom software and CRMs',
      summary:
        'Portals, CRMs, dashboards and internal tools in Next.js, for when the off-the-shelf option has you working around it.',
      examples:
        'The spreadsheet that became the business, replaced by something that knows what an event, a matter or an investor is.',
      indexIntro:
        'When the off-the-shelf tool makes you work around it, we build the one that fits. Portals, CRMs, dashboards and internal tools in Next.js, designed around how your team actually operates.',
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
        heading: 'Software that fits your business, {sync} *instead of the other way around.*',
        intro:
          'Portals, CRMs, dashboards and internal tools built in Next.js, designed around how your team actually operates. For when the off-the-shelf tool has you working around it.',
        primaryCta: contact,
        secondaryCta: { label: 'Read a case study', href: '/work/takeshape-adventures-crm' },
      },
      diagram: { inputs: [], outputs: [], hubTitle: null, hubNote: null, caption: null },
      painPoints: {
        heading: sections.soundFamiliar,
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
        heading: sections.build,
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
            body: 'We’ve taken our own products from idea to subscribers, with billing, support and hosting. We can do it for yours.',
          },
        ],
      },
      approach: {
        heading: sections.approach,
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
            body: 'Standard Next.js, a normal database, documented, no exotic stack. Another developer can pick it up. So can we, in two years, without archaeology.',
          },
        ],
      },
      relatedHeading: sections.related,
      faqsHeading: sections.faqs,
      faqs: [
        {
          question: 'Should I build custom or buy something off the shelf?',
          answer:
            'If a product fits 80% of what you do, buy it and we’ll integrate it. Custom is for when the other 20% is the business. We’ll tell you which one you’re in on the first call, even if the answer is “don’t hire us”.',
        },
        {
          question: 'Who owns the code?',
          answer:
            'You do. It lives in a repository you have access to from day one, and you can take it to another developer whenever you like.',
        },
        {
          question: 'What happens after launch?',
          answer:
            'We host it, monitor it and keep it patched under a care plan, with a block of hours each month for the next improvements. Or hand it to your team with documentation. Your call.',
        },
      ],
      closing: {
        heading: '~What’s the spreadsheet~ *you’re afraid of?*',
        body: 'Show us how the process works today and we’ll tell you what we’d build to replace it, and whether it’s worth it.',
        ctaLabel: 'Talk about your business',
      },
    },
  },

  // Websites and WooCommerce -----------------------------------------------------------------------
  {
    slug: 'websites',
    data: {
      title: 'Websites and WooCommerce',
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
        heading: 'WordPress and WooCommerce, {sync} *built like software.*',
        intro:
          'Fast, maintainable sites with custom blocks, checkout extensions and plugin work. We’ve spent years inside WooCommerce, and we write a plugin that stores around the world rely on.',
        primaryCta: contact,
        secondaryCta: relatedWork,
      },
      diagram: { inputs: [], outputs: [], hubTitle: null, hubNote: null, caption: null },
      painPoints: {
        heading: sections.soundFamiliar,
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
            body: 'Most of our website work starts with a site someone else built. We’ll tell you honestly whether to fix it or start again.',
          },
        ],
      },
      offerings: {
        heading: sections.build,
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
        heading: sections.approach,
        items: [
          {
            title: 'Lean builds',
            body: 'Every plugin is a dependency someone else controls. We’d rather write forty lines of code than install one that does a thousand things you don’t need.',
          },
          {
            title: 'Editors can actually edit',
            body: 'Custom blocks with the options you need and none you don’t. You shouldn’t need to call us to change a heading.',
          },
          {
            title: 'Measured, not guessed',
            body: 'Core Web Vitals on real devices before and after. If we tell you it’s faster, there’s a number behind it.',
          },
        ],
      },
      relatedHeading: sections.related,
      faqsHeading: sections.faqs,
      faqs: [
        {
          question: 'WordPress, or something else?',
          answer:
            'WordPress for content-heavy sites and WooCommerce for most stores; Shopify when its ecosystem fits better; Next.js when it’s really an app with a website attached. We’ll recommend the one that suits, not the one we feel like building.',
        },
        {
          question: 'Can you work with our designer?',
          answer:
            'Yes. Hand us the Figma file and we’ll build it faithfully, including the bits that are hard. If you don’t have a designer, we’ll put together a clean, structured layout and refine it with you on staging.',
        },
        {
          question: 'Can you fix a site someone else built?',
          answer:
            'That’s most of what comes through the door. We’ll look at it first and tell you plainly whether it’s worth fixing or faster to rebuild, with a price for each.',
        },
      ],
      closing: {
        heading: '~Send us~ *the URL.*',
        body: 'We’ll have a look at what’s there and come back with what we’d fix, what we’d leave, and what it would cost.',
        ctaLabel: 'Talk about your business',
      },
    },
  },

  // Hosting and ongoing care -----------------------------------------------------------------------
  {
    slug: 'hosting',
    data: {
      title: 'Hosting and ongoing care',
      summary:
        'Managed hosting on infrastructure we run, plus updates, backups, monitoring and a person to call when something breaks.',
      examples: 'Sydney servers for WordPress, dedicated servers for everything else.',
      indexIntro:
        'We host what we build on infrastructure we manage. Your site or app can live there, with updates, backups, monitoring and someone who knows the code when something goes wrong.',
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
        heading: 'Hosting from someone {live} *who knows the code.*',
        intro:
          'Managed WordPress hosting on Sydney servers, app hosting on dedicated servers, and monthly care plans so your site stays fast, patched and online. When something breaks, you talk to the person who can fix it.',
        primaryCta: { label: 'Talk about hosting', href: '/contact' },
        secondaryCta: relatedWork,
      },
      diagram: { inputs: [], outputs: [], hubTitle: null, hubNote: null, caption: null },
      painPoints: {
        heading: sections.soundFamiliar,
        items: [
          {
            title: 'The host blames the site, the developer blames the host',
            body: 'And you’re in the middle with a site that’s down. When we host what we built, there’s nobody to pass it to.',
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
        heading: 'What’s *included*',
        intro:
          'Boring, well-run infrastructure. Sydney servers for WordPress, dedicated servers running Docker for custom apps, Cloudflare in front of everything.',
        items: [
          {
            title: 'Managed WordPress hosting',
            body: 'Sydney-based servers, OpenLiteSpeed and Cloudflare in front, with weekly updates through staging. One site or a whole fleet of them.',
          },
          {
            title: 'App hosting on dedicated servers',
            body: 'Next.js apps, integrations and services deployed with Docker on dedicated hardware we manage. No surprise cloud bills.',
          },
          {
            title: 'Updates, backups and monitoring',
            body: 'Weekly updates via staging, daily off-site backups, uptime checks that page us, not you.',
          },
          {
            title: 'Cloudflare, DNS and email deliverability',
            body: 'Domains, DNS, WAF rules and the SPF, DKIM and DMARC records that keep your email out of spam. We’ve moved hundreds of domains; it holds no fear.',
          },
          {
            title: 'Monthly care plans with dev hours',
            body: 'Hosting plus a block of development hours each month for the small changes you’d otherwise put off, with the same developer every time.',
          },
          {
            title: 'Security clean-ups and incident response',
            body: 'Compromised site, suspicious redirects, injected scripts. We find the source, clean it, and close the door it came through.',
          },
        ],
      },
      // The design has no approach steps on this page.
      approach: { heading: sections.approach, items: [] },
      // Hosting is sold as part of a care plan, so there are no plan cards.
      plans: { heading: null, intro: null, items: [] },
      relatedHeading: sections.related,
      faqsHeading: sections.faqs,
      faqs: [
        {
          question: 'Can you host a site someone else built?',
          answer:
            'Yes, after we’ve had a look at it. We migrate it, run it on staging, and tell you if there’s anything that needs fixing before it goes live on the new server.',
        },
        {
          question: 'Where is the data stored?',
          answer:
            'WordPress hosting is in Sydney. Custom app hosting runs on dedicated servers in Melbourne. Backups are stored off-site in Brisbane. Happy to put it in writing for your privacy policy.',
        },
        {
          question: 'What exactly is in a care plan?',
          answer:
            'Hosting, weekly updates via staging, daily backups, uptime monitoring, security patches, and two hours of development each month that roll into whatever you need done. No lock-in; cancel monthly.',
        },
      ],
      closing: {
        heading: '~Want someone~ *to just look after it?*',
        body: 'Tell us what you’re running and where. We’ll come back with a plan and a monthly price.',
        ctaLabel: 'Talk about hosting',
      },
    },
  },
]
