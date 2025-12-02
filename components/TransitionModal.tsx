import React, { useState, useEffect } from 'react';
import { Candidate, ApplicationStatus } from '../types';
import { Button } from './ui/Button';
import { AlertCircle, X } from 'lucide-react';

interface TransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedData: Partial<Candidate>) => void;
  targetStatus: ApplicationStatus;
  candidate: Candidate;
  missingFields: string[];
}

export const TransitionModal: React.FC<TransitionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  targetStatus,
  candidate,
  missingFields
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    // Reset form when modal opens
    setFormData({});
  }, [isOpen, candidate]);

  if (!isOpen) return null;

  const getLabel = (field: string) => {
    const labels: Record<string, string> = {
      city: 'Cidade onde reside',
      hasDriverLicense: 'Possui CNH Tipo B? (Sim/Não)',
      interestAreas: 'Áreas de Interesse',
      education: 'Formação Acadêmica',
      experience: 'Experiências Anteriores',
      maritalStatus: 'Estado Civil',
      source: 'Onde nos encontrou',
      feedback: 'Feedback / Motivo da Decisão'
    };
    return labels[field] || field;
  };

  const handleSave = () => {
    // Validação simples: verificar se tudo foi preenchido
    const allFilled = missingFields.every(field => {
      // Se for booleano, verificar se foi definido. Se for string, verificar se não está vazia.
      if (field === 'hasDriverLicense') return formData[field] !== undefined;
      return formData[field] && formData[field].toString().trim() !== '';
    });

    if (!allFilled) {
      alert("Por favor, preencha todos os campos obrigatórios para avançar.");
      return;
    }

    onConfirm(formData);
  };

  const isClosingStage = targetStatus === ApplicationStatus.SELECIONADO || targetStatus === ApplicationStatus.REPROVADO;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-brand-surface w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isClosingStage ? 'Encerrar Processo' : 'Informações Pendentes'}
            </h3>
            <p className="text-sm text-slate-500">
              Para mover para <span className="font-semibold text-brand-orange">{targetStatus}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>
              {isClosingStage 
                ? `Você está prestes a marcar este candidato como ${targetStatus}. O feedback é obrigatório.` 
                : "Os seguintes campos são obrigatórios para esta etapa e não foram preenchidos:"}
            </p>
          </div>

          <form className="space-y-4">
            {missingFields.map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {getLabel(field)} <span className="text-red-500">*</span>
                </label>
                
                {field === 'hasDriverLicense' ? (
                  <select
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-teal focus:outline-none"
                    onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value === 'true' }))}
                    defaultValue=""
                  >
                    <option value="" disabled>Selecione...</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                ) : field === 'feedback' || field === 'experience' ? (
                  <textarea
                    rows={field === 'feedback' ? 4 : 2}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-teal focus:outline-none"
                    onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={`Digite ${getLabel(field).toLowerCase()}...`}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-teal focus:outline-none"
                    onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Confirmar e Mover</Button>
        </div>
      </div>
    </div>
  );
};