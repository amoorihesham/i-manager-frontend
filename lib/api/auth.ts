import client from './client'
import type { ApiSuccess, User, AuthUser } from './types'

export interface RegisterBody {
  username: string
  email: string
  password: string
}

export interface LoginBody {
  email: string
  password: string
}

export const register = (body: RegisterBody) =>
  client.post<ApiSuccess<User>>('/auth/register', body).then((r) => r.data)

export const login = (body: LoginBody) =>
  client.post<ApiSuccess<AuthUser>>('/auth/login', body).then((r) => r.data)
