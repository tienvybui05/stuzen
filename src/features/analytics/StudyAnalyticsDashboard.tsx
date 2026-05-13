import type { ReactNode } from 'react'
import { Card } from '../../components/ui/Card'
import { loadGpaHistory } from '../gpa/gpaStorage'
import type { GpaCalculationSnapshot, GpaHistoryEntry } from '../gpa/types'

type StudyAnalyticsDashboardProps = {
  latestGpa: GpaCalculationSnapshot | null
}

export function StudyAnalyticsDashboard({
  latestGpa,
}: StudyAnalyticsDashboardProps) {
  const history = loadGpaHistory()
  const chronologicalHistory = [...history].reverse()
  const activeSnapshot = latestGpa ?? history[0] ?? null
  const targetProgress =
    activeSnapshot && activeSnapshot.targetGpa > 0
      ? Math.min(100, Math.round((activeSnapshot.currentGpa / activeSnapshot.targetGpa) * 100))
      : 0

  return (
    <section className="scroll-mt-24" id="analytics">
      <Card
        title="Study analytics"
        description="Biểu đồ theo dõi GPA, hiệu suất học kỳ và tiến độ so với mục tiêu."
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <ChartPanel title="GPA trend">
            {chronologicalHistory.length > 1 ? (
              <GpaTrendChart history={chronologicalHistory} />
            ) : (
              <EmptyChartState>
                Cần ít nhất 2 lần tính GPA để hiển thị xu hướng.
              </EmptyChartState>
            )}
          </ChartPanel>

          <ChartPanel title="Target progress">
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Tiến độ đạt mục tiêu</span>
                  <span className="font-semibold text-white">{targetProgress}%</span>
                </div>
                <div className="mt-3 h-4 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-cyan-300 transition-all duration-500"
                    style={{ width: `${targetProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Metric
                  label="Hiện tại"
                  value={activeSnapshot ? activeSnapshot.currentGpa.toFixed(2) : '--'}
                />
                <Metric
                  label="Mục tiêu"
                  value={activeSnapshot ? activeSnapshot.targetGpa.toFixed(2) : '--'}
                />
              </div>
            </div>
          </ChartPanel>

          <ChartPanel title="Semester performance" className="lg:col-span-2">
            {activeSnapshot ? (
              <SemesterPerformanceChart snapshot={activeSnapshot} />
            ) : (
              <EmptyChartState>
                Nhập thông tin GPA để xem hiệu suất học kỳ.
              </EmptyChartState>
            )}
          </ChartPanel>
        </div>
      </Card>
    </section>
  )
}

type ChartPanelProps = {
  children: ReactNode
  className?: string
  title: string
}

function ChartPanel({ children, className = '', title }: ChartPanelProps) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-black/20 p-5 ${className}`}
    >
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      {children}
    </div>
  )
}

function GpaTrendChart({ history }: { history: GpaHistoryEntry[] }) {
  const width = 520
  const height = 220
  const padding = 28
  const points = history.map((item, index) => {
    const x =
      padding +
      (index / Math.max(history.length - 1, 1)) * (width - padding * 2)
    const y = height - padding - (item.currentGpa / 4) * (height - padding * 2)

    return { item, x, y }
  })
  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
      <svg
        className="h-[220px] w-full"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <title>Biểu đồ xu hướng GPA</title>
        {[0, 1, 2, 3, 4].map((value) => {
          const y = height - padding - (value / 4) * (height - padding * 2)

          return (
            <g key={value}>
              <line
                stroke="rgba(255,255,255,0.08)"
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
              />
              <text fill="rgba(255,255,255,0.35)" fontSize="10" x="4" y={y + 4}>
                {value}
              </text>
            </g>
          )
        })}
        <path d={path} fill="none" stroke="#67e8f9" strokeWidth="4" />
        {points.map((point) => (
          <circle
            cx={point.x}
            cy={point.y}
            fill="#cffafe"
            key={point.item.id}
            r="5"
          />
        ))}
      </svg>
    </div>
  )
}

function SemesterPerformanceChart({
  snapshot,
}: {
  snapshot: GpaCalculationSnapshot
}) {
  const bars = [
    { label: 'GPA hiện tại', value: snapshot.currentGpa },
    { label: 'GPA cần đạt', value: snapshot.requiredGpa },
    { label: 'GPA mục tiêu', value: snapshot.targetGpa },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {bars.map((bar) => {
        const width = `${Math.min(100, Math.max(0, (bar.value / 4) * 100))}%`

        return (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4" key={bar.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-zinc-400">{bar.label}</span>
              <span className="font-semibold text-white">{bar.value.toFixed(2)}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-cyan-300 transition-all duration-500"
                style={{ width }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

type MetricProps = {
  label: string
  value: string
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

function EmptyChartState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/60 p-5 text-sm leading-6 text-zinc-400">
      {children}
    </div>
  )
}
