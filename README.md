# UK School ERP

Next.js ERP application based on the screens and design system in `uk-school-erp-design`.

## Run locally

1. Start the API in `uk-school-api` on port `3000`.
2. Copy `.env.example` to `.env.local` and set `API_BASE_URL` to the API's versioned base URL.
3. Run `pnpm install`, then start the ERP with `pnpm dev --port 3001`.

The sign-in page sends credentials from the browser to a same-origin Next.js route handler. That handler calls the API and stores its session token in an HttpOnly, SameSite=Lax cookie; the token is never returned to browser JavaScript. Protected ERP pages validate the token against `GET /api/v1/erp/me`, and sign-out revokes it through the API.

The API currently stores sessions in process memory. Sessions are therefore invalidated when the API process restarts and are not shared between API instances; production deployment needs a shared persistent session store.

## Attendance workflow

The `/attendance` workspace is available to attendance officers, leadership/admin, and teachers. Staff can open morning/afternoon registers or lesson sessions, record configured attendance codes and absence reasons, and save audited batches. Teacher class groups, register pupils, and attendance reports are limited by the API to the teacher's assignments. Headteacher reports support a selected date with daily, weekly, monthly, year-group, form, and year-to-date persistent-absence views. Parent and student portals show only their scoped attendance summaries and recent marks.

Sprint 3 is underway. The parent portal supports a child switcher and displays only the selected child's current timetable and attendance updates. The student workspace displays the timetable resolved for the signed-in student's own record. Homework, assignments, school notices, messaging, consent, and achievement/behaviour summaries are not implemented yet.