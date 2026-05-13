type StatCardProps = {
  label: string
  value: string
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4">
      <p className="truncate whitespace-nowrap text-xs font-medium text-zinc-500">
        {label}
      </p>
      <p className="mt-2 whitespace-nowrap text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  )
}
