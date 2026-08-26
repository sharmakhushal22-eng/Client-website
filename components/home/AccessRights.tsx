import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { access } from '@/content/positioning'
import { cn } from '@/lib/cn'

/* Rights management.
 *
 * The CFO row is highlighted because it is the one that closes deals: a
 * finance signatory wants the statutory and cost position without being handed
 * access to individual salaries, and most systems cannot express that
 * distinction — which is why a sanitised spreadsheet gets maintained beside
 * them.
 *
 * Heading beside the roles rather than above them, and roles as rows rather
 * than cards. */
export function AccessRights() {
  return (
    <section className="bg-brand-50 py-12 sm:py-14 lg:py-16" aria-label="Roles and access">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              {access.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              {access.title}
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">
              {access.lede}
            </p>

            {/* The room this section is actually about.
             *
             * Rights management is abstract until you picture who is asking
             * for the access — and it is usually this: a leadership review
             * where someone wants the cost and the compliance position
             * without wanting anyone's individual salary on the screen.
             *
             * Kept to the left column, under the copy, so it supports the
             * argument rather than competing with the role cards that carry
             * it. Decorative: alt is empty and every claim is still text. */}
            <div className="relative mt-8 hidden aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-brand-100 lg:block">
              <Image
                src="/photos/leadership-review.jpg"
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 1024px) 0px, 33vw"
                className="object-cover object-center"
              />
              {/* A brand tint, so the photograph reads as part of this page
                  rather than as something bought from a library. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-brand-900/25 mix-blend-multiply"
              />
            </div>
          </div>

          <ul className="space-y-3">
            {access.roles.map((role, i) => (
              <li
                key={role.name}
                data-reveal=""
                style={{ transitionDelay: `${Math.min(i, 3) * 45}ms` }}
                className={cn(
                  'flex items-start gap-4 rounded-2xl p-5',
                  role.highlight
                    ? 'bg-dark text-white ring-2 ring-brand-600'
                    : 'bg-surface ring-1 ring-ink-200',
                )}
              >
                <span
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
                    role.highlight
                      ? 'bg-brand-600 text-on-accent'
                      : 'bg-brand-100 text-brand-700',
                  )}
                >
                  <Icon name={role.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3
                    className={cn(
                      'text-[1.02rem] font-bold',
                      role.highlight ? 'text-white' : 'text-ink-900',
                    )}
                  >
                    {role.name}
                  </h3>
                  <p
                    className={cn(
                      'mt-1.5 text-sm leading-relaxed',
                      role.highlight ? 'text-on-dark-muted' : 'text-ink-600',
                    )}
                  >
                    {role.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
