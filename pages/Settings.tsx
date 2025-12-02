import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { mockEmailTemplates, mockCandidates } from '../services/firebase';
import { ApplicationStatus, EmailTemplate } from '../types';
import { Mail, Save, Plus, Download, FileText } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

const Settings = () => {
  const [templates, setTemplates] = useState(mockEmailTemplates);
  const [activeTab, setActiveTab] = useState('email');
  
  // New Template Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
      subject: '', body: '', triggerStatus: ApplicationStatus.INSCRITO
  });

  const handleCreateTemplate = () => {
      if(!newTemplate.subject || !newTemplate.body) {
          alert("Preencha assunto e corpo do e-mail.");
          return;
      }
      setTemplates([...templates, {
          id: Date.now().toString(),
          active: true,
          subject: newTemplate.subject!,
          body: newTemplate.body!,
          triggerStatus: newTemplate.triggerStatus!
      }]);
      setIsModalOpen(false);
      setNewTemplate({ subject: '', body: '', triggerStatus: ApplicationStatus.INSCRITO });
  };

  const handleExportCSV = () => {
    // Generate CSV Content
    const headers = ["ID", "Nome", "Email", "Telefone", "Vaga", "Status", "Cidade", "Data Aplicação"];
    const rows = mockCandidates.map(c => [
        c.id, c.name, c.email, c.phone, c.role, c.status, c.city || '', c.appliedDate
    ].join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "young_talents_candidatos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Novo Template de E-mail"
         footer={
             <div className="flex justify-end gap-2 w-full">
                 <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                 <Button onClick={handleCreateTemplate}>Salvar Template</Button>
             </div>
         }
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium mb-1">Gatilho (Fase do Pipeline)</label>
                  <select 
                      className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      value={newTemplate.triggerStatus}
                      onChange={e => setNewTemplate({...newTemplate, triggerStatus: e.target.value as ApplicationStatus})}
                  >
                      {Object.values(ApplicationStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                      ))}
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1">Assunto do E-mail</label>
                  <input 
                      className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      value={newTemplate.subject}
                      onChange={e => setNewTemplate({...newTemplate, subject: e.target.value})}
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1">Corpo do E-mail</label>
                  <textarea 
                      className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      rows={5}
                      value={newTemplate.body}
                      onChange={e => setNewTemplate({...newTemplate, body: e.target.value})}
                  />
                  <p className="text-xs text-slate-400 mt-1">Variáveis disponíveis: {'{nome}'}, {'{vaga}'}</p>
              </div>
          </div>
      </Modal>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações</h1>

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'email' ? 'border-b-2 border-brand-orange text-brand-orange' : 'text-slate-500'}`}
            onClick={() => setActiveTab('email')}
        >
            Automação de E-mail
        </button>
        <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'reports' ? 'border-b-2 border-brand-orange text-brand-orange' : 'text-slate-500'}`}
            onClick={() => setActiveTab('reports')}
        >
            Exportar Relatórios
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
                <Button size="sm" onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4 mr-2"/> Novo Template</Button>
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

      {activeTab === 'reports' && (
          <div className="space-y-6">
              <div className="bg-white dark:bg-brand-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold mb-4">Exportar Dados</h2>
                  <p className="text-slate-500 mb-6">Baixe os dados completos de candidatos e processos para análise externa.</p>
                  
                  <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-lg">
                      <div className="p-3 bg-brand-teal/10 rounded-lg text-brand-teal">
                          <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                          <h3 className="font-bold">Relatório Completo de Candidatos</h3>
                          <p className="text-sm text-slate-500">Formato CSV compatível com Excel e Google Sheets</p>
                      </div>
                      <Button onClick={handleExportCSV}>
                          <Download className="w-4 h-4 mr-2" /> Baixar CSV
                      </Button>
                  </div>
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