import React, { Fragment } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-brand-surface w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};