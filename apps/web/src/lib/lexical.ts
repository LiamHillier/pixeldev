import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { slugify } from '@/fields/slug'

export type Heading = { id: string; text: string; tag: string }

type AnyNode = { type?: string; tag?: string; text?: string; children?: AnyNode[] }

function textOf(node: AnyNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(textOf).join('')
}

/** Pull h2/h3 headings out of a Lexical document for a table of contents. */
export function extractHeadings(state: SerializedEditorState | null | undefined): Heading[] {
  if (!state?.root) return []
  const out: Heading[] = []
  for (const node of (state.root.children ?? []) as AnyNode[]) {
    if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
      const text = textOf(node)
      out.push({ id: slugify(text), text, tag: node.tag })
    }
  }
  return out
}

export function headingId(node: AnyNode): string {
  return slugify(textOf(node))
}
