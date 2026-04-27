# Data Model: Workspace Flow — Backend Integration

**Feature**: 001-workspace-backend-integration
**Phase**: 1 — Design
**Date**: 2026-04-27
**Source of truth**: `lib/api/types.ts` (TypeScript interfaces, already defined)

---

## Core Entities

### Workspace

Represents a top-level organisational unit. A user can belong to many workspaces.

| Field       | Type     | Notes                                  |
| ----------- | -------- | -------------------------------------- |
| `id`        | `string` | UUID, assigned by backend              |
| `name`      | `string` | 1–100 characters, unique per owner     |
| `ownerId`   | `string` | User ID of the workspace creator/owner |
| `createdAt` | `string` | ISO 8601 datetime                      |
| `updatedAt` | `string` | ISO 8601 datetime                      |

### WorkspaceWithRole

Extends `Workspace`. Returned by `listWorkspaces()`. Carries the calling user's role
so the frontend can apply role-based gating without a separate members call.

| Field  | Type            | Notes                            |
| ------ | --------------- | -------------------------------- |
| `role` | `WorkspaceRole` | `'owner' \| 'admin' \| 'member'` |
| `...`  |                 | All `Workspace` fields           |

### WorkspaceMember

A user's membership record within a workspace.

| Field      | Type            | Notes                            |
| ---------- | --------------- | -------------------------------- |
| `userId`   | `string`        | UUID                             |
| `role`     | `WorkspaceRole` | `'owner' \| 'admin' \| 'member'` |
| `joinedAt` | `string`        | ISO 8601 datetime                |
| `username` | `string`        | Display name                     |
| `email`    | `string`        | Email address                    |

### Invitation

Created when an owner/admin invites someone by email.

| Field         | Type               | Notes                                               |
| ------------- | ------------------ | --------------------------------------------------- |
| `id`          | `string`           | UUID                                                |
| `token`       | `string`           | Opaque invitation token                             |
| `email`       | `string`           | Invitee email                                       |
| `scope`       | `InvitationScope`  | `'workspace'` for this feature                      |
| `workspaceId` | `string \| null`   | Target workspace                                    |
| `role`        | `string`           | Invited role (`'admin' \| 'member'`)                |
| `status`      | `InvitationStatus` | `'pending' \| 'accepted' \| 'revoked' \| 'expired'` |
| `expiresAt`   | `string`           | ISO 8601 datetime                                   |
| `createdAt`   | `string`           | ISO 8601 datetime                                   |

---

## Role Definitions

```
WorkspaceRole = 'owner' | 'admin' | 'member'
```

| Role     | Rename workspace | Delete workspace | Invite member | Remove member | View members |
| -------- | :--------------: | :--------------: | :-----------: | :-----------: | :----------: |
| `owner`  |        ✅        |        ✅        |      ✅       |      ✅       |      ✅      |
| `admin`  |        ✅        |        ❌        |      ✅       |     ✅\*      |      ✅      |
| `member` |        ❌        |        ❌        |      ❌       |      ❌       |      ✅      |

\*Admins cannot remove the owner.

---

## Form Schemas (`lib/workspaces/schemas.ts`)

### CreateWorkspaceSchema

```ts
z.object({
	name: z
		.string()
		.min(1, 'Workspace name is required')
		.max(100, 'Workspace name must be 100 characters or fewer')
		.trim(),
});
```

### RenameWorkspaceSchema

Same shape as `CreateWorkspaceSchema`.

### InviteMemberSchema

```ts
z.object({
	email: z.string().email('Enter a valid email address'),
	role: z.enum(['admin', 'member']).default('member'),
});
```

---

## State Transitions

### Invitation Status

```
pending → accepted  (invitee accepts)
pending → revoked   (owner/admin revokes)
pending → expired   (past expiresAt)
accepted → (terminal)
revoked  → (terminal)
expired  → (terminal)
```

### Workspace Lifecycle

```
[created]  →  [active]  →  [deleted]
               ↕ rename
               ↕ member invite/remove
```

---

## API ↔ Component Data Flow

```
listWorkspaces()
  → WorkspaceWithRole[]
  → WorkspaceListView (holds array in state)
    → WorkspaceCard (receives single WorkspaceWithRole)

getWorkspace(id)       +   role from WorkspaceWithRole
  → Workspace
  → WorkspaceSettingsView (receives workspace + userRole)
    → RenameWorkspaceForm
    → DeleteWorkspaceDialog

listWorkspaceMembers(id)
  → WorkspaceMember[]
  → WorkspaceMembersView (holds members in state + userRole prop)
    → MemberRow (receives single WorkspaceMember + canManage bool)
    → InviteMemberForm
    → RemoveMemberButton
```
