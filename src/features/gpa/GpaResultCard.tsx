import { statusMeta } from './gpaMeta'
import type { GpaResult } from './types'

type GpaResultCardProps = {
  result: GpaResult
}

export function GpaResultCard({ result }: GpaResultCardProps) {
  const activeStatus = result ? statusMeta[result.status] : null

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">GPA trung bình cần đạt</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-white">
            {result ? result.requiredGpa.toFixed(2) : '--'}
          </p>
        </div>
        {activeStatus && (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${activeStatus.className}`}
          >
            {activeStatus.label}
          </span>
        )}
      </div>
      <p className="mt-5 text-sm leading-6 text-zinc-300">
        {result
          ? result.message
          : 'Nhập thông tin để tính mục tiêu học tập tiếp theo.'}
      </p>
    </div>
  )
}
