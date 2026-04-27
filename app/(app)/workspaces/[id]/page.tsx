import type { Metadata } from 'next';
import { WorkspaceDashboardView } from '@/components/workspaces/workspace-dashboard-view';

export const metadata: Metadata = {
	title: 'Workspace — iManager',
	robots: 'noindex',
};

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <WorkspaceDashboardView workspaceId={id} />;
}
