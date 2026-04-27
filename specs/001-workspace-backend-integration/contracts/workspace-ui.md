# UI Contracts: Workspace Flow

**Feature**: 001-workspace-backend-integration
**Phase**: 1 — Design
**Date**: 2026-04-27

This document defines the interface contract for each page and major component in the
workspace flow. Each entry describes: the route, the component tree, the data it needs,
and the interactions it exposes.

---

## Pages

### `/workspaces` — Workspace List

**File**: `app/(app)/workspaces/page.tsx`
**Rendering**: Server Component (metadata only) → renders `<WorkspaceListView />`

```ts
export const metadata: Metadata = {
  title: 'Workspaces — iManager',
  robots: 'noindex',
};
```

**WorkspaceListView** (`components/workspaces/workspace-list-view.tsx`)

```
Props: none
State:
  workspaces: WorkspaceWithRole[]   (fetched on mount)
  isLoading: boolean
  error: string | null

Renders:
  - Loading: <WorkspaceListSkeleton />
  - Error: inline error banner + retry button
  - Empty: empty-state with "Create your first workspace" CTA → /workspaces/new
  - Populated: grid of <WorkspaceCard /> + "New Workspace" button → /workspaces/new

API calls:
  - api.workspaces.listWorkspaces()  [on mount]
```

**WorkspaceCard** (`components/workspaces/workspace-card.tsx`)

```
Props:
  workspace: WorkspaceWithRole

Renders:
  - Workspace name (h3 semantics)
  - Role badge (owner / admin / member)
  - "Open" link → /workspaces/[id]

Interactions: none (pure display + navigation link)
```

---

### `/workspaces/new` — Create Workspace

**File**: `app/(app)/workspaces/new/page.tsx`
**Rendering**: Server Component (metadata) → renders `<CreateWorkspaceForm />`

```ts
export const metadata: Metadata = {
  title: 'New Workspace — iManager',
  robots: 'noindex',
};
```

**CreateWorkspaceForm** (`components/workspaces/create-workspace-form.tsx`)

```
Props: none
State:
  serverError: string | null
  form: TanStack Form (CreateWorkspaceSchema)
    fields: name (string)

Renders:
  - Name input + validation error
  - Server error banner
  - Submit button (disabled while submitting)
  - "Cancel" link → /workspaces

Interactions:
  - onSubmit: api.workspaces.createWorkspace({ name })
    success → router.push('/workspaces/[newId]') + toast.success
    error   → setServerError(apiErr.error.message)
```

---

### `/workspaces/[id]` — Workspace Dashboard

**File**: `app/(app)/workspaces/[id]/page.tsx`
**Rendering**: Server Component (metadata) → renders `<WorkspaceDashboardView />`

```ts
// metadata is dynamic — workspace name fetched client-side, fallback title used
export const metadata: Metadata = {
  title: 'Workspace — iManager',
  robots: 'noindex',
};
```

**WorkspaceDashboardView** (inline or separate component)

```
Props:
  workspaceId: string  (from route params — passed server→client)
State:
  workspace: WorkspaceWithRole | null
  isLoading: boolean
  error: string | null

Renders:
  - Workspace name as <h1>
  - User's role badge
  - Navigation links: Settings | Members
  - Projects section placeholder ("Projects coming soon")

API calls:
  - api.workspaces.listWorkspaces()  [to find this workspace's role]
    OR store role in URL / context (simpler: re-use listWorkspaces and find by id)
```

---

### `/workspaces/[id]/settings` — Workspace Settings

**File**: `app/(app)/workspaces/[id]/settings/page.tsx`
**Rendering**: Server Component → renders `<WorkspaceSettingsView />`

```ts
export const metadata: Metadata = {
  title: 'Workspace Settings — iManager',
  robots: 'noindex',
};
```

**WorkspaceSettingsView** (`components/workspaces/workspace-settings-view.tsx`)

```
Props:
  workspaceId: string

State:
  workspace: Workspace | null
  userRole: WorkspaceRole | null
  isLoading: boolean
  error: string | null

Renders:
  - Workspace name as <h1>
  - Back link → /workspaces/[id]
  - <RenameWorkspaceForm /> (visible if role is 'owner' or 'admin')
  - <DeleteWorkspaceDialog /> (visible only if role is 'owner')

API calls on mount:
  - api.workspaces.getWorkspace(workspaceId)
  - api.workspaces.listWorkspaces()  → derive userRole
```

