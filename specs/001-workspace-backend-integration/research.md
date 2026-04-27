# Research: Workspace Flow — Backend Integration

**Feature**: 001-workspace-backend-integration
**Phase**: 0 — Research & Decision Log
**Date**: 2026-04-27

## Decision 1: Data Fetching Strategy

**Decision**: Client-side data fetching using the existing Axios API client as-is.

**Rationale**: The existing `lib/api/client.ts` is configured with `NEXT_PUBLIC_API_URL`
(a browser-exposed env variable) and `withCredentials: true` for cookie-based auth.
Using it in Next.js Server Components would require forwarding the incoming request's
`Cookie` header to each Axios call — a non-trivial change that introduces a separate
server-side client variant. Since the feature request explicitly says "using the api-client
already made," client-side fetching is the correct interpretation.

**Pattern adopted**:

- Page files are Server Components (for `generateMetadata`, HTML shell, zero JS overhead).
- Each page renders a single Client Component "view" that owns the data fetching and
  interactive state via `useState` + `useEffect` (or TanStack Query in a future refactor).
- Mutations (create, rename, delete, invite, remove) are triggered from Client Components.

**Alternatives considered**:

- Next.js server-side fetch with `cookies()` forwarding → deferred; requires API client refactor.
- TanStack Query for caching/invalidation → valuable but adds a new dependency; deferred to a
  follow-up once the baseline integration is stable.

---

## Decision 2: Route Group for Authenticated Pages

**Decision**: Create `app/(app)/` route group with a layout that enforces authentication.

**Rationale**: The app already uses `app/(auth)/` for public auth pages. A parallel
`(app)` group cleanly separates authenticated routes, applies a shared app-shell layout
(sidebar, nav), and centralises the auth guard without touching existing routes.

**Auth guard approach**:

- `app/(app)/layout.tsx` is a Client Component.
- On mount it calls `api.auth.me()` (or reads session state). If unauthenticated, it calls
  `router.push('/login')`.
- This is consistent with the current pattern: `login-form.tsx` redirects to `/` on success
  using `router.push('/')`, so the landing page redirect target after login will become
  `/workspaces` (update `login-form.tsx`).

**Alternatives considered**:

- Next.js Middleware (`middleware.ts`) for server-side auth redirect → preferred long-term,
  but requires knowing the session cookie name/structure; deferred.

---

## Decision 3: Form Pattern

**Decision**: TanStack Form v1 with Zod `onSubmit` validator, matching the existing
`login-form.tsx` and `register-form.tsx` pattern exactly.

**Pattern**:

```ts
const form = useForm({
	defaultValues: { name: '' },
	validators: { onSubmit: SchemaName },
	onSubmit: async ({ value }) => {
		try {
			await api.workspaces.createWorkspace(value);
			toast.success('Workspace created');
			router.push(`/workspaces/${result.data.id}`);
		} catch (err) {
			const apiErr = err as api.ApiError;
			setServerError(apiErr?.error?.message ?? 'Something went wrong.');
		}
	},
});
```

**Zod schemas location**: `lib/workspaces/schemas.ts` (mirrors `lib/auth/schemas.ts`).

---

## Decision 4: Deletion Confirmation

**Decision**: Use Radix UI `AlertDialog` (shadcn primitive) for all destructive confirmation
dialogs (delete workspace, remove member).

**Rationale**: AlertDialog is keyboard-accessible, focus-trapped, and already in the
project's Radix UI dependency. It satisfies Constitution Principle V (Accessibility).
The `shadcn add alert-dialog` command installs it.

---

## Decision 5: Role-Based UI Gating

**Decision**: Gate management controls (rename, delete, invite, remove) on the
`WorkspaceWithRole.role` value returned by `listWorkspaces()` / `getWorkspace()`.

**Rules**:

- `role === 'owner'`: full access (rename, delete, invite, remove any member).
- `role === 'admin'`: rename, invite, remove non-owner members.
- `role === 'member'`: read-only access; management controls hidden.

**Implementation**: The current user's role is retrieved once per page and passed as a
prop to child components. Controls are conditionally rendered (not just disabled) to
avoid accessibility confusion.

---

## Decision 6: Invite Member — Role Selection

**Decision**: The invite form exposes a role selector (admin | member) defaulting to
`member`. The `InviteToWorkspaceBody` type accepts `role?: ProjectRole`, and the API
supports it.

**Note**: `InviteToWorkspaceBody` types `role` as `ProjectRole` ('admin' | 'member').
`WorkspaceRole` includes 'owner' which is never selectable when inviting — correct
behaviour since owner is assigned only at workspace creation.

---

## Decision 7: Navigation After Create/Delete

**Decision**:

- After **create workspace** → navigate to `/workspaces/[newId]`.
- After **delete workspace** → navigate to `/workspaces` (list).
- After **rename** / member actions → stay on current page; show success toast and
  refresh the local state (re-fetch).

---

## Decision 8: Shadcn Components Needed

Components not yet installed that this feature requires:

| Component   | Command                                   |
| ----------- | ----------------------------------------- |
| AlertDialog | `pnpm dlx shadcn@latest add alert-dialog` |
| Badge       | `pnpm dlx shadcn@latest add badge`        |
| Dialog      | `pnpm dlx shadcn@latest add dialog`       |
| Select      | `pnpm dlx shadcn@latest add select`       |
| Separator   | `pnpm dlx shadcn@latest add separator`    |
| Skeleton    | `pnpm dlx shadcn@latest add skeleton`     |

Already installed: Button, Card, Input, Label.

---

## Decision 9: Loading & Error States

**Decision**:

- **Loading**: Render Skeleton components while data is being fetched (prevents CLS —
  Constitution Principle III, CLS ≤ 0.1).
- **Error**: Show an inline error banner (same pattern as auth forms) and a retry button.
- **Mutations**: Disable the submit button while `form.state.isSubmitting` or a local
  `isPending` flag is true.

---

## Decision 10: Redirect After Login

**Decision**: Update `components/auth/login-form.tsx` to redirect to `/workspaces`
instead of `/` after a successful login, so users land directly in their workspace list.

**Why now**: This change is directly enabled by this feature (the `/workspaces` route
now exists) and improves the user journey described in US1.
