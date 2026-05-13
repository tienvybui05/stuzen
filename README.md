# StuZen

StuZen is a student productivity platform for GPA planning, task tracking, semester planning, analytics, and contact feedback.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Vercel environment variables

Add these variables in Vercel Project Settings -> Environment Variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
RESEND_API_KEY=
RESEND_FROM_EMAIL=StuZen <support@stuzen.io.vn>
CONTACT_TO_EMAIL=support@stuzen.io.vn
```

Existing `VITE_FIREBASE_*` values can be copied into the matching `NEXT_PUBLIC_FIREBASE_*` variables. `RESEND_API_KEY` is required for `/api/contact` to send email to `support@stuzen.io.vn`.

Resend requires the sender domain in `RESEND_FROM_EMAIL` to be verified before it can send to arbitrary recipients. Verify `stuzen.io.vn` in Resend Domains before using `support@stuzen.io.vn`.

After editing env variables, redeploy the latest Vercel deployment.
