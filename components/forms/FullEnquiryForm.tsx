'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { submitLead, type LeadFormState } from '@/app/actions/leads'
import {
  TextField,
  SelectField,
  TextAreaField,
  CheckboxField,
  ChipMultiSelect,
} from './Field'
import { HiddenTracking, useMounted } from './HiddenTracking'
import { SubmitButton } from './SubmitButton'
import {
  validateEmail,
  validatePhone,
  validateRequired,
  freeMailWarning,
  EMPLOYEE_BANDS,
  DESIGNATIONS,
  CURRENTLY_USING,
  TIMELINES,
  INDIAN_STATES,
} from '@/lib/validation'
import { moduleGroups } from '@/content/modules'

const initial: LeadFormState = { status: 'idle' }

const MODULE_OPTIONS = moduleGroups.map((g) => g.name)

const BAND_LABELS: Record<string, string> = {
  '<50': 'Fewer than 50',
  '50-200': '50 – 200',
  '200-500': '200 – 500',
  '500-1000': '500 – 1,000',
  '1000+': 'More than 1,000',
}

/* Spec §5.1 full enquiry form — /contact and /book-a-demo.
 *
 * Required: name, work email, phone, company, headcount, designation, consent.
 * Optional: city/state, current system, modules, timeline, message.
 * Headcount is the single best qualifier we collect, which is why it is
 * required here while city and timeline are not. */
export function FullEnquiryForm({
  formName,
  submitLabel = 'Send enquiry',
  compact = false,
}: {
  formName: string
  submitLabel?: string
  compact?: boolean
}) {
  const [state, action, pending] = useActionState(submitLead, initial)
  const mounted = useMounted()
  const router = useRouter()

  useEffect(() => {
    if (state.status === 'success') {
      router.push(`/thank-you?from=${encodeURIComponent(formName)}`)
    }
  }, [state.status, formName, router])

  const v = state.values ?? {}

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <HiddenTracking formName={formName} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="full_name"
          label="Full name"
          required
          autoComplete="name"
          placeholder="Your name"
          defaultValue={v.full_name}
          serverError={state.errors?.full_name}
          validate={(x) => validateRequired(x, 'Full name')}
        />
        <TextField
          name="work_email"
          label="Work email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          defaultValue={v.work_email}
          serverError={state.errors?.work_email}
          validate={validateEmail}
          warn={freeMailWarning}
        />
        <TextField
          name="phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="numeric"
          placeholder="98765 43210"
          hint="+91"
          defaultValue={v.phone}
          serverError={state.errors?.phone}
          validate={validatePhone}
        />
        <TextField
          name="company_name"
          label="Company name"
          required
          autoComplete="organization"
          placeholder="Your company"
          defaultValue={v.company_name}
          serverError={state.errors?.company_name}
          validate={(x) => validateRequired(x, 'Company name')}
        />
        <SelectField
          name="employee_band"
          label="Number of employees"
          required
          defaultValue={v.employee_band}
          serverError={state.errors?.employee_band}
          options={EMPLOYEE_BANDS.map((b) => ({ value: b, label: BAND_LABELS[b] }))}
        />
        <SelectField
          name="designation"
          label="Your role"
          required
          defaultValue={v.designation}
          serverError={state.errors?.designation}
          options={DESIGNATIONS}
        />
      </div>

      {!compact && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="city"
              label="City"
              placeholder="Mumbai"
              autoComplete="address-level2"
              defaultValue={v.city}
            />
            <SelectField
              name="state"
              label="State"
              hint="Professional Tax and LWF vary by state, so this is useful on the call."
              defaultValue={v.state}
              options={INDIAN_STATES}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              name="currently_using"
              label="What are you using today?"
              defaultValue={v.currently_using}
              options={CURRENTLY_USING}
            />
            <SelectField
              name="timeline"
              label="When are you looking to start?"
              defaultValue={v.timeline}
              options={TIMELINES}
            />
          </div>

          <ChipMultiSelect
            name="modules_interest"
            label="Which areas matter most?"
            hint="Pick any. It lets us tailor the demo instead of showing you everything."
            options={MODULE_OPTIONS}
          />

          <TextAreaField
            name="message"
            label="Anything else we should know?"
            rows={4}
            placeholder="Number of locations, states you operate in, what is not working today…"
            defaultValue={v.message}
          />
        </>
      )}

      <CheckboxField name="consent" serverError={state.errors?.consent}>
        I agree to be contacted by EZER HRMS about this enquiry, and I have read
        the{' '}
        <Link href="/privacy-policy" className="font-semibold text-brand-700 underline">
          privacy policy
        </Link>
        .
      </CheckboxField>

      <SubmitButton pending={pending} disabled={!mounted}>
        {submitLabel}
      </SubmitButton>

      {state.status === 'error' && state.message && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
