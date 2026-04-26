'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as api from '@/lib/api';
import { LoginSchema } from '@/lib/auth/schemas';
import { toast } from 'sonner';

export function LoginForm() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: '', password: '' },
		validators: {
			onSubmit: LoginSchema,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				const { message } = await api.auth.login(value);
				toast.success(message);
				router.push('/');
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
				<form.Field name='email'>
					{(field) => (
						<div className='space-y-1.5'>
							<Label htmlFor={field.name}>Email</Label>
							<Input
								id={field.name}
								name={field.name}
								type='email'
								autoComplete='email'
								placeholder='you@example.com'
								aria-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
							{field.state.meta.errors &&
								field.state.meta.errors.map((e) => (
									<p
										className='text-xs text-destructive'
										key={e?.message}>
										{e?.message}
									</p>
								))}
						</div>
					)}
				</form.Field>

				<form.Field name='password'>
					{(field) => (
						<div className='space-y-1.5'>
							<Label htmlFor={field.name}>Password</Label>
							<Input
								id={field.name}
								name={field.name}
								type='password'
								autoComplete='current-password'
								placeholder='••••••••'
								aria-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
							{field.state.meta.errors &&
								field.state.meta.errors.map((e) => (
									<p
										className='text-xs text-destructive'
										key={e?.message}>
										{e?.message}
									</p>
								))}
						</div>
					)}
				</form.Field>
			</div>

			<Button
				type='submit'
				size='lg'
				className='mt-6 w-full'
				disabled={form.state.isSubmitting}>
				{form.state.isSubmitting ? 'Signing in…' : 'Sign in'}
			</Button>
		</form>
	);
}
