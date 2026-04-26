import { AuthBrandPanel } from '@/components/auth/auth-brand-panel';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='grid min-h-screen lg:grid-cols-2'>
			<div className='hidden lg:flex'>
				<AuthBrandPanel />
			</div>
			<div className='flex items-center justify-center p-6 lg:p-12'>
				<div className='w-full max-w-sm'>{children}</div>
			</div>
		</div>
	);
}
