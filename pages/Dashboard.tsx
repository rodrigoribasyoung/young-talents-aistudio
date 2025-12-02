import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Users, Briefcase, CheckCircle, Clock } from 'lucide-react';
import { mockCandidates, mockJobs } from '../services/firebase';
import { ApplicationStatus } from '../types';

const StatCard = ({ title, value, icon: Icon, colorClass, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md hover:border-brand-teal/50 transition-all group"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-brand-orange transition-colors">{title}</p>
        <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${colorClass} group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  // Dados do Funil (Agrupado por Status)
  const funnelData = [
    { name: 'Inscrito', count: mockCandidates.filter(c => c.status === ApplicationStatus.INSCRITO).length },
    { name: 'Considerado', count: mockCandidates.filter(c => c.status === ApplicationStatus.CONSIDERADO).length },
    { name: 'Entrevista I', count: mockCandidates.filter(c => c.status === ApplicationStatus.ENTREVISTA_I).length },
    { name: 'Testes', count: mockCandidates.filter(c => c.status === ApplicationStatus.TESTES).length },
    { name: 'Entrevista II', count: mockCandidates.filter(c => c.status === ApplicationStatus.ENTREVISTA_II).length },
    { name: 'Selecionado', count: mockCandidates.filter(c => c.status === ApplicationStatus.SELECIONADO).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Olá, Recrutador</h1>
          <p className="text-slate-500 dark:text-slate-400">Visão geral do pipeline da Young Talents.</p>
        </div>
        <button 
          onClick={() => navigate('/jobs')} 
          className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-brand-orange/20"
        >
          + Gerenciar Vagas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Candidatos" 
          value={mockCandidates.length} 
          icon={Users} 
          colorClass="bg-blue-500"
          onClick={() => navigate('/candidates')}
        />
        <StatCard 
          title="Vagas Ativas" 
          value={mockJobs.filter(j => j.active).length} 
          icon={Briefcase} 
          colorClass="bg-brand-teal"
          onClick={() => navigate('/jobs')}
        />
        <StatCard 
          title="Em Entrevista" 
          value={mockCandidates.filter(c => c.status.includes('Entrevista')).length} 
          icon={Clock} 
          colorClass="bg-brand-orange"
          onClick={() => navigate('/candidates')}
        />
        <StatCard 
          title="Selecionados" 
          value={mockCandidates.filter(c => c.status === ApplicationStatus.SELECIONADO).length} 
          icon={CheckCircle} 
          colorClass="bg-green-500"
          onClick={() => navigate('/candidates')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold mb-4">Funil de Contratação</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === funnelData.length - 1 ? '#22c55e' : '#fe5009'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold mb-4">Ações Recentes</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
               <div className="w-2 h-2 rounded-full bg-brand-teal mt-2" />
               <div>
                  <p className="text-sm font-medium dark:text-slate-200">Novo Candidato Importado</p>
                  <p className="text-xs text-slate-500">Via Importação CSV • 10 min atrás</p>
               </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
               <div className="w-2 h-2 rounded-full bg-brand-orange mt-2" />
               <div>
                  <p className="text-sm font-medium dark:text-slate-200">Alice Young avançou</p>
                  <p className="text-xs text-slate-500">Para Entrevista II • 2 horas atrás</p>
               </div>
            </div>
            <div className="flex items-start gap-3">
               <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
               <div>
                  <p className="text-sm font-medium dark:text-slate-200">Nova Vaga Criada</p>
                  <p className="text-xs text-slate-500">Designer UI/UX • Ontem</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;