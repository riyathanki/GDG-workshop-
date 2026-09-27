import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  ExternalLink,
  Award,
  Filter,
  Search
} from 'lucide-react';

export const CitizenApplicationsList: React.FC = () => {
  const { 
    currentUser, 
    applications, 
    setCurrentView, 
    setActiveTrackingAppId, 
    setCertificateModal, 
    certificates,
    setActiveServiceForWizard 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'active' | 'corrections' | 'approved'>('all');
  const [search, setSearch] = useState('');

  const myApps = applications.filter(a => a.citizenId === currentUser.id);

  const filtered = myApps.filter(app => {
    const matchesSearch = 
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'active') return app.status !== 'approved' && app.status !== 'rejected';
    if (filter === 'corrections') return app.status === 'correction_required';
    if (filter === 'approved') return app.status === 'approved';
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            My Service Applications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track status, view officer scrutiny remarks, and download issued digital certificates.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveServiceForWizard(null);
            setCurrentView('citizen_wizard');
          }}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Apply for New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Filter buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${myApps.length})` },
            { id: 'active', label: 'Active' },
            { id: 'corrections', label: 'Needs Action' },
            { id: 'approved', label: 'Approved' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID or service..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-semibold text-slate-700 text-sm">No applications found</h3>
            <p className="text-xs">Select a statutory service from the catalog to submit your first application.</p>
          </div>
        ) : (
          filtered.map(app => {
            const isCorrection = app.status === 'correction_required';
            const isApproved = app.status === 'approved';
            const cert = certificates.find(c => c.id === app.certificateId || c.applicationId === app.id);

            return (
              <div
                key={app.id}
                className={`p-5 rounded-xl border transition-all bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCorrection 
                    ? 'border-amber-300 bg-amber-50/20' 
                    : isApproved 
                    ? 'border-emerald-200 bg-emerald-50/10' 
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="font-bold text-slate-900">{app.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{new Date(app.createdAt).toLocaleDateString('en-GB')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-sans text-indigo-700 font-medium">{app.department}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {app.serviceName}
                  </h3>

                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <span>Stage: <strong>{app.currentStage}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Officer: {app.assignedOfficerName}</span>
                  </div>

                  {isCorrection && (
                    <div className="text-xs text-amber-800 bg-amber-100 p-2 rounded mt-2">
                      <strong>Correction Reason:</strong> {app.correctionNotes || 'Uploaded document requires clearer scan with visible authorized seal.'}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:items-end gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider self-start sm:self-end ${
                    isCorrection
                      ? 'bg-amber-100 text-amber-900'
                      : isApproved
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-indigo-50 text-indigo-800'
                  }`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>

                  <div className="flex items-center gap-2">
                    {isApproved && cert && (
                      <button
                        onClick={() => setCertificateModal(cert)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Download Certificate</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTrackingAppId(app.id);
                        setCurrentView('citizen_tracking');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span>Track Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
