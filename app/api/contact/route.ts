import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const RATE_LIMIT_MS = 60_000
const requestsByIp = new Map<string, number>()

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') ?? 'unknown'
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const now = Date.now()
  const lastRequestAt = requestsByIp.get(ip) ?? 0

  if (now - lastRequestAt < RATE_LIMIT_MS) {
    return NextResponse.json(
      { message: 'Bạn chỉ có thể gửi liên hệ mỗi 60 giây.' },
      { status: 429 },
    )
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { message: 'Server chưa cấu hình RESEND_API_KEY.' },
      { status: 500 },
    )
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const body = (await request.json().catch(() => null)) as {
    email?: unknown
    message?: unknown
    name?: unknown
  } | null

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { message: 'Tên cần từ 2 đến 80 ký tự.' },
      { status: 400 },
    )
  }

  if (!isValidEmail(email) || email.length > 120) {
    return NextResponse.json(
      { message: 'Email không hợp lệ.' },
      { status: 400 },
    )
  }

  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json(
      { message: 'Nội dung cần từ 10 đến 2000 ký tự.' },
      { status: 400 },
    )
  }

  requestsByIp.set(ip, now)

  const { error } = await resend.emails.send({
    from: 'StuZen <onboarding@resend.dev>',
    replyTo: email,
    subject: `StuZen contact từ ${name}`,
    to: 'support@stuzen.io.vn',
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `IP: ${ip}`,
      '',
      message,
    ].join('\n'),
  })

  if (error) {
    requestsByIp.delete(ip)
    return NextResponse.json(
      { message: error.message || 'Không gửi được email.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ message: 'Đã gửi liên hệ thành công.' })
}
