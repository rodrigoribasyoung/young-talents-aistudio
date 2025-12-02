import React, { useState, useRef } from 'react';
import { mockCandidates, mockJobs, parseCSVToCandidates } from '../services/firebase';
import { ApplicationStatus, Candidate } from '../types';
import { Button } from '../components/ui/Button';
import { Search, Filter, Sparkles, MessageSquare, Users, Upload, ChevronDown, ChevronUp, MapPin, DollarSign, Calendar } from 'lucide-react';
import { analyzeCandidate, generateInterviewQuestions } from '../services/geminiService';

const Candidates = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{score: number, summary: string, questions: string[]} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.INSCRITO: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case ApplicationStatus.CONSIDERADO: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case ApplicationStatus.ENTREVISTA_I: return 'bg-brand-teal/20 text-brand-teal';
      case ApplicationStatus.TESTES: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case ApplicationStatus.ENTREVISTA_II: return 'bg-brand-orange/20 text-brand-orange';
      case ApplicationStatus.SELECIONADO: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case ApplicationStatus.REPROVADO: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-700';
    }
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

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? c.role.includes(filterRole) : true;
    const matchesCity = filterCity ? (c.city || '').toLowerCase().includes(filterCity.toLowerCase()) : true;
    const matchesStatus = filterStatus ? c.status === filterStatus : true;

    return matchesSearch && matchesRole && matchesCity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Candidatos</h1>
        <div className="flex flex-wrap gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".csv" 
          />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Importar CSV
          </Button>
          <Button variant="primary">
            + Adicionar Manual
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
            <Filter className="w-4 h-4 mr-2" /> Filtros Avançados
            {showFilters ? <ChevronUp className="w-3 h-3 ml-2" /> : <ChevronDown className="w-3 h-3 ml-2" />}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status do Funil</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="">Todos</option>
                {Object.values(ApplicationStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Cargo / Interesse</label>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista */}
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
                        <p className="text-slate-500 text-xs">{candidate.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <p>{candidate.role}</p>
                      {candidate.city && <p className="text-xs text-slate-400 flex items-center mt-1"><MapPin className="w-3 h-3 mr-1"/> {candidate.city}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div>{candidate.appliedDate}</div>
                      {candidate.salaryExpectation && <div className="text-green-600 dark:text-green-400 mt-1">{candidate.salaryExpectation}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => { e.stopPropagation(); handleAiAnalysis(candidate); }}
                      >
                        <Sparkles className="w-4 h-4 text-brand-teal" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCandidates.length === 0 && (
              <div className="p-8 text-center text-slate-500">Nenhum candidato encontrado.</div>
            )}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500">
            Mostrando {filteredCandidates.length} registros
          </div>
        </div>

        {/* Painel de Detalhes e IA */}
        <div className="lg:col-span-1 h-[600px] overflow-y-auto custom-scrollbar">
          {selectedCandidate ? (
            <div className="bg-white dark:bg-brand-surface rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              
              {/* Header do Candidato */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCandidate.name}</h2>
                  <p className="text-sm text-brand-teal">{selectedCandidate.role}</p>
                </div>
                {selectedCandidate.aiScore && (
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg
                    ${selectedCandidate.aiScore > 80 ? 'bg-green-500' : selectedCandidate.aiScore > 60 ? 'bg-brand-orange' : 'bg-red-500'}
                  `}>
                    {selectedCandidate.aiScore}
                  </div>
                )}
              </div>

              {/* Dados Principais */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                    <div className="flex items-center text-slate-600 dark:text-slate-400"><MapPin className="w-3 h-3 mr-2"/> {selectedCandidate.city || 'N/A'}</div>
                    <div className="flex items-center text-slate-600 dark:text-slate-400"><DollarSign className="w-3 h-3 mr-2"/> {selectedCandidate.salaryExpectation || 'N/A'}</div>
                    <div className="flex items-center text-slate-600 dark:text-slate-400"><Calendar className="w-3 h-3 mr-2"/> {selectedCandidate.birthDate ? `${selectedCandidate.age} anos` : 'Idade N/A'}</div>
                </div>
                
                <div className="col-span-2">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Sobre</p>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{selectedCandidate.aboutMe || 'Sem descrição.'}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Escolaridade</p>
                    <p className="text-slate-700 dark:text-slate-300">{selectedCandidate.schoolingLevel || '-'}</p>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">CNH</p>
                    <p className="text-slate-700 dark:text-slate-300">{selectedCandidate.hasDriverLicense ? 'Sim' : 'Não'}</p>
                </div>
              </div>

              {/* IA Section */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-brand-orange"/> Análise IA</h3>
                      {!isAnalyzing && !aiResult && (
                          <Button size="sm" onClick={() => handleAiAnalysis(selectedCandidate)}>Gerar Análise</Button>
                      )}
                  </div>

                  {isAnalyzing ? (
                    <div className="py-8 text-center">
                      <Sparkles className="w-8 h-8 text-brand-teal animate-bounce mx-auto mb-2" />
                      <p className="text-slate-500 animate-pulse text-sm">Gemini analisando perfil...</p>
                    </div>
                  ) : aiResult ? (
                    <div className="space-y-4">
                       <div className="bg-brand-orange/5 p-3 rounded-lg border border-brand-orange/10">
                         <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                           {aiResult.summary}
                         </p>
                       </div>

                       <div>
                         <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                           <MessageSquare className="w-3 h-3" /> Sugestão de Perguntas
                         </h3>
                         <ul className="space-y-2">
                           {aiResult.questions.map((q, i) => (
                             <li key={i} className="text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                               {q}
                             </li>
                           ))}
                         </ul>
                       </div>
                    </div>
                  ) : null}
              </div>

              {/* Ações */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                 <Button className="w-full text-sm">Avançar Etapa</Button>
                 <Button variant="outline" className="w-full text-sm text-red-500 hover:text-red-600">Reprovar</Button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center text-slate-400 h-full flex flex-col items-center justify-center">
              <Users className="w-12 h-12 mb-2 opacity-50" />
              <p>Selecione um candidato para ver os detalhes completos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Candidates;