import React, { useState } from 'react';
import { Compass, Bookmark, User, BookOpen, Eye, Trash2, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import { storageService } from '../services/storageService';

interface NavbarProps {
  activeTab: 'feed' | 'saved' | 'profile' | 'methodology' | 'recruiter';
  setActiveTab: (tab: 'feed' | 'saved' | 'profile' | 'methodology' | 'recruiter') => void;
  savedCount: number;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onResetData,
}) => {
  const [showDataMenu, setShowDataMenu] = useState(false);

  const handleExport = () => {
    const data = storageService.exportDataJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beyond-the-title-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowDataMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200">
                <Compass className="w-5 h-5 text-amber-300 animate-spin-slow" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Beyond the Title
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                  Personal Project
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-feed-btn"
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden md:inline">Opportunities</span>
            </button>

            <button
              id="nav-saved-btn"
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 relative ${
                activeTab === 'saved'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden md:inline">Saved</span>
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-indigo-600 text-white rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              id="nav-profile-btn"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Profile</span>
            </button>

            <button
              id="nav-recruiter-btn"
              onClick={() => setActiveTab('recruiter')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'recruiter'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden lg:inline">Recruiter View</span>
            </button>

            <button
              id="nav-methodology-btn"
              onClick={() => setActiveTab('methodology')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'methodology'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden lg:inline">Methodology</span>
            </button>
          </nav>

          {/* Right Privacy & Data Controls */}
          <div className="relative flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Private • Stored Locally</span>
            </div>

            <div className="relative">
              <button
                id="data-controls-btn"
                onClick={() => setShowDataMenu(!showDataMenu)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Data & Storage Controls"
                aria-label="Data & Storage Controls"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {showDataMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-sm">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Data & Storage Controls
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    Export Data (JSON)
                  </button>
                  <button
                    onClick={() => {
                      setShowDataMenu(false);
                      onResetData();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    Reset Stored Data
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
