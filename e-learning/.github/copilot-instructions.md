### Quick context for AI coding agents

This is a small React + Vite single-page application (LMS) with two main user flows: student and educator.

- Build & dev: `package.json` defines scripts: `dev` (vite), `build` (vite build), `preview` (vite preview), and `lint` (eslint).
- Key env vars: `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_CURRENCY` (used in `src/main.jsx` and `src/context/AppContext.jsx`). Missing `VITE_CLERK_PUBLISHABLE_KEY` is treated as fatal in `src/main.jsx`.

### High-level architecture

- Routing: `src/App.jsx` defines routes for student pages (e.g. `/home`, `/course-list`, `/courses/:id`, `/player/:id`) and educator pages under `/educator/*`.
- Global state & utilities: `src/context/AppContext.jsx` provides course lists, helper utilities (rating, duration, lecture counts), and a `navigate` wrapper used across components.
- Components: Student UI lives under `src/components/student/`, educator UI under `src/components/educator/`, pages under `src/pages/{student,educator}`.

### Project-specific patterns and gotchas

- Dummy data: The app currently simulates API calls using `dummyCourses` from `src/assets/assets.js` (see `AppContext.fetchAllCourses`). When implementing network calls, keep the same shape as `dummyCourses` to avoid breaking components.
- Time calculations use `humanize-duration` and assume lecture durations are in minutes (see `calculateChapterTime`, `calculateCourseDuration`). Preserve that unit when adding data.
- Conditional UI: The main `Navbar` is intentionally hidden on educator routes using `useMatch('/educator/*')` — changes to route structure must respect this.
- Auth: Clerk is used. `src/main.jsx` expects `VITE_CLERK_PUBLISHABLE_KEY`; do not remove the early throw without adding an alternative auth flow.

### When changing or adding files

- Keep routes in `src/App.jsx` and add pages under the matching `src/pages/*` folder. Follow existing naming and path conventions (e.g., `Player` expects `:id`).
- Add shared helpers to `src/context/AppContext.jsx` if they need to be accessible across pages. The context exposes `allCourses`, `loading`, `currency`, and helper functions.
- UI components follow folder conventions (`components/student`, `components/educator`). Reuse existing Tailwind utility classes from `index.css`.

### Build / test / debug commands (Windows PowerShell)

```powershell
# Install deps
npm install

# Run dev server with HMR
npm run dev

# Build production bundle
npm run build

# Run a local preview of the production build
npm run preview

# Lint
npm run lint
```

### Examples to reference in edits

- env & auth check: `src/main.jsx` (throws if `VITE_CLERK_PUBLISHABLE_KEY` missing)
- routing decisions: `src/App.jsx` (educator vs student UI)
- global state/helpers: `src/context/AppContext.jsx` (data shapes, `calculateCourseDuration`, `calculateRating`)

### Acceptance cues for PRs

- Dev server runs via `npm run dev` with no environment errors.
- New routes appear in `src/App.jsx` and pages under `src/pages/*`.
- No regressions in components that consume `AppContext` (check for `allCourses`, `loading`, helper functions).

If anything here is unclear or you want additional rules (tests, CI steps, formatting), tell me which area to expand and I will update this file.
