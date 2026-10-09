import {
  RichText as LexicalRichText,
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

export function RichText({
  data,
  className,
}: {
  data: SerializedEditorState | null | undefined
  className?: string
}) {
  if (!data) return null
  return (
    <LexicalRichText
      data={data}
      converters={converters}
      className={cx('prose-pd', className)}
    />
  )
}
