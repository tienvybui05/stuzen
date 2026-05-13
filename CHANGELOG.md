# Changelog

## 2026-05-13 18:49

- Initialized and pushed the project to GitHub at `https://github.com/tienvybui05/stuzen`.
- Deployed StuZen to Vercel production at `https://stuzen.vercel.app`.
- Added `.vercel` to `.gitignore` after linking the local project to Vercel.
- Verified the production page returns HTTP 200 and the Firebase environment config is present in the production bundle.

## 2026-05-13 18:37

- Added `.env` to `.gitignore` before preparing the project for Git/Vercel deployment.
- Verified the project with `npm run build`.

## 2026-05-13 18:35

- Updated the browser title to `StuZen - Nền tảng học tập cho sinh viên`.
- Updated the footer copyright text to `@ 2026 StuZen`.
- Removed the frontend tech stack text from the footer.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 17:01

- Shortened the navbar Google authentication button label to `Login`.
- Reduced the login button and Google mark sizing for a more compact header.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 16:54

- Improved the shared `Button` component with gradient primary styling, stronger focus states, smoother active/hover feedback, and better spacing for icon buttons.
- Redesigned the navbar controls with a richer StuZen brand badge, visible mobile Google login button, polished user avatar chip, and cleaner logout action.
- Upgraded the theme toggle into a compact pill switch while keeping the `Dark` / `Light` labels in English.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 15:41

- Added Firebase modular setup in `src/lib/firebase.ts` using Vite environment variables.
- Added Google Auth helpers, Firestore GPA result helpers, and client-throttled feedback submission.
- Removed the old hard-coded `src/firebase.js` config file.
- Added Auth UI in the navbar with Google login, logout, avatar, and display name.
- Added explicit Firestore save flow for GPA results with a 20-result-per-user limit.
- Kept guest GPA usage available through local calculation history without Firestore writes.
- Added Firestore-backed saved GPA history loading and deletion for logged-in users.
- Added a feedback form that supports guest feedback and stores uid/email when logged in.
- Added `.env.example` and `firestore.rules`.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 14:42

- Added an internal scroll area for long Upcoming tasks lists so the task form and surrounding dashboard sections stay visible.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 14:40

- Rebalanced the student dashboard layout so Upcoming tasks uses the wider right column.
- Moved Quick actions below Upcoming tasks to avoid a large empty right-side panel.
- Adjusted task form and task item layout so fields and titles have more horizontal space.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 14:34

- Completed the Upcoming tasks module with real task creation and persistence.
- Added task fields for title, deadline date, category, priority, and pending/done status.
- Added task sorting by nearest deadline, due-state labels (`overdue`, `due today`, `upcoming`), checkbox completion, and delete actions.
- Added `localStorage` load/save helpers for tasks.
- Replaced the dashboard Upcoming tasks empty state with the interactive task module.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 14:29

- Changed the theme toggle label back to English (`Dark` / `Light`) while keeping the rest of the UI localized.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:52

- Improved light theme styling with global theme-aware overrides for surfaces, cards, borders, text, inputs, gradients, and shadows.
- Updated the theme toggle label from English to Vietnamese.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:49

- Added edit support for semester planner courses.
- Added edit and cancel-edit flows that populate the course form and update the existing course instead of adding a duplicate.
- Persisted edited course data back to `localStorage`.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:46

- Added delete buttons for individual GPA calculation history entries.
- Synced GPA history deletion with `localStorage`.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:44

- Added `localStorage` persistence for semester planner courses.
- Added `plannerStorage.ts` with load/save helpers for planned courses.
- Updated semester planner to restore saved courses on reload and persist changes when courses are added or removed.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:42

- Added a reusable StuZen UI system with `Button`, `Card`, `Input`, `Modal`, `Navbar`, `Sidebar`, and `ThemeToggle` components.
- Extended `Card` with a reusable `className` prop.
- Refactored `NumberInput` to build on the shared `Input` component.
- Updated GPA and semester planner forms to use the shared `Button` and `Input` primitives.
- Replaced the inline landing navigation with the reusable `Navbar` component.
- Added persisted light/dark theme state through the reusable theme toggle.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:35

