// NOTE: Em produção, usar firebase/app, firebase/firestore, firebase/auth
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

import { Candidate, Job, ApplicationStatus, EmailTemplate } from '../types';

// Mock Data Service
export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alice Young',
    email: 'alice@example.com',
    phone: '+55 11 99999-9999',
    role: 'Engenheiro Frontend Senior',
    status: ApplicationStatus.ENTREVISTA_I,
    skills: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
    appliedDate: '2024-05-10',
    city: 'São Paulo',
    salaryExpectation: 'R$ 15.000,00',
    experience: '5 anos no Google',
    aiScore: 88,
    aiSummary: 'Forte correspondência técnica. Experiência alinhada com expectativas sênior.'
  },
  {
    id: '2',
    name: 'Roberto Silva',
    email: 'roberto@example.com',
    phone: '+55 11 88888-8888',
    role: 'Product Designer',
    status: ApplicationStatus.INSCRITO,
    skills: ['Figma', 'UI/UX', 'Prototypagem'],
    city: 'Rio de Janeiro',
    salaryExpectation: 'R$ 8.000,00',
    appliedDate: '2024-05-12'
  },
  {
    id: '3',
    name: 'Carla Dias',
    email: 'carla@example.com',
    phone: '+55 21 77777-7777',
    role: 'Engenheiro Frontend Senior',
    status: ApplicationStatus.CONSIDERADO,
    skills: ['Vue', 'JavaScript', 'CSS'],
    city: 'Curitiba',
    salaryExpectation: 'R$ 12.000,00',
    appliedDate: '2024-05-11',
    aiScore: 65,
    aiSummary: 'Bons fundamentos de frontend, mas falta profundidade em TypeScript exigida para a vaga Senior.'
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Engenheiro Frontend Senior',
    department: 'Engenharia',
    location: 'Remoto (Brasil)',
    type: 'Tempo Integral',
    description: 'Procuramos um especialista em React para liderar nossas iniciativas de frontend.',
    requirements: ['5+ anos React', 'TypeScript', 'Tailwind'],
    postedDate: '2024-05-01',
    active: true
  },
  {
    id: '2',
    title: 'Product Designer',
    department: 'Design',
    location: 'São Paulo, SP',
    type: 'Tempo Integral',
    description: 'Crie interfaces bonitas para nossos produtos SaaS.',
    requirements: ['Domínio do Figma', 'Design Systems', 'Pesquisa de Usuário'],
    postedDate: '2024-05-05',
    active: true
  }
];

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    triggerStatus: ApplicationStatus.CONSIDERADO,
    subject: 'Sua aplicação na Young Talents - Próximos Passos',
    body: 'Olá {nome},\n\nFicamos felizes em informar que seu perfil avançou para a etapa de triagem. Em breve entraremos em contato.',
    active: true
  },
  {
    id: '2',
    triggerStatus: ApplicationStatus.REPROVADO,
    subject: 'Atualização sobre sua candidatura - Young Talents',
    body: 'Olá {nome},\n\nAgradecemos seu interesse. Neste momento, optamos por seguir com outros candidatos mais alinhados ao perfil da vaga.',
    active: true
  }
];

// Utilitário simples para parsear CSV (Simulação)
export const parseCSVToCandidates = (csvText: string): Candidate[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  
  const newCandidates: Candidate[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Lógica básica de split (não lida com vírgulas dentro de aspas perfeitamente, para prod usar lib 'papaparse')
    const values = lines[i].split(','); 
    
    if (values.length < 3) continue;

    // Mapeamento simplificado baseado nas colunas solicitadas
    // Assumindo ordem aproximada ou mapeamento direto para demonstração
    const candidate: Candidate = {
      id: `imported-${Date.now()}-${i}`,
      timestamp: values[0] || new Date().toISOString(),
      name: values[2] || 'Sem Nome',
      email: values[6] || 'sem-email@exemplo.com',
      phone: values[7] || '',
      city: values[8] || '',
      role: values[9] || 'Banco de Talentos', // Áreas de interesse
      skills: [values[10], values[12]].filter(Boolean) as string[], // Formação + Cursos como skills
      status: ApplicationStatus.INSCRITO,
      appliedDate: new Date().toISOString().split('T')[0],
      source: 'Importação CSV'
    };
    newCandidates.push(candidate);
  }
  return newCandidates;
};