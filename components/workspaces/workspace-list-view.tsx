'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { WorkspaceCard } from './workspace-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import * as api from '@/lib/api';
import type { WorkspaceWithRole } from '@/lib/api';

export function WorkspaceListView() {
	const [workspaces, setWorkspaces] = useState<WorkspaceWithRole[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadWorkspaces = useCallback(() => {
		return api.workspaces
			.listWorkspaces()
			.then((res) => setWorkspaces(res.data))
			.catch((err) => {
				const apiErr = err as api.ApiError;
				setError(apiErr?.error?.message ?? 'Failed to load workspaces.');
			})
			.finally(() => setIsLoading(false));
	}, []);

	useEffect(() => {
		loadWorkspaces();
	}, [loadWorkspaces]);

	const handleRetry = () => {
		setIsLoading(true);
		setError(null);
		loadWorkspaces();
	};

	if (isLoading) {
		return (
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className='h-24 rounded-lg' />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div
				role='alert'
				className='rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center justify-between'>
				<span>{error}</span>
				<Button variant='ghost' size='sm' onClick={handleRetry}>
					Retry
				</Button>
			</div>
		);
	}

	if (workspaces.length === 0) {
		return (
			<div className='flex flex-col items-center gap-4 py-16 text-center'>
				<p className='text-muted-foreground text-sm'>You don&apos;t have any workspaces yet.</p>
				<Button asChild>
					<Link href='/workspaces/new'>Create workspace</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='flex justify-end'>
				<Button asChild size='sm'>
					<Link href='/workspaces/new'>New Workspace</Link>
				</Button>
			</div>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{workspaces.map((ws) => (
					<WorkspaceCard key={ws.id} workspace={ws} />
				))}
			</div>
		</div>
	);
}