- Added a study analytics dashboard module with chart-based views.
- Added GPA trend line chart using saved GPA calculation history from `localStorage`.
- Added semester performance bar chart for current GPA, required GPA, and target GPA.
- Added target progress visualization based on the latest GPA calculation.
- Added the analytics section to the landing page navigation and main page flow.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:32

- Added a real semester planner module under `src/features/planner`.
- Added course planning types, validation utilities, and weighted semester GPA calculation.
- Added a planner form for course name, credits, and expected grade.
- Added planned course list with remove action, total credits, and projected semester GPA summary.
- Replaced the static planner landing section with the interactive semester planner.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:24

- Refactored the GPA calculator into a dedicated module with smaller reusable components: form, result card, progress card, and history list.
- Added `gpaStorage.ts` to persist calculation history in `localStorage`.
- Added `GpaHistoryEntry` type and shared GPA status metadata for cleaner TypeScript structure.
- Saved each valid GPA calculation to local history and restored the latest saved result into the dashboard on load.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:21

- Added a modern responsive dark-mode student dashboard section.
- Included GPA overview, semester progress, upcoming tasks, study statistics, and quick actions.
- Connected GPA overview, semester progress, and study statistics to the latest real GPA calculation state.
- Added empty states for upcoming tasks and study tracking data until real user-entered data exists.
- Added dashboard navigation and CTA anchors.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:16

- Reworked the StuZen interface into a modern startup/student SaaS landing page.
- Added navigation, hero section, feature cards, GPA tools section, student planner section, CTA section, and footer.
- Kept the GPA calculator as the real interactive tool and connected landing dashboard stats to the latest calculated GPA state.
- Preserved empty states for planner-related data instead of introducing mock numbers.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:11

- Adjusted dashboard statistic cards so labels stay on one line and values do not wrap.
- Increased the desktop width of the header stats grid to reduce cramped card labels.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:08

- Removed the mock dashboard data source from `src/data/dashboard.ts`.
- Connected the top dashboard stats to the latest real GPA calculation state instead of hard-coded sample numbers.
- Added empty states for GPA history, study analytics, and semester planning until the app has real user-entered data for those modules.
- Added a GPA calculation snapshot type and callback flow so feature output can update the main dashboard.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:02

- Vietnamese-localized the StuZen dashboard copy, GPA calculator labels, validation messages, result states, dashboard metrics, GPA history, analytics, and semester planning content.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 13:00

- Repositioned the app as StuZen, a student productivity dashboard built with React, TypeScript, Vite, and Tailwind CSS.
- Refactored the UI into a scalable component-based structure with reusable `Card`, `NumberInput`, and `StatCard` components.
- Moved GPA calculator logic into `src/features/gpa` with clear form types, validation, and required GPA calculation utilities.
- Added dashboard data in `src/data/dashboard.ts` for GPA history, semester planning, study analytics, and student overview stats.
- Removed the unused Vite starter `src/App.css` file and kept styling in Tailwind plus the global baseline.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 12:25

- Clarified the GPA calculation logic in `src/App.tsx` using the required formula: `requiredGPA = ((targetGPA * totalCredits) - (currentGPA * completedCredits)) / remainingCredits`.
- Verified the project with `npm run build`.

## 2026-05-13 12:22

- Replaced the default Vite starter screen with a modern dark dashboard GPA calculator.
- Added React TypeScript state, input validation, GPA target calculation, and feasibility status handling.
- Added responsive Tailwind CSS layout for the header, GPA input form, result card, and credit progress panel.
- Simplified global CSS so Tailwind controls the app layout and dark theme baseline.
- Verified the project with `npm run build` and `npm run lint`.

## 2026-05-13 12:19

- Set up Tailwind CSS for the Vite React project.
- Added `tailwindcss` and `@tailwindcss/vite` as development dependencies.
- Registered the Tailwind CSS Vite plugin in `vite.config.ts`.
- Imported Tailwind CSS from `src/index.css` with `@import "tailwindcss";`.
- Verified the project still builds successfully with `npm run build`.
