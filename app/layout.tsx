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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3421325358490202"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
