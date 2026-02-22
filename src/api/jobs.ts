import { api } from './client';
import type { Job } from '../types';

export interface JobsResponse {
  jobs: Job[];
}

export interface JobResponse {
  job: Job;
}

export interface CreateJobData {
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  category: string;
}

export async function getJobs(params?: {
  search?: string;
  category?: string;
  location?: string;
  type?: string;
  employerId?: string;
}): Promise<JobsResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category) query.append('category', params.category);
  if (params?.location) query.append('location', params.location);
  if (params?.type) query.append('type', params.type);
  if (params?.employerId) query.append('employerId', params.employerId);

  const queryString = query.toString();
  return api<JobsResponse>(`/jobs${queryString ? `?${queryString}` : ''}`);
}

export async function getJob(id: string): Promise<JobResponse> {
  return api<JobResponse>(`/jobs/${id}`);
}

export async function createJob(data: CreateJobData): Promise<JobResponse> {
  return api<JobResponse>('/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateJob(id: string, data: Partial<CreateJobData>): Promise<JobResponse> {
  return api<JobResponse>(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteJob(id: string): Promise<{ message: string }> {
  return api<{ message: string }>(`/jobs/${id}`, {
    method: 'DELETE',
  });
}
