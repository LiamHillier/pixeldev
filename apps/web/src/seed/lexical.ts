/**
 * Tiny builders for Lexical JSON so seed content can be written as plain data.
 * Inline markup: [text](url) becomes a link, *text* becomes italic.
 */

type Inline = { type: 'text'; text: string; format: number; detail: 0; mode: 'normal'; style: ''; version: 1 }
type LinkNode = {
  type: 'link'
  version: 3
  fields: { linkType: 'custom'; url: string; newTab: boolean }
  children: Inline[]
  direction: 'ltr'
  format: ''
  indent: 0
}
type Block = Record<string, unknown>

const base = { direction: 'ltr' as const, format: '' as const, indent: 0 as const, version: 1 as const }

function text(t: string, format = 0): Inline {
  return { type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 }
}

export function inline(src: string): Array<Inline | LinkNode> {
  const out: Array<Inline | LinkNode> = []
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(text(src.slice(last, m.index)))
    if (m[1]) {
      out.push({
        type: 'link',
        version: 3,
        fields: { linkType: 'custom', url: m[2], newTab: /^https?:/.test(m[2]) },
        children: [text(m[1])],
        direction: 'ltr',
        format: '',
        indent: 0,
      })
    } else if (m[3]) {
      out.push(text(m[3], 2))
    }
    last = re.lastIndex
  }
  if (last < src.length) out.push(text(src.slice(last)))
  return out
}

export const p = (t: string): Block => ({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: inline(t) })
export const h2 = (t: string): Block => ({ ...base, type: 'heading', tag: 'h2', children: inline(t) })
export const h3 = (t: string): Block => ({ ...base, type: 'heading', tag: 'h3', children: inline(t) })
export const ol = (items: string[]): Block => ({
  ...base,
  type: 'list',
  listType: 'number',
  tag: 'ol',
  start: 1,
  children: items.map((t, i) => ({ ...base, type: 'listitem', value: i + 1, children: inline(t) })),
})
export const ul = (items: string[]): Block => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((t, i) => ({ ...base, type: 'listitem', value: i + 1, children: inline(t) })),
})
export const quote = (t: string): Block => ({ ...base, type: 'quote', children: inline(t) })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function richText(...blocks: Block[]): any {
  return { root: { ...base, type: 'root', children: blocks } }
}
