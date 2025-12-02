import React, { useState } from 'react';
import { mockCandidates, mockJobs } from '../services/firebase';
import { ApplicationStatus, Candidate } from '../types';
import { Button } from '../components/ui/Button';
import { Search, Filter, Sparkles, MessageSquare, Users } from 'lucide-react';
import { analyzeCandidate, generateInterviewQuestions } from '../services/geminiService';

const Candidates = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{score: number, summary: string, questions: string[]} | null>(null);

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.NEW: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case ApplicationStatus.INTERVIEW: return 'bg-brand-orange/10 text-brand-orange';
      case ApplicationStatus.HIRED: return 'bg-brand-teal/10 text-brand-teal';
      case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const handleAiAnalysis = async (candidate: Candidate) => {
    setIsAnalyzing(true);
    setAiResult(null);
    setSelectedCandidate(candidate);

    // Find the job this candidate applied for (Mock logic)
    // In real app, candidate would have jobId
    const job = mockJobs.find(j => j.title === candidate.role) || mockJobs[0];

    const analysis = await analyzeCandidate(candidate, job);
    const questions = await generateInterviewQuestions(candidate, job);

    setAiResult({ ...analysis, questions });
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Candidates</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-surface text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-surface rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Applied</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{candidate.name}</p>
                        <p className="text-slate-500">{candidate.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{candidate.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{candidate.appliedDate}</td>
                    <td className="px-6 py-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleAiAnalysis(candidate)}
                      >
                        <Sparkles className="w-4 h-4 text-brand-teal" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Details Panel */}
        <div className="lg:col-span-1">
          {selectedCandidate ? (
            <div className="bg-white dark:bg-brand-surface rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCandidate.name}</h2>
                  <p className="text-sm text-slate-500">{selectedCandidate.role}</p>
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

              {isAnalyzing ? (
                <div className="py-12 text-center">
                  <Sparkles className="w-8 h-8 text-brand-teal animate-bounce mx-auto mb-2" />
                  <p className="text-slate-500 animate-pulse">Gemini is analyzing profile...</p>
                </div>
              ) : aiResult ? (
                <div className="space-y-6">
                   {/* Score if freshly calculated */}
                   {!selectedCandidate.aiScore && (
                     <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                       <span className="font-medium">Match Score</span>
                       <span className="text-xl font-bold text-brand-teal">{aiResult.score}/100</span>
                     </div>
                   )}

                   <div>
                     <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Summary</h3>
                     <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-brand-orange/5 p-3 rounded-lg border border-brand-orange/10">
                       {aiResult.summary}
                     </p>
                   </div>

                   <div>
                     <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                       <MessageSquare className="w-3 h-3" /> Interview Suggestions
                     </h3>
                     <ul className="space-y-2">
                       {aiResult.questions.map((q, i) => (
                         <li key={i} className="text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                           {q}
                         </li>
                       ))}
                     </ul>
                   </div>

                   <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                     <Button className="w-full">Schedule Interview</Button>
                     <Button variant="outline" className="w-full">Reject</Button>
                   </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  Click the sparkle icon to analyze this candidate.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center text-slate-400 h-full flex flex-col items-center justify-center">
              <Users className="w-12 h-12 mb-2 opacity-50" />
              <p>Select a candidate to view AI insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Candidates;