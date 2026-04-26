import client from './client'
import type { ApiSuccess, Invitation, InvitationPreview } from './types'

export const previewInvitation = (token: string) =>
  client
    .get<ApiSuccess<InvitationPreview>>(`/invitations/${token}`)
    .then((r) => r.data)

export const acceptInvitation = (token: string) =>
  client
    .post<ApiSuccess<Invitation>>(`/invitations/${token}/accept`)
    .then((r) => r.data)

export const revokeInvitation = (id: string) =>
  client
    .post<ApiSuccess<null>>(`/invitations/${id}/revoke`)
    .then((r) => r.data)
