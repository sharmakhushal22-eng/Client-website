import type { IconName } from '@/components/ui/Icon'

/* The pre-registration offer, in one place so the teaser and the panel can
 * never drift apart — the teaser is a promise the panel has to keep.
 *
 * Note what is NOT here: a seat counter, a countdown, or "only 7 places
 * left". Manufactured scarcity is the cheapest trick available and the most
 * expensive one to be caught at, and this company's whole position is that it
 * says true things about where it is. The scarcity here is real and needs no
 * number: a founding cohort closes when general launch happens. */
export const prereg = {
  eyebrow: 'Founding customers',
  teaserTitle: 'Priced like a coffee. Not public yet.',
  teaserLine:
    'One coffee a month, per employee — and the founding rate is held for your term.',

  panelTitle: 'Lock the coffee price',
  panelLead:
    'Per employee, per month, EZER costs about what one coffee costs. That rate is not public yet — pre-register and it is held for your founding term.',

  /* The urgency line. Every clause is a fact, not a device:
   *   · the rate genuinely is not published (pricing.disclosed === false)
   *   · the founding rate genuinely is held for the term
   *   · a founding cohort genuinely closes at general launch
   *
   * What is NOT here: a countdown, a seat counter, or "the price goes up on
   * the 30th". Those would each be a commitment nobody has made, and the
   * first prospect who asks "up to what?" turns the whole page into a
   * negotiation about credibility. */
  urgency:
    'The rate goes public at general launch. Pre-register before then and it is held for your founding term — including through the versions that add more than you signed up for.',

  benefits: [
    {
      icon: 'wallet' as IconName,
      title: 'Rate held for the founding term',
      detail: 'Including through the versions that add more than you signed up for.',
    },
    {
      icon: 'users' as IconName,
      title: 'Implementation by the people who built it',
      detail: 'Not a partner, not a reseller. They run your parallel payroll cycle.',
    },
    {
      icon: 'shield' as IconName,
      title: 'Your statutory edge cases get built',
      detail: 'Your state, your establishment type, your wage structure — because you asked.',
    },
    {
      icon: 'sparkle' as IconName,
      title: 'First look at labour-code tooling',
      detail: 'As each state notifies its rules, you see the handling before it ships.',
    },
  ],

  /* This should repel the wrong buyer as efficiently as it attracts the right
   * one. A founding engagement genuinely is not for everybody. */
  fitNote:
    'This suits a company that wants influence over the product and can tolerate being early. If you need a vendor with two hundred reference customers, we are not that yet.',

  reassurance:
    'No obligation and no credit card. We will call once to understand what you run — if it is not a fit, we will say so.',

  cta: 'Pre-register my company',
} as const
