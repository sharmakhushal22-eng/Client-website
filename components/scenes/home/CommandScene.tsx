'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Icon } from '@/components/ui/Icon'
import { Scene } from '@/components/scene/Scene'
import { cn } from '@/lib/cn'

/* ============================================================================
 * Scene 7: the whole group on one screen, seen as different people.
 *
 * Modelled on the product's own HR dashboard: KPI tiles, headcount by
 * location, the recruitment pipeline (the product's real stages, including
 * AI screening), and a live activity feed. The switch along the top is the
 * point: pick a role and the same screen re-scopes the way the product's
 * role-based access does (content/positioning.ts → access.roles). A branch
 * HR executive sees one branch; Finance sees cost with Aadhaar and bank
 * details masked; the CFO sees the group consolidated.
 *
 * All figures are sample data and the card says so. No particle stage here:
 * the dashboard is busy enough, and the quiet keeps the scenes from
 * repeating one effect.
 * ========================================================================= */

type Role = 'hr' | 'branch' | 'finance' | 'cfo'

const roles: { id: Role; label: string; note: string }[] = [
  { id: 'hr', label: 'HR Head', note: 'Full access, all companies' },
  { id: 'branch', label: 'Branch HR', note: 'Own branch only' },
  { id: 'finance', label: 'Finance', note: 'Cost reports, PII masked' },
  { id: 'cfo', label: 'CFO', note: 'Consolidated, no transaction detail' },
]

const locations = [
  ['Mumbai · Head office', 214],
  ['Pune · Plant', 186],
  ['Bengaluru · Branch', 112],
  ['Delhi NCR · Branch', 98],
  ['Chennai · Depot', 84],
  ['Hyderabad · Branch', 76],
  ['Kolkata · Warehouse', 70],
  ['Ahmedabad · Plant', 50],
] as const

const pipeline = [
  ['Applied', 128], ['AI screened', 64], ['Telephonic', 31], ['L1', 18], ['L2', 11], ['Offer sent', 9], ['Joined', 6],
] as const

const feed = [
  ['Offer accepted', 'Kabir S. · Quality Engineer', 'briefcase'],
  ['Leave approved', 'Ananya R. · 26–27 Oct', 'calendar'],
  ['Payroll released', 'Plant · Pune · 186 people', 'wallet'],
  ['Transfer', 'Meera K. · Pune to Bengaluru', 'map-pin'],
  ['Missed punch regularised', 'Arjun P. · approved by RM', 'clock'],
  ['Offer accepted', 'Kabir S. · Quality Engineer', 'briefcase'],
] as const

const tiles: Record<Role, [string, string, string][]> = {
  hr: [['Employees', '890', '3 companies'], ['Open positions', '41', 'approved MRFs'], ['In pipeline', '32', 'active candidates'], ['Joining soon', '10', 'in onboarding']],
  branch: [['Employees', '186', 'Plant · Pune'], ['On leave today', '7', 'of 186'], ['Missed punches', '3', 'to regularise'], ['Joining soon', '2', 'this month']],
  finance: [['Payroll cost', '₹3.38 Cr', 'October, all companies'], ['Employer PF', '₹18.6 L', 'October'], ['Claims pending', '24', 'with Finance'], ['Loans active', '37', 'EMIs in payroll']],
  cfo: [['Headcount', '890', 'group, 3 companies'], ['Cost vs plan', '−2.4%', 'year to date'], ['Filings done', '86%', 'October'], ['Risk flags', '2', 'due this week']],
}

function Bar({ v, max, dim, i }: { v: number; max: number; dim?: boolean; i: number }) {
  return (
    <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-ink-900/[0.06]">
      <span
        className={cn('ez-panel-bar absolute inset-y-0 left-0 rounded-full', dim ? 'bg-ink-200' : 'bg-brand-600')}
        style={{ width: `${(v / max) * 100}%`, '--i': i } as React.CSSProperties}
      />
    </span>
  )
}

