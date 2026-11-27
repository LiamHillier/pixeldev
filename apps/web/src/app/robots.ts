import type { MetadataRoute } from 'next'
import { absoluteUrl, siteUrl } from '@/lib/seo'

/**
 * AI search and assistant crawlers, named so the intent is explicit: being cited in ChatGPT,
 * Claude, Perplexity, Gemini and Copilot answers is the point. A crawler that matches a named
 * group ignores the `*` group, so each one gets the same allow and disallow lists.
 */
const aiCrawlers = [
  // OpenAI: search index, user-triggered fetches, training
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  // Anthropic
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google Gemini grounding, Apple Intelligence
  'Google-Extended',
  'Applebot-Extended',
  // Others that feed AI answers
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'meta-externalagent',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  // Keep staging and preview deploys out of the index; only the live domain is crawlable.
  const isLive = process.env.NODE_ENV === 'production' && !siteUrl.includes('localhost')
  const allow = ['/', '/api/media/file/']
  const disallow = ['/admin', '/api/']
  return {
    rules: isLive
      ? [
          { userAgent: '*', allow, disallow },
          { userAgent: aiCrawlers, allow, disallow },
        ]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteUrl,
  }
}
