import type { Metadata } from 'next';
import { WorkspaceMembersView } from '@/components/workspaces/workspace-members-view';

export const metadata: Metadata = {
	title: 'Workspace Members — iManager',
	robots: 'noindex',
};

export default async function WorkspaceMembersPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <WorkspaceMembersView workspaceId={id} />;
}
