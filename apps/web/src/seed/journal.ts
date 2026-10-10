import { h2, ol, p, ul } from './lexical'

/**
 * Full bodies for the journal stub posts, keyed by exact post title.
 */
export const articles: Record<
  string,
  { readingMinutes: number; tags: string[]; body: Record<string, unknown>[] }
> = {
  'Square and WooCommerce: the five sync problems every store hits': {
    readingMinutes: 7,
    tags: ['WooCommerce', 'Square', 'Integrations', 'SquareSync for Woo'],
    body: [
      p(
        'I’ve spent a good chunk of the last few years keeping Square and WooCommerce talking to each other. Partly for clients, and partly because I build and support SquareSync for Woo, which means I see the support inbox when it goes wrong. The same five problems turn up over and over. None of them are exotic. All of them are fixable.',
      ),
      h2('1. Webhooks that never arrive'),
      p(
        'Square tells your store about changes by sending a webhook: a small message saying “this item changed” or “this order was paid”. If your site doesn’t receive it, nothing syncs, and nothing complains either. The usual causes are boring. A security plugin blocking the request because it doesn’t recognise Square’s servers. A caching layer answering the webhook URL with a cached page. A staging site that was cloned from production and is now receiving the live webhooks instead of the real store.',
      ),
      p(
        'That last one cost a café client of mine most of a Saturday. Their staging copy was quietly eating every stock update while the live site sold pastries it didn’t have. The fix is to check the webhook subscription in the Square dashboard, confirm the URL points where you think it does, and exclude that URL from caching and firewall rules.',
      ),
      h2('2. WP cron that doesn’t fire'),
      p(
        'WordPress doesn’t have a real scheduler. WP cron runs when someone visits the site. On a quiet store at 3am, nobody visits, so the scheduled sync job just sits there. Then a burst of traffic at 9am tries to run six hours of queued work at once, and the site slows to a crawl.',
      ),
      p(
        'The fix is to disable WP cron’s visitor trigger and run it from a real server cron every minute or two. Most decent hosts let you set this up in their panel. If yours doesn’t, that tells you something about the host.',
      ),
      h2('3. Variations that don’t map'),
      p(
        'Square thinks of a T-shirt in three sizes as one item with three variations. WooCommerce agrees in principle, but the details differ. Attribute names, option order, and whether “Large” and “L” are the same thing all matter. When they don’t line up, you get a variable product with one variation, or three simple products, or a variation that updates the wrong size’s stock.',
      ),
      p(
        'Pick one system as the source of truth for product structure and set it up properly there. Then let the sync create the other side, rather than trying to match two catalogues that were built by different people on different days.',
      ),
      h2('4. SKUs that aren’t really SKUs'),
      p(
        'Most sync tools match products by SKU. That only works if every product has one, and every SKU is unique. In practice I see blank SKUs, SKUs reused across sizes, and SKUs with a trailing space that makes them technically different. A homewares store I helped had 1,400 products and 212 of them shared a SKU with something else. The sync was doing exactly what it was told. It was just being told nonsense.',
      ),
      p('Before you sync anything, export both catalogues to a spreadsheet and check:'),
      ul([
        'Every product and variation has a SKU.',
        'No SKU appears twice.',
        'No SKU has leading or trailing spaces, or a mix of upper and lower case.',
      ]),
      h2('5. Stock that goes wrong in both directions'),
      p(
        'If you sell in a shop and online, stock moves in both directions. Two sales a few seconds apart, one at the counter and one on the website, can both read the same stock count, both subtract one, and both write back the same number. You’ve sold two and recorded one.',
      ),
      p(
        'The fix is to sync stock as adjustments, not absolute numbers. “Subtract one” is safe to apply twice in a row. “Set to 4” is not. This is one of the main reasons I wrote SquareSync for Woo the way I did, and it’s the first thing I check on any setup someone else has built.',
      ),
      p(
        'If your Square and WooCommerce setup is doing something odd, [tell me what you’re seeing](/contact). Odds are it’s one of these five.',
      ),
    ],
  },

  'Human in the loop: where AI automation should stop and ask': {
    readingMinutes: 6,
    tags: ['AI', 'Automation', 'Human in the loop', 'Flo'],
    body: [
      p(
        'Most of the AI automation work I do now isn’t about whether a model can do a task. It usually can, most of the time. The real question is what happens on the occasions it gets it wrong, and whether anyone will notice before it matters.',
      ),
      p(
        'So I use a simple rule, and I use it on every workflow before I write any code.',
      ),
      h2('The rule'),
      p(
        'A model can act on its own when the step is cheap to check and cheap to undo. When a step is expensive to undo, or someone outside the business will see the result, the model drafts and a person approves.',
      ),
      p('That gives you three buckets:'),
      ol([
        'Do it: reading, sorting, tagging, summarising, filling in internal fields. If it’s wrong, someone fixes it in ten seconds and nobody outside ever knew.',
        'Draft it: customer emails, quotes, journal entries, anything that changes a balance. The model does the slow part, a person clicks approve.',
        'Don’t touch it: refunds over a threshold, anything legal, firing off payments. The model can flag these. It doesn’t act.',
      ]),
      h2('What this looks like in Flo'),
      p(
        'Flo is my own product. It reads invoices out of a Gmail inbox, pulls out the supplier, amount, GST and due date, and files them as draft bills in Xero. Notice the word draft. Flo never approves a bill, and it never pays one.',
      ),
      p(
        'Reading the invoice and filling in the fields is firmly in the first bucket. If it gets the due date wrong, the bookkeeper sees it when reviewing the draft and fixes it. Creating an approved bill would be in the second bucket, because once it’s approved it feeds into payment runs. So Flo stops there and lets a person look.',
      ),
      p(
        'Flo also scores how confident it is. When a supplier it has seen fifty times sends the usual invoice, the draft goes straight in. When it’s a new supplier, or the total doesn’t match the line items, or the GST looks off, it gets flagged for a closer look. Roughly one invoice in twelve ends up flagged, and that’s about right. Too many flags and people stop reading them.',
      ),
      h2('A workflow that got it wrong'),
      p(
        'A while back I inherited an automation for a trades business that drafted replies to quote requests and sent them straight away. It was quick, it was polite, and about once a fortnight it quoted a job the business didn’t do at a price it had made up. A customer turned up with a printout of one of those quotes and expected it honoured.',
      ),
      p(
        'Nothing about the model changed in the fix. I moved the send step from bucket one to bucket two. Replies now land in a shared inbox as drafts, the office manager reads them over coffee, and most go out within the hour with a single click. Response time went from four minutes to about forty. Nobody has complained, and nobody has turned up with a printout since.',
      ),
      h2('Questions to ask about your own workflow'),
      ul([
        'If this step is wrong, who finds out, and how long does it take?',
        'Can it be undone without an apology?',
        'Does the output leave the business, or touch money?',
        'If a person has to approve it, is the approval quick enough that they will actually do it properly?',
      ]),
      p(
        'That last one matters more than people think. A review step that takes five minutes per item gets rubber-stamped by week three. Good human in the loop design makes the check fast: show the source next to the draft, highlight what the model was unsure about, and make approve a single click.',
      ),
      p(
        'If you’re thinking about automating something and aren’t sure where the line should sit, [walk me through it](/contact). I’ll tell you which bucket each step belongs in.',
      ),
    ],
  },

  'SPF, DKIM and DMARC in plain English': {
    readingMinutes: 6,
    tags: ['Email', 'DNS', 'Deliverability', 'Hosting'],
    body: [
      p(
        'A plumbing business rang me last year because their invoices were going to spam. Not some of them. Nearly all of them. Their accounting software sent invoices “from” their email address, but nothing in their domain’s settings said it was allowed to. Gmail and Outlook did the sensible thing and assumed it was a forgery.',
      ),
      p(
        'The fix was three DNS records, about twenty minutes of work, and a week of waiting for things to settle. Here’s what each record does, without the jargon.',
      ),
      h2('SPF: who is allowed to send'),
      p(
        'SPF stands for Sender Policy Framework. It’s a single line in your DNS that lists the services allowed to send email using your domain. Your email provider, your accounting software, your newsletter tool, your website’s contact form.',
      ),
      p(
        'When an email arrives claiming to be from you, the receiving server checks that list. If the sender isn’t on it, that’s a mark against the message. Two common mistakes: forgetting to add a service, and having two separate SPF records. You’re only allowed one. If you have two, both are ignored, which is worse than having none.',
      ),
      h2('DKIM: a signature on every email'),
      p(
        'DKIM stands for DomainKeys Identified Mail. Each sending service signs the emails it sends with a private key. You publish the matching public key in your DNS. The receiving server checks the signature against your public key, and if it matches, it knows two things: the email really came from a service you approved, and nobody changed it on the way.',
      ),
      p(
        'Each service you send from needs its own DKIM record. Google Workspace gives you one, Microsoft 365 gives you two, Xero and MYOB and most newsletter tools have their own. They’re usually found under a heading like “domain authentication” in that tool’s settings.',
      ),
      h2('DMARC: what to do when the checks fail'),
      p(
        'DMARC stands for Domain-based Message Authentication, Reporting and Conformance, which is a mouthful for a simple idea. It tells receiving servers what to do with email that fails SPF and DKIM, and where to send reports about it.',
      ),
      p('It has three settings:'),
      ol([
        'none: deliver it anyway, but send me reports. Start here.',
        'quarantine: put failing email in spam.',
        'reject: refuse it outright.',
      ]),
      p(
        'Start on none for two or three weeks and read the reports. They’ll show you every service sending as your domain, including the ones you forgot about. For the plumber it turned out their old website, which they thought was switched off, was still sending booking confirmations from a forgotten server. Once everything legitimate is passing, move to quarantine, then reject.',
      ),
      h2('The order I do it in'),
      ol([
        'List every service that sends email as your domain. Ask whoever handles accounts, marketing and the website.',
        'Set up DKIM for each one, using that service’s instructions.',
        'Write one SPF record that includes all of them.',
        'Add a DMARC record set to none, with reports going to an address someone actually checks.',
        'Read the reports for a few weeks, fix anything failing, then tighten the policy.',
      ]),
      p(
        'For the plumber, the finished setup was one SPF record covering Microsoft 365 and their accounting software, three DKIM records, and a DMARC record that moved to quarantine after a month. Invoices started landing in inboxes the same week. Their bookkeeper told me overdue invoices dropped noticeably, which makes sense: it’s hard to pay a bill you never saw.',
      ),
      p(
        'Since early 2024, Google and Yahoo have required all three for anyone sending in bulk, and they’ve become much stricter with small senders too. If you send invoices, quotes or booking confirmations, this isn’t optional any more.',
      ),
      p(
        'If you’re not sure what your domain has set up, [send me the domain name](/contact). I’ll check it and tell you what’s missing.',
      ),
    ],
  },

  'Buy or build? A simple test for custom software': {
    readingMinutes: 6,
    tags: ['Custom software', 'SaaS', 'Planning', 'OnCloudWine'],
    body: [
      p(
        'I build custom software for a living, so you might expect me to recommend it every time. I don’t. On a fair share of first calls, the most useful thing I can say is “you don’t need me for this, here’s the tool that already does it”. That call costs the client nothing and saves them a lot.',
      ),
      p('The question I ask to get there is simple.'),
      h2('The 80/20 question'),
      p(
        'Is there an off-the-shelf product that does 80 percent of what you need, and can you genuinely live without the other 20 percent?',
      ),
      p(
        'If the answer is yes, buy it. A good SaaS product has had thousands of users finding its bugs before you. It has someone on call when it breaks. It gets better every month without you paying for a project. Even if the monthly fee feels steep, it’s almost always cheaper than building and maintaining your own version.',
      ),
      p(
        'The trick is being honest about the second half. A physio clinic I spoke to wanted a custom booking system because none of the existing ones let them colour-code appointments by practitioner and room at the same time. That was the 20 percent. When we talked it through, the colour coding was a nice-to-have from one person’s wishlist. They bought an existing product and were live in a week.',
      ),
      h2('When custom is clearly right'),
      p('There are two situations where I’ll recommend building without much hesitation.'),
      p(
        'The first is when the missing 20 percent is how you make money. If your process is the thing that sets you apart, squeezing it into someone else’s software means working like everyone else. A freight broker I worked with had a pricing method that took into account return loads and driver hours in a way no off-the-shelf tool supported. That method was their margin. Building around it paid for itself in about five months.',
      ),
      p(
        'The second is when the gap is between tools rather than inside one. You’ve bought good products for each job, but someone spends ten hours a week copying data between them. Often the answer here isn’t a whole new system. It’s a small integration that joins the tools you already have. That’s some of the best value custom work there is.',
      ),
      p(
        'Either way, remember that building is the cheap part. A custom system needs hosting, updates, security patches and someone who understands it when it breaks in three years. I price that in from the first quote, and if a client can’t see it being worth the ongoing cost, that’s a strong sign they should buy.',
      ),
      h2('What it looked like for OnCloudWine'),
      p(
        'OnCloudWine started as a build-versus-buy question. A small winery wanted to run a wine club: members, quarterly shipments, payment on a schedule, and the ability to swap bottles before each release. I looked hard at the existing options. Generic subscription tools handled the billing but had no idea what a shipment allocation was. The wine-specific platforms existed, but they were built for much bigger wineries and priced to match.',
      ),
      p(
        'Neither got to 80 percent for a small cellar door. So I built it, and then other wineries asked for the same thing, and it became a product. That’s the happy version of the story. Most custom builds stay custom, and that’s fine too.',
      ),
      h2('A quick checklist'),
      ul([
        'List what you need. Mark each item as must-have or nice-to-have, and be ruthless.',
        'Try two or three existing products against the must-haves only.',
        'If one covers them, buy it and revisit in a year.',
        'If none do, ask whether the gap is your competitive edge, or the space between tools you already use.',
        'If it’s neither, you probably need to change the process, not the software.',
      ]),
      p(
        'If you’re weighing it up, [tell me what you’re trying to do](/contact). I’ll give you a straight answer, even if that answer is someone else’s product.',
      ),
    ],
  },

  'What I learned moving 500 domains to Cloudflare': {
    readingMinutes: 7,
    tags: ['Hosting', 'Cloudflare', 'DNS', 'Domains'],
    body: [
      p(
        'Earlier this year I moved a little over 500 domains to Cloudflare for a marketing agency that had been collecting them for fifteen years. Client sites, campaign domains, typo domains, a few that nobody could explain. They were spread across four registrars and three DNS hosts, and renewals were arriving at a rate of about two a week.',
      ),
      p(
        'It took six weeks. Nothing went down for longer than a few minutes. Here’s what I learned and the checklist I now use for every move, whether it’s one domain or five hundred.',
      ),
      h2('Bulk transfers are mostly a spreadsheet job'),
      p(
        'The technical part of moving a domain is small. The hard part is knowing what you have. Before touching anything, I built a spreadsheet with every domain, its registrar, its current DNS host, its expiry date, whether it had email, and whether anyone still wanted it.',
      ),
      p(
        'That last column saved real money. 140 of the domains were for campaigns that had ended years ago. The agency let them lapse instead of transferring them, which knocked a few thousand dollars a year off their renewals.',
      ),
      p(
        'For the rest, Cloudflare will scan and import existing DNS records when you add a domain. It’s good, but not perfect. It misses records it can’t discover, which usually means subdomains nobody links to. I exported the zone file from the old host for every domain and compared the two. On about one domain in fifteen, the import had missed something.',
      ),
      h2('The .au quirks'),
      p(
        'Australian domains are their own little world. At the time of the move, Cloudflare’s registrar didn’t support .com.au or .au, so those stayed with an Australian registrar and only the nameservers moved. That’s fine. You still get Cloudflare’s DNS, caching and security, you just renew somewhere else.',
      ),
      p(
        'Two other things caught me out. First, .au domains are tied to an eligible registrant, usually an ABN. A handful were registered to ABNs of businesses that had since closed, which meant the agency’s clients technically weren’t eligible to hold them. Sorting that out took longer than everything else combined. Second, the auth code for a .au domain is sent to the registrant contact, and on old domains that was often an email address that no longer existed.',
      ),
      h2('Email is where it goes wrong'),
      p(
        'A website being down for ten minutes is annoying. Email silently bouncing for a day is a disaster, and you don’t find out until someone asks why you didn’t reply. Every domain with an MX record got extra attention: I checked MX, SPF, DKIM and DMARC records matched exactly before switching nameservers, then sent a test email in and out straight after.',
      ),
      p(
        'One domain had DKIM keys stored as two separate text strings, which the import had joined incorrectly. Mail still arrived, but outgoing mail started failing authentication. The DMARC reports caught it the next morning, which is a good argument for having DMARC reporting set up before a move.',
      ),
      h2('The checklist'),
      ol([
        'Inventory every domain: registrar, DNS host, expiry, email or not, still needed or not.',
        'Export the full zone file from the current DNS host.',
        'Lower TTLs on important records to five minutes, a day ahead.',
        'Turn off DNSSEC at the registrar before changing nameservers, then turn it back on through Cloudflare afterwards.',
        'Add the domain to Cloudflare and compare its imported records against the zone file, line by line.',
        'Check MX, SPF, DKIM and DMARC records character by character.',
        'Switch nameservers. Test the website, then send email in and out.',
        'Transfer registration later, once DNS has been stable for a week. Never move both on the same day.',
      ]),
      p(
        'The DNSSEC step matters more than it looks. If you change nameservers with DNSSEC still on at the registrar, resolvers will treat your domain as tampered with, and it disappears from the internet until it’s fixed. I learned that one on a test domain, thankfully.',
      ),
      p(
        'If you’ve got a pile of domains spread across too many accounts, [send me the list](/contact). I’ll tell you what’s worth keeping and what a move would involve.',
      ),
    ],
  },
}
