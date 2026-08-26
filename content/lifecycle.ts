import type { IconName } from '@/components/ui/Icon'

/* ============================================================================
 * "One employee record. Hire to exit."
 *
 * New in the redesign, and it earns its place by making an abstract claim
 * concrete. "One system, not five" is what every HR vendor says; showing the
 * SAME record moving through six stages is the version a buyer can check —
 * and it names the thing that actually goes wrong elsewhere, which is the
 * re-keying between stages rather than any single stage being bad.
 * ========================================================================= */

export const lifecycle = {
  eyebrow: 'The whole arc',
  title: 'One employee record. Hire to exit.',
  lede:
    'Watch the same record travel the whole lifecycle — nothing re-keyed, ' +
    'nothing handed to another vendor.',

  stages: [
    { icon: 'briefcase' as IconName, name: 'Hire', detail: 'ATS + offers' },
    { icon: 'user-plus' as IconName, name: 'Onboard', detail: 'e-KYC, forms' },
    { icon: 'clock' as IconName, name: 'Work', detail: 'attendance' },
    { icon: 'wallet' as IconName, name: 'Pay', detail: 'payroll + TDS' },
    { icon: 'chart' as IconName, name: 'Grow', detail: 'reviews, FBP' },
    { icon: 'check' as IconName, name: 'Exit', detail: 'FNF settled' },
  ],

  /* The line that turns the diagram into an argument. Without it a reader
   * sees six boxes; with it they see the failure it removes. */
  /* Deliberately says "join", not "arrow". The strip is drawn as ONE
   * unbroken line precisely because arrows between boxes imply handoffs —
   * which is the thing this section exists to say does not happen. Copy that
   * described arrows would contradict the picture beside it. */
  note:
    'Every join above is a handoff somewhere else — an export, a re-keyed PAN, ' +
    'a spreadsheet emailed to payroll. Here there is nothing to hand off: it is ' +
    'one record the whole way, which is why the line does not break.',
} as const

/* The four promises from the product's own brand block, carried over from the
 * redesign. Short enough to sit under the hero without competing with it. */
export const brandPromises = [
  'Make your HR process easy',
  'User satisfaction, our priority',
  'Multiple tools interlinked, a single login',
] as const
