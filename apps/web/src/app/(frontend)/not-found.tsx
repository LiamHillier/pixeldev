import { Button, PageHeader } from '@/components/ui'

export default function NotFound() {
  return (
    <PageHeader eyebrow="404" heading="That page isn't here." intro="It may have moved, or the link was wrong. The home page has everything that is." className="pb-24">
      <Button href="/" className="self-start">
        Back to the start
      </Button>
    </PageHeader>
  )
}
