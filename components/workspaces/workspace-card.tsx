'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { WorkspaceWithRole } from '@/lib/api';

interface WorkspaceCardProps {
	workspace: WorkspaceWithRole;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
	return (
		<div className='rounded-lg border p-4 flex flex-col gap-3'>
			<div className='flex items-start justify-between gap-2'>
				<h2 className='font-medium text-sm'>{workspace.name}</h2>
				<Badge variant='secondary' className='capitalize text-xs'>
					{workspace.role}
				</Badge>
			</div>
			<Link
				href={`/workspaces/${workspace.id}`}
				className='text-sm text-primary hover:underline self-start'>
				Open
			</Link>
		</div>
	);
}
