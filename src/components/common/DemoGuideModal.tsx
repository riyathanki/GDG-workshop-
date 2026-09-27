import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, ChevronRight, Play, Sparkles, ArrowRight } from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const { 
    isDemoGuideOpen, 
    setIsDemoGuideOpen, 
    switchUser, 
    setCurrentView, 
    setActiveTrackingAppId, 
    setActiveReviewAppId,
    setActiveVerifyCertId,
    applications,
    certificates
  } = useApp();

  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  if (!isDemoGuideOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Enter Citizen Demo',
      desc: 'Sign in as Citizen Riya Patel to explore citizen services.',
      actionLabel: 'Switch to Citizen',
      onRun: () => {
        switchUser('citizen', 'usr-citizen-riya');
        setCurrentView('citizen_home');
      }
    },
    {
      step: 2,
      title: 'Search "Income Certificate"',
      desc: 'Discover eligibility and required documents for the primary demo service.',
      actionLabel: 'Go to Services',
      onRun: () => {
        setCurrentView('citizen_services');
      }
    },
    {
      step: 3,
      title: 'Start Application Wizard',
      desc: 'Guided 6-step wizard: Personal details, service criteria, and doc checklist.',
      actionLabel: 'Launch Wizard',
      onRun: () => {
        setCurrentView('citizen_wizard');
      }
    },
    {
      step: 4,
      title: 'Upload Synthetic Documents & AI Check',
      desc: 'Simulate document upload with automated optical structure analysis.',
      actionLabel: 'View Documents',
      onRun: () => {
        setCurrentView('citizen_wizard');
      }
    },
    {
      step: 5,
      title: 'Consent & Submit Application',
      desc: 'Submit application with digital receipt and instant tracking identifier generation.',
      actionLabel: 'Open Applications',
      onRun: () => {
        setCurrentView('citizen_applications');
      }
    },
    {
      step: 6,
      title: 'View Real-Time Tracking Timeline',
      desc: 'Live vertical timeline displaying intake, automated scan, and assigned officer.',
      actionLabel: 'View Live Tracker',
      onRun: () => {
        setActiveTrackingAppId('APP-2026-004821');
        setCurrentView('citizen_tracking');
      }
    },
    {
      step: 7,
      title: 'Switch to Officer Demo',
      desc: 'Log in as Sub-Divisional Magistrate Rajesh Verma to manage scrutiny queue.',
      actionLabel: 'Switch to Officer',
      onRun: () => {
        switchUser('officer', 'usr-officer-rajesh');
        setCurrentView('officer_portal');
      }
    },
    {
      step: 8,
      title: 'Open Scrutiny Page for APP-2026-004821',
      desc: 'Examine citizen details, salary proof, and optical analysis flags.',
      actionLabel: 'Open Review View',
      onRun: () => {
        switchUser('officer', 'usr-officer-rajesh');
        setActiveReviewAppId('APP-2026-004821');
        setCurrentView('officer_portal');
      }
    },
    {
      step: 9,
      title: 'Officer Requests Document Correction',
      desc: 'Click "Request Correction" on Income Proof: "Employer seal is smudged, provide clear scan".',
      actionLabel: 'Inspect & Request',
      onRun: () => {
        switchUser('officer', 'usr-officer-rajesh');
        setActiveReviewAppId('APP-2026-004821');
        setCurrentView('officer_portal');
      }
    },
    {
      step: 10,
      title: 'Switch Back to Citizen & Receive Alert',
      desc: 'Citizen dashboard immediately reflects "Needs Correction" notification and action item.',
      actionLabel: 'Return to Citizen',
      onRun: () => {
        switchUser('citizen', 'usr-citizen-riya');
        setActiveTrackingAppId('APP-2026-004821');
        setCurrentView('citizen_tracking');
      }
    },
    {
      step: 11,
      title: 'Citizen Resubmits Corrected Document',
      desc: 'Upload clear replacement proof. Status updates to "Resubmitted" and alerts officer.',
      actionLabel: 'Open Resubmit Action',
      onRun: () => {
        switchUser('citizen', 'usr-citizen-riya');
        setActiveTrackingAppId('APP-2026-004821');
        setCurrentView('citizen_tracking');
      }
    },
    {
      step: 12,
      title: 'Officer Grants Final Approval',
      desc: 'Officer reviews resubmitted document and clicks "Approve Application".',
      actionLabel: 'Approve as Officer',
      onRun: () => {
        switchUser('officer', 'usr-officer-rajesh');
        setActiveReviewAppId('APP-2026-004821');
        setCurrentView('officer_portal');
      }
    },
    {
      step: 13,
      title: 'Citizen Receives Digital Certificate',
      desc: 'View newly generated prototype certificate with official seal and QR hash.',
      actionLabel: 'View Certificate',
      onRun: () => {
        switchUser('citizen', 'usr-citizen-riya');
        setActiveTrackingAppId('APP-2026-004821');
        setCurrentView('citizen_tracking');
      }
    },
    {
      step: 14,
      title: 'Public QR Code Certificate Verification',
      desc: 'Simulate citizen or third-party scanning QR code on /verify/[certificateId].',
      actionLabel: 'Open QR Verifier',
      onRun: () => {
        const approvedApp = applications.find(a => a.certificateId);
        const certId = approvedApp?.certificateId || 'CERT-2026-882193';
        setActiveVerifyCertId(certId);
        setCurrentView('verify_certificate');
      }
    },
    {
      step: 15,
      title: 'Switch to Admin: Analytics & Audit Trail',
      desc: 'Review department workload, approval ratios, processing SLAs, and immutable audit logs.',
      actionLabel: 'Open Admin Dashboard',
      onRun: () => {
        switchUser('admin', 'usr-admin-sunita');
        setCurrentView('admin_dashboard');
      }
    }
  ];

  const toggleStep = (stepNum: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNum) ? prev.filter(s => s !== stepNum) : [...prev, stepNum]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Judge 3-Minute Demonstration Guide
              </h2>
              <p className="text-xs text-slate-500">
                End-to-end interactive journey through Citizen, Officer, and Admin workflows
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner */}
        <div className="bg-indigo-50/70 border-b border-indigo-100 px-6 py-2.5 text-xs text-indigo-900 flex items-center justify-between">
          <span>Click any <strong>Run Step</strong> button to instantly navigate the application to that state.</span>
          <span className="font-mono font-medium text-indigo-700">
            {completedSteps.length} of {demoSteps.length} checked
          </span>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {demoSteps.map((item) => {
            const isDone = completedSteps.includes(item.step);

            return (
              <div
                key={item.step}
                className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-4 ${
                  isDone 
                    ? 'bg-slate-50/70 border-slate-200' 
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(item.step)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 focus:outline-none"
                    title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${isDone ? 'text-emerald-600 fill-emerald-50' : 'text-slate-300'}`} />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 font-semibold">Step {item.step}.</span>
                      <h4 className="text-xs font-semibold text-slate-900">{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    item.onRun();
                    if (!completedSteps.includes(item.step)) {
                      setCompletedSteps(prev => [...prev, item.step]);
                    }
                    setIsDemoGuideOpen(false);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span>Tip: You can re-open this guide at any time from the top black Demo Bar.</span>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="px-4 py-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700 font-medium"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
