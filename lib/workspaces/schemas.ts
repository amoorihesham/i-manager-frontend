import { z } from 'zod';

export const CreateWorkspaceSchema = z.object({
	name: z
		.string()
		.min(1, 'Workspace name is required')
		.max(100, 'Workspace name must be 100 characters or fewer')
		.trim(),
});

export const RenameWorkspaceSchema = z.object({
	name: z
		.string()
		.min(1, 'Workspace name is required')
		.max(100, 'Workspace name must be 100 characters or fewer')
		.trim(),
});

export const InviteMemberSchema = z.object({
	email: z.string().email('Enter a valid email address'),
	role: z.enum(['admin', 'member']),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type RenameWorkspaceInput = z.infer<typeof RenameWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
