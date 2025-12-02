import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  Menu, 
  Sun, 
  Moon,
  LogOut,
  Camera
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  // Profile Photo State
  const [profilePhoto, setProfilePhoto] = useState<string | null>(localStorage.getItem('userProfilePhoto'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhoto(result);
        localStorage.setItem('userProfilePhoto', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Vagas', path: '/jobs' },
    { icon: Users, label: 'Candidatos', path: '/candidates' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-brand-dark text-slate-900 dark:text-white font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        bg-white dark:bg-brand-surface border-r border-slate-200 dark:border-slate-700
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xl font-bold tracking-tight">
              YOUNG<span className="text-brand-orange">.</span>TALENTS
            </span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-brand-orange/10 text-brand-orange font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-brand-surface border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8">
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center ml-auto space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-brand-orange"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* User Profile with Upload */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <div className="w-8 h-8 rounded-full bg-brand-teal overflow-hidden flex items-center justify-center text-white font-bold text-sm border-2 border-transparent group-hover:border-brand-orange transition-all">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  "YT"
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};