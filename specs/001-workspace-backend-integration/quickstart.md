# Developer Quickstart: Workspace Flow — Backend Integration

**Feature**: 001-workspace-backend-integration
**Branch**: `001-workspace-backend-integration`
**Date**: 2026-04-27

## Prerequisites

- Node.js 20+ and pnpm installed
- Backend API running and accessible at `NEXT_PUBLIC_API_URL`
- `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:<port>`

## 1. Install New Shadcn Components

This feature requires Shadcn components not yet in the project:

```bash
pnpm dlx shadcn@latest add alert-dialog
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add skeleton
```

## 2. Create Zod Schemas

Create `lib/workspaces/schemas.ts`:

```ts
import { z } from 'zod';

export const CreateWorkspaceSchema = z.object({
	name: z
		.string()
		.min(1, 'Workspace name is required')
		.max(100, 'Workspace name must be 100 characters or fewer')
		.trim(),
});

export const RenameWorkspaceSchema = CreateWorkspaceSchema;

export const InviteMemberSchema = z.object({
	email: z.string().email('Enter a valid email address'),
	role: z.enum(['admin', 'member']).default('member'),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type RenameWorkspaceInput = z.infer<typeof RenameWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
```

## 3. Create the (app) Route Group

```
app/
└── (app)/
    ├── layout.tsx       ← auth guard
    └── workspaces/
        ├── page.tsx
        ├── new/page.tsx
        └── [id]/
            ├── page.tsx
            ├── settings/page.tsx
            └── members/page.tsx
```

### Auth Guard Layout (`app/(app)/layout.tsx`)

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		// Replace with actual auth check when api.auth.me() is available
		// For now: if listWorkspaces() throws 401, redirect to login
		api.workspaces
			.listWorkspaces()
			.catch(() => router.push('/login'))
			.finally(() => setChecked(true));
	}, [router]);

	if (!checked) return null; // or a full-screen skeleton

	return <>{children}</>;
}
```

## 4. Implement Pages (Server Components)

Each page exports metadata and renders a single Client Component view.

**Pattern** (`app/(app)/workspaces/page.tsx`):

```tsx
import type { Metadata } from 'next';
import { WorkspaceListView } from '@/components/workspaces/workspace-list-view';

export const metadata: Metadata = {
	title: 'Workspaces — iManager',
	robots: 'noindex',
};

export default function WorkspacesPage() {
	return (
		<main className='mx-auto max-w-5xl px-6 py-10'>
			<h1 className='text-2xl font-bold tracking-tight mb-6'>Workspaces</h1>
			<WorkspaceListView />
		</main>
	);
}
```

## 5. Implement Client Component Views

Follow the existing `login-form.tsx` pattern:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as api from '@/lib/api';
import { CreateWorkspaceSchema } from '@/lib/workspaces/schemas';

export function CreateWorkspaceForm() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { name: '' },
		validators: { onSubmit: CreateWorkspaceSchema },
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				const result = await api.workspaces.createWorkspace(value);
				toast.success(result.message);
				router.push(`/workspaces/${result.data.id}`);
			} catch (err) {
				const apiErr = err as api.ApiError;
				setServerError(apiErr?.error?.message ?? 'Something went wrong.');
			}
		},
	});

	// ... render form fields following login-form.tsx field pattern
}
```

## 6. Update Login Redirect

In `components/auth/login-form.tsx`, change:

```ts
// before
router.push('/');

// after
router.push('/workspaces');
```

## 7. Run the Dev Server

```bash
pnpm dev
```

Navigate to `http://localhost:3000/workspaces` — you should be redirected to
`/login` if not authenticated, or see the workspace list if you are.

## 8. Validate Constitution Compliance

Before opening a PR, verify:

- [ ] All pages export `generateMetadata` with `robots: 'noindex'`
- [ ] No TypeScript `any` without an explanatory comment
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm build` completes without type errors
- [ ] All interactive elements are keyboard-navigable
- [ ] Shadcn AlertDialog is used for delete/remove confirmations
- [ ] Skeleton components shown during data loading (CLS prevention)
- [ ] One `<h1>` per page
