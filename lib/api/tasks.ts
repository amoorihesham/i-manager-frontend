import client from './client';
import type { ApiSuccess, Task, TaskStatus } from './types';

export interface CreateTaskBody {
	title: string;
	description?: string;
	status?: TaskStatus;
	assigneeId?: string;
}

export interface UpdateTaskBody {
	title?: string;
	description?: string;
	status?: TaskStatus;
	assigneeId?: string | null;
}

export const createTask = (projectId: string, body: CreateTaskBody) =>
	client.post<ApiSuccess<Task>>(`/projects/${projectId}/tasks`, body).then((r) => r.data);

export const listTasks = (projectId: string) =>
	client.get<ApiSuccess<Task[]>>(`/projects/${projectId}/tasks`).then((r) => r.data);

export const getTask = (id: string) => client.get<ApiSuccess<Task>>(`/tasks/${id}`).then((r) => r.data);

export const updateTask = (id: string, body: UpdateTaskBody) =>
	client.patch<ApiSuccess<Task>>(`/tasks/${id}`, body).then((r) => r.data);

export const deleteTask = (id: string) => client.delete<ApiSuccess<null>>(`/tasks/${id}`).then((r) => r.data);
