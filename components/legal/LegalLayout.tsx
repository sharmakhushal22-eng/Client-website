import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'

/* Shared shell for the three legal pages.
 *
 * The review banner is deliberately visible on the page, not just a code
 * comment: spec §9 lists "Legal pages (privacy, terms, cookies) — Legal
 * review required", and §11 will not let these ship unreviewed. Delete the
 * `needsReview` prop once a lawyer has signed each one off. */
export function LegalLayout({
  title,
  updated,
  intro,
  needsReview = true,
  children,
}: {
  title: string
  updated: string
  intro: string
  needsReview?: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <section className="bg-brand-50 py-10 sm:py-12">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-[2rem] font-bold leading-[1.14] sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm text-ink-500">Last updated: {updated}</p>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">{intro}</p>
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-12">
        {needsReview && (
          <div className="mx-auto mb-10 max-w-3xl rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
            <p className="flex items-start gap-2.5 text-sm leading-relaxed text-amber-900">
              <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <span>
                <strong>Draft — pending legal review.</strong> This document is a
                working draft written to cover what the site actually does. It
                must be reviewed by a lawyer before launch, and this notice
                removed by passing <code className="font-mono">needsReview=&#123;false&#125;</code>.
              </span>
            </p>
          </div>
        )}

        {/* Prose styling applied here rather than with a typography plugin —
            these three pages are the only long-form text on the site. */}
        <article
          className="mx-auto max-w-3xl
            [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline
            [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:sm:text-2xl
            [&_h3]:mt-7 [&_h3]:text-base [&_h3]:font-bold
            [&_li]:text-[0.95rem] [&_li]:leading-relaxed [&_li]:text-ink-600
            [&_p]:mt-4 [&_p]:text-[0.95rem] [&_p]:leading-relaxed [&_p]:text-ink-600
            [&_table]:mt-5 [&_table]:w-full [&_table]:text-left [&_table]:text-sm
            [&_td]:border-t [&_td]:border-ink-200 [&_td]:py-3 [&_td]:pr-4 [&_td]:align-top [&_td]:text-ink-600
            [&_th]:border-b-2 [&_th]:border-ink-200 [&_th]:py-2 [&_th]:pr-4 [&_th]:text-sm [&_th]:font-bold
            [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
        >
          {children}
        </article>
      </Container>
    </>
  )
}
