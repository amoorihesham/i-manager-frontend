'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as api from '@/lib/api';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		api.workspaces.listWorkspaces().catch(() => {
			router.push('/login');
		}).finally(() => {
			setIsChecking(false);
		});
	}, [router]);

	if (isChecking) {
		return null;
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<header className='border-b px-6 py-3 flex items-center gap-6'>
				<span className='font-semibold text-sm tracking-tight'>iManager</span>
				<nav>
					<Link href='/workspaces' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
						Workspaces
					</Link>
				</nav>
			</header>
			<main className='flex-1'>{children}</main>
		</div>
	);
}
