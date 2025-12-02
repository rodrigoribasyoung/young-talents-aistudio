export enum ApplicationStatus {
  INSCRITO = 'Inscrito',
  CONSIDERADO = 'Considerado',
  ENTREVISTA_I = 'Entrevista I',
  TESTES = 'Testes realizados',
  ENTREVISTA_II = 'Entrevista II',
  SELECIONADO = 'Selecionado',
  REPROVADO = 'Reprovado' // Manter para controle interno
}

export interface EmailTemplate {
  id: string;
  triggerStatus: ApplicationStatus;
  subject: string;
  body: string;
  active: boolean;
}

export interface Candidate {
  id: string; // ID
  timestamp?: string; // Carimbo de data/hora
  name: string; // Nome completo
  photoUrl?: string; // Nos envie uma foto atual...
  birthDate?: string; // Data de Nascimento
  age?: number; // Idade
  email: string; // E-mail principal
  phone: string; // Nº telefone celular / Whatsapp
  city?: string; // Cidade onde reside
  interestAreas?: string[]; // Áreas de interesse profissional
  education?: string; // Formação
  experience?: string; // Experiências anteriores
  courses?: string; // Cursos e certificações profissionais
  aboutMe?: string; // Campo Livre, SEJA VOCÊ!
  schoolingLevel?: string; // Nível de escolaridade
  maritalStatus?: string; // Estado civil
  hasDriverLicense?: boolean; // Você possui CNH tipo B?
  institution?: string; // Instituição de ensino
  source?: string; // Onde você nos encontrou?
  applicationType?: string; // Vaga específica ou banco de talentos?
  role: string; // Mapeado de applicationType ou input manual
  status: ApplicationStatus; // Etapa_Funil
  references?: string; // Referências profissionais
  certifications?: string; // Certificações profissionais
  resumeUrl?: string; // Anexar currículo
  portfolioUrl?: string; // Portfólio de trabalho
  graduationDate?: string; // Data de formatura
  canRelocate?: boolean; // Teria disponibilidade para mudança de cidade?
  currentlyStudying?: boolean; // Em caso de curso superior, está cursando...?
  salaryExpectation?: string; // Qual seria sua expectativa salarial?
  childrenCount?: string; // Se tem filhos, quantos?
  referralName?: string; // Você foi indicado por algum colaborador...?
  
  // Internal Tracking
  appliedDate: string;
  firstInterviewDate?: string; // Data Primeira Entrevista
  testData?: string; // Dados dos testes
  secondInterviewDate?: string; // Data Segunda Entrevista
  feedback?: string; // Feedback
  
  // AI Fields
  skills: string[]; // Derivado de courses/experience
  aiScore?: number;
  aiSummary?: string;
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