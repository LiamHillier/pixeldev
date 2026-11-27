/**
 * Home page copy, from the Inline design (Direction-I), rewritten in the "we" voice.
 *
 *   homeCopy              raw copy. Relationships are given as Work slugs (`figureWorkSlug`,
 *                         `workSection.cases[].workSlug`), so it can't go to Payload as is.
 *   resolveHomeCopy(p)    homeCopy with those slugs looked up as Work IDs, ready for
 *                         payload.updateGlobal({ slug: 'home', data: await resolveHomeCopy(payload) })
 *
 * Upload fields (figure.image, about.photo.image) and the seo group are left out, so they keep
 * their current values. Client names for the strip are not here: the page reads them from Work
 * entries of kind "client".
 *
 * Every number in here comes from the case study briefs in src/seed/case-studies/<slug>/brief.json.
 */
import type { Payload } from 'payload'

const caseRows = [
  {
    workSlug: 'takeshape-adventures-crm',
    title: 'TakeShape Adventures',
    struggle:
      'Events run from spreadsheets, inboxes and a CRM that didn’t know what an event was.',
    built:
      'A custom CRM with events, attendees and members at the centre, fed by their booking app.',
    // brief.json: stats "6 hrs admin saved per week"; "How it went": stopped printing manifests
    // and ringing guests the night before.
    changed:
      'Six hours of admin back every week, and no more printed manifests or night-before phone calls.',
  },
  {
    workSlug: 'bowery-investor-onboarding',
    title: 'Bowery',
    struggle:
      'Onboarding investors meant chasing documents by email and keeping track in a spreadsheet.',
    built:
      'An onboarding workflow that collects, checks and follows up on its own, from first contact to completed application.',
    // brief.json "How it went": two to three days instead of around two weeks; nobody retypes.
    changed:
      'Application to sign-off in two to three days instead of around two weeks, and nothing retyped into the register.',
  },
  {
    workSlug: 'squaresync-for-woo',
    title: 'SquareSync for Woo',
    struggle:
      'Shops selling in person on Square and online on WooCommerce, with stock and orders drifting apart.',
    built: 'Our own plugin that keeps products, stock and orders in step, in both directions.',
    // brief.json: atAGlance "What they have now"; stats "380 paying subscribers".
    changed:
      'Real-time, two-way sync with a log that explains every failure, and 380 paying subscribers.',
  },
]

