# Implementation Plan: Workspace Flow — Backend Integration

**Branch**: `001-workspace-backend-integration` | **Date**: 2026-04-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-workspace-backend-integration/spec.md`

## Summary

Wire the existing workspace API client (`lib/api/workspaces.ts`) to a full set of
Next.js App Router pages and React components, giving authenticated users the ability
to list, create, rename, delete, and manage the members of their workspaces. The UI
uses TanStack Form + Zod for all form interactions, Shadcn UI primitives for visual
components, Sonner for toast notifications, and Lucide React for icons — all
consistent with the existing auth flow.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode)
**Primary Dependencies**: Next.js 16.2.4 (App Router), Axios (existing `lib/api/client.ts`),
TanStack Form v1, Zod 4, Shadcn UI + Radix UI, Tailwind CSS 4, Sonner, Lucide React
**Storage**: N/A — data lives in the backend; frontend is stateless
**Testing**: Not in scope for this feature
**Target Platform**: Web (all modern browsers)
**Project Type**: Web application (Next.js frontend only)
**Performance Goals**: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (per constitution Principle III)
**Constraints**: API client uses `NEXT_PUBLIC_API_URL` + Axios `withCredentials`; server-side
data fetching with this client requires cookie forwarding, which is out of scope — see
Complexity Tracking below
**Scale/Scope**: Single user session; workspace lists assumed < 50 items, member lists < 100

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                      | Status                 | Notes                                                                                                                                 |
| ------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| I. SEO-First                   | ✅ Pass                | All pages export `generateMetadata`; authenticated pages use `robots: noindex` since content is user-specific and private             |
| II. Code Quality & Type Safety | ✅ Pass                | No `any`; all props typed via interfaces or Zod-inferred types; ESLint/Prettier enforced                                              |
| III. Performance by Default    | ⚠️ Justified exception | See Complexity Tracking — Axios client is client-side only; pages are Server Components but data-fetching views are Client Components |
| IV. Component Architecture     | ✅ Pass                | Shadcn/Radix primitives used throughout; TanStack Form + Zod for all forms; no prop drilling beyond 2 levels                          |
| V. Accessibility               | ✅ Pass                | Semantic HTML, `aria-*` attributes on form fields, keyboard-navigable dialogs via Radix AlertDialog                                   |

## Project Structure

### Documentation (this feature)

```text
specs/001-workspace-backend-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── workspace-ui.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
app/
├── (auth)/                        # existing — login / register
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
├── (app)/                         # NEW — authenticated shell
│   ├── layout.tsx                 # auth guard + app chrome (sidebar/nav)
│   └── workspaces/
│       ├── page.tsx               # workspace list
│       ├── new/
│       │   └── page.tsx           # create workspace
│       └── [id]/
│           ├── page.tsx           # workspace dashboard (projects placeholder)
│           ├── settings/
│           │   └── page.tsx       # rename + delete
│           └── members/
│               └── page.tsx       # members list + invite + remove
├── layout.tsx                     # existing root layout
└── page.tsx                       # existing landing page

components/
├── auth/                          # existing
└── workspaces/                    # NEW
    ├── workspace-list-view.tsx    # 'use client' — fetches + renders list
    ├── workspace-card.tsx         # workspace card (client)
    ├── create-workspace-form.tsx  # 'use client' — TanStack Form + Zod
    ├── workspace-settings-view.tsx # 'use client' — rename form + delete dialog
    ├── rename-workspace-form.tsx  # 'use client' — TanStack Form + Zod
    ├── delete-workspace-dialog.tsx # 'use client' — Radix AlertDialog
    ├── workspace-members-view.tsx # 'use client' — members list + actions
    ├── invite-member-form.tsx     # 'use client' — TanStack Form + Zod
    └── remove-member-button.tsx   # 'use client' — Radix AlertDialog

lib/
├── api/                           # existing — no changes
└── workspaces/
    └── schemas.ts                 # NEW — Zod schemas for workspace forms
```

**Structure Decision**: Next.js App Router route groups — `(auth)` for public auth pages
(existing), `(app)` for private authenticated pages (new). Each workspace route is a
separate page file so that metadata, loading states, and error boundaries can be applied
independently.

## Complexity Tracking

| Violation                                               | Why Needed                                                                                                                                                                                                                                                | Simpler Alternative Rejected Because                                                                                                                                   |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Principle III: Client Components used for data fetching | The existing Axios client (`lib/api/client.ts`) targets `NEXT_PUBLIC_API_URL` with `withCredentials: true`. Server Components would require forwarding the `Cookie` request header to Axios on every render, which needs a server-side API client variant | Creating a server-side API client variant is a separate refactor outside this feature's scope; doing it here would add significant complexity with no spec requirement |
