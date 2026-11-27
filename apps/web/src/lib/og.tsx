import { ImageResponse } from 'next/og'

const colors = {
  paper: '#ffffff',
  ink: '#111318',
  muted: '#4a4f59',
  rule: '#e3e5e9',
  accent: '#087a6c',
  tint: '#e3f1ee',
}

const FONT = 'Funnel Display'

/** Funnel Display from Google Fonts as TTF. Falls back to the default font if the fetch fails. */
async function loadDisplay(text: string, weight: 500 | 600): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Funnel+Display:wght@${weight}&text=${encodeURIComponent(
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
export async function logoMark(px: number) {
  const font = await loadDisplay('P', 600)
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
          fontSize: px * 0.66,
          fontFamily: font ? FONT : 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
          letterSpacing: '-0.04em',
          borderRadius: px * 0.22,
        }}
      >
        P
      </div>
    ),
    {
      width: px,
      height: px,
      fonts: font ? [{ name: FONT, data: font, weight: 600, style: 'normal' }] : undefined,
    },
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
  const [medium, bold] = await Promise.all([
    loadDisplay(`${title}${eyebrow ?? ''}${footer}`, 500),
    loadDisplay(siteName, 600),
  ])
  const size = title.length > 70 ? 58 : title.length > 40 ? 70 : 84
  const fonts = [
    ...(medium ? [{ name: FONT, data: medium, weight: 500 as const, style: 'normal' as const }] : []),
    ...(bold ? [{ name: FONT, data: bold, weight: 600 as const, style: 'normal' as const }] : []),
  ]
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
          fontFamily: fonts.length ? FONT : undefined,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.04em' }}>{siteName}</div>
          {eyebrow ? (
            <div style={{ fontSize: 26, fontWeight: 500, color: colors.muted }}>{eyebrow}</div>
          ) : null}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: size,
            fontWeight: 500,
            lineHeight: 1.04,
            letterSpacing: '-0.045em',
            maxWidth: 1000,
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
            fontWeight: 500,
            color: colors.muted,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 17,
              background: colors.accent,
            }}
          />
          {footer}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length ? fonts : undefined,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
    },
  )
}
