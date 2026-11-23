import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button, Arrow } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { PageTransition } from '@/components/brand/PageTransition'
import { Eyebrow } from '@/components/brand/Bars'
import { CtaBand } from '@/components/sections/CtaBand'
import { DemoPlayer } from '@/components/tour/DemoPlayer'
import { DemoLibrary } from '@/components/tour/DemoLibrary'
import { PhoneShowcase } from '@/components/tour/PhoneShowcase'
import { ScrollStory, type Chapter } from '@/components/tour/ScrollStory'
import { AutoTabs, type Tab } from '@/components/tour/AutoTabs'
import { AiTypewriter } from '@/components/tour/AiTypewriter'
import { shot } from '@/components/tour/screens'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { demoFlows, demoStepCount } from '@/content/tour'
import { moduleGroups, solutions } from '@/content/modules'

export const metadata: Metadata = pageMetadata({
  title: 'Product tour: watch EZER HRMS work, screen by screen',
  description:
    'A self-playing tour of the real EZER HRMS: employee self-service, a manager’s day, performance reviews, EZER Learn, analytics, hiring, payroll and more. No sign-up.',
  path: '/product-tour',
})

/* ============================================================================
 * /product-tour — the product, shown working.
 *
 * What a buyer sees, top to bottom:
 *   1. The demo player, playing on arrival. Real screens from the live app;
 *      a cursor clicks through each flow the way a person would.
 *   2. The demo library: every flow as a card, like the module demos on the
 *      larger HR sites, each one already moving.
 *   3. The employee app on three phones, scrolling itself.
 *   4. Performance reviews, as a scroll story beside the real screens.
 *   5. EZER Learn, the learning app, as self-advancing tabs.
 *   6. The details that win the room: AI notes, themes, Fun Zone and more.
 *   7. Everything in the box, then the ask.
 *
 * Screens come from the product's demo company. Every person, company and
 * figure in them is fictional. The payroll run itself and the statutory
 * outputs are kept for the live demo, on the buyer's own structure.
 * ========================================================================= */

const pms: Chapter[] = [
  {
    kicker: 'Employee',
    title: 'Everyone knows where the cycle is',
    body: 'Seven stages with their dates, and the one thing owed right now in red at the top. Hover a stage and it explains itself.',
    shot: shot('pms-ess-0'),
    alt: 'Employee performance page with the seven-stage cycle and an overdue prompt to write KRAs',
    focus: { x: 50, y: 70, s: 1.18 },
  },
  {
    kicker: 'Employee',
    title: 'Goals that add up to a hundred',
    body: 'Four to ten KRAs, weightage exactly 100, and a one-to-one with the manager before they lock. Nobody is rated on goals they never agreed.',
    shot: shot('pms-ess-2'),
    alt: 'My KRAs tab with the weightage meter and the rule that a one-to-one is required before KRAs lock',
    focus: { x: 40, y: 75, s: 1.15 },
  },
  {
    kicker: 'Manager',
    title: 'Managers rate in deadline order',
    body: 'The team in one table, ordered by whose deadline cannot move. KRA approval, one-to-ones, ratings, PIP requests and team analytics sit in tabs above it.',
    points: ['Self ratings in, ratings owed, people on notice', 'Cannot rate before the employee submits'],
    shot: shot('manager-6'),
    alt: 'Manager’s team view listing each report’s KRAs, one-to-one and self-rating status with what is owed',
    focus: { x: 60, y: 82, s: 1.12 },
  },
  {
    kicker: 'HR',
    title: 'Policies, not one-size-fits-all',
    body: 'Run several cycles at once: sales monthly, leadership half-yearly, workmen annually. Each policy sets the KRA limits and who finalises.',
    shot: shot('pms-1'),
    alt: 'Policy builder listing performance policies with frequency, KRA limits and who finalises',
    focus: { x: 55, y: 75, s: 1.15 },
  },
  {
    kicker: 'HR',
    title: 'Chase the right people',
    body: 'Who has done what, live, filterable by department, status, employment type and company, with an Excel export that matches the screen.',
    shot: shot('pms-2'),
    alt: 'Fill status tracker with counts by stage and a filterable list of employees',
    focus: { x: 55, y: 55, s: 1.12 },
  },
  {
    kicker: 'HR',
    title: 'Calibrate against a guideline',
    body: 'The final spread against a reference curve, with average rating, published and acknowledged counts. A guideline to calibrate with, never a forced quota.',
    shot: shot('pms-3'),
    alt: 'Ratings summary with the distribution of ratings for the period',
    focus: { x: 60, y: 85, s: 1.15 },
  },
  {
    kicker: 'HR',
    title: 'Improvement plans with a paper trail',
    body: 'The manager raises it, the HR manager reviews, HR starts it and the employee is notified and acknowledges. A manager cannot start one alone.',
    shot: shot('pms-4'),
    alt: 'PIP management with the approval route and the HR action queue',
    focus: { x: 50, y: 70, s: 1.12 },
  },
  {
    kicker: 'HR',
    title: 'Every step has a gate',
    body: 'Twelve steps from policy to result, each with who acts and the gate that stops it. Most delays turn out to be one of these, not somebody being slow.',
    shot: shot('pms-5'),
    alt: 'Flow and hierarchy table listing each step of a performance period, who acts and the gate',
    focus: { x: 50, y: 82, s: 1.12 },
  },
]

