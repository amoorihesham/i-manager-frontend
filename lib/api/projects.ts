import client from './client';
import type { ApiSuccess, Project, ProjectMember, Invitation, ProjectRole } from './types';

export interface CreateProjectBody {
	name: string;
	description?: string;
}

export interface UpdateProjectBody {
	name?: string;
	description?: string;
}

export interface InviteToProjectBody {
	email: string;
	role?: ProjectRole;
}

export const createProject = (workspaceId: string, body: CreateProjectBody) =>
	client.post<ApiSuccess<Project>>(`/workspaces/${workspaceId}/projects`, body).then((r) => r.data);

export const listProjects = (workspaceId: string) =>
	client.get<ApiSuccess<Project[]>>(`/workspaces/${workspaceId}/projects`).then((r) => r.data);

export const getProject = (id: string) => client.get<ApiSuccess<Project>>(`/projects/${id}`).then((r) => r.data);

export const updateProject = (id: string, body: UpdateProjectBody) =>
	client.patch<ApiSuccess<Project>>(`/projects/${id}`, body).then((r) => r.data);

export const deleteProject = (id: string) => client.delete<ApiSuccess<null>>(`/projects/${id}`).then((r) => r.data);

export const listProjectMembers = (id: string) =>
	client.get<ApiSuccess<ProjectMember[]>>(`/projects/${id}/members`).then((r) => r.data);

export const inviteToProject = (id: string, body: InviteToProjectBody) =>
	client.post<ApiSuccess<Invitation>>(`/projects/${id}/invitations`, body).then((r) => r.data);
