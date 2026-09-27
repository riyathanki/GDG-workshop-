import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { GovernmentService, ServiceCategory } from '../../types';

export const CitizenDashboard: React.FC = () => {
  const { 
    currentUser, 
    services, 
    applications, 
    setCurrentView, 
    setActiveServiceForWizard, 
    setActiveTrackingAppId,
    setServiceDetailModal,
    setCertificateModal,
    certificates,
    t 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter citizen applications
  const myApplications = applications.filter(a => a.citizenId === currentUser.id);
  const activeCount = myApplications.filter(a => a.status !== 'approved' && a.status !== 'rejected').length;
  const pendingActionsCount = myApplications.filter(a => a.status === 'correction_required').length;
  const completedCount = myApplications.filter(a => a.status === 'approved').length;
  const totalVerifiedDocs = myApplications.reduce((acc, app) => 
    acc + app.documents.filter(d => d.status === 'verified').length, 0
  );

  // Filtered services
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleStartService = (service: GovernmentService) => {
    setActiveServiceForWizard(service);
    setCurrentView('citizen_wizard');
  };

  const handleTrackApplication = (appId: string) => {
    setActiveTrackingAppId(appId);
    setCurrentView('citizen_tracking');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Hero Banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-medium">
            <span>Welcome back, {currentUser.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-300">Aadhaar (Masked): {currentUser.aadhaarMasked || 'XXXX-XXXX-4821'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Digital Government Services, Simplified.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Discover public certificates, track live application scrutiny across revenue departments, and receive cryptographically verified digital credentials.
          </p>

          {/* Quick Search Input */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards - 4 Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">{activeCount}</div>
            <div className="text-xs text-slate-500 font-medium">{t('activeApplications')}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            pendingActionsCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
          }`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">{pendingActionsCount}</div>
            <div className="text-xs text-slate-500 font-medium">{t('pendingActions')}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">{totalVerifiedDocs}</div>
            <div className="text-xs text-slate-500 font-medium">{t('verifiedDocuments')}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">{completedCount}</div>
            <div className="text-xs text-slate-500 font-medium">{t('completedServices')}</div>
          </div>
        </div>
      </div>

      {/* Actionable Notice if correction is pending */}
      {pendingActionsCount > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h3 className="text-xs font-semibold text-amber-900">
                Action Required on Active Application
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                The revenue officer has requested document correction for your Income Certificate application. Please resubmit the clear proof to resume review.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleTrackApplication('APP-2026-004821')}
            className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium whitespace-nowrap shadow-xs"
          >
            Review & Resubmit
          </button>
        </div>
      )}

      {/* My Active Applications Quick Section */}
      {myApplications.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Active Applications
            </h2>
            <button
              onClick={() => setCurrentView('citizen_applications')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <span>View all ({myApplications.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myApplications.map((app) => {
              const isNeedsCorrection = app.status === 'correction_required';
              const isApproved = app.status === 'approved';

              return (
                <div 
                  key={app.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isNeedsCorrection
                      ? 'bg-amber-50/40 border-amber-200'
                      : isApproved
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-medium">{app.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{app.department}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{app.serviceName}</h3>
                    </div>

                    <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isNeedsCorrection
                        ? 'bg-amber-100 text-amber-800'
                        : isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-1">
                    Current stage: <strong>{app.currentStage}</strong>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Assigned: {app.assignedOfficerName}
                    </span>

                    <div className="flex items-center gap-2">
                      {isApproved && app.certificateId && (
                        <button
                          onClick={() => {
                            const cert = certificates.find(c => c.id === app.certificateId);
                            if (cert) setCertificateModal(cert);
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                        >
                          Certificate
                        </button>
                      )}

                      <button
                        onClick={() => handleTrackApplication(app.id)}
                        className="px-3 py-1 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 flex items-center gap-1"
                      >
                        <span>{t('trackStatus')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Government Services Directory */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Government Services Catalog
            </h2>
            <p className="text-xs text-slate-500">
              Select a statutory service to check eligibility, required documents, and apply online
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'revenue', label: 'Revenue' },
              { id: 'social_welfare', label: 'Social Welfare' },
              { id: 'civic_administration', label: 'Civic Admin' },
              { id: 'education', label: 'Education' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="rounded-xl border border-slate-200/90 bg-white p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                {/* Clean unboxed metadata with bullet separators */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                  <span className="font-medium text-indigo-700">{service.department}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {service.estimatedDays} {t('days')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {service.name}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                {/* Required Docs List Snippet */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="text-slate-400 font-medium mb-1.5 flex items-center justify-between">
                    <span>{t('requiredDocs')}:</span>
                    <span className="text-slate-600 font-mono">{service.requirements.length} proofs</span>
                  </div>
                  <ul className="space-y-1 text-slate-600">
                    {service.requirements.slice(0, 3).map(req => (
                      <li key={req.id} className="flex items-center gap-1.5 truncate">
                        <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                        <span className="truncate">{req.name}</span>
                      </li>
                    ))}
                    {service.requirements.length > 3 && (
                      <li className="text-[11px] text-slate-400 italic">
                        +{service.requirements.length - 3} additional proofs
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{t('fee')}</span>
                  <span className="text-xs font-semibold text-slate-900 font-mono">
                    {service.fee === 0 ? t('free') : `₹${service.fee}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setServiceDetailModal(service)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    {t('viewDetails')}
                  </button>

                  <button
                    onClick={() => handleStartService(service)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs flex items-center gap-1 transition-colors"
                  >
                    <span>{t('startApplication')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
