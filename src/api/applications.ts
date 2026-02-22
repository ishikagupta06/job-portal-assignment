import { api } from './client';
import type { Application } from '../types';

export interface ApplicationsResponse {
  applications: (Application & {
    job?: { id: string; title: string; company: string };
    applicant?: { id: string; name: string; email: string };
  })[];
}

export interface ApplicationResponse {
  application: Application & {
    job?: { id: string; title: string; company: string };
  };
}

export interface CreateApplicationData {
  jobId: string;
  coverLetter?: string;
  resume?: string;
}

export async function getApplications(params?: {
  jobId?: string;
  userId?: string;
}): Promise<ApplicationsResponse> {
  const query = new URLSearchParams();
  if (params?.jobId) query.append('jobId', params.jobId);
  if (params?.userId) query.append('userId', params.userId);

  const queryString = query.toString();
  return api<ApplicationsResponse>(`/applications${queryString ? `?${queryString}` : ''}`);
}

export async function createApplication(data: CreateApplicationData): Promise<ApplicationResponse> {
  return api<ApplicationResponse>('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted'
): Promise<ApplicationResponse> {
  return api<ApplicationResponse>(`/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
