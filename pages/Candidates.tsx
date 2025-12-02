import React, { useState, useRef } from 'react';
import { mockCandidates, mockJobs, parseCSVToCandidates } from '../services/firebase';
import { ApplicationStatus, Candidate } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Search, Filter, Sparkles, MessageSquare, Users, Upload, ChevronDown, ChevronUp, MapPin, DollarSign, Calendar, LayoutGrid, List, Plus } from 'lucide-react';
import { analyzeCandidate, generateInterviewQuestions } from '../services/geminiService';
import { TransitionModal } from '../components/TransitionModal';

const Candidates = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{score: number, summary: string, questions: string[]} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // View Mode
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');

  // Modal State for Pipeline Transition
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{candidate: Candidate, targetStatus: ApplicationStatus} | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  
  // Modal State for New Candidate
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
    name: '', email: '', phone: '', role: '', city: ''
  });

  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.INSCRITO: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-l-4 border-slate-400';
      case ApplicationStatus.CONSIDERADO: return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-l-4 border-blue-500';
      case ApplicationStatus.ENTREVISTA_I: return 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 border-l-4 border-brand-teal';
      case ApplicationStatus.TESTES: return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-l-4 border-purple-500';
      case ApplicationStatus.ENTREVISTA_II: return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 border-l-4 border-brand-orange';
      case ApplicationStatus.SELECIONADO: return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-l-4 border-green-500';
      case ApplicationStatus.REPROVADO: return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-l-4 border-red-500';
      default: return 'bg-slate-100 text-slate-700 border-l-4 border-slate-300';
    }
  };

  const handleAddCandidate = () => {
    if(!newCandidate.name || !newCandidate.email || !newCandidate.role) {
        alert("Nome, Email e Vaga são obrigatórios.");
        return;
    }
    const candidateToAdd: Candidate = {
        id: Date.now().toString(),
        name: newCandidate.name!,
        email: newCandidate.email!,
        phone: newCandidate.phone || '',
        role: newCandidate.role!,
        city: newCandidate.city || '',
        status: ApplicationStatus.INSCRITO,
        appliedDate: new Date().toLocaleDateString('pt-BR'),
        skills: [],
        interestAreas: [],
    };
    setCandidates([...candidates, candidateToAdd]);
    setIsAddModalOpen(false);
    setNewCandidate({ name: '', email: '', phone: '', role: '', city: '' });
  };

  const handleAiAnalysis = async (candidate: Candidate) => {
    setIsAnalyzing(true);
    setAiResult(null);
    setSelectedCandidate(candidate);

    const job = mockJobs.find(j => j.title === candidate.role) || mockJobs[0];
    const analysis = await analyzeCandidate(candidate, job);
    const questions = await generateInterviewQuestions(candidate, job);

    setAiResult({ ...analysis, questions });
    setIsAnalyzing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const newCandidates = parseCSVToCandidates(text);
        setCandidates([...candidates, ...newCandidates]);
        alert(`${newCandidates.length} candidatos importados com sucesso!`);
      };
      reader.readAsText(file);
    }
  };

  // --- Pipeline Logic ---

  const checkRequirements = (candidate: Candidate, targetStatus: ApplicationStatus): string[] => {
    const missing: string[] = [];

    // Lógica 1 -> 2: Inscrito -> Considerado
    if (targetStatus === ApplicationStatus.CONSIDERADO) {
      if (!candidate.city) missing.push('city');
      if (candidate.hasDriverLicense === undefined) missing.push('hasDriverLicense');
    }

    // Lógica 2 -> 3: Considerado -> Entrevista I
    if (targetStatus === ApplicationStatus.ENTREVISTA_I) {
      if (!candidate.interestAreas || candidate.interestAreas.length === 0) missing.push('interestAreas');
      if (!candidate.education) missing.push('education');
      if (!candidate.experience) missing.push('experience');
      if (!candidate.maritalStatus) missing.push('maritalStatus');
      if (!candidate.source) missing.push('source');
    }

    // Lógica X -> Fechamento (Selecionado ou Reprovado)
    if (targetStatus === ApplicationStatus.SELECIONADO || targetStatus === ApplicationStatus.REPROVADO) {
      if (!candidate.feedback) missing.push('feedback');
    }

    return missing;
  };

  const initiateMove = (candidateId: string, targetStatus: ApplicationStatus) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // Se estiver movendo para o mesmo status, ignora
    if (candidate.status === targetStatus) return;

    const missing = checkRequirements(candidate, targetStatus);

    if (missing.length > 0) {
      setPendingMove({ candidate, targetStatus });
      setMissingFields(missing);
      setIsTransitionModalOpen(true);
    } else {
      // Se não faltar nada, move direto
      updateCandidateStatus(candidate.id, targetStatus);
    }
  };

  const updateCandidateStatus = (id: string, status: ApplicationStatus, additionalData?: Partial<Candidate>) => {
    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, status, ...additionalData } : c
    ));
    setIsTransitionModalOpen(false);
    setPendingMove(null);
  };

  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData('candidateId', candidateId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Permite o drop
  };

  const onDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');
    initiateMove(candidateId, targetStatus);
  };

  // --- Filtering ---
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? c.role.includes(filterRole) : true;
    const matchesCity = filterCity ? (c.city || '').toLowerCase().includes(filterCity.toLowerCase()) : true;
    const matchesStatus = filterStatus ? c.status === filterStatus : true;

    return matchesSearch && matchesRole && matchesCity && matchesStatus;
  });

  // Kanban Columns
  const pipelineStages = [
    ApplicationStatus.INSCRITO,
    ApplicationStatus.CONSIDERADO,
    ApplicationStatus.ENTREVISTA_I,
    ApplicationStatus.TESTES,
    ApplicationStatus.ENTREVISTA_II,
    ApplicationStatus.SELECIONADO
    // Reprovado fica "escondido" ou numa lista separada, mas pode ser uma coluna se desejar
  ];

  return (
    <div className="space-y-6">
      {/* Modal de Transição */}
      {pendingMove && (
        <TransitionModal 
          isOpen={isTransitionModalOpen}
          onClose={() => setIsTransitionModalOpen(false)}
          onConfirm={(data) => updateCandidateStatus(pendingMove.candidate.id, pendingMove.targetStatus, data)}
          targetStatus={pendingMove.targetStatus}
          candidate={pendingMove.candidate}
          missingFields={missingFields}
        />
      )}

      {/* Modal de Adicionar Candidato */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Novo Candidato"
        footer={
            <div className="flex justify-end gap-2 w-full">
                <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddCandidate}>Salvar</Button>
            </div>
        }
      >
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nome Completo *</label>
                <input className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" value={newCandidate.name} onChange={e => setNewCandidate({...newCandidate, name: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">E-mail *</label>
                <input className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" value={newCandidate.email} onChange={e => setNewCandidate({...newCandidate, email: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Vaga de Interesse *</label>
                <input className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" value={newCandidate.role} onChange={e => setNewCandidate({...newCandidate, role: e.target.value})} placeholder="Ex: Engenheiro Frontend" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Telefone</label>
                    <input className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" value={newCandidate.phone} onChange={e => setNewCandidate({...newCandidate, phone: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Cidade</label>
                    <input className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" value={newCandidate.city} onChange={e => setNewCandidate({...newCandidate, city: e.target.value})} />
                </div>
            </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pipeline de Talentos</h1>
           <p className="text-slate-500 text-sm">Gerencie o fluxo de contratação arrastando os cartões.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".csv" 
          />
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center mr-2">
             <button 
                onClick={() => setViewMode('board')} 
                className={`p-2 rounded-md transition-colors ${viewMode === 'board' ? 'bg-white dark:bg-brand-surface shadow text-brand-orange' : 'text-slate-500'}`}
             >
                <LayoutGrid className="w-4 h-4" />
             </button>
             <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-brand-surface shadow text-brand-orange' : 'text-slate-500'}`}
             >
                <List className="w-4 h-4" />
             </button>
          </div>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Importar CSV
          </Button>
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white dark:bg-brand-surface p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" /> Filtros
            {showFilters ? <ChevronUp className="w-3 h-3 ml-2" /> : <ChevronDown className="w-3 h-3 ml-2" />}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Cargo</label>
              <input 
                type="text" 
                placeholder="Ex: Frontend" 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Cidade</label>
              <input 
                type="text" 
                placeholder="Ex: São Paulo" 
                value={filterCity} 
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* VIEW: BOARD (KANBAN) */}
      {viewMode === 'board' && (
        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar min-h-[600px]">
          {pipelineStages.map(status => (
            <div 
                key={status}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, status)}
                className="min-w-[280px] w-[280px] flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-xl p-2 border border-slate-200 dark:border-slate-800"
            >
                <div className={`p-3 rounded-lg font-bold text-sm mb-3 flex justify-between items-center ${
                    status === ApplicationStatus.SELECIONADO ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-white dark:bg-brand-surface text-slate-700 dark:text-slate-200'
                }`}>
                    {status}
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                        {filteredCandidates.filter(c => c.status === status).length}
                    </span>
                </div>
                
                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar px-1">
                    {filteredCandidates.filter(c => c.status === status).map(candidate => (
                        <div
                            key={candidate.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, candidate.id)}
                            onClick={() => setSelectedCandidate(candidate)}
                            className="bg-white dark:bg-brand-surface p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md cursor-grab active:cursor-grabbing group transition-all"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate pr-2">{candidate.name}</h4>
                                {candidate.aiScore && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${candidate.aiScore > 75 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-brand-orange'}`}>
                                        {candidate.aiScore}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-brand-teal font-medium mb-1 truncate">{candidate.role}</p>
                            <div className="flex items-center text-xs text-slate-500 mb-2">
                                <MapPin className="w-3 h-3 mr-1" /> {candidate.city || 'N/A'}
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400">{candidate.appliedDate}</span>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 px-2 text-xs"
                                    onClick={(e) => { e.stopPropagation(); handleAiAnalysis(candidate); setSelectedCandidate(candidate); }}
                                >
                                    <Sparkles className="w-3 h-3 text-brand-orange" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: LIST (LEGADO) */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-brand-surface rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[600px]">
            <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                    <tr>
                    <th className="px-6 py-4 font-semibold">Nome / Contato</th>
                    <th className="px-6 py-4 font-semibold">Vaga / Interesse</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Info</th>
                    <th className="px-6 py-4 font-semibold">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setSelectedCandidate(candidate)}>
                        <td className="px-6 py-4">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">{candidate.name}</p>
                            <p className="text-slate-500 text-xs">{candidate.email}</p>
                        </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        <p>{candidate.role}</p>
                        </td>
                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(candidate.status)}`}>
                            {candidate.status}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                        <div>{candidate.appliedDate}</div>
                        </td>
                        <td className="px-6 py-4">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleAiAnalysis(candidate); }}>
                            <Sparkles className="w-4 h-4 text-brand-teal" />
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
          
          {/* Painel Detalhes para View List */}
           <div className="lg:col-span-1 h-[600px] overflow-y-auto custom-scrollbar">
              {selectedCandidate ? (
                <div className="bg-white dark:bg-brand-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                   <h2 className="font-bold text-xl">{selectedCandidate.name}</h2>
                   <p className="text-brand-orange mb-4">{selectedCandidate.status}</p>
                   <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{selectedCandidate.email}</p>
                   <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{selectedCandidate.phone}</p>
                   <Button onClick={() => setSelectedCandidate(null)} variant="outline" size="sm">Fechar Detalhes</Button>
                </div>
              ) : (
                <div className="text-center p-10 text-slate-500">Selecione um candidato</div>
              )}
           </div>
        </div>
      )}

      {/* Overlay de Detalhes Completo (Quando em Board View e clicado) */}
      {viewMode === 'board' && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
            <div className="w-full max-w-lg bg-white dark:bg-brand-surface h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCandidate.name}</h2>
                    <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600">
                        <ChevronDown className="rotate-90 w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Status Actions */}
                    <div className="flex gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 uppercase font-bold">Status Atual</p>
                            <p className="font-medium text-brand-orange">{selectedCandidate.status}</p>
                        </div>
                        <Button 
                            size="sm" 
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                            onClick={() => initiateMove(selectedCandidate.id, ApplicationStatus.REPROVADO)}
                        >
                            Reprovar
                        </Button>
                    </div>

                    {/* Dados */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                            <p className="text-xs text-slate-400">Email</p>
                            <p className="truncate">{selectedCandidate.email}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                            <p className="text-xs text-slate-400">Telefone</p>
                            <p>{selectedCandidate.phone}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                            <p className="text-xs text-slate-400">Cidade</p>
                            <p>{selectedCandidate.city || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                            <p className="text-xs text-slate-400">Salário Pretendido</p>
                            <p>{selectedCandidate.salaryExpectation || '-'}</p>
                        </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold flex items-center gap-2 text-lg"><Sparkles className="w-5 h-5 text-brand-teal"/> Análise Gemini AI</h3>
                            <Button size="sm" onClick={() => handleAiAnalysis(selectedCandidate)} isLoading={isAnalyzing}>
                                {aiResult ? 'Regerar' : 'Analisar'}
                            </Button>
                        </div>
                        
                        {aiResult && (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="bg-brand-teal/5 border border-brand-teal/20 p-4 rounded-lg">
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{aiResult.summary}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-500 uppercase mb-2">Sugestão de Perguntas</h4>
                                    <ul className="space-y-2">
                                        {aiResult.questions.map((q, i) => (
                                            <li key={i} className="text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                                {q}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;