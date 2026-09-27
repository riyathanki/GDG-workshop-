import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, Clock, IndianRupee, FileCheck, ArrowRight, Shield } from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const { 
    serviceDetailModal, 
    setServiceDetailModal, 
    setActiveServiceForWizard, 
    setCurrentView,
    t 
  } = useApp();

  if (!serviceDetailModal) return null;

  const handleStart = () => {
    setActiveServiceForWizard(serviceDetailModal);
    setServiceDetailModal(null);
    setCurrentView('citizen_wizard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{serviceDetailModal.department}</span>
              <span aria-hidden="true">·</span>
              <span className="uppercase text-[10px] tracking-wider text-indigo-700 font-bold">
                {serviceDetailModal.category.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {serviceDetailModal.name}
            </h2>
          </div>
          <button
            onClick={() => setServiceDetailModal(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          
          {/* Overview */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Service Purpose & Overview
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {serviceDetailModal.description}
            </p>
            <div className="mt-2.5 p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900">
              <strong>Statutory Purpose:</strong> {serviceDetailModal.purpose}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Estimated Time</span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {serviceDetailModal.estimatedDays} Working Days
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                <span>Statutory Fee</span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {serviceDetailModal.fee === 0 ? 'Free of Cost' : `₹${serviceDetailModal.fee}`}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <FileCheck className="w-3.5 h-3.5 text-teal-500" />
                <span>Required Proofs</span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {serviceDetailModal.requirements.length} Enclosures
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Eligibility Criteria
            </h3>
            <ul className="space-y-2">
              {serviceDetailModal.eligibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents Checklist */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Required Supporting Documents
            </h3>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
              {serviceDetailModal.requirements.map((req) => (
                <div key={req.id} className="p-3 flex items-start justify-between gap-3 text-xs bg-white">
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>{req.name}</span>
                      {req.mandatory ? (
                        <span className="text-[10px] text-rose-600 font-medium">Mandatory</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Optional</span>
                      )}
                    </div>
                    <div className="text-slate-500 mt-0.5">{req.description}</div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 shrink-0 font-mono">
                    {req.acceptedFormats.join('/')} · Max {req.maxSizeMb}MB
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => setServiceDetailModal(null)}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Close
          </button>

          <button
            onClick={handleStart}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
          >
            <span>Start Application</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
