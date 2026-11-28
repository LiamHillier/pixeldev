/**
 * Site settings copy from the Inline design.
 *
 *   siteCopy  ->  payload.updateGlobal({ slug: 'site', data: siteCopy })
 *
 * Only these fields are set. email, ABN, linkedin, business details, nav, legal links and the
 * seo group are left out, so they keep their current values.
 */
export const siteCopy = {
  tagline: 'AI, automation and software for growing Australian businesses.',
  locationLine: 'Melbourne, working Australia-wide.',
  headerCtaLabel: 'Let’s talk',
  products: [
    { label: 'SquareSync for Woo', href: 'https://squaresyncforwoo.com' },
    { label: 'OnCloudWine', href: '/work/oncloudwine' },
  ],
}