const STAGES = ['KRA setting', 'One-to-one', 'Weightage lock', 'Self rating', 'Manager review', 'HOD finalise', 'Result']

const lms: Tab[] = [
  {
    group: 'For the learner',
    icon: 'book',
    title: 'A home they open by choice',
    body: 'Featured courses up front, what is due and overdue, and picks for their role and team. It opens from the HR app with no second login.',
    shot: shot('lms-0'),
    alt: 'EZER Learn home with progress counters and a featured compliance course',
    host: 'ezerlms.com',
    focus: { x: 60, y: 60, s: 1.08 },
  },
  {
    group: 'For the learner',
    icon: 'file',
    title: 'Courses that explain themselves',
    body: 'Videos, readings, quizzes and a final assessment, with pass marks, attempts, a certificate and renewal every twelve months.',
    shot: shot('lms-2'),
    alt: 'Course page listing what the course includes, lessons, quizzes and the certificate',
    host: 'ezerlms.com',
    focus: { x: 85, y: 40, s: 1.15 },
  },
  {
    group: 'For the learner',
    icon: 'sparkle',
    title: 'XP, streaks and seventeen badges',
    body: 'Levels, a weekly goal and badges such as Quiz ace, Early bird and Path finisher, so finishing a course feels like progress.',
    shot: shot('lms-3'),
    alt: 'Achievements page with level, day streak, weekly XP and a grid of badges',
    host: 'ezerlms.com',
    focus: { x: 55, y: 55, s: 1.1 },
  },
  {
    group: 'For HR',
    icon: 'upload',
    title: 'Build a course in an afternoon',
    body: 'Video, slides, documents and quizzes. Drafts go for review, published courses keep their versions, and every course shows who is enrolled and overdue.',
    shot: shot('lms-studio-1'),
    alt: 'Learning Studio course list with published courses, lesson counts and enrolment numbers',
    host: 'ezerlms.com/studio',
    focus: { x: 70, y: 70, s: 1.12 },
  },
  {
    group: 'For HR',
    icon: 'chart',
    title: 'Compliance training, tracked',
    body: 'Completion, overdue learners, mandatory compliance and failed attempts across every company, on the first screen.',
    shot: shot('lms-studio-0'),
    alt: 'Learning Studio overview with completion rate, overdue count and mandatory compliance',
    host: 'ezerlms.com/studio',
    focus: { x: 55, y: 50, s: 1.1 },
  },
  {
    group: 'For HR',
    icon: 'monitor',
    title: 'Live sessions, recorded',
    body: 'Webinars on Zoom, Meet or Teams with invitations, reminders, attendance and the recording afterwards, counted towards the course.',
    shot: shot('lms-studio-3'),
    alt: 'Live sessions page with upcoming, held and cancelled sessions',
    host: 'ezerlms.com/studio',
    focus: { x: 60, y: 45, s: 1.1 },
  },
  {
    group: 'For HR',
    icon: 'shield',
    title: 'Certificates anyone can verify',
    body: 'Each certificate carries a number, the score, an expiry date and a verification code.',
    shot: shot('lms-studio-4'),
    alt: 'Certificates list with certificate numbers, people, scores, issue and expiry dates',
    host: 'ezerlms.com/studio',
    focus: { x: 55, y: 60, s: 1.12 },
  },
]

