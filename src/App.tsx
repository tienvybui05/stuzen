import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { Navbar } from './components/ui/Navbar'
import { StatCard } from './components/ui/StatCard'
import type { ThemeMode } from './components/ui/ThemeToggle'
import { StudyAnalyticsDashboard } from './features/analytics/StudyAnalyticsDashboard'
import { StudentDashboard } from './features/dashboard/StudentDashboard'
import { FeedbackForm } from './features/feedback/FeedbackForm'
import { GpaCalculator } from './features/gpa/GpaCalculator'
import type { GpaCalculationSnapshot } from './features/gpa/types'
import { SemesterPlanner } from './features/planner/SemesterPlanner'
import { auth, loginWithGoogle, logout } from './lib/firebase'
import type { User } from 'firebase/auth'

const features = [
  {
    title: 'Theo dõi GPA rõ ràng',
    description:
      'Tính GPA cần đạt theo mục tiêu học tập và cập nhật chỉ số ngay trên dashboard.',
  },
  {
    title: 'Lập kế hoạch học kỳ',
    description:
      'Chuẩn bị cấu trúc để quản lý môn học, tín chỉ, deadline và mục tiêu từng kỳ.',
  },
  {
    title: 'Phân tích thói quen học',
    description:
      'Sẵn sàng mở rộng thành khu vực theo dõi giờ học, nhiệm vụ và mức độ duy trì.',
  },
]

const navItems = [
  { href: '#features', label: 'Tính năng' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#gpa-tools', label: 'GPA' },
  { href: '#planner', label: 'Planner' },
  { href: '#feedback', label: 'Feedback' },
]

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  return window.localStorage.getItem('stuzen:theme') === 'light'
    ? 'light'
    : 'dark'
}

function App() {
  const [latestGpa, setLatestGpa] = useState<GpaCalculationSnapshot | null>(null)
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const [user, setUser] = useState<User | null>(null)

  useEffect(
    () =>
      onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser)

        if (!nextUser) {
          setLatestGpa(null)
        }
      }),
    [],
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('stuzen:theme', theme)
  }, [theme])

  const dashboardStats = useMemo(
    () => [
      {
        label: 'GPA hiện tại',
        value: latestGpa ? latestGpa.currentGpa.toFixed(2) : '--',
      },
      {
        label: 'Tín chỉ',
        value: latestGpa
          ? `${latestGpa.completedCredits}/${latestGpa.totalCredits}`
          : '--',
      },
      {
        label: 'GPA cần đạt',
        value: latestGpa ? latestGpa.requiredGpa.toFixed(2) : '--',
      },
      {
        label: 'GPA mục tiêu',
        value: latestGpa ? latestGpa.targetGpa.toFixed(2) : '--',
      },
    ],
    [latestGpa],
  )

  return (
    <main
      className={`min-h-screen overflow-hidden ${
        theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-950'
      }`}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(52,211,153,0.12),transparent_28%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-5 sm:px-6 lg:px-8">
        <Navbar
          brand="StuZen"
          ctaHref="#gpa-tools"
          ctaLabel="Bắt đầu"
          items={navItems}
          onLogin={loginWithGoogle}
          onLogout={logout}
          onThemeToggle={() =>
            setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
          }
          theme={theme}
          user={user}
        />

        <section
          className="grid min-h-[calc(100vh-160px)] items-center gap-8 py-6 lg:grid-cols-[1.05fr_0.95fr]"
          id="hero"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
              Nền tảng học tập cho sinh viên
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Quản lý việc học thông minh hơn với StuZen.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              StuZen giúp sinh viên tính mục tiêu GPA, chuẩn bị kế hoạch học kỳ
              và xây dựng một dashboard học tập dùng được thật, không dựa vào
              số liệu mẫu.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-2xl bg-cyan-300 px-6 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
                href="#gpa-tools"
              >
                Tính GPA ngay
              </a>
              <a
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                href="#features"
              >
                Xem tính năng
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
            <div className="grid grid-cols-2 gap-3">
              {dashboardStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
            <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-zinc-400">Trạng thái dữ liệu</p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {latestGpa ? 'Đã có dữ liệu GPA mới nhất' : 'Chưa có dữ liệu GPA'}
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Các chỉ số này sẽ được cập nhật sau khi bạn nhập thông tin và
                bấm tính GPA ở phần bên dưới.
              </p>
            </div>
          </div>
        </section>

        <StudentDashboard latestGpa={latestGpa} user={user} />

        <StudyAnalyticsDashboard latestGpa={latestGpa} />

        <section className="scroll-mt-24" id="features">
          <div className="mb-6 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Một workspace gọn cho việc học hằng ngày.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                className="rounded-3xl border border-white/10 bg-zinc-900/75 p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:bg-zinc-900"
                key={feature.title}
              >
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="scroll-mt-24" id="gpa-tools">
          <GpaCalculator onCalculate={setLatestGpa} user={user} />
        </section>

        <section className="scroll-mt-24" id="planner">
          <SemesterPlanner user={user} />
        </section>

        <section className="scroll-mt-24" id="feedback">
          <FeedbackForm />
        </section>

        <section
          className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6 text-center shadow-2xl shadow-cyan-950/20 sm:p-10"
          id="cta"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Bắt đầu với mục tiêu GPA của bạn.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-cyan-50/80">
            Nhập GPA hiện tại, tín chỉ đã học và mục tiêu mong muốn để StuZen
            tính ngay mức GPA cần đạt ở phần còn lại.
          </p>
          <a
            className="mt-6 inline-flex rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            href="#gpa-tools"
          >
            Dùng công cụ GPA
          </a>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/10 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>StuZen - Nền tảng học tập cho sinh viên.</p>
          <p>@ 2026 StuZen</p>
        </footer>
      </div>
    </main>
  )
}

export default App
