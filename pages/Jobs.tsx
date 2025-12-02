import React, { useState } from 'react';
import { mockJobs } from '../services/firebase';
import { Button } from '../components/ui/Button';
import { MapPin, Briefcase, Calendar, MoreVertical, Search } from 'lucide-react';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = mockJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vagas Ativas</h1>
        <Button>+ Criar Nova Posição</Button>
      </div>

      <div className="relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
         <input 
            type="text" 
            placeholder="Buscar vaga por título ou departamento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-surface text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-teal/50 transition-colors group relative">
            <div className="absolute top-4 right-4">
               <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                 <MoreVertical className="w-5 h-5" />
               </button>
            </div>
            
            <div className="mb-4">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-brand-teal/10 text-brand-teal rounded mb-2">
                {job.department}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{job.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {job.location}</span>
                <span className="flex items-center"><Briefcase className="w-3 h-3 mr-1" /> {job.type}</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {job.requirements.slice(0, 3).map((req, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-700">
                  {req}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> Publicado em {job.postedDate}
              </span>
              <Button size="sm" variant="outline" className="group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange">
                Ver Detalhes
              </Button>
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
            <p className="text-slate-500 col-span-full text-center py-10">Nenhuma vaga encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default Jobs;