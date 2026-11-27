'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDot } from '@/components/ui'
import { cx } from '@/lib/utils'
import { submitEnquiry, type EnquiryState } from './actions'
import {
  fieldError,
  formPaths,
  otherName,
  type ChoiceField,
  type FormField,
  type TextField,
  type TextareaField,
} from './form-config'

type Props = {
  submitLabel: string
  submitNote?: string | null
  successHeading: string
  successBody?: string | null
}

type Values = Record<string, string | string[]>

const initial: EnquiryState = { status: 'idle' }

const labelCls = 'text-[15px] text-body'
const errorCls = 'text-[15px] text-[#A12C1C]'
const tints = ['bg-tint-teal', 'bg-tint-blue', 'bg-tint-lilac']

/** Runs of short text inputs sit side by side; everything else takes the full width. */
function rows(fields: FormField[]): (FormField | TextField[])[] {
  const out: (FormField | TextField[])[] = []
  for (const f of fields) {
    const last = out[out.length - 1]
    if (f.kind === 'text' && Array.isArray(last)) last.push(f)
    else out.push(f.kind === 'text' ? [f] : f)
  }
  return out
}

/**
 * The start-a-project form. Screen one asks what the visitor is after, which picks a path from
 * form-config.ts; the screens after it are that path's steps. Answers are kept across screens and
 * across a change of path, and sent to the server action in one go from the last screen.
 */
