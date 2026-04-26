import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
	title: 'Create Account — iManager',
};

export default function RegisterPage() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>Fill in the details below to get started</CardDescription>
			</CardHeader>
			<CardContent>
				<RegisterForm />
				<p className='mt-6 text-center text-sm text-muted-foreground'>
					Already have an account?{' '}
					<Link
						href='/login'
						className='text-primary hover:underline'>
						Sign in
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}
