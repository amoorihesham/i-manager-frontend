import type { Metadata } from 'next';
import Link from 'next/link';
import { CreateWorkspaceForm } from '@/components/workspaces/create-workspace-form';

export const metadata: Metadata = {
	title: 'New Workspace — iManager',
	robots: 'noindex',
};

export default function NewWorkspacePage() {
	return (
		<main className='container max-w-md mx-auto px-6 py-8'>
			<h1 className='text-2xl font-semibold mb-6'>New Workspace</h1>
			<CreateWorkspaceForm />
			<div className='mt-4 text-center'>
				<Link
					href='/workspaces'
					className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
					Cancel
				</Link>
			</div>
		</main>
	);
}
