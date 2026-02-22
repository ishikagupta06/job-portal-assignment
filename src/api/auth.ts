import { api } from './client';
import type { User } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface MeResponse {
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role: 'employer' | 'jobseeker';
  company?: string;
}): Promise<RegisterResponse> {
  return api<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<MeResponse> {
  return api<MeResponse>('/auth/me');
}

export function logout(): void {
  localStorage.removeItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}
