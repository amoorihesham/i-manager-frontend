'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import * as api from '@/lib/api';
import type { WorkspaceWithRole } from '@/lib/api';

interface WorkspaceDashboardViewProps {
	workspaceId: string;
}

export function WorkspaceDashboardView({ workspaceId }: WorkspaceDashboardViewProps) {
	const [workspace, setWorkspace] = useState<WorkspaceWithRole | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		api.workspaces
			.listWorkspaces()
			.then((res) => {
				const found = res.data.find((ws) => ws.id === workspaceId);
				if (!found) {
					setError('Workspace not found.');
				} else {
					setWorkspace(found);
				}
			})
			.catch((err) => {
				const apiErr = err as api.ApiError;
				setError(apiErr?.error?.message ?? 'Failed to load workspace.');
			})
			.finally(() => setIsLoading(false));
	}, [workspaceId]);

	if (isLoading) {
		return (
			<main className='container max-w-5xl mx-auto px-6 py-8 space-y-4'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-5 w-24' />
			</main>
		);
	}

	if (error || !workspace) {
		return (
			<main className='container max-w-5xl mx-auto px-6 py-8'>
				<p role='alert' className='text-sm text-destructive'>
					{error ?? 'Workspace not found.'}
				</p>
			</main>
		);
	}

	return (
		<main className='container max-w-5xl mx-auto px-6 py-8'>
			<div className='flex items-center gap-3 mb-6'>
				<h1 className='text-2xl font-semibold'>{workspace.name}</h1>
				<Badge variant='secondary' className='capitalize'>
					{workspace.role}
				</Badge>
			</div>
			<nav className='flex gap-4'>
				<Link
					href={`/workspaces/${workspaceId}/settings`}
					className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
					Settings
				</Link>
				<Link
					href={`/workspaces/${workspaceId}/members`}
					className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
					Members
				</Link>
			</nav>
		</main>
	);
}
