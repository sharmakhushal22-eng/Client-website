'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/cn'

/* ============================================================================
 * Form field primitives — spec §5.2.
 *
 * Every field here: has a <label> tied to its input by id, validates on blur
 * rather than only on submit, announces its error with role="alert" and
 * aria-describedby, and marks itself aria-invalid so a screen reader reports
 * the state and not just the text.
 * ========================================================================= */

type BaseProps = {
  name: string
  label: string
  required?: boolean
  hint?: string
  defaultValue?: string
  /* Returns an error string, or null when valid. Run on blur, and again on
   * change once the field has already been marked invalid — so an error
   * clears as soon as the visitor fixes it, rather than persisting until
   * they blur again. */
  validate?: (value: string) => string | null
  /* A non-blocking note. Used for the free-mail warning in §5.1, which must
   * warn without preventing submission. */
  warn?: (value: string) => string | null
  serverError?: string
  onDark?: boolean
}

const inputBase =
  'w-full rounded-xl px-4 py-3 text-[0.95rem] transition-shadow ' +
  'ring-1 ring-inset placeholder:text-ink-400 ' +
  'focus:outline-none focus:ring-2'

const inputLight =
  'bg-surface text-ink-900 ring-ink-200 focus:ring-brand-600'
const inputDark =
  'bg-white/10 text-white ring-white/20 focus:ring-brand-400 placeholder:text-ink-400'
const inputInvalid = 'ring-red-500 focus:ring-red-500'

function Label({
  htmlFor,
  children,
  required,
  onDark,
}: {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
  onDark?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'mb-1.5 block text-sm font-semibold',
        onDark ? 'text-white' : 'text-ink-900',
      )}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-brand-600" aria-hidden="true">
          *
        </span>
      )}
      {/* Not conveyed by the asterisk alone — spec §8.5. */}
      {required && <span className="sr-only"> (required)</span>}
    </label>
  )
}

function Messages({
  id,
  error,
  warning,
  hint,
  onDark,
}: {
  id: string
  error?: string | null
  warning?: string | null
  hint?: string
  onDark?: boolean
}) {
  if (error) {
    return (
      <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
        {error}
      </p>
    )
  }
  if (warning) {
    return (
      <p id={id} className="mt-1.5 text-sm text-amber-700">
        {warning}
      </p>
    )
  }
  if (hint) {
    return (
      <p id={id} className={cn('mt-1.5 text-sm', onDark ? 'text-on-dark-muted' : 'text-ink-600')}>
        {hint}
      </p>
    )
  }
  return null
}

/** Shared blur/change validation state. */
function useFieldState(
  validate?: (v: string) => string | null,
  warn?: (v: string) => string | null,
  serverError?: string,
) {
  const [error, setError] = useState<string | null>(serverError ?? null)
  const [warning, setWarning] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const run = (value: string) => {
    setError(validate ? validate(value) : null)
    setWarning(warn ? warn(value) : null)
  }

  return {
    error: serverError ?? error,
    warning,
    onBlur: (value: string) => {
      setTouched(true)
      run(value)
    },
    onChange: (value: string) => {
      /* Only re-validate on keystroke once the field has been marked bad —
       * otherwise the visitor is told their half-typed email is invalid
       * while they are still typing it. */
      if (touched) run(value)
    },
  }
}

export function TextField({
  name,
  label,
  required,
  hint,
  defaultValue,
  validate,
  warn,
  serverError,
  onDark,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
}: BaseProps & {
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
}) {
  const id = useId()
  const msgId = `${id}-msg`
  const state = useFieldState(validate, warn, serverError)

  return (
    <div>
      <Label htmlFor={id} required={required} onDark={onDark}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        /* Spec §5.2 — numeric keypad for phone, email keyboard for email. */
        inputMode={inputMode ?? (type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'text')}
        required={required}
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error || state.warning || hint ? msgId : undefined}
        onBlur={(e) => state.onBlur(e.target.value)}
        onChange={(e) => state.onChange(e.target.value)}
        className={cn(
          inputBase,
          onDark ? inputDark : inputLight,
          state.error && inputInvalid,
        )}
      />
      <Messages
        id={msgId}
        error={state.error}
        warning={state.warning}
        hint={hint}
        onDark={onDark}
      />
    </div>
  )
}