const essFeatures: [IconName, string, string][] = [
  ['clock', 'Punch in', 'Shift, streak and the week, on the first screen'],
  ['calendar', 'Attendance', 'The month in colour, with regularisation'],
  ['calendar', 'Leave', 'Balances, holidays and the request together'],
  ['wallet', 'Pay and tax', 'Payslips, Form 16, flexi and declarations'],
  ['receipt', 'Claims', 'Local, domestic, international, or a bill'],
  ['inbox', 'Inbox', 'A desk for HR, payroll, finance, IT and more'],
  ['file', 'HR services', 'Letters on request, the directory, exit'],
  ['chart', 'Insights', 'Their own month, written in three lines'],
  ['target', 'Performance', 'KRAs, one-to-ones and the result'],
  ['book', 'EZER Learn', 'Courses and badges, no second login'],
  ['heart', 'Wall of Fame', 'Shoutouts and private thank-yous'],
  ['gamepad', 'Fun Zone', 'Fourteen games for a five-minute break'],
]

const DESKS = ['HR', 'Payroll', 'Finance', 'Leave & attendance', 'Performance', 'Recruitment', 'Exit', 'IT & access', 'Fun Zone']
const GAMES = ['Tic-tac-toe', 'Memory match', 'EZER trivia', 'Spin the wheel', '2048', 'Echo', 'Quick draw', 'Payroll scramble', 'Slide puzzle', 'Math sprint', 'Colour clash', 'Code breaker', 'Lights out', 'Minesweeper']

