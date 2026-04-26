// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin';
export type WorkspaceRole = 'owner' | 'admin' | 'member';
export type ProjectRole = 'admin' | 'member';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type SubscriptionTier = 'free' | 'pro' | 'ultra';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled';
export type InvitationScope = 'workspace' | 'project';
export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface User {
	id: string;
	username: string;
	email: string;
	role: UserRole;
	createdAt: string;
	updatedAt: string;
}

export interface AuthUser extends User {
	accessToken: string;
	refreshToken: string;
}

export interface Subscription {
	tier: SubscriptionTier;
	status: SubscriptionStatus;
}

export interface Workspace {
	id: string;
	name: string;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
}

export interface WorkspaceWithRole extends Workspace {
	role: WorkspaceRole;
}

export interface WorkspaceMember {
	userId: string;
	role: WorkspaceRole;
	joinedAt: string;
	username: string;
	email: string;
}

export interface Project {
	id: string;
	workspaceId: string;
	name: string;
	description: string | null;
	createdById: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProjectMember {
	userId: string;
	role: ProjectRole;
	joinedAt: string;
	username: string;
	email: string;
}

export interface Task {
	id: string;
	projectId: string;
	title: string;
	description: string | null;
	status: TaskStatus;
	assigneeId: string | null;
	createdById: string;
	createdAt: string;
	updatedAt: string;
}

export interface Invitation {
	id: string;
	token: string;
	email: string;
	scope: InvitationScope;
	workspaceId: string | null;
	projectId: string | null;
	role: string;
	invitedById: string;
	status: InvitationStatus;
	expiresAt: string;
	acceptedAt: string | null;
	createdAt: string;
}

export interface InvitationPreview {
	scope: InvitationScope;
	role: string;
	resourceName: string;
	inviterUsername: string | null;
	email: string;
	status: InvitationStatus;
	expiresAt: string;
}

// ─── Response Wrappers ────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
	success: true;
	message: string;
	data: T;
}

export interface ApiError {
	success: false;
	error: {
		code: string;
		message: string;
	};
	upgradeUrl?: string;
}
