import client from './client'
import type {
  ApiSuccess,
  Workspace,
  WorkspaceWithRole,
  WorkspaceMember,
  Invitation,
  ProjectRole,
} from './types'

export interface CreateWorkspaceBody {
  name: string
}

export interface UpdateWorkspaceBody {
  name: string
}

export interface InviteToWorkspaceBody {
  email: string
  role?: ProjectRole
}

export const createWorkspace = (body: CreateWorkspaceBody) =>
  client
    .post<ApiSuccess<Workspace>>('/workspaces', body)
    .then((r) => r.data)

export const listWorkspaces = () =>
  client
    .get<ApiSuccess<WorkspaceWithRole[]>>('/workspaces')
    .then((r) => r.data)

export const getWorkspace = (id: string) =>
  client
    .get<ApiSuccess<Workspace>>(`/workspaces/${id}`)
    .then((r) => r.data)

export const updateWorkspace = (id: string, body: UpdateWorkspaceBody) =>
  client
    .patch<ApiSuccess<Workspace>>(`/workspaces/${id}`, body)
    .then((r) => r.data)

export const deleteWorkspace = (id: string) =>
  client
    .delete<ApiSuccess<null>>(`/workspaces/${id}`)
    .then((r) => r.data)

export const listWorkspaceMembers = (id: string) =>
  client
    .get<ApiSuccess<WorkspaceMember[]>>(`/workspaces/${id}/members`)
    .then((r) => r.data)

export const removeWorkspaceMember = (id: string, userId: string) =>
  client
    .delete<ApiSuccess<null>>(`/workspaces/${id}/members/${userId}`)
    .then((r) => r.data)

export const inviteToWorkspace = (id: string, body: InviteToWorkspaceBody) =>
  client
    .post<ApiSuccess<Invitation>>(`/workspaces/${id}/invitations`, body)
    .then((r) => r.data)
