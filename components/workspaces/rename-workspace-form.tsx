'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as api from '@/lib/api';
import { RenameWorkspaceSchema } from '@/lib/workspaces/schemas';
import { toast } from 'sonner';

interface RenameWorkspaceFormProps {
	workspaceId: string;
	currentName: string;
	onSuccess: (newName: string) => void;
}

export function RenameWorkspaceForm({ workspaceId, currentName, onSuccess }: RenameWorkspaceFormProps) {
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { name: currentName },
		validators: {
			onSubmit: RenameWorkspaceSchema,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				const result = await api.workspaces.updateWorkspace(workspaceId, { name: value.name });
				toast.success(result.message);
				onSuccess(value.name);
			} catch (err) {
				const apiErr = err as api.ApiError;
				setServerError(apiErr?.error?.message ?? 'Something went wrong. Please try again.');
			}
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			noValidate>
			{serverError && (
				<p
					role='alert'
					className='mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'>
					{serverError}
				</p>
			)}

			<div className='space-y-4'>
				<form.Field name='name'>
					{(field) => (
						<div className='space-y-1.5'>
							<Label htmlFor={field.name}>Workspace name</Label>
							<Input
								id={field.name}
								name={field.name}
								type='text'
								aria-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
								aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
							{field.state.meta.errors && field.state.meta.errors.length > 0 && (
								<p
									id={`${field.name}-error`}
									className='text-xs text-destructive'>
									{field.state.meta.errors[0]?.message}
								</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<Button
				type='submit'
				size='sm'
				className='mt-4'
				disabled={form.state.isSubmitting}>
				{form.state.isSubmitting ? 'Saving…' : 'Save'}
			</Button>
		</form>
	);
}