export const homeCopy = {
  hero: {
    eyebrow: null,
    heading: '*Your business is growing.* Your systems should make it {img} easier to run, not harder.',
    intro:
      'We help growing Australian businesses make AI, automation and software work together, so you spend less time managing processes and more time leading your team and doing the work you’re actually good at.',
    primaryCta: { label: 'Talk about your business', href: '/contact' },
    // No booking tool exists yet, so this goes to the contact page. Swap the href for a booking
    // link in the admin when there is one.
    secondaryCta: { label: 'Book a 30-minute call', href: '/contact' },
  },
  figure: {
    placeholder: null,
    caption:
      'TakeShape Adventures ran events across spreadsheets, inboxes and a CRM that didn’t fit. Now the team runs them from one screen, fed by the app their members book through.',
  },
  figureWorkSlug: 'takeshape-adventures-crm',
  marquee: {
    intro: 'Some of the businesses we’ve built for.',
    label: 'Businesses we’ve built for',
  },
  familiar: {
    heading: 'Sound familiar?',
    statements: [
      { text: 'You’re paying for six systems and someone still copies data between them.' },
      { text: 'Someone on the team spends every Friday building the same report.' },
      { text: 'You’ve tried AI tools, and now you’ve got one more thing to manage.' },
      { text: 'Every new customer adds admin faster than it adds revenue.' },
    ],
    closing:
      '*None of that is a technology problem. It’s a nobody-has-connected-the-pieces problem.* ~Connecting the pieces, and adding AI where it actually helps, is what we do.~',
  },
  approach: {
    heading: 'AI, automation and software, {sync} *working together.*',
    intro:
      'Not another subscription. A system built around how your business actually runs, using the tools you already have plus the ones that are missing.',
    steps: [
      {
        title: 'We learn how your business actually runs',
        body: 'Not the org chart. The real process: who does what, where it stalls, and which spreadsheet everyone secretly depends on.',
      },
      {
        title: 'We connect what you have, and add AI where it earns its place',
        body: 'Your systems start talking to each other. AI reads the documents, sorts the enquiries and drafts the reports, with a person checking what matters. When nothing off the shelf fits, we build the piece that does.',
      },
      {
        title: 'You get your time back',
        body: 'Fewer manual steps, one source of truth, and a team spending its day on the work that grows the business instead of feeding the systems.',
      },
    ],
    toolsLead: 'The tools behind it:',
  },
  stats: [
    { value: '10 years', label: 'building software for businesses, in agencies and now directly' },
    { value: 'Hundreds', label: 'of applications, CRMs and internal tools delivered' },
    { value: 'Thousands', label: 'of websites shipped and kept running' },
    // takeshape-adventures-crm/brief.json stats: "6 hrs admin saved per week".
    { value: '6 hrs', label: 'of admin saved every week for TakeShape Adventures' },
  ],
  workSection: {
    heading: 'Work that changed *how a business runs*',
    linkLabel: 'All case studies',
    cases: caseRows,
  },
  testimonial: {
    quote:
      'They didn’t sell us AI. Liam spent a morning watching how we actually run a trip, from the booking to the bus leaving at 5am, and built around that. Bookings land in the manifest on their own, Keap gets tagged without anyone touching it, and the crew check people in from their phones. We stopped copying data between systems within the first month.',
    attribution: 'Operations Manager, TakeShape Adventures',
    result: 'Stopped copying data between systems in the first month.',
    resultNote: 'Bookings, Keap tags and check-in now run off one dashboard.',
  },
  process: {
    heading: 'Working with us *is simple*',
    note: 'No pitch deck, no six-week discovery phase.',
    steps: [
      {
        title: 'A conversation about your business',
        body: 'Thirty minutes. You tell us what’s slow, manual or frustrating. You don’t need to know what the solution is.',
      },
      {
        title: 'A plan in plain English',
        body: 'What we’d build, what it costs, what it will change, and what’s left for later. Written down before anything starts.',
      },
      {
        title: 'You see it working early',
        body: 'A staging link within weeks, so you and your team can use it and shape it before launch.',
      },
      {
        title: 'Launch, then we stay around',
        body: 'Hosting, monitoring, fixes and the next improvements. The same people, not a support queue.',
      },
    ],
  },
  about: {
    heading: 'Meet Liam, *the founder of Pixeldev.*',
    body: [
      'When you work with Pixeldev, you’re talking directly to the person who understands your business, designs the solution and is accountable for delivering it. You won’t be passed between salespeople, account managers and developers.',
      'Liam spent ten years as a senior developer in agencies before setting up Pixeldev to work with growing businesses directly. We take on a small number of them at a time, so each gets proper attention.',
    ].join('\n\n'),
    linkLabel: 'More about how we work',
  },
  closing: {
    heading: 'Let’s make your business {toggle} *easier to run.*',
    body: 'Tell us what’s slow, manual or held together with spreadsheets. You don’t need to know what you need yet. We reply within one business day.',
    ctaLabel: 'Talk about your business',
    secondaryCta: { label: 'Book a 30-minute call', href: '/contact' },
    phoneLabel: 'Or call',
  },
}

/** homeCopy with its Work slugs swapped for IDs. Rows whose project doesn't exist are dropped. */
export async function resolveHomeCopy(payload: Payload) {
  const slugs = [homeCopy.figureWorkSlug, ...caseRows.map((c) => c.workSlug)]
  const { docs } = await payload.find({
    collection: 'work',
    where: { slug: { in: slugs } },
    limit: slugs.length,
    depth: 0,
  })
  const id = (slug: string) => docs.find((d) => d.slug === slug)?.id ?? null
  const { figureWorkSlug, workSection, ...rest } = homeCopy
  return {
    ...rest,
    figureWork: id(figureWorkSlug),
    workSection: {
      ...workSection,
      cases: workSection.cases.flatMap(({ workSlug, ...row }) => {
        const work = id(workSlug)
        return work ? [{ ...row, work }] : []
      }),
    },
  }
}
