import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, type LegalSection } from '@/components/LegalPage'
import { getSite } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

const intro =
  'What this site collects, why, where it’s kept and how to get it changed or deleted. The short version: only what you send me through the contact form, used only to reply to you.'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: '/privacy', title: 'Privacy policy', description: intro })
}

export default async function PrivacyPage() {
  const site = await getSite()
  const email = site.email ?? 'liam@pixeldev.com.au'
  const mail = <a href={`mailto:${email}`}>{email}</a>

  const sections: LegalSection[] = [
    {
      heading: 'Who I am',
      body: (
        <p>
          {site.name} is run by {site.ownerName ?? 'Liam Hillier'}, a sole trader based in
          Melbourne{site.abn ? ` (ABN ${site.abn})` : ''}. When this policy says “I” or “me”, that’s
          who it means. I handle personal information in line with the Australian Privacy
          Principles in the Privacy Act 1988 (Cth).
        </p>
      ),
    },
    {
      heading: 'What I collect',
      body: (
        <>
          <p>
            If you use the <Link href="/contact">contact form</Link>, I collect what you type into
            it: your name, email address, and anything else you choose to tell me, such as your
            business name, the systems you use, the problem you’re trying to solve and a rough
            budget. If you email me directly, I get your email address and whatever is in the
            message.
          </p>
          <p>
            Like any web server, the server that hosts this site keeps short-lived technical logs
            (IP address, browser type, the page requested and the time). They’re used to keep the
            site running and secure, and aren’t used to identify you.
          </p>
          <p>That’s it. I don’t buy lists, and I don’t collect anything about you from elsewhere.</p>
        </>
      ),
    },
    {
      heading: 'No tracking, no cookies',
      body: (
        <p>
          This site doesn’t use analytics, advertising pixels, social media embeds or tracking
          cookies. Fonts are served from this site rather than a third party, so visiting a page
          doesn’t tell anyone else you were here. The only cookie the site ever sets is a login
          cookie for the content admin, which only I use.
        </p>
      ),
    },
    {
      heading: 'How I use it',
      body: (
        <>
          <p>I use what you send me to:</p>
          <ul>
            <li>reply to your enquiry and talk through the work;</li>
            <li>prepare a quote or proposal if you ask for one;</li>
            <li>keep a record of our conversation if we end up working together.</li>
          </ul>
          <p>
            I won’t add you to a mailing list, send you marketing, or sell, rent or trade your
            details. Ever.
          </p>
        </>
      ),
    },
    {
      heading: 'Who else sees it',
      body: (
        <>
          <p>
            Nobody, except the services that make the site work. Contact form submissions are saved
            in this site’s database and a copy is emailed to me through Postmark, an email delivery
            service. Postmark processes email in the United States, so the contents of your
            enquiry pass through servers there on the way to my inbox. Postmark has its own
            security and privacy commitments, and only handles the message to deliver it.
          </p>
          <p>I’d only disclose your information to anyone else if the law required me to.</p>
        </>
      ),
    },
    {
      heading: 'Where it’s stored and how long for',
      body: (
        <>
          <p>
            The site and its database run on a server in Australia. Access is limited to me, and
            the admin is password protected over an encrypted connection.
          </p>
          <p>
            I keep enquiries for as long as they’re useful for our conversation, and delete ones
            that didn’t go anywhere when I tidy up. If you become a client, I keep project and
            billing records for as long as Australian tax law requires, which is currently five
            years.
          </p>
        </>
      ),
    },
    {
      heading: 'Seeing, fixing or deleting your information',
      body: (
        <p>
          You can ask me for a copy of what I hold about you, ask me to correct it, or ask me to
          delete it. Email {mail} and I’ll sort it out, usually within a few days and always within
          30. There’s no charge. The only thing I can’t delete is what I’m legally required to keep,
          such as invoices.
        </p>
      ),
    },
    {
      heading: 'Complaints',
      body: (
        <p>
          If you think I’ve mishandled your information, email {mail} and tell me what happened.
          I’ll respond within 30 days. If you’re not happy with my response, you can contact the
          Office of the Australian Information Commissioner at{' '}
          <a href="https://www.oaic.gov.au">oaic.gov.au</a>.
        </p>
      ),
    },
    {
      heading: 'Client systems',
      body: (
        <p>
          This policy covers this website. When I build or host software for a client, the
          personal information in that system belongs to the client and is handled under their
          privacy policy and our written agreement.
        </p>
      ),
    },
    {
      heading: 'Changes',
      body: (
        <p>
          If I change how I handle personal information, I’ll update this page and the date at the
          top. Questions about any of it: {mail}.
        </p>
      ),
    },
  ]

  return (
    <LegalPage
      path="/privacy"
      title="Privacy policy"
      heading="Privacy policy"
      intro={intro}
      updated="10 October 2026"
      sections={sections}
    />
  )
}
