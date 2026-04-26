import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
	title: 'Sign In — iManager',
};

export default function LoginPage() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign in</CardTitle>
				<CardDescription>Enter your credentials to access your account</CardDescription>
			</CardHeader>
			<CardContent>
				<LoginForm />
				<p className='mt-6 text-center text-sm text-muted-foreground'>
					Don&apos;t have an account?{' '}
					<Link
						href='/register'
						className='text-primary hover:underline'>
						Sign up
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}