export function SelectField({
  name,
  label,
  required,
  hint,
  defaultValue,
  options,
  placeholder = 'Please choose…',
  serverError,
  onDark,
}: BaseProps & {
  options: readonly string[] | ReadonlyArray<{ value: string; label: string }>
  placeholder?: string
}) {
  const id = useId()
  const msgId = `${id}-msg`
  const [error, setError] = useState<string | null>(serverError ?? null)

  const normalised = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o,
  )

  return (
    <div>
      <Label htmlFor={id} required={required} onDark={onDark}>
        {label}
      </Label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? msgId : undefined}
        onBlur={(e) => {
          if (required) setError(e.target.value ? null : `${label} is required.`)
        }}
        onChange={(e) => {
          if (e.target.value) setError(null)
        }}
        className={cn(
          inputBase,
          'appearance-none bg-[length:20px] bg-[right_0.9rem_center] bg-no-repeat pr-11',
          onDark ? inputDark : inputLight,
          error && inputInvalid,
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {normalised.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Messages id={msgId} error={error} hint={hint} onDark={onDark} />
    </div>
  )
}

export function TextAreaField({
  name,
  label,
  required,
  hint,
  defaultValue,
  onDark,
  rows = 4,
  placeholder,
}: BaseProps & { rows?: number; placeholder?: string }) {
  const id = useId()
  const msgId = `${id}-msg`

  return (
    <div>
      <Label htmlFor={id} required={required} onDark={onDark}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        aria-describedby={hint ? msgId : undefined}
        className={cn(inputBase, 'resize-y', onDark ? inputDark : inputLight)}
      />
      <Messages id={msgId} hint={hint} onDark={onDark} />
    </div>
  )
}

export function CheckboxField({
  name,
  children,
  serverError,
  defaultChecked = false,
  onDark,
}: {
  name: string
  children: React.ReactNode
  serverError?: string
  /* Spec §5.1: consent is "Unticked by default." This default is the policy,
     so it stays false unless a caller has a very good reason. */
  defaultChecked?: boolean
  onDark?: boolean
}) {
  const id = useId()
  const msgId = `${id}-msg`
  const [error, setError] = useState<string | null>(serverError ?? null)

  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? msgId : undefined}
          onChange={(e) => {
            if (e.target.checked) setError(null)
          }}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-[6px] border-ink-200 text-brand-600 accent-brand-600"
        />
        <label
          htmlFor={id}
          className={cn(
            'cursor-pointer text-sm leading-relaxed',
            onDark ? 'text-ink-200' : 'text-ink-600',
          )}
        >
          {children}
        </label>
      </div>
      {error && (
        <p id={msgId} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

/** Multi-select rendered as chips. Used for "Modules of interest" (§5.1),
 *  which routes the demo — a native multi-select is close to unusable on a
 *  phone, and this is a mobile-first site (§8.6). */
export function ChipMultiSelect({
  name,
  label,
  options,
  hint,
}: {
  name: string
  label: string
  options: readonly string[]
  hint?: string
}) {
  const groupId = useId()
  const [selected, setSelected] = useState<string[]>([])

  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-semibold text-ink-900">
        {label}
      </legend>
      {hint && (
        <p id={`${groupId}-hint`} className="mb-2.5 text-sm text-ink-500">
          {hint}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isOn = selected.includes(option)
          return (
            <label
              key={option}
              className={cn(
                'cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors',
                'ring-1 ring-inset has-[:focus-visible]:outline has-[:focus-visible]:outline-2',
                'has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600',
                isOn
                  ? 'bg-brand-600 text-on-accent ring-brand-600'
                  : 'bg-surface text-ink-600 ring-ink-200 hover:ring-brand-300',
              )}
            >
              <input
                type="checkbox"
                name={name}
                value={option}
                className="sr-only"
                checked={isOn}
                onChange={(e) =>
                  setSelected((prev) =>
                    e.target.checked
                      ? [...prev, option]
                      : prev.filter((v) => v !== option),
                  )
                }
              />
              {option}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
