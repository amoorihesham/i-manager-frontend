'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { RenameWorkspaceForm } from './rename-workspace-form';
import { DeleteWorkspaceDialog } from './delete-workspace-dialog';
import * as api from '@/lib/api';
import type { WorkspaceRole } from '@/lib/api';

interface WorkspaceSettingsViewProps {
	workspaceId: string;
}

export function WorkspaceSettingsView({ workspaceId }: WorkspaceSettingsViewProps) {
	const [workspaceName, setWorkspaceName] = useState<string | null>(null);
	const [userRole, setUserRole] = useState<WorkspaceRole | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		Promise.all([
			api.workspaces.getWorkspace(workspaceId),
			api.workspaces.listWorkspaces(),
		])
			.then(([wsRes, listRes]) => {
				setWorkspaceName(wsRes.data.name);
				const membership = listRes.data.find((ws) => ws.id === workspaceId);
				setUserRole(membership?.role ?? null);
			})
			.catch((err) => {
				const apiErr = err as api.ApiError;
				setError(apiErr?.error?.message ?? 'Failed to load workspace settings.');
			})
			.finally(() => setIsLoading(false));
	}, [workspaceId]);

	if (isLoading) {
		return (
			<main className='container max-w-2xl mx-auto px-6 py-8 space-y-4'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-5 w-32' />
				<Skeleton className='h-10 w-full' />
			</main>
		);
	}

	if (error || !workspaceName) {
		return (
			<main className='container max-w-2xl mx-auto px-6 py-8'>
				<p role='alert' className='text-sm text-destructive'>
					{error ?? 'Workspace not found.'}
				</p>
			</main>
		);
	}

	return (
		<main className='container max-w-2xl mx-auto px-6 py-8'>
			<div className='flex items-center gap-4 mb-6'>
				<Link
					href={`/workspaces/${workspaceId}`}
					className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
					← Back
				</Link>
			</div>
			<h1 className='text-2xl font-semibold mb-6'>{workspaceName}</h1>

			{(userRole === 'owner' || userRole === 'admin') && (
				<section className='space-y-4 mb-8'>
					<h2 className='text-base font-medium'>Rename workspace</h2>
					<RenameWorkspaceForm
						workspaceId={workspaceId}
						currentName={workspaceName}
						onSuccess={(newName) => setWorkspaceName(newName)}
					/>
				</section>
			)}

			{userRole === 'owner' && (
				<>
					<Separator className='my-6' />
					<section className='space-y-3'>
						<h2 className='text-base font-medium text-destructive'>Danger zone</h2>
						<p className='text-sm text-muted-foreground'>
							Once deleted, this workspace and all its data will be permanently removed.
						</p>
						<DeleteWorkspaceDialog workspaceId={workspaceId} workspaceName={workspaceName} />
					</section>
				</>
			)}
		</main>
	);
}
