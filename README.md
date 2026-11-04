# UEMP Frontend

React + TypeScript + Vite + Tailwind + Axios + React Router.

## Run

```
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `.env`.

## API status

The API base URL defaults to `http://localhost:5000/v1`. Authentication uses the session cookie created by `/auth/login`; API requests include credentials and the current user is restored from `/auth/me`. The backend must allow credentialed requests from the frontend origin. Service paths follow the documented `/users`, `/courses`, `/registrations`, `/results`, and `/academics/*` routes, including role-specific response collection wrappers.

Dashboard summaries are assembled from role-scoped `/registrations` and `/results`; department and super-admin summaries also use `/users` and `/courses`, with super-admin activity counts from `/activities`. Lecturer accounts must have a department assigned on the backend to list their courses.

## Not done yet

- Dept admin: academic levels/programs management, course registrations view
- Super admin: separate role assignment screen (role is editable on Users), activity monitoring feed
- Student print is `window.print()` only
