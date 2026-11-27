import {
  RichText as LexicalRichText,
  type JSXConverters,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { headingId } from '@/lib/lexical'
import { cx } from '@/lib/utils'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    return <Tag id={headingId(node as never)}>{nodesToJSX({ nodes: node.children })}</Tag>
  },
})

/**
 * Article and case-study bodies: numbered lists become ruled rows with "01" counters that tint on
 * hover and rise in as they scroll into view, as in the Inline design.
 */
const ruledConverters: JSXConvertersFunction = (args) => {
  const base = converters(args) as JSXConverters
  return {
    ...base,
    list: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      if (node.tag === 'ol') {
        return <ol className={`list-${node.listType} ruled rv-li`}>{children}</ol>
      }
      return <ul className={`list-${node.listType}`}>{children}</ul>
    },
  }
}

/**
 * `variant`:
 *   default   legal pages and anything else: the plain `prose-pd` body.
 *   article   journal articles: teal underlined links, ruled numbered lists.
 *   case      case-study sections: ruled numbered lists.
 */
export function RichText({
  data,
  className,
  variant,
}: {
  data: SerializedEditorState | null | undefined
  className?: string
  variant?: 'article' | 'case'
}) {
  if (!data) return null
  return (
    <LexicalRichText
      data={data}
      converters={variant ? ruledConverters : converters}
      className={cx(
        'prose-pd',
        // `.prose-pd` is unlayered CSS, so these overrides need `!` to win over it.
        variant &&
          '[&_ol.ruled]:[counter-reset:pd-list_px]! [&_ol.ruled>li]:pr-12! [&_ol.ruled>li]:grid-cols-[24px_1fr]! [&_ol.ruled>li]:gap-5!',
        variant === 'article' &&
          '[&_a]:text-accent! [&_a]:underline-offset-4! [&_a:hover]:text-ink!',
        variant === 'case' && 'leading-[1.6]!',
        className,
      )}
    />
  )
}
