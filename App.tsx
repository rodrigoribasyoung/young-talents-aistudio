import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Jobs from './pages/Jobs';
import Settings from './pages/Settings';

// Simple placeholder for Login logic
const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-dark px-4">
    <div className="w-full max-w-md space-y-8 bg-white dark:bg-brand-surface p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          YOUNG<span className="text-brand-orange">.</span>TALENTS
        </h2>
        <p className="mt-2 text-sm text-slate-500">Faça login no seu painel</p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.hash = '/'; }}>
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Endereço de e-mail" 
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            required 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            required 
          />
        </div>
        <button 
          type="submit" 
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-brand-orange/20 text-sm font-medium text-white bg-brand-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
);

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Layout Routes */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/candidates" element={<Layout><Candidates /></Layout>} />
        <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;