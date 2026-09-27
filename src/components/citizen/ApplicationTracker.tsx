import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Building, 
  UserCheck, 
  Calendar, 
  Award, 
  RotateCw, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { ApplicationDocument } from '../../types';
import { DocumentResubmitModal } from './DocumentResubmitModal';

export const ApplicationTracker: React.FC = () => {
  const { 
    applications, 
    activeTrackingAppId, 
    setCurrentView, 
    setCertificateModal, 
    certificates,
    updateApplication,
    showToast 
  } = useApp();

  const [resubmittingDoc, setResubmittingDoc] = useState<ApplicationDocument | null>(null);
  const [liveSecondsAgo, setLiveSecondsAgo] = useState(12);

  const application = applications.find(a => a.id === activeTrackingAppId) || applications[0];

  // Simulated live ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSecondsAgo(prev => prev + 5);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!application) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No active application selected for tracking.</p>
        <button
          onClick={() => setCurrentView('citizen_home')}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isNeedsCorrection = application.status === 'correction_required';
  const isApproved = application.status === 'approved';
  const certificate = certificates.find(c => c.applicationId === application.id || c.id === application.certificateId);

  // Simulated Fast-Forward Demo Action for Judges
  const handleFastForwardSimulation = () => {
    if (application.status === 'under_officer_review') {
      showToast('Simulating live officer field report validation...', 'info');
      setTimeout(() => {
        updateApplication(application.id, {
          currentStage: 'Field Verification Completed · Awaiting Signature',
          expectedNextStep: 'Digital token signoff by Executive Magistrate'
        });
        showToast('Timeline updated: Field Verification validated!', 'success');
      }, 700);
    } else {
      showToast('Status is actively synced with officer action queue.', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('citizen_applications')}
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Applications</span>
        </button>

        {/* Live Simulator button */}
        <button
          onClick={handleFastForwardSimulation}
          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 border border-slate-200"
          title="Simulate background department check"
        >
          <RotateCw className="w-3 h-3 text-slate-500" />
          <span>Simulate Status Sync</span>
        </button>
      </div>

      {/* Signature Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="font-bold text-slate-900 text-sm">{application.id}</span>
              <span aria-hidden="true">·</span>
              <span>Submitted: {new Date(application.createdAt).toLocaleDateString('en-GB')}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              {application.serviceName}
            </h1>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isNeedsCorrection
                ? 'bg-amber-100 text-amber-900 animate-pulse'
                : isApproved
                ? 'bg-emerald-100 text-emerald-900'
                : 'bg-indigo-100 text-indigo-900'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isNeedsCorrection ? 'bg-amber-600' : isApproved ? 'bg-emerald-600' : 'bg-indigo-600'
              }`} />
              {application.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Key Real-Time Tracking Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Assigned Department</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{application.assignedDepartment}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Assigned Officer</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{application.assignedOfficerName}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Expected Next Step</span>
            <span className="font-semibold text-indigo-700 mt-0.5 block">{application.expectedNextStep}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Last Live Heartbeat</span>
            <span className="font-mono text-emerald-700 font-semibold mt-0.5 block">
              {liveSecondsAgo < 60 ? `${liveSecondsAgo}s ago` : `${Math.floor(liveSecondsAgo / 60)}m ago`}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Action Banner: Document Correction Request */}
      {isNeedsCorrection && (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-5 shadow-xs space-y-3 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Officer Action Notice: Document Correction Required
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  The reviewing officer reviewed your application and noted: <br />
                  <strong className="font-serif italic font-normal text-amber-950">
                    "{application.correctionNotes || 'Please upload a clearer official scan of your income proof with visible stamps.'}"
                  </strong>
                </p>
              </div>
            </div>

            {/* Quick Resubmit Trigger */}
            <button
              onClick={() => {
                const flagged = application.documents.find(d => d.status === 'needs_correction') || application.documents[0];
                setResubmittingDoc(flagged);
              }}
              className="shrink-0 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Resubmit Document</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Prominent Action Banner: Approved with Certificate */}
      {isApproved && certificate && (
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Statutory Certificate Generated & Issued!
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Certificate Number: <span className="font-mono font-bold">{certificate.id}</span> · Valid & Signed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCertificateModal(certificate)}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>View Prototype Certificate</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Vertical Timeline + Documents Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Signature Vertical Timeline (2 cols on desktop) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Application Progress Timeline
              </h2>
              <p className="text-xs text-slate-500">
                End-to-end transparent scrutiny lifecycle
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded">
              Stage: {application.currentStage}
            </span>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {application.timeline.map((event) => {
              const isDone = event.completed;
              const isActive = event.active;

              return (
                <div key={event.id} className="relative group">
                  {/* Step Dot */}
                  <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDone 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : isActive 
                      ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-50 animate-pulse' 
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isActive ? (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`font-bold ${isActive ? 'text-indigo-700 text-sm' : isDone ? 'text-slate-900' : 'text-slate-500'}`}>
                        {event.title}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {event.timestamp}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Action by: <strong>{event.actor}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="uppercase tracking-wider">{event.actorRole}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Submitted Documents & Scrutiny Flags */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Attached Proof Enclosures
            </h3>
            <p className="text-xs text-slate-500">
              Verification status per document
            </p>
          </div>

          <div className="space-y-3">
            {application.documents.map((doc) => {
              const docNeedsCorrection = doc.status === 'needs_correction';
              const docResubmitted = doc.status === 'resubmitted';
              const docVerified = doc.status === 'verified';

              return (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    docNeedsCorrection
                      ? 'bg-amber-50 border-amber-300'
                      : docResubmitted
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-slate-900">
                      {doc.name}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      docNeedsCorrection
                        ? 'bg-amber-200 text-amber-900'
                        : docResubmitted
                        ? 'bg-indigo-200 text-indigo-900'
                        : docVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {doc.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="font-mono text-slate-500 text-[11px] mt-1 truncate">
                    {doc.fileName || 'Pending upload'}
                  </div>

                  {doc.correctionReason && (
                    <div className="mt-2 text-[11px] text-amber-800 bg-amber-100/80 p-2 rounded">
                      <strong>Correction Reason:</strong> {doc.correctionReason}
                    </div>
                  )}

                  {docNeedsCorrection && (
                    <button
                      onClick={() => setResubmittingDoc(doc)}
                      className="mt-2.5 w-full py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-center block transition-colors shadow-xs"
                    >
                      Resubmit Document Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Resubmission Modal */}
      {resubmittingDoc && (
        <DocumentResubmitModal
          applicationId={application.id}
          document={resubmittingDoc}
          onClose={() => setResubmittingDoc(null)}
        />
      )}

    </div>
  );
};