export function CommandScene({ index }: { index: number }) {
  const [role, setRole] = useState<Role>('hr')

  return (
    <Scene index={index} tone="white" labelledBy="command-title">
      <Container className="flex h-full flex-col justify-center py-20 lg:py-0 lg:pt-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>One login, every role</Eyebrow>
            <h2 id="command-title" className="mt-5 text-[2.2rem] leading-[1.04] sm:text-[2.8rem] lg:text-[min(3.2vw,5.4vh)]">
              The whole group on one screen.
              <br />
              <span className="text-ink-400">Each person sees their part.</span>
            </h2>
          </div>
          <div>
            <p className="ez-kicker mb-2 text-ink-500" id="viewas">View as</p>
            <div role="radiogroup" aria-labelledby="viewas" className="grid grid-cols-2 gap-1 rounded-[22px] bg-paper p-1 ring-1 ring-ink-900/[0.06] sm:inline-flex sm:flex-wrap sm:rounded-full">
              {roles.map((r) => (
                <button
                  key={r.id}
                  role="radio"
                  aria-checked={role === r.id}
                  onClick={() => setRole(r.id)}
                  className={cn(
                    'ez-press rounded-full px-4 py-2 text-[0.88rem] font-semibold transition-colors',
                    role === r.id ? 'bg-ink-900 text-white' : 'text-ink-600 hover:text-ink-900',
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[0.8rem] text-ink-500" aria-live="polite">
              {roles.find((r) => r.id === role)?.note}
            </p>
          </div>
        </div>

        {/* ── The dashboard ─────────────────────────────────────────────── */}
        <div
          data-depth="1"
          role="img"
          aria-label={`Illustration with sample data: the HR dashboard as seen by ${roles.find((r) => r.id === role)?.label}.`}
          className="mt-8 overflow-hidden rounded-[28px] bg-paper p-4 shadow-[0_1px_2px_rgb(11_22_51/0.05),0_50px_100px_-50px_rgb(11_22_51/0.45)] ring-1 ring-ink-900/[0.06] sm:p-5"
        >
          <div key={role} className="ez-panel-in grid gap-3 lg:grid-cols-12">
            {/* KPI tiles */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-12">
              {tiles[role].map(([k, v, sub]) => (
                <div key={k} className="rounded-[18px] bg-white p-4 ring-1 ring-ink-900/[0.05]">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-500">{k}</p>
                  <p className="ez-count mt-2 font-display text-[1.7rem] font-[680] leading-none tracking-[-0.03em] text-ink-900 [font-stretch:108%]">{v}</p>
                  <p className="mt-1.5 text-[0.74rem] text-ink-500">{sub}</p>
                </div>
              ))}
            </div>

            {/* Headcount by location, or by company */}
            <div className="rounded-[18px] bg-white p-4 ring-1 ring-ink-900/[0.05] lg:col-span-5">
              <p className="text-[0.74rem] font-semibold text-ink-700">
                {role === 'finance' || role === 'cfo' ? 'Cost by company · October' : 'Headcount by location'}
              </p>
              <ul className="mt-3 space-y-2">
                {(role === 'finance' || role === 'cfo'
                  ? ([['Company 1 · Manufacturing', 148], ['Company 2 · Logistics', 104], ['Company 3 · Retail', 86]] as const)
                  : locations.slice(0, role === 'branch' ? 8 : 6)
                ).map(([name, v], i) => {
                  const dim = role === 'branch' && name !== 'Pune · Plant'
                  return (
                    <li key={name} className={cn('flex items-center gap-3 text-[0.76rem]', dim && 'opacity-50')}>
                      <span className="w-[9.5rem] shrink-0 truncate text-ink-600">{name}</span>
                      <Bar v={v} max={role === 'finance' || role === 'cfo' ? 160 : 220} dim={dim} i={i} />
                      <span className="ez-count w-12 shrink-0 text-right font-semibold text-ink-800">
                        {dim ? 'n/a' : role === 'finance' || role === 'cfo' ? `₹${(v / 100).toFixed(2)} Cr` : v}
                      </span>
                    </li>
                  )
                })}
              </ul>
              {role === 'branch' && <p className="mt-3 text-[0.72rem] text-ink-400">Other branches are outside this role&rsquo;s scope.</p>}
            </div>

            {/* Middle: pipeline, or a masked employee row */}
            <div className="rounded-[18px] bg-white p-4 ring-1 ring-ink-900/[0.05] max-md:hidden lg:col-span-4">
              {role === 'finance' ? (
                <>
                  <p className="text-[0.74rem] font-semibold text-ink-700">Employee record, as Finance sees it</p>
                  <dl className="mt-3 divide-y divide-ink-900/[0.06] text-[0.78rem]">
                    {[
                      ['Name', 'Ananya R.'],
                      ['CTC', '₹7,20,000'],
                      ['Aadhaar', 'XXXX XXXX 4821'],
                      ['Bank account', '•••• •••• 6630'],
                      ['PAN', 'XXXXX1234X'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2">
                        <dt className="text-ink-500">{k}</dt>
                        <dd className={cn('ez-count font-semibold', v.includes('X') || v.includes('•') ? 'text-ink-400' : 'text-ink-900')}>
                          {v}
                          {(v.includes('X') || v.includes('•')) && <Icon name="lock" className="ml-1.5 inline h-3 w-3 text-ink-400" />}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : role === 'cfo' ? (
                <>
                  <p className="text-[0.74rem] font-semibold text-ink-700">Statutory filings · October</p>
                  <div className="mt-3 flex items-center gap-4">
                    <svg viewBox="0 0 42 42" className="h-24 w-24 -rotate-90">
                      <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgb(11 22 51 / .08)" strokeWidth="5" />
                      <circle cx="21" cy="21" r="15.9" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" pathLength={100} strokeDasharray="86 100" className="ez-donut-in" />
                    </svg>
                    <ul className="space-y-1.5 text-[0.76rem]">
                      <li className="text-ink-700"><span className="font-semibold text-emerald-700">Filed</span> · September EPF, ESIC, PT</li>
                      <li className="text-ink-700"><span className="font-semibold text-amber-700">Next</span> · TDS by 7 Nov</li>
                      <li className="text-ink-700"><span className="font-semibold text-ink-900">Then</span> · EPF, ESIC by 15 Nov</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[0.74rem] font-semibold text-ink-700">Recruitment pipeline{role === 'branch' ? ' · Pune' : ''}</p>
                  <ul className="mt-3 space-y-1.5">
                    {pipeline.map(([stage, v], i) => {
                      const val = role === 'branch' ? Math.max(1, Math.round(v / 6)) : v
                      return (
                        <li key={stage} className="flex items-center gap-3 text-[0.76rem]">
                          <span className="w-20 shrink-0 text-ink-600">{stage}</span>
                          <Bar v={val} max={role === 'branch' ? 22 : 128} i={i} />
                          <span className="ez-count w-8 shrink-0 text-right font-semibold text-ink-800">{val}</span>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </div>

            {/* Live activity */}
            <div className="relative rounded-[18px] bg-white p-4 ring-1 ring-ink-900/[0.05] max-md:hidden lg:col-span-3">
              <p className="flex items-center justify-between text-[0.74rem] font-semibold text-ink-700">
                Recent activity
                <span className="inline-flex items-center gap-1.5 text-[0.68rem] text-emerald-700">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="ez-ping absolute inset-0 rounded-full bg-emerald-600" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  </span>
                  Live
                </span>
              </p>
              <div data-live="" className="relative mt-3 h-[13.5rem] overflow-hidden">
                <ul className="ez-feed" style={{ '--row': '3.4rem' } as React.CSSProperties}>
                  {feed.map(([t, s, icon], i) => (
                    <li key={i} className="flex h-[3.4rem] items-center gap-3 border-b border-ink-900/[0.05]">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                        <Icon name={icon} className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[0.78rem] font-semibold text-ink-900">{t}</span>
                        <span className="block truncate text-[0.7rem] text-ink-500">{s}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-right text-[0.7rem] text-ink-400">Illustrative · sample data</p>
        </div>
      </Container>
    </Scene>
  )
}
