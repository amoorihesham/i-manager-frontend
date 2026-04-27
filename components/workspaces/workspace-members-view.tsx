'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { InviteMemberForm } from './invite-member-form';
import { RemoveMemberButton } from './remove-member-button';
import * as api from '@/lib/api';
import type { WorkspaceMember, WorkspaceRole } from '@/lib/api';

interface WorkspaceMembersViewProps {
	workspaceId: string;
}

export function WorkspaceMembersView({ workspaceId }: WorkspaceMembersViewProps) {
	const [members, setMembers] = useState<WorkspaceMember[]>([]);
	const [userRole, setUserRole] = useState<WorkspaceRole | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadMembers = useCallback(() => {
		return api.workspaces
			.listWorkspaceMembers(workspaceId)
			.then((res) => setMembers(res.data))
			.catch((err) => {
				const apiErr = err as api.ApiError;
				setError(apiErr?.error?.message ?? 'Failed to load members.');
			});
	}, [workspaceId]);

	useEffect(() => {
		Promise.all([api.workspaces.listWorkspaces(), api.workspaces.listWorkspaceMembers(workspaceId)])
			.then(([listRes, membersRes]) => {
				const ws = listRes.data.find((w) => w.id === workspaceId);
				setUserRole(ws?.role ?? null);
				if (ws?.role === 'owner') {
					setCurrentUserId(ws.ownerId);
				}
				setMembers(membersRes.data);
			})
			.catch((err) => {
				const apiErr = err as api.ApiError;
				setError(apiErr?.error?.message ?? 'Failed to load members.');
			})
			.finally(() => setIsLoading(false));
	}, [workspaceId]);

	const handleMemberChange = () => {
		loadMembers();
	};

	if (isLoading) {
		return (
			<main className='container max-w-3xl mx-auto px-6 py-8 space-y-4'>
				<Skeleton className='h-8 w-32' />
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton
						key={i}
						className='h-12 rounded-lg'
					/>
				))}
			</main>
		);
	}

	if (error) {
		return (
			<main className='container max-w-3xl mx-auto px-6 py-8'>
				<p
					role='alert'
					className='text-sm text-destructive'>
					{error}
				</p>
			</main>
		);
	}

	return (
		<main className='container max-w-3xl mx-auto px-6 py-8'>
			<div className='flex items-center gap-4 mb-6'>
				<Link
					href={`/workspaces/${workspaceId}`}
					className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
					← Back
				</Link>
			</div>
			<h1 className='text-2xl font-semibold mb-6'>Members</h1>

			{(userRole === 'owner' || userRole === 'admin') && (
				<>
					<section className='mb-6'>
						<InviteMemberForm
							workspaceId={workspaceId}
							onInviteSent={handleMemberChange}
						/>
					</section>
					<Separator className='mb-6' />
				</>
			)}

			<ul className='space-y-2'>
				{members.map((member) => {
					const isSelf = currentUserId !== null && member.userId === currentUserId;
					const isOwnerRow = member.role === 'owner';
					const canRemove =
						!isSelf && (userRole === 'owner' || userRole === 'admin') && !(isOwnerRow && userRole !== 'owner');

					return (
						<li
							key={member.userId}
							className='flex items-center justify-between rounded-lg border px-4 py-3'>
							<div className='flex flex-col gap-0.5'>
								<div className='flex items-center gap-2'>
									<span className='text-sm font-medium'>{member.username}</span>
									<Badge
										variant='secondary'
										className='capitalize text-xs'>
										{member.role}
									</Badge>
								</div>
								<span className='text-xs text-muted-foreground'>{member.email}</span>
								<span className='text-xs text-muted-foreground'>
									Joined {new Date(member.joinedAt).toLocaleDateString()}
								</span>
							</div>
							{canRemove && (
								<RemoveMemberButton
									workspaceId={workspaceId}
									userId={member.userId}
									username={member.username}
									onRemoved={handleMemberChange}
								/>
							)}
						</li>
					);
				})}
			</ul>
		</main>
	);
}
