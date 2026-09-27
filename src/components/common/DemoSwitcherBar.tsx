import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Shield, Award, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';

export const DemoSwitcherBar: React.FC = () => {
  const { currentUser, switchUser, resetDemoData, setIsDemoGuideOpen, setCurrentView } = useApp();

  return (
    <div className="bg-slate-900 text-slate-100 text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
      {/* Role Switcher */}
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-slate-400 font-medium flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Demo Mode:
        </span>

        <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
          <button
            onClick={() => switchUser('citizen', 'usr-citizen-riya')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentUser.role === 'citizen'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Citizen (Riya Patel)
          </button>

          <button
            onClick={() => switchUser('officer', 'usr-officer-rajesh')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentUser.role === 'officer'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Officer (Rajesh Verma, SDM)
          </button>

          <button
            onClick={() => switchUser('admin', 'usr-admin-sunita')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentUser.role === 'admin'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Admin (Dr. Sunita Rao)
          </button>
        </div>
      </div>

      {/* Demo Guidance & Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsDemoGuideOpen(true)}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Judge 3-Min Walkthrough Guide</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('verify_certificate');
          }}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Public QR Verify</span>
        </button>

        <button
          onClick={resetDemoData}
          title="Reset all demo data to baseline state"
          className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
