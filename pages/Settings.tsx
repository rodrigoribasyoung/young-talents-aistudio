import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { mockEmailTemplates } from '../services/firebase';
import { ApplicationStatus } from '../types';
import { Mail, Save, Plus } from 'lucide-react';

const Settings = () => {
  const [templates, setTemplates] = useState(mockEmailTemplates);
  const [activeTab, setActiveTab] = useState('email');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações</h1>

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'email' ? 'border-b-2 border-brand-orange text-brand-orange' : 'text-slate-500'}`}
            onClick={() => setActiveTab('email')}
        >
            Automação de E-mail
        </button>
        <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'general' ? 'border-b-2 border-brand-orange text-brand-orange' : 'text-slate-500'}`}
            onClick={() => setActiveTab('general')}
        >
            Geral
        </button>
      </div>

      {activeTab === 'email' && (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold">Templates de E-mail do Funil</h2>
                    <p className="text-sm text-slate-500">Configure e-mails automáticos enviados quando um candidato muda de fase.</p>
                </div>
                <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Novo Template</Button>
            </div>

            <div className="grid gap-6">
                {templates.map(template => (
                    <div key={template.id} className="bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-700`}>
                                    Quando move para:
                                </span>
                                <span className="text-brand-orange font-medium">{template.triggerStatus}</span>
                            </div>
                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" checked={template.active} readOnly />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-teal"></div>
                                  <span className="ml-2 text-xs text-slate-500">Ativo</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Assunto</label>
                                <input 
                                    type="text" 
                                    defaultValue={template.subject}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Corpo do E-mail</label>
                                <textarea 
                                    defaultValue={template.body}
                                    rows={4}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                                />
                                <p className="text-xs text-slate-400 mt-1">Variáveis disponíveis: {'{nome}'}, {'{vaga}'}</p>
                            </div>
                            <div className="flex justify-end">
                                <Button size="sm" variant="ghost"><Save className="w-4 h-4 mr-2"/> Salvar Alterações</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'general' && (
          <div className="p-8 text-center text-slate-500 bg-white dark:bg-brand-surface rounded-xl">
              Configurações gerais do sistema (Logo, Integrações, Usuários) ficariam aqui.
          </div>
      )}
    </div>
  );
};

export default Settings;