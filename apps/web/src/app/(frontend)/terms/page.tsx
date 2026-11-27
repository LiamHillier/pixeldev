import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, type LegalSection } from '@/components/LegalPage'
import { getSite } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

const intro =
  'The terms for using this website. They’re short. Project work is covered separately, by a written agreement we both sign before anything starts.'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: '/terms', title: 'Terms of use', description: intro })
}

export default async function TermsPage() {
  const site = await getSite()
  const email = site.email ?? 'liam@pixeldev.com.au'
  const mail = <a href={`mailto:${email}`}>{email}</a>
  const owner = site.ownerName ?? 'Liam Hillier'

  const sections: LegalSection[] = [
    {
      heading: 'About these terms',
      body: (
        <p>
          This website is run by {owner}, trading as {site.name}
          {site.abn ? ` (ABN ${site.abn})` : ''}, a sole trader based in Melbourne. When these
          terms say “we”, “us” or “our”, that’s who they mean. By using the site, you agree to
          these terms. If you don’t agree, please don’t use it.
        </p>
      ),
    },
    {
      heading: 'Project work',
      body: (
        <p>
          Nothing on this site is an offer to do work at a fixed price or on fixed terms. Prices,
          timeframes and examples are a guide. When we work together, the scope, price, payment,
          ownership of the code and everything else is set out in a written proposal or agreement,
          and that document is what applies, not this page.
        </p>
      ),
    },
    {
      heading: 'Products',
      body: (
        <p>
          Products we build and sell, such as SquareSync for Woo, have their own terms on their own
          sites. Those terms apply when you buy or use the product.
        </p>
      ),
    },
    {
      heading: 'The content on this site',
      body: (
        <>
          <p>
            We write the articles and case studies to be useful, and we try to keep them accurate.
            They’re general information, not advice for your particular situation. Software, APIs
            and platforms change, so check before you rely on anything here for a decision that
            matters.
          </p>
          <p>
            Case studies describe real projects. Some client details are changed or left out at the
            client’s request, and some screenshots use made-up sample data.
          </p>
        </>
      ),
    },
    {
      heading: 'Copyright',
      body: (
        <p>
          The writing, design and images on this site belong to us, or to the clients and owners
          who’ve allowed us to show them. You’re welcome to link to any page and quote short
          extracts with a link back. Please ask before copying anything more than that. Trade
          marks and product names belong to their owners.
        </p>
      ),
    },
    {
      heading: 'Using the site',
      body: (
        <>
          <p>Please don’t:</p>
          <ul>
            <li>use the contact form to send spam, advertising or anything unlawful;</li>
            <li>try to break into, overload or interfere with the site or its admin;</li>
            <li>scrape the site in a way that degrades it for other people.</li>
          </ul>
        </>
      ),
    },
    {
      heading: 'Links to other sites',
      body: (
        <p>
          Some pages link to other websites, including client sites and our own products. We
          don’t control those sites and we’re not responsible for what’s on them.
        </p>
      ),
    },
    {
      heading: 'Liability',
      body: (
        <>
          <p>
            We aim to keep the site available and correct, but we can’t promise it will always be
            either. To the extent the law allows, we’re not liable for any loss that comes from
            using the site or relying on its content.
          </p>
          <p>
            Nothing in these terms limits rights you have under the Australian Consumer Law that
            can’t be excluded.
          </p>
        </>
      ),
    },
    {
      heading: 'Privacy',
      body: (
        <p>
          How we handle anything you send us is covered in the{' '}
          <Link href="/privacy">privacy policy</Link>.
        </p>
      ),
    },
    {
      heading: 'Governing law',
      body: (
        <p>
          These terms are governed by the laws of Victoria, Australia, and the courts of Victoria
          have jurisdiction over any dispute about them.
        </p>
      ),
    },
    {
      heading: 'Changes',
      body: (
        <p>
          We may update these terms from time to time. The date at the top shows when they last
          changed. Questions: {mail}.
        </p>
      ),
    },
  ]

  return (
    <LegalPage
      path="/terms"
      title="Terms of use"
      heading="Terms of use"
      intro={intro}
      updated="27 November 2026"
      sections={sections}
    />
  )
}
