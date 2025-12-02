// NOTE: In a real environment, you would import these from firebase/app, firebase/firestore, firebase/auth
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// Placeholder configuration - You must replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "young-ats.firebaseapp.com",
  projectId: "young-ats",
  storageBucket: "young-ats.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Mocking the service for the UI demo since we don't have the real keys
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

// Mock Data Service
import { Candidate, Job, ApplicationStatus } from '../types';

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alice Young',
    email: 'alice@example.com',
    phone: '+55 11 99999-9999',
    role: 'Senior Frontend Engineer',
    status: ApplicationStatus.INTERVIEW,
    skills: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
    appliedDate: '2024-05-10',
    aiScore: 88,
    aiSummary: 'Strong match for technical requirements. Experience aligns well with senior role expectations.'
  },
  {
    id: '2',
    name: 'Roberto Silva',
    email: 'roberto@example.com',
    phone: '+55 11 88888-8888',
    role: 'Product Designer',
    status: ApplicationStatus.NEW,
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    appliedDate: '2024-05-12'
  },
  {
    id: '3',
    name: 'Carla Dias',
    email: 'carla@example.com',
    phone: '+55 21 77777-7777',
    role: 'Senior Frontend Engineer',
    status: ApplicationStatus.SCREENING,
    skills: ['Vue', 'JavaScript', 'CSS'],
    appliedDate: '2024-05-11',
    aiScore: 65,
    aiSummary: 'Good frontend basics but lacks TypeScript depth required for the Senior role.'
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (Brazil)',
    type: 'Full-time',
    description: 'We are looking for a React expert to lead our frontend initiatives.',
    requirements: ['5+ years React', 'TypeScript', 'Tailwind'],
    postedDate: '2024-05-01',
    active: true
  },
  {
    id: '2',
    title: 'Product Designer',
    department: 'Design',
    location: 'São Paulo, SP',
    type: 'Full-time',
    description: 'Create beautiful interfaces for our SaaS products.',
    requirements: ['Figma mastery', 'Design Systems', 'User Research'],
    postedDate: '2024-05-05',
    active: true
  }
];