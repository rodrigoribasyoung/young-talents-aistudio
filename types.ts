export enum ApplicationStatus {
  INSCRITO = 'Inscrito',
  CONSIDERADO = 'Considerado',
  ENTREVISTA_I = 'Entrevista I',
  TESTES = 'Testes realizados',
  ENTREVISTA_II = 'Entrevista II',
  SELECIONADO = 'Selecionado',
  REPROVADO = 'Reprovado'
}

export interface EmailTemplate {
  id: string;
  triggerStatus: ApplicationStatus;
  subject: string;
  body: string;
  active: boolean;
}

export interface Candidate {
  id: string;
  timestamp?: string;
  name: string;
  photoUrl?: string;
  birthDate?: string;
  age?: number;
  email: string;
  phone: string;
  city?: string;
  interestAreas?: string[]; // Pode virar string simples na edição rápida
  education?: string;
  experience?: string;
  courses?: string;
  aboutMe?: string;
  schoolingLevel?: string;
  maritalStatus?: string;
  hasDriverLicense?: boolean;
  institution?: string;
  source?: string;
  applicationType?: string;
  role: string;
  status: ApplicationStatus;
  references?: string;
  certifications?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  graduationDate?: string;
  canRelocate?: boolean;
  currentlyStudying?: boolean;
  salaryExpectation?: string;
  childrenCount?: string;
  referralName?: string;
  
  // Tracking Interno
  appliedDate: string;
  firstInterviewDate?: string;
  testData?: string;
  secondInterviewDate?: string;
  feedback?: string;
  
  // AI Fields
  skills: string[];
  aiScore?: number;
  aiSummary?: string;

  // Index signature para acesso dinâmico na validação
  [key: string]: any;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Tempo Integral' | 'Meio Período' | 'Contrato' | 'Estágio';
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