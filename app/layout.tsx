import type { Metadata } from 'next'
import '../src/index.css'

export const metadata: Metadata = {
  title: 'StuZen - Nền tảng học tập cho sinh viên',
  description: 'Student productivity platform for GPA, tasks, and planning.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
