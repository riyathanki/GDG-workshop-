import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  Building, 
  Calendar, 
  FileCheck, 
  QrCode,
  Lock,
  ExternalLink
} from 'lucide-react';

export const PublicVerificationView: React.FC = () => {
  const { 
    certificates, 
    activeVerifyCertId, 
    setActiveVerifyCertId, 
    setCurrentView,
    setCertificateModal 
  } = useApp();

  const [inputQuery, setInputQuery] = useState(activeVerifyCertId || certificates[0]?.id || 'CERT-2026-882193');

  const activeCert = certificates.find(c => 
    c.id.toLowerCase() === inputQuery.trim().toLowerCase()
  ) || certificates[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          onClick={() => setCurrentView('citizen_home')}
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Public QR Verification Protocol v1.4
        </span>
      </div>

      {/* Query Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold uppercase tracking-wider">
          <QrCode className="w-4 h-4 text-indigo-600" />
          <span>Verify Statutory Digital Certificate</span>
        </div>
        <p className="text-xs text-slate-500">
          Enter any Certificate Identifier or scan a physical QR code from a printed credential to confirm authentic validity in the public registry.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="e.g. CERT-2026-882193"
            className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Verify
          </button>
        </form>

        {/* Quick Demo Pickers */}
        <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 overflow-x-auto">
          <span>Demo issued certificates:</span>
          {certificates.map(c => (
            <button
              key={c.id}
              onClick={() => setInputQuery(c.id)}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-mono"
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {activeCert ? (
        <div className="bg-white rounded-xl border-2 border-emerald-500 shadow-md overflow-hidden animate-fade-in">
          
          {/* Banner: Verified Result */}
          <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-white" />
              <div>
                <h2 className="text-base font-bold leading-none">
                  CERTIFICATE VERIFICATION
                </h2>
                <span className="text-xs text-emerald-100 mt-1 inline-block">
                  ✓ Official Certificate Found & Verified in Registry
                </span>
              </div>
            </div>

            <span className="bg-white text-emerald-800 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider">
              {activeCert.status}
            </span>
          </div>

          {/* Details Table */}
          <div className="p-6 space-y-6 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Certificate Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{activeCert.id}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Certified Service</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{activeCert.serviceName}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Issuing Department</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{activeCert.department}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Statutory Issue Date</span>
                <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{activeCert.issueDate}</span>
              </div>
            </div>

            {/* Privacy-Preserved Citizen Information */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  Privacy-Protected Public Data
                </span>
                <span className="text-[10px] text-slate-400">Minimal disclosures only</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>Beneficiary Name: <strong>{activeCert.citizenName}</strong></div>
                <div>District Jurisdiction: <strong>{activeCert.district}</strong></div>
                <div>Status Validity: <strong>{activeCert.validUntil}</strong></div>
                <div>Issuing Authority: <strong>{activeCert.issuingAuthority}</strong></div>
              </div>
            </div>

            {/* Cryptographic Hash */}
            <div className="text-[11px] font-mono text-slate-400 p-3 bg-slate-100 rounded border border-slate-200 break-all">
              <span className="text-slate-500 font-semibold block mb-0.5">Digital Cryptographic Signature:</span>
              {activeCert.digitalSignatureHash}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCertificateModal(activeCert)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <span>View Full Certificate Artwork</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <div className="text-[10px] text-slate-400 italic">
                GovFlow Prototype Verification Engine
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <p className="font-semibold text-slate-900">Certificate Not Found</p>
          <p className="text-xs text-slate-400 mt-1">Please verify the certificate identifier number entered.</p>
        </div>
      )}

    </div>
  );
};
