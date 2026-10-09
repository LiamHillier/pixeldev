import { ImageResponse } from 'next/og'

const colors = {
  paper: '#f6f3ee',
  ink: '#1b1a17',
  faint: '#7a7468',
  rule: '#ddd6cb',
  accent: '#2f5d50',
}

/** Newsreader from Google Fonts as TTF. Falls back to the default font if the fetch fails. */
async function loadSerif(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@72,500&text=${encodeURIComponent(
        text,
      )}`,
      { next: { revalidate: 60 * 60 * 24 * 30 } },
    ).then((r) => r.text())
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (!src) return null
    return await fetch(src).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

/** Square "P" mark, used for the favicon and as the logo in structured data. */
export function logoMark(px: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.ink,
          color: colors.paper,
          fontSize: px * 0.69,
          fontFamily: 'Georgia, serif',
          borderRadius: px * 0.19,
        }}
      >
        P
      </div>
    ),
    { width: px, height: px },
  )
}

export async function shareCard({
  title,
  eyebrow,
  siteName,
  footer,
}: {
  title: string
  eyebrow?: string
  siteName: string
  footer: string
}) {
  const serif = await loadSerif(`${title}${siteName}${eyebrow ?? ''}${footer}`)
  const size = title.length > 70 ? 56 : title.length > 40 ? 68 : 80
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: colors.paper,
          color: colors.ink,
          padding: '64px 72px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: `2px solid ${colors.ink}`,
            paddingBottom: 24,
          }}
        >
          <div style={{ fontFamily: serif ? 'Newsreader' : undefined, fontSize: 40 }}>
            {siteName}
          </div>
          {eyebrow ? <div style={{ fontSize: 26, color: colors.faint }}>{eyebrow}</div> : null}
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: serif ? 'Newsreader' : undefined,
            fontSize: size,
            lineHeight: 1.08,
            letterSpacing: '-0.015em',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 26,
            color: colors.faint,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: colors.accent }} />
          {footer}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: serif
        ? [{ name: 'Newsreader', data: serif, weight: 500, style: 'normal' }]
        : undefined,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
    },
  )
}