export function ContactForm({ submitLabel, submitNote, successHeading, successBody }: Props) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)
  const [intent, setIntent] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Values>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const wrap = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const moved = useRef(false)

  const path = formPaths.find((p) => p.id === intent) ?? null
  const current = path && step > 0 ? path.steps[step - 1] : null
  const total = path ? path.steps.length + 1 : null
  const isLast = Boolean(path && step === path.steps.length)

  // After moving between screens, bring the top of the form back into view and put focus on the
  // new heading, so keyboard and screen reader users land on the next question.
  useEffect(() => {
    if (!moved.current) return
    // 96px is the room the sticky header needs, the same as the wrapper's scroll margin.
    const top = wrap.current?.getBoundingClientRect().top ?? 96
    if (top < 96) wrap.current?.scrollIntoView({ block: 'start' })
    heading.current?.focus({ preventScroll: true })
  }, [step])

  if (state.status === 'sent') {
    return (
      <div className="flex flex-col gap-5 p-8 lg:p-12 rounded-xl bg-tint-teal" role="status">
        <h2 className="h-section">{successHeading}</h2>
        {successBody ? <p className="text-[18px] text-body">{successBody}</p> : null}
      </div>
    )
  }

  const go = (to: number) => {
    moved.current = true
    setErrors({})
    setStep(to)
  }

  const set = (name: string, value: string | string[]) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => (name in e ? Object.fromEntries(Object.entries(e).filter(([k]) => k !== name)) : e))
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!path || !current) return

    const found: Record<string, string> = {}
    for (const f of current.fields) {
      const error = fieldError(f, values[f.name] ?? (f.kind === 'choice' ? [] : ''))
      if (error) found[f.name] = error
    }
    const firstBad = Object.keys(found)[0]
    if (firstBad) {
      setErrors(found)
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus()
      return
    }
    if (!isLast) return go(step + 1)

    const data = new FormData()
    data.set('intent', path.id)
    data.set('website', String(new FormData(e.currentTarget).get('website') ?? ''))
    for (const f of path.steps.flatMap((s) => s.fields)) {
      const v = values[f.name]
      if (Array.isArray(v)) v.forEach((item) => data.append(f.name, item))
      else if (v) data.set(f.name, v)
      if (f.kind === 'choice' && f.other) data.set(otherName(f), String(values[otherName(f)] ?? ''))
    }
    startTransition(() => action(data))
  }

  return (
    <div ref={wrap} className="scroll-mt-24">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-9">
        <div className="flex flex-col gap-4">
          {total ? (
            <div className="flex items-center gap-4">
              <p className="text-[15px] text-muted tabular-nums">
                Step {step + 1} of {total}
              </p>
              <div className="flex gap-1.5" aria-hidden="true">
                {Array.from({ length: total }, (_, i) => (
                  <span
                    key={i}
                    className={cx(
                      'h-1 w-8 rounded-full transition-colors duration-300',
                      i <= step ? 'bg-accent' : 'bg-rule',
                    )}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <h2 ref={heading} tabIndex={-1} className="h-row outline-none">
            {current ? current.title : 'What are you after?'}
          </h2>
          {current ? (
            current.intro ? (
              <p className="max-w-[620px] text-body">{current.intro}</p>
            ) : null
          ) : (
            <p className="max-w-[620px] text-body">
              Pick the closest one. It decides what we ask next, so you only answer what matters.
            </p>
          )}
        </div>

        {current ? (
          <div key={step} className="step-in flex flex-col gap-8">
            {rows(current.fields).map((row) =>
              Array.isArray(row) ? (
                <div
                  key={row[0].name}
                  className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-6 gap-y-7"
                >
                  {row.map((f) => (
                    <Text
                      key={f.name}
                      field={f}
                      value={String(values[f.name] ?? '')}
                      error={errors[f.name]}
                      onChange={(v) => set(f.name, v)}
                    />
                  ))}
                </div>
              ) : row.kind === 'textarea' ? (
                <Textarea
                  key={row.name}
                  field={row}
                  value={String(values[row.name] ?? '')}
                  error={errors[row.name]}
                  onChange={(v) => set(row.name, v)}
                />
              ) : row.kind === 'choice' ? (
                <Choice
                  key={row.name}
                  field={row}
                  value={(values[row.name] as string[] | undefined) ?? []}
                  other={String(values[otherName(row)] ?? '')}
                  onChange={(v) => set(row.name, v)}
                  onOther={(v) => set(otherName(row), v)}
                />
              ) : null,
            )}
          </div>
        ) : (
          <div className="step-in flex flex-col gap-3">
            {formPaths.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={p.id === intent}
                onClick={() => {
                  setIntent(p.id)
                  go(1)
                }}
                className={cx(
                  'opt go flex items-center justify-between gap-6 w-full p-6 lg:px-7 rounded-xl border-0 text-left text-ink cursor-pointer',
                  tints[i % tints.length],
                  p.id === intent && 'ring-2 ring-ink',
                )}
              >
                <span className="flex flex-col gap-1.5">
                  <span className="opt-t font-display text-[22px] lg:text-[24px] leading-[1.12] font-medium tracking-[-0.03em]">
                    {p.label}
                  </span>
                  <span className="text-[16px] text-body">{p.body}</span>
                </span>
                <ArrowDot />
              </button>
            ))}
          </div>
        )}

        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {current ? (
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-1">
            <button
              type="submit"
              disabled={pending}
              className="btn-ink border-0 cursor-pointer disabled:opacity-60"
            >
              {isLast ? (pending ? 'Sending…' : submitLabel) : 'Continue'}
            </button>
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="u inline-flex items-center min-h-[44px] p-0 border-0 bg-transparent text-[16px] cursor-pointer"
            >
              Back
            </button>
            {isLast ? (
              <p className="flex-[1_1_260px] text-[15px] text-muted">
                {submitNote ? `${submitNote} ` : null}
                How we handle your details:{' '}
                <Link href="/privacy" className="link-u text-ink">
                  privacy policy
                </Link>
                .
              </p>
            ) : null}
          </div>
        ) : null}

        {state.status === 'error' ? (
          <p role="alert" className={errorCls}>
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  )
}

function Text({
  field,
  value,
  error,
  onChange,
}: {
  field: TextField
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={field.name} className={labelCls}>
        {field.label}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type ?? 'text'}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${field.name}-error` : undefined}
        className={cx('field', error && 'border-[#A12C1C]')}
      />
      {error ? (
        <p id={`${field.name}-error`} className={errorCls}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Textarea({
  field,
  value,
  error,
  onChange,
}: {
  field: TextareaField
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={field.name} className={labelCls}>
        {field.label}
      </label>
      <textarea
        id={field.name}
        name={field.name}
        rows={field.rows ?? 6}
        placeholder={field.placeholder}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${field.name}-error` : undefined}
        className={cx('field min-h-0 py-3.5 leading-[1.5] resize-y', error && 'border-[#A12C1C]')}
      />
      {error ? (
        <p id={`${field.name}-error`} className={errorCls}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Choice({
  field,
  value,
  other,
  onChange,
  onOther,
}: {
  field: ChoiceField
  value: string[]
  other: string
  onChange: (value: string[]) => void
  onOther: (value: string) => void
}) {
  const toggle = (option: string) => {
    if (!field.multiple) return onChange([option])
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option])
  }
  return (
    <fieldset className="flex flex-col gap-3 min-w-0 m-0 p-0 border-0">
      <legend className={cx(labelCls, 'p-0 pb-3')}>
        {field.label}
        {field.multiple ? <span className="text-faint"> Pick any that apply.</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2">
        {field.options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type={field.multiple ? 'checkbox' : 'radio'}
              name={field.name}
              value={option}
              checked={value.includes(option)}
              onChange={() => toggle(option)}
              className="peer sr-only"
            />
            <span className="inline-flex items-center min-h-[44px] px-4 rounded-full border border-line bg-paper text-[16px] text-body transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-2">
              {option}
            </span>
          </label>
        ))}
      </div>
      {field.other ? (
        <div className="flex flex-col gap-2 pt-3">
          <label htmlFor={otherName(field)} className={labelCls}>
            {field.other.label}
          </label>
          <input
            id={otherName(field)}
            name={otherName(field)}
            type="text"
            placeholder={field.other.placeholder}
            value={other}
            onChange={(e) => onOther(e.target.value)}
            className="field"
          />
        </div>
      ) : null}
    </fieldset>
  )
}
