'use client'

import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

type ContactErrors = Partial<Record<'email' | 'message' | 'name', string>>
type ToastState = {
  message: string
  type: 'error' | 'success'
} | null

const initialValues = {
  email: '',
  message: '',
  name: '',
}

function validate(values: typeof initialValues) {
  const errors: ContactErrors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Tên cần ít nhất 2 ký tự.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Email không hợp lệ.'
  }

  if (values.message.trim().length < 10) {
    errors.message = 'Nội dung cần ít nhất 10 ký tự.'
  }

  return errors
}

export function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)

  const canSubmit = useMemo(
    () =>
      values.name.trim() !== '' &&
      values.email.trim() !== '' &&
      values.message.trim() !== '' &&
      !isSubmitting,
    [isSubmitting, values],
  )

  function updateField(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setToast(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setToast({ message: 'Kiểm tra lại thông tin trước khi gửi.', type: 'error' })
      return
    }

    setIsSubmitting(true)
    setToast(null)

    try {
      const response = await fetch('/api/contact', {
        body: JSON.stringify({
          email: values.email.trim(),
          message: values.message.trim(),
          name: values.name.trim(),
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(data.message || 'Không gửi được liên hệ.')
      }

      setValues(initialValues)
      setToast({
        message: data.message || 'Đã gửi liên hệ thành công.',
        type: 'success',
      })
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Không gửi được liên hệ.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit} noValidate>
      <Input
        error={errors.name}
        label="Tên của bạn"
        onValueChange={(value) => updateField('name', value)}
        placeholder="Ví dụ: Nguyễn Văn A"
        type="text"
        value={values.name}
      />
      <Input
        error={errors.email}
        label="Email"
        onValueChange={(value) => updateField('email', value)}
        placeholder="you@example.com"
        type="email"
        value={values.email}
      />
      <label className="block lg:col-span-2">
        <span className="text-sm font-medium text-zinc-200">Nội dung</span>
        <textarea
          className={`mt-2 min-h-36 w-full resize-y rounded-2xl border bg-zinc-950/70 px-4 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 ${
            errors.message ? 'border-rose-400/70' : 'border-white/10'
          }`}
          onChange={(event) => updateField('message', event.target.value)}
          placeholder="Bạn muốn góp ý hoặc cần StuZen hỗ trợ điều gì?"
          value={values.message}
        />
        {errors.message && (
          <span className="mt-2 block text-sm text-rose-300">
            {errors.message}
          </span>
        )}
      </label>

      <div className="flex flex-col gap-3 lg:col-span-2 sm:flex-row sm:items-center">
        <Button disabled={!canSubmit} type="submit">
          {isSubmitting ? 'Đang gửi...' : 'Gửi liên hệ'}
        </Button>
        {toast && (
          <p
            className={`rounded-2xl border px-4 py-3 text-sm ${
              toast.type === 'success'
                ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100'
                : 'border-rose-300/30 bg-rose-300/10 text-rose-100'
            }`}
          >
            {toast.message}
          </p>
        )}
      </div>
    </form>
  )
}
