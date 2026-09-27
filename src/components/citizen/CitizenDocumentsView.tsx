import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, CheckCircle2, AlertTriangle, Clock, ShieldCheck, Upload, Sparkles } from 'lucide-react';

export const CitizenDocumentsView: React.FC = () => {
  const { applications, currentUser, setCurrentView, setActiveTrackingAppId, showToast } = useApp();

  const myApps = applications.filter(a => a.citizenId === currentUser.id);
  const allDocs = myApps.flatMap(a => a.documents.map(d => ({ ...d, appServiceName: a.serviceName, appId: a.id })));

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Citizen Document Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synthetic digital proofs verified across your active and archived public service applications.
          </p>
        </div>

        <button
          onClick={() => showToast('Simulated document upload completed', 'success')}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-center"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload New Proof</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allDocs.map((doc, idx) => {
          const isVerified = doc.status === 'verified';
          const isNeedsCorrection = doc.status === 'needs_correction';
          const analysis = doc.analysis;

          return (
            <div
              key={`${doc.id}-${idx}`}
              className={`p-5 rounded-xl border bg-white shadow-xs space-y-3 ${
                isNeedsCorrection ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {doc.fileName} · {doc.fileSize}
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isVerified
                    ? 'bg-emerald-100 text-emerald-800'
                    : isNeedsCorrection
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-indigo-50 text-indigo-700'
                }`}>
                  {doc.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Associated with: <strong>{doc.appServiceName}</strong></span>
                <span className="font-mono text-slate-400">{doc.appId}</span>
              </div>

              {analysis && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-indigo-700 font-medium">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      Optical Quality: {analysis.qualityStatus}
                    </span>
                    <span className="font-mono">Readability: {analysis.readabilityScore}%</span>
                  </div>
                  <div className="text-slate-500 truncate">
                    Recommendation: <strong>{analysis.recommendation}</strong>
                  </div>
                </div>
              )}

              {isNeedsCorrection && (
                <button
                  onClick={() => {
                    setActiveTrackingAppId(doc.appId);
                    setCurrentView('citizen_tracking');
                  }}
                  className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Resubmit Corrected Document in Tracker
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
