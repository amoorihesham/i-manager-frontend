# Auth Pages: Login & Register

## Context
The app currently has only the create-next-app placeholder home page. The backend already exposes `/auth/login` and `/auth/register` (see [lib/api/auth.ts](lib/api/auth.ts)) and the axios client is configured with `withCredentials: true` (see [lib/api/client.ts](lib/api/client.ts)) — meaning the backend issues HTTP-only auth cookies on success and the browser will send them on subsequent requests automatically.

We need user-facing **/login** and **/register** pages that submit to those endpoints. Per request:
- Split-screen layout (branding panel + form panel)
- shadcn/ui primitives + TailwindCSS
- **TanStack Form** for form state + per-field validation (paired with Zod schemas)
- Auth state lives in HTTP-only cookies set by the backend — client never reads tokens, never stores them in localStorage

> **Heads-up (per AGENTS.md):** Next.js 16 renamed `middleware.ts` → `proxy.ts` and made `cookies()` async. This plan does not touch a proxy file, but if you later add route protection, use `proxy.ts` not `middleware.ts`.

## Dependencies to add
```
pnpm add @tanstack/react-form zod
```
- `@tanstack/react-form` — form state machine, no re-render on every keystroke
- `zod` — schema validation, fed into TanStack Form's `validators.onChange` adapter

## File layout

```
app/
  (auth)/
    layout.tsx            # split-screen shell (branding | form slot)
    login/page.tsx        # server component — renders <LoginForm/>
    register/page.tsx     # server component — renders <RegisterForm/>
components/
  auth/
    login-form.tsx        # 'use client' — TanStack Form + axios call
    register-form.tsx     # 'use client'
    auth-brand-panel.tsx  # left-side branding/marketing visual
lib/
  auth/
    schemas.ts            # Zod schemas: LoginSchema, RegisterSchema
```

Route group `(auth)` keeps these pages out of any future authenticated layout while sharing the split-screen shell.

## Implementation details

### 1. `lib/auth/schemas.ts`
Zod schemas matching the existing `RegisterBody` / `LoginBody` shapes in [lib/api/auth.ts](lib/api/auth.ts):
- `LoginSchema`: `email` (valid email), `password` (min 8)
- `RegisterSchema`: `username` (min 3, trim), `email` (valid), `password` (min 8, must contain letter + number), optional `confirmPassword` with refine for match

Export inferred types: `type LoginInput = z.infer<typeof LoginSchema>`.

### 2. `app/(auth)/layout.tsx` (server component)
Tailwind grid: `grid min-h-screen lg:grid-cols-2`.
- **Left** (`hidden lg:flex`): `<AuthBrandPanel />` — gradient background, product name, tagline, optional illustration. Hidden on mobile.
- **Right** (`flex items-center justify-center p-6 lg:p-12`): renders `{children}` inside a centered `max-w-sm` container.

### 3. Pages (server components, thin)
`app/(auth)/login/page.tsx` and `app/(auth)/register/page.tsx` each export `metadata` (title) and render their respective `<LoginForm/>` / `<RegisterForm/>` inside a shadcn `Card` with `CardHeader` (title + description) and `CardContent` (the form). Footer link to switch between login/register via `next/link`.

### 4. `components/auth/login-form.tsx` (`'use client'`)
- Use `useForm` from `@tanstack/react-form`:
  - `defaultValues: { email: '', password: '' }`
  - `validators.onChange: LoginSchema` (TanStack Form has first-class Zod adapter via `zodValidator()` or pass schema directly with the standard-schema adapter)
  - `onSubmit: async ({ value }) => { ... }`
- Inside `onSubmit`:
  - Call `login(value)` from [lib/api/auth.ts](lib/api/auth.ts). Success → backend sets the HTTP-only cookie; client just calls `router.push('/dashboard')` via `useRouter` from `next/navigation`.
  - Failure → axios interceptor returns the parsed `ApiError`; surface `error.error.message` via a top-level form error state (`form.setErrorMap` or local `useState`).
- Render: shadcn `<Label>` + `<Input>` + per-field error from `field.state.meta.errors`; submit `<Button>` disabled while `form.state.isSubmitting`.
- Accessibility: each input has `id`, `name`, `autoComplete` (`email`, `current-password` / `new-password`), `aria-invalid` when errored.

### 5. `components/auth/register-form.tsx` (`'use client'`)
Same shape as login. Three fields (username, email, password) — optionally a confirm-password. On success, call `register()` then either:
- (a) immediately call `login()` to obtain the session cookie and redirect to `/dashboard`, **or**
- (b) redirect to `/login?registered=1`.

Recommend **(a)** — single-form UX. Confirm with user (see questions below).

### 6. `components/auth/auth-brand-panel.tsx`
Decorative-only server component. Gradient background (`bg-gradient-to-br from-primary to-primary/60`), product name in heading font, short tagline, optional SVG/illustration. No interactivity.

## Why this shape

- **Server component pages, client component forms**: keeps the route lightweight and lets us add server-side redirects later (e.g. read auth cookie in the page and `redirect('/dashboard')` if already logged-in) without rewriting the form.
- **TanStack Form, not React's `useActionState`**: the Next.js docs show server-actions for first-party auth, but our auth lives on a separate API service. Submitting via axios from the client (so the browser sees the `Set-Cookie` response and stores the HTTP-only cookie) is the correct pattern here — server actions would lose the cross-origin cookie unless we proxy through a route handler.
- **HTTP-only cookies, no token in JS**: we do **not** persist `accessToken` / `refreshToken` from the `AuthUser` response into `localStorage` or React context. Treat them as opaque — the cookie is the source of truth. (If the backend doesn't already drop the token fields from the JSON body, that's a backend cleanup, not in scope here.)

## Verification

1. `pnpm install` then `pnpm dev`.
2. Confirm `NEXT_PUBLIC_API_URL` is set in `.env.local` and the backend is reachable.
3. Navigate to `http://localhost:3000/register` — submit valid data → should land on `/dashboard` (or wherever we choose), and DevTools → Application → Cookies should show the auth cookie with `HttpOnly`, `Secure` (in prod), `SameSite=Lax` (or `None` if cross-site) flags set by the backend.
4. Navigate to `/login` — submit same credentials → redirects to dashboard.
5. Try invalid email / short password → inline field errors appear, no network request fires.
6. Try wrong password → server error message rendered above the submit button.
7. Resize to mobile width (<1024px) → branding panel hides, form fills screen.
8. Tab through inputs → focus ring visible, screen reader announces field errors via `aria-invalid`.

## Out of scope (flag for follow-up)
- `proxy.ts` to gate `/dashboard` on the auth cookie (will need backend cookie name).
- A `/dashboard` route — the redirect target is currently a 404.
- Forgot-password / email-verification flows.
- A toast system (sonner) for global error feedback — using inline form errors for now.
