import type { Metadata } from 'next';
import { WorkspaceListView } from '@/components/workspaces/workspace-list-view';

export const metadata: Metadata = {
	title: 'Workspaces — iManager',
	robots: 'noindex',
};

export default function WorkspacesPage() {
	return (
		<main className='container max-w-5xl mx-auto px-6 py-8'>
			<h1 className='text-2xl font-semibold mb-6'>Workspaces</h1>
			<WorkspaceListView />
		</main>
	);
}