**RenameWorkspaceForm** (`components/workspaces/rename-workspace-form.tsx`)

```
Props:
  workspaceId: string
  currentName: string
  onSuccess: (newName: string) => void

State:
  serverError: string | null
  form: TanStack Form (RenameWorkspaceSchema)
    fields: name (string, defaultValue: currentName)

Interactions:
  - onSubmit: api.workspaces.updateWorkspace(workspaceId, { name })
    success → onSuccess(name) + toast.success
    error   → setServerError(apiErr.error.message)
```

**DeleteWorkspaceDialog** (`components/workspaces/delete-workspace-dialog.tsx`)

```
Props:
  workspaceId: string
  workspaceName: string

State:
  isPending: boolean

Renders:
  - Radix AlertDialog trigger button ("Delete workspace")
  - Confirmation dialog: "Are you sure you want to delete [name]? This cannot be undone."
  - Confirm + Cancel buttons

Interactions:
  - onConfirm: api.workspaces.deleteWorkspace(workspaceId)
    success → router.push('/workspaces') + toast.success
    error   → toast.error(apiErr.error.message)
```

---

### `/workspaces/[id]/members` — Workspace Members

**File**: `app/(app)/workspaces/[id]/members/page.tsx`
**Rendering**: Server Component → renders `<WorkspaceMembersView />`

```ts
export const metadata: Metadata = {
  title: 'Workspace Members — iManager',
  robots: 'noindex',
};
```

**WorkspaceMembersView** (`components/workspaces/workspace-members-view.tsx`)

```
Props:
  workspaceId: string

State:
  members: WorkspaceMember[]
  userRole: WorkspaceRole | null
  isLoading: boolean
  error: string | null

Renders:
  - Back link → /workspaces/[id]
  - <h1>Members</h1>
  - <InviteMemberForm /> (visible if role is 'owner' or 'admin')
  - Members table/list:
      username | email | role | joined | actions
      <RemoveMemberButton /> per row (hidden for own row; hidden for owner row if user is admin)
  - Loading: Skeleton rows
  - Empty: "No other members yet" message

API calls on mount:
  - api.workspaces.listWorkspaceMembers(workspaceId)
  - api.workspaces.listWorkspaces()  → derive userRole
```

**InviteMemberForm** (`components/workspaces/invite-member-form.tsx`)

```
Props:
  workspaceId: string
  onInviteSent: () => void   (callback to re-fetch member list)

State:
  serverError: string | null
  form: TanStack Form (InviteMemberSchema)
    fields: email (string), role ('admin' | 'member')

Renders:
  - Email input + role Select (Shadcn Select) + Submit button
  - Server error banner

Interactions:
  - onSubmit: api.workspaces.inviteToWorkspace(workspaceId, { email, role })
    success → form.reset() + onInviteSent() + toast.success
    error   → setServerError(apiErr.error.message)
```

**RemoveMemberButton** (`components/workspaces/remove-member-button.tsx`)

```
Props:
  workspaceId: string
  userId: string
  username: string
  onRemoved: () => void

State:
  isPending: boolean

Renders:
  - Radix AlertDialog: "Remove [username] from this workspace?"
  - Confirm + Cancel

Interactions:
  - onConfirm: api.workspaces.removeWorkspaceMember(workspaceId, userId)
    success → onRemoved() + toast.success
    error   → toast.error(apiErr.error.message)
```

---

## Shared Layout

### `app/(app)/layout.tsx` — App Shell

```
Type: Client Component ('use client')
State:
  isChecking: boolean   (auth check in progress)

Behaviour on mount:
  - Calls api.auth.me() (or checks session) to verify auth
  - If unauthenticated → router.push('/login')
  - While checking → render loading spinner / skeleton
  - If authenticated → render children inside app chrome

App chrome (once authenticated):
  - Top nav bar: iManager logo | "Workspaces" link | user menu
  - <main>: {children}
```

---

## Error Handling Contract

All API errors follow `ApiError` from `lib/api/types.ts`:

```ts
interface ApiError {
  success: false;
  error: { code: string; message: string };
  upgradeUrl?: string;
}
```

**Component-level rule**:
- Form submissions → set `serverError` state → render inline error banner above submit button.
- Non-form mutations (delete, remove) → `toast.error(apiErr.error.message)`.
- Data loading failures → set `error` state → render inline banner with retry button.
- `upgradeUrl` present → show upgrade prompt alongside the error (future enhancement; log for now).
