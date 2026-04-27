'use client';

import { useState } from 'react';
import { UserMinus } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import * as api from '@/lib/api';
import { toast } from 'sonner';

interface RemoveMemberButtonProps {
	workspaceId: string;
	userId: string;
	username: string;
	onRemoved: () => void;
}

export function RemoveMemberButton({ workspaceId, userId, username, onRemoved }: RemoveMemberButtonProps) {
	const [isPending, setIsPending] = useState(false);

	const handleRemove = async () => {
		setIsPending(true);
		try {
			const result = await api.workspaces.removeWorkspaceMember(workspaceId, userId);
			toast.success(result.message);
			onRemoved();
		} catch (err) {
			const apiErr = err as api.ApiError;
			toast.error(apiErr?.error?.message ?? 'Failed to remove member.');
			setIsPending(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					aria-label={`Remove ${username}`}>
					<UserMinus className='h-4 w-4' />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove member</AlertDialogTitle>
					<AlertDialogDescription>Remove {username} from this workspace?</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleRemove}
						disabled={isPending}>
						{isPending ? 'Removing…' : 'Remove'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
