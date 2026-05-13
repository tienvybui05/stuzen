type GpaProgressCardProps = {
  completedCredits: number
  progress: number
  remainingCredits: number
}

export function GpaProgressCard({
  completedCredits,
  progress,
  remainingCredits,
}: GpaProgressCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">Tiến độ tín chỉ</span>
        <span className="font-semibold text-white">{progress}%</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-cyan-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-zinc-400">{completedCredits} đã học</span>
        <span className="text-zinc-400">{remainingCredits} còn lại</span>
      </div>
    </div>
  )
}
