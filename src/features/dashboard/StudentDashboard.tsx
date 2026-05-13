import type { GpaCalculationSnapshot } from '../gpa/types'
import type { ReactNode } from 'react'
import { UpcomingTasks } from '../tasks/UpcomingTasks'

type StudentDashboardProps = {
  latestGpa: GpaCalculationSnapshot | null
}

const statusLabel = {
  feasible: 'Khả thi',
  difficult: 'Khó',
  impossible: 'Không khả thi',
}

const actionItems = [
  { href: '#gpa-tools', label: 'Tính GPA mục tiêu' },
  { href: '#planner', label: 'Lập kế hoạch học kỳ' },
  { href: '#cta', label: 'Bắt đầu theo dõi' },
]

export function StudentDashboard({ latestGpa }: StudentDashboardProps) {
  const semesterProgress = latestGpa
    ? Math.round((latestGpa.completedCredits / latestGpa.totalCredits) * 100)
    : 0

  return (
    <section className="scroll-mt-24" id="dashboard">
      <div className="mb-6 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
          Student dashboard
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Tổng quan học tập trong một màn hình.
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <DashboardPanel title="GPA overview">
            <p className="text-sm text-zinc-400">GPA hiện tại</p>
            <p className="mt-3 text-5xl font-semibold tracking-tight text-white">
              {latestGpa ? latestGpa.currentGpa.toFixed(2) : '--'}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Metric label="Mục tiêu" value={latestGpa ? latestGpa.targetGpa.toFixed(2) : '--'} />
              <Metric label="Cần đạt" value={latestGpa ? latestGpa.requiredGpa.toFixed(2) : '--'} />
            </div>
          </DashboardPanel>

          <DashboardPanel title="Semester progress">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Tiến độ tín chỉ</span>
              <span className="font-semibold text-white">{semesterProgress}%</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-cyan-300 transition-all duration-500"
                style={{ width: `${semesterProgress}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {latestGpa
                ? `${latestGpa.completedCredits}/${latestGpa.totalCredits} tín chỉ đã ghi nhận.`
                : 'Nhập GPA và tín chỉ để xem tiến độ học kỳ.'}
            </p>
          </DashboardPanel>

          <DashboardPanel title="Study statistics">
            <div className="grid grid-cols-2 gap-3">
              <Metric
                label="Tín chỉ còn lại"
                value={latestGpa ? String(latestGpa.remainingCredits) : '--'}
              />
              <Metric
                label="Trạng thái"
                value={latestGpa ? statusLabel[latestGpa.status] : '--'}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Các chỉ số giờ học và độ tập trung sẽ xuất hiện khi có tracker học
              tập thật.
            </p>
          </DashboardPanel>
        </div>

        <div className="grid gap-4">
          <DashboardPanel title="Upcoming tasks" className="xl:min-h-[620px]">
            <UpcomingTasks />
          </DashboardPanel>

          <DashboardPanel title="Quick actions">
            <div className="grid gap-3 sm:grid-cols-3">
              {actionItems.map((item) => (
                <a
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50/80">
              Dashboard chỉ dùng dữ liệu bạn nhập. Các khu vực chưa có nguồn dữ
              liệu thật sẽ hiển thị trạng thái trống.
            </div>
          </DashboardPanel>
        </div>
      </div>
    </section>
  )
}

type DashboardPanelProps = {
  children: ReactNode
  className?: string
  title: string
}

function DashboardPanel({ children, className = '', title }: DashboardPanelProps) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-zinc-900/75 p-5 shadow-xl shadow-black/20 backdrop-blur-xl ${className}`}
    >
      <h3 className="mb-4 text-lg font-semibold tracking-tight text-white">{title}</h3>
      {children}
    </div>
  )
}

type MetricProps = {
  label: string
  value: string
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-2 truncate text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}