export default function ProductTourPage() {
  const live = solutions.filter((s) => !s.coming)
  const coming = solutions.filter((s) => s.coming)

  return (
    <PageTransition kind="product">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Product tour', path: '/product-tour' },
          ]),
        ]}
      />

      {/* ── Hero, with the demo already playing ───────────────────────── */}
      <section aria-labelledby="tour-title" className="relative overflow-hidden bg-paper pb-16 pt-10 sm:pt-14 lg:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(37_99_235/0.10),transparent_70%)]"
        />
        <Container className="relative">
          <nav aria-label="Breadcrumb" className="text-[0.85rem] text-ink-500">
            <Link href="/" className="ez-link hover:text-ink-900">Home</Link>
            <span aria-hidden className="mx-2 text-ink-300">/</span>
            <span aria-current="page" className="font-medium text-ink-900">Product tour</span>
          </nav>

          <div className="mx-auto mt-6 max-w-3xl text-center">
            <Eyebrow className="justify-center">Product tour · it plays itself</Eyebrow>
            <h1 id="tour-title" className="mt-4 text-[2.4rem] leading-[1.02] tracking-[-0.03em] sm:text-[3.3rem] lg:text-[3.8rem]">
              Watch EZER run <span className="text-brand-600">a working day.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-ink-600 sm:text-[1.1rem]">
              The real product, clicked through for you: an employee punching in and asking for leave, a
              manager’s Monday, a review cycle, a course in EZER Learn. Sit back, or take over at any step.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/book-a-demo?module=tour" size="lg">
                See it on your data
                <Arrow />
              </Button>
              <Button href="#library" variant="secondary" size="lg">
                Choose a module
              </Button>
            </div>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.85rem] text-ink-500">
              <span><b className="font-semibold text-ink-900">{demoStepCount}</b> real screens</span>
              <span><b className="font-semibold text-ink-900">{demoFlows.length}</b> flows</span>
              <span><b className="font-semibold text-ink-900">3</b> points of view</span>
              <span>No sign-up</span>
            </p>
          </div>

          <div id="demo" className="mx-auto mt-9 max-w-[70rem] scroll-mt-24 sm:mt-11">
            <DemoPlayer />
          </div>
        </Container>
      </section>

      {/* ── Demo library ──────────────────────────────────────────────── */}
      <section id="library" aria-labelledby="library-title" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Demo library</Eyebrow>
              <h2 id="library-title" className="mt-5 text-[2.2rem] leading-[1.04] sm:text-[2.9rem]">
                Pick what you came to see.
              </h2>
            </div>
            <p className="text-[1rem] leading-relaxed text-ink-600 lg:col-span-5">
              Each card is a short flow through the live product, under a minute. Choose one and it
              plays in the window above, from the first click.
            </p>
          </div>
          <div className="mt-12">
            <DemoLibrary playerId="demo" />
          </div>
        </Container>
      </section>

      {/* ── The employee app ─────────────────────────────────────────── */}
      <section aria-labelledby="ess-title" className="relative overflow-hidden bg-navy py-16 text-white sm:py-20 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_45%,rgb(37_99_235/0.35),transparent_70%)]" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow tone="onDark" className="justify-center">Employee self-service</Eyebrow>
            <h2 id="ess-title" className="mt-5 text-[2.2rem] leading-[1.04] text-white sm:text-[3rem]">
              The app your people actually open.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-white/75">
              Built for the phone first, because that is where a plant worker, a field salesperson or a
              branch cashier will open it. Nothing to install, and every question they would have
              emailed HR has an answer on a screen.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-5xl">
            <PhoneShowcase />
          </div>

          <ul className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
            {essFeatures.map(([icon, name, detail]) => (
              <li key={name} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-brand-300 ring-1 ring-white/10">
                  <Icon name={icon} className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[0.95rem] font-semibold text-white">{name}</span>
                  <span className="block text-[0.84rem] leading-snug text-white/60">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Performance ──────────────────────────────────────────────── */}
      <section aria-labelledby="pms-title" className="bg-paper py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Performance management</Eyebrow>
              <h2 id="pms-title" className="mt-5 text-[2.2rem] leading-[1.04] sm:text-[2.9rem]">
                Reviews that actually finish.
              </h2>
            </div>
            <p className="text-[1rem] leading-relaxed text-ink-600 lg:col-span-5">
              Most review cycles stall because nobody can see who is stuck. EZER shows everyone,
              employee, manager and HR, exactly where the cycle is and what is owed next.
            </p>
          </div>

          {/* the seven stages, lighting up in order */}
          <div className="mt-12 overflow-x-auto pb-2 [scrollbar-width:none]">
            <ol className="relative flex min-w-[44rem] justify-between">
              <span aria-hidden className="absolute left-[4%] right-[4%] top-4 h-[2px] bg-ink-900/10" />
              <span aria-hidden className="ez-stage-line absolute left-[4%] right-[4%] top-4 h-[2px] bg-brand-600" />
              {STAGES.map((s, i) => (
                <li key={s} className="relative flex w-[14%] flex-col items-center text-center">
                  <span
                    className="ez-stage-dot grid h-8 w-8 place-items-center rounded-full bg-white text-[0.8rem] font-bold text-ink-500"
                    style={{ ['--d' as string]: `${i * 0.95}s` }}
                  >
                    {i + 1}
                  </span>
                  <span className="mt-2.5 text-[0.82rem] font-semibold leading-tight text-ink-800">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 lg:mt-4">
            <ScrollStory chapters={pms} host="app.ezerhrms.com" />
          </div>

          <div className="mt-10">
            <Button href="/features/performance" variant="secondary">
              Performance and learning, in detail
              <Arrow />
            </Button>
          </div>
        </Container>
      </section>

      {/* ── EZER Learn ───────────────────────────────────────────────── */}
      <section aria-labelledby="lms-title" className="bg-paper-2 py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Learning · EZER Learn</Eyebrow>
              <h2 id="lms-title" className="mt-5 text-[2.2rem] leading-[1.04] sm:text-[2.9rem]">
                A learning app, not a training register.
              </h2>
            </div>
            <p className="text-[1rem] leading-relaxed text-ink-600 lg:col-span-5">
              EZER Learn comes with the HR system: a catalogue people browse, streaks and badges that
              bring them back, and a studio where HR builds, assigns and proves compliance training.
            </p>
          </div>
          <div className="mt-12">
            <AutoTabs
              tabs={lms}
              chips={[
                { icon: 'sparkle', label: 'Day streak · weekly goal', tone: 'bg-amber-50 text-amber-700', at: '-left-4 top-[22%]' },
                { icon: 'shield', label: '17 badges to earn', tone: 'bg-brand-50 text-brand-700', at: '-right-4 top-[48%]' },
                { icon: 'check', label: 'Certificate with a verification code', tone: 'bg-emerald-50 text-emerald-700', at: '-bottom-4 left-[12%]' },
              ]}
            />
          </div>
          <ul className="mt-14 grid gap-x-8 gap-y-4 border-t border-ink-900/10 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Learning paths', 'Several courses as one programme, such as a new-joiner path.'],
              ['Rules that assign', 'New joiners and people who move teams get the right courses on their own.'],
              ['Preboarding', 'Courses for candidates before their first day, on a private link.'],
              ['Manager approval and prerequisites', 'Courses can need a manager’s yes, another course first, or open a module a day later.'],
              ['Reviews and ratings', 'Learners rate courses, so HR knows which ones work.'],
              ['An audit log', 'Every publish, assignment and change, recorded.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2.5">
                <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand-600" />
                <span>
                  <span className="block text-[0.95rem] font-semibold text-ink-900">{t}</span>
                  <span className="block text-[0.88rem] leading-snug text-ink-600">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── The details that win the room ────────────────────────────── */}
      <section aria-labelledby="details-title" className="bg-paper py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>The details</Eyebrow>
            <h2 id="details-title" className="mt-5 text-[2.2rem] leading-[1.04] sm:text-[2.9rem]">
              The small things people notice on day one.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-6">
            {/* AI notes */}
            <div className="rounded-3xl bg-navy p-6 text-white md:col-span-4 sm:p-8">
              <p className="flex items-center gap-2 text-[0.8rem] font-semibold text-white/70">
                <Icon name="sparkle" className="h-4 w-4 text-brand-300" />
                AI that writes the note, not just the chart
              </p>
              <div className="mt-6">
                <AiTypewriter />
              </div>
              <p className="mt-6 border-t border-white/10 pt-4 text-[0.82rem] leading-snug text-white/55">
                Written from each person’s own figures, and every number it quotes is checked against
                them. The same AI screens candidates and flags bills that do not match their claim.
              </p>
            </div>

            {/* themes */}
            <div className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-900/[0.06] md:col-span-2">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#eef1f6]">
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp */}
                <img src="/product/ess-home-light.webp" alt="The employee home screen in the light theme" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-left-top" />
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp */}
                <img src="/product/ess-home-dark.webp" alt="" aria-hidden loading="lazy" className="ez-wipe absolute inset-0 h-full w-full object-cover object-left-top" />
                <span aria-hidden className="ez-wipe-edge absolute inset-y-0 w-[2px] bg-white shadow-[0_0_12px_rgb(255_255_255/0.8)]" />
              </div>
              <div className="p-6">
                <p className="font-display text-[1.25rem] font-[650] leading-tight text-ink-900">Light, dark or eye comfort</p>
                <p className="mt-2 text-[0.9rem] leading-snug text-ink-600">Each person picks their own, or follows their phone. Easier on night shifts.</p>
              </div>
            </div>

            {/* Fun Zone */}
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-900/[0.06] md:col-span-2 sm:p-7">
              <p className="flex items-center gap-2 font-display text-[1.25rem] font-[650] leading-tight text-ink-900">
                <Icon name="gamepad" className="h-5 w-5 text-brand-600" />
                Fun Zone
              </p>
              <p className="mt-2 text-[0.9rem] leading-snug text-ink-600">Fourteen games inside the HR app. Three can be played live against a colleague.</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {GAMES.map((g, i) => (
                  <li key={g} className="ez-pop rounded-full bg-paper px-2.5 py-1 text-[0.75rem] font-medium text-ink-700 ring-1 ring-ink-900/[0.06]" style={{ ['--d' as string]: `${(i * 0.43).toFixed(2)}s` }}>
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* E-sign */}
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-900/[0.06] md:col-span-2 sm:p-7">
              <p className="flex items-center gap-2 font-display text-[1.25rem] font-[650] leading-tight text-ink-900">
                <Icon name="file" className="h-5 w-5 text-brand-600" />
                E-sign, built in
              </p>
              <p className="mt-2 text-[0.9rem] leading-snug text-ink-600">Offer letters, policies and agreements, signed in the browser.</p>
              <ol className="mt-5 space-y-2.5">
                {['Sent for signature', 'Verified by e-mail OTP', 'Stamped and sealed', 'Audit certificate attached'].map((s, i) => (
                  <li key={s} className="ez-tick-step flex items-center gap-2.5 text-[0.88rem] font-medium text-ink-800" style={{ ['--d' as string]: `${i * 0.8}s` }}>
                    <span className="ez-tick-dot grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            {/* Group */}
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-900/[0.06] md:col-span-2 sm:p-7">
              <p className="flex items-center gap-2 font-display text-[1.25rem] font-[650] leading-tight text-ink-900">
                <Icon name="briefcase" className="h-5 w-5 text-brand-600" />
                A group, not just a company
              </p>
              <p className="mt-2 text-[0.9rem] leading-snug text-ink-600">
                Every legal entity keeps its own registrations and rules, and HR sees them together. Access is set per role, down to the company and the screen.
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[['4', 'companies'], ['10', 'locations'], ['1', 'login']].map(([n, l]) => (
                  <div key={l} className="rounded-2xl bg-paper py-3">
                    <dt className="sr-only">{l}</dt>
                    <dd className="font-display text-[1.6rem] font-[650] leading-none text-ink-900">{n}</dd>
                    <dd className="mt-1 text-[0.72rem] text-ink-500">{l}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-[0.72rem] text-ink-500">The demo company’s own set-up.</p>
            </div>

            {/* Desks */}
            <div className="overflow-hidden rounded-3xl bg-white py-6 ring-1 ring-ink-900/[0.06] md:col-span-6 sm:py-7">
              <div className="flex flex-col gap-2 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
                <p className="flex items-center gap-2 font-display text-[1.25rem] font-[650] leading-tight text-ink-900">
                  <Icon name="inbox" className="h-5 w-5 text-brand-600" />
                  Questions go to a desk, not a person’s phone
                </p>
                <p className="text-[0.9rem] text-ink-600">One inbox, a queue for each team.</p>
              </div>
              <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
                <div className="ez-marquee flex w-max gap-3">
                  {[...DESKS, ...DESKS].map((d, i) => (
                    <span key={i} aria-hidden={i >= DESKS.length} className="whitespace-nowrap rounded-full bg-paper px-4 py-2 text-[0.88rem] font-semibold text-ink-800 ring-1 ring-ink-900/[0.06]">
                      {d} desk
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Everything in the box ────────────────────────────────────── */}
      <section aria-labelledby="box-title" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Everything in the box</Eyebrow>
              <h2 id="box-title" className="mt-5 text-[2.2rem] leading-[1.04] sm:text-[2.9rem]">
                {live.length} solutions live today. One plan.
              </h2>
            </div>
            <p className="text-[1rem] leading-relaxed text-ink-600 lg:col-span-5">
              The tour shows the highlights. This is the whole of it, grouped by area. Every module is
              in the one plan; nothing is held back for a higher tier.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {moduleGroups.map((g) => {
              const inner = (
                <>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={g.icon} className="h-5 w-5" />
                  </span>
                  <span className="mt-4 block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink-500">{g.label}</span>
                  <span className="mt-1 block font-display text-[1.25rem] font-[650] leading-tight tracking-[-0.02em] text-ink-900">{g.name}</span>
                  <ul className="mt-3 space-y-1.5">
                    {g.modules.map((m) => (
                      <li key={m.name} className="flex gap-2 text-[0.84rem] leading-snug text-ink-600">
                        <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                        {/* The lead clause only: the full sentences are on /features. */}
                        <span>{m.name.split(/,| so | with | before | from the /)[0]}</span>
                      </li>
                    ))}
                  </ul>
                  {g.href && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-brand-700">
                      Read more <Arrow className="h-3.5 w-3.5" />
                    </span>
                  )}
                </>
              )
              return (
                <li key={g.id}>
                  {g.href ? (
                    <Link href={g.href} className="block h-full rounded-2xl bg-paper p-5 ring-1 ring-ink-900/[0.06] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)]">
                      {inner}
                    </Link>
                  ) : (
                    <div className="h-full rounded-2xl bg-paper p-5 ring-1 ring-ink-900/[0.06]">{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>

          {coming.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-dashed border-ink-900/15 px-5 py-4">
              <span className="rounded-full bg-marigold/20 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[#7a4b00]">
                On the roadmap
              </span>
              {coming.map((c) => (
                <span key={c.n} className="text-[0.9rem] text-ink-700">{c.name}</span>
              ))}
              <span className="text-[0.82rem] text-ink-500">Labelled as coming, so nobody buys a promise.</span>
            </div>
          )}

          <p className="mt-10 max-w-3xl text-[0.82rem] leading-relaxed text-ink-500">
            Every screen on this page is from the live product, captured from its demo company. Every
            person, company and figure in them is fictional.
          </p>
        </Container>
      </section>

      <CtaBand
        eyebrow="Seen enough to want your own?"
        title="Now see it on your data"
        lede="The tour shows the demo company. In 30 minutes we will show the payroll run, the statutory heads and the approval chains on your own entities, states and salary structures."
      />
    </PageTransition>
  )
}
