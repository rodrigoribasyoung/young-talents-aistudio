import React, { useState } from 'react';
import { mockJobs } from '../services/firebase';
import { Job } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { MapPin, Briefcase, Calendar, MoreVertical, Search, Plus } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    department: '',
    location: '',
    type: 'Tempo Integral',
    description: '',
    requirements: []
  });

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateJob = () => {
    if (!newJob.title || !newJob.department) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const jobToAdd: Job = {
      id: Date.now().toString(),
      title: newJob.title || 'Nova Vaga',
      department: newJob.department || 'Geral',
      location: newJob.location || 'Remoto',
      type: newJob.type as any || 'Tempo Integral',
      description: newJob.description || '',
      requirements: newJob.requirements || [],
      postedDate: new Date().toLocaleDateString('pt-BR'),
      active: true
    };

    setJobs([jobToAdd, ...jobs]);
    setIsModalOpen(false);
    setNewJob({ title: '', department: '', location: '', type: 'Tempo Integral', description: '', requirements: [] });
  };

  return (
    <div className="space-y-6">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Nova Vaga"
        footer={
            <div className="flex justify-end gap-2 w-full">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateJob}>Publicar Vaga</Button>
            </div>
        }
      >
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Título do Cargo *</label>
                <input 
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" 
                    value={newJob.title} 
                    onChange={e => setNewJob({...newJob, title: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Departamento *</label>
                    <input 
                        className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" 
                        value={newJob.department} 
                        onChange={e => setNewJob({...newJob, department: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select 
                        className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        value={newJob.type}
                        onChange={e => setNewJob({...newJob, type: e.target.value as any})}
                    >
                        <option>Tempo Integral</option>
                        <option>Meio Período</option>
                        <option>Contrato</option>
                        <option>Estágio</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Localização</label>
                <input 
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" 
                    value={newJob.location} 
                    onChange={e => setNewJob({...newJob, location: e.target.value})}
                    placeholder="Ex: São Paulo, SP ou Remoto"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea 
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" 
                    rows={3}
                    value={newJob.description} 
                    onChange={e => setNewJob({...newJob, description: e.target.value})}
                />
            </div>
        </div>
      </Modal>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vagas Ativas</h1>
        <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Criar Nova Posição
        </Button>
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