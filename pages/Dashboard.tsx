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
    { name: 'Mon', applicants: 4 },
    { name: 'Tue', applicants: 7 },
    { name: 'Wed', applicants: 12 },
    { name: 'Thu', applicants: 8 },
    { name: 'Fri', applicants: 15 },
    { name: 'Sat', applicants: 3 },
    { name: 'Sun', applicants: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Recruiter</h1>
          <p className="text-slate-500 dark:text-slate-400">Here is what's happening at Young Empreendimentos today.</p>
        </div>
        <button className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-brand-orange/20">
          + Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Candidates" 
          value={mockCandidates.length} 
          icon={Users} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Active Jobs" 
          value={mockJobs.filter(j => j.active).length} 
          icon={Briefcase} 
          colorClass="bg-brand-teal" 
        />
        <StatCard 
          title="Interviews" 
          value="4" 
          icon={Clock} 
          colorClass="bg-brand-orange" 
        />
        <StatCard 
          title="Hired this Month" 
          value="12" 
          icon={CheckCircle} 
          colorClass="bg-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold mb-4">Application Trends</h2>
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
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="w-2 h-2 rounded-full bg-brand-orange mt-2" />
                <div>
                  <p className="text-sm font-medium">New application received</p>
                  <p className="text-xs text-slate-500">Frontend Dev • 2 hours ago</p>
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