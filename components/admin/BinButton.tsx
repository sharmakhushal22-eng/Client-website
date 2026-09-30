'use client'

/* ============================================================================
 * The delete control: a red bin whose lid lifts when you reach for it.
 *
 * Built here rather than added to components/ui/Icon.tsx because that set is
 * one <path> per name, drawn as a single shape. A bin that opens needs its
 * lid to be a SEPARATE element with its own transform origin, which the
 * shared icon component has no way to express.
 *
 * The animation is not decoration. An icon-only button in a dense table has
 * to answer "did I mean to point at this?" before the click, and a lid that
 * lifts under the cursor does that faster than a colour change. It fires on
 * focus as well as hover, so the keyboard gets the same answer.
 *
 * Accessibility: the button carries the company name in its label, because
 * "Delete" repeated down a table tells a screen-reader user nothing about
 * WHICH row they are on. The bin itself is aria-hidden — it is a picture of
 * the label, not extra information.
 * ========================================================================= */

type Props = {
  /** Named, not generic: "Delete Acme Steel", never just "Delete". */
  label: string
  /** True while the delete is in flight — the bin shakes and stops taking clicks. */
  working?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  /** `solid` is the filled button used to confirm; `ghost` is the row trigger. */
  variant?: 'ghost' | 'solid'
  /** Set on a confirm button so the keyboard lands on the decision, not on
   *  whatever happened to be next in the table. */
  autoFocus?: boolean
  children?: React.ReactNode
}

export function BinButton({
  label,
  working = false,
  onClick,
  type = 'button',
  variant = 'ghost',
  autoFocus = false,
  children,
}: Props) {
  const solid = variant === 'solid'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={working}
      autoFocus={autoFocus}
      aria-label={children ? undefined : label}
      title={label}
      className={
        'group inline-flex items-center gap-1.5 rounded-lg outline-none transition-colors ' +
        'focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 ' +
        'disabled:cursor-wait ' +
        (solid
          ? 'bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-70'
          : 'p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600')
      }
    >
      <Bin working={working} />
      {children}
    </button>
  )
}

/** 24×24, stroked to match the rest of the admin iconography. The lid is its
 *  own group so it can swing from the right-hand edge. */
function Bin({ working }: { working: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`ez-bin h-[1.15rem] w-[1.15rem] shrink-0 ${working ? 'ez-bin-working' : ''}`}
    >
      {/* Lid: handle + bar, hinged at the right end of the bar. */}
      <g className="ez-bin-lid">
        <path d="M9.5 5.2V4.3A1.6 1.6 0 0 1 11.1 2.7h1.8a1.6 1.6 0 0 1 1.6 1.6v.9" />
        <path d="M4.6 5.2h14.8" />
      </g>

      {/* Can. */}
      <path d="M6.6 7.4l.72 11.6a2.1 2.1 0 0 0 2.1 2h5.16a2.1 2.1 0 0 0 2.1-2l.72-11.6" />
      <path d="M10.4 10.9v6.2M13.6 10.9v6.2" />
    </svg>
  )
}
