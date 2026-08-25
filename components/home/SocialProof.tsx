import Image from 'next/image'
import { Section, SectionHeading } from '@/components/ui/Section'
import { testimonials } from '@/content/home'

/* Spec §4.1 §9 — 2–3 testimonials with name, designation, company and photo.
 *
 * The section renders nothing while every entry is still a placeholder. Spec
 * §11 forbids shipping placeholder content, and an empty space is a smaller
 * credibility problem than three invented quotes: a buyer who recognises a
 * fabricated testimonial stops believing the compliance claims too. */
export function SocialProof() {
  const live = testimonials.filter((t) => t.published)
  if (live.length === 0) return null

  return (
    <Section tone="white" ariaLabel="What customers say">
      <SectionHeading
        eyebrow="In their words"
        title="What changed after the switch"
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {live.map((t, i) => (
          <figure
            key={t.name}
            data-reveal=""
            style={{ transitionDelay: `${Math.min(i, 3) * 45}ms` }}
            className="flex flex-col rounded-2xl bg-brand-50 p-7 ring-1 ring-brand-100"
          >
            <blockquote className="flex-1 text-[1.05rem] leading-relaxed text-ink-900">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-brand-200/70 pt-5">
              {t.photo ? (
                <Image
                  src={t.photo}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-sm font-bold text-on-accent"
                >
                  {t.name.slice(0, 1)}
                </span>
              )}
              <span>
                <span className="block text-sm font-bold text-ink-900">{t.name}</span>
                <span className="block text-xs text-ink-500">
                  {t.designation}, {t.company}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
