import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Accessibility, FileCheck, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, highContrast } = useApp();

  return (
    <footer className={`border-t transition-colors mt-auto py-8 text-xs ${
      highContrast 
        ? 'bg-black text-white border-white' 
        : 'bg-slate-900 text-slate-400 border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Academic / Prototype Disclaimer Banner */}
        <div className="rounded-lg bg-slate-800/80 border border-slate-700 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block font-semibold sm:inline sm:mr-1">Academic & Hackathon Prototype Disclaimer:</strong>
            GovFlow is an independent design prototype inspired by digital government workflows. It is NOT an official government website and does not claim affiliation with the Government of India, DigiLocker, UMANG, UIDAI, or any state revenue department. All citizen identities, documents, and verification stamps are 100% synthetic mock artifacts.
          </div>
        </div>

        {/* Links & Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">GovFlow</span>
            <span aria-hidden="true">·</span>
            <span>Document Transparency Engine</span>
            <span aria-hidden="true">·</span>
            <span>2026 Academic Edition</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button 
              onClick={() => setCurrentView('verify_certificate')}
              className="hover:text-white transition-colors flex items-center gap-1 text-emerald-400"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Public Certificate Registry</span>
            </button>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Accessibility className="w-3.5 h-3.5 text-indigo-400" />
              <span>WCAG 2.1 AA Compliant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
