import type { Metadata } from 'next';
import { WorkspaceSettingsView } from '@/components/workspaces/workspace-settings-view';

export const metadata: Metadata = {
	title: 'Workspace Settings — iManager',
	robots: 'noindex',
};

export default async function WorkspaceSettingsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <WorkspaceSettingsView workspaceId={id} />;
}
