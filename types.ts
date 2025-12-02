export enum ApplicationStatus {
  NEW = 'NEW',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED'
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  skills: string[];
  appliedDate: string;
  aiScore?: number;
  aiSummary?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  requirements: string[];
  postedDate: string;
  active: boolean;
}

export interface DashboardMetrics {
  totalCandidates: number;
  activeJobs: number;
  interviewsScheduled: number;
  timeToHire: number;
}