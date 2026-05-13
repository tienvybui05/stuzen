import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { submitFeedback } from '../../lib/firebase'

export function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await submitFeedback(message)
      setMessage('')
      setStatus('Đã gửi feedback. Cảm ơn bạn.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Không gửi được feedback.')
    }
  }

  return (
    <Card
      title="Feedback"
      description="Góp ý nhanh cho StuZen. Guest vẫn gửi được, mỗi 60 giây một lần."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-zinc-200">Nội dung</span>
          <textarea
            className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Bạn muốn StuZen cải thiện điều gì?"
            value={message}
          />
        </label>
        <Button type="submit">Gửi feedback</Button>
        {status && <p className="text-sm text-cyan-200">{status}</p>}
      </form>
    </Card>
  )
}
