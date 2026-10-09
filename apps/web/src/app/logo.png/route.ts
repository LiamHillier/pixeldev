import { logoMark } from '@/lib/og'

/** 512px logo at a stable URL for structured data (the favicon's URL is hashed). */
export function GET() {
  return logoMark(512)
}
