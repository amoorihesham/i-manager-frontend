'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import * as api from '@/lib/api';
import { InviteMemberSchema } from '@/lib/workspaces/schemas';
import { toast } from 'sonner';

interface InviteMemberFormProps {
	workspaceId: string;
	onInviteSent: () => void;
}

export function InviteMemberForm({ workspaceId, onInviteSent }: InviteMemberFormProps) {
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: '', role: 'member' as 'admin' | 'member' },
		validators: {
			onSubmit: InviteMemberSchema,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				const result = await api.workspaces.inviteToWorkspace(workspaceId, {
					email: value.email,
					role: value.role,
				});
				toast.success(result.message);
				form.reset();
				onInviteSent();
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
			noValidate
			className='space-y-4'>
			{serverError && (
				<p
					role='alert'
					className='rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'>
					{serverError}
				</p>
			)}

			<div className='flex gap-3 items-end'>
				<form.Field name='email'>
					{(field) => (
						<div className='flex-1 space-y-1.5'>
							<Label htmlFor={field.name}>Email address</Label>
							<Input
								id={field.name}
								name={field.name}
								type='email'
								placeholder='colleague@example.com'
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

				<form.Field name='role'>
					{(field) => (
						<div className='space-y-1.5'>
							<Label htmlFor='invite-role'>Role</Label>
							<Select
								value={field.state.value}
								onValueChange={(v) => field.handleChange(v as 'admin' | 'member')}>
								<SelectTrigger id='invite-role' className='w-32'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='member'>Member</SelectItem>
									<SelectItem value='admin'>Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</form.Field>

				<Button type='submit' size='sm' disabled={form.state.isSubmitting} className='mb-0.5'>
					{form.state.isSubmitting ? 'Inviting…' : 'Invite'}
				</Button>
			</div>
		</form>
	);
}
