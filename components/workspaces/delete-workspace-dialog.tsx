'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface DeleteWorkspaceDialogProps {
	workspaceId: string;
	workspaceName: string;
}

export function DeleteWorkspaceDialog({ workspaceId, workspaceName }: DeleteWorkspaceDialogProps) {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const handleDelete = async () => {
		setIsPending(true);
		try {
			const result = await api.workspaces.deleteWorkspace(workspaceId);
			toast.success(result.message);
			router.push('/workspaces');
		} catch (err) {
			const apiErr = err as api.ApiError;
			toast.error(apiErr?.error?.message ?? 'Failed to delete workspace.');
			setIsPending(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant='destructive'
					size='sm'>
					Delete workspace
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete workspace</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete &ldquo;{workspaceName}&rdquo;? This cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isPending}>
						{isPending ? 'Deleting…' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
