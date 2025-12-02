import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Briefcase, CheckCircle, Clock } from 'lucide-react';
import { mockCandidates, mockJobs } from '../services/firebase';

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <div className="bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const data = [
    { name: 'Seg', applicants: 4 },
    { name: 'Ter', applicants: 7 },
    { name: 'Qua', applicants: 12 },
    { name: 'Qui', applicants: 8 },
    { name: 'Sex', applicants: 15 },
    { name: 'Sáb', applicants: 3 },
    { name: 'Dom', applicants: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Olá, Recrutador</h1>
          <p className="text-slate-500 dark:text-slate-400">Aqui está o que está acontecendo na Young Talents hoje.</p>
        </div>
        <button className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-brand-orange/20">
          + Criar Nova Vaga
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Candidatos" 
          value={mockCandidates.length} 
          icon={Users} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Vagas Ativas" 
          value={mockJobs.filter(j => j.active).length} 
          icon={Briefcase} 
          colorClass="bg-brand-teal" 
        />
        <StatCard 
          title="Entrevistas Agendadas" 
          value="4" 
          icon={Clock} 
          colorClass="bg-brand-orange" 
        />
        <StatCard 
          title="Contratados no Mês" 
          value="12" 
          icon={CheckCircle} 
          colorClass="bg-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold mb-4">Tendência de Inscrições</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="applicants" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#fe5009' : '#00bcbc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold mb-4">Atividade Recente</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="w-2 h-2 rounded-full bg-brand-orange mt-2" />
                <div>
                  <p className="text-sm font-medium">Nova inscrição recebida</p>
                  <p className="text-xs text-slate-500">Engenharia Frontend • 2 horas atrás</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;