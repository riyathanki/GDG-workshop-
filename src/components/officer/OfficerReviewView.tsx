import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  User, 
  Clock, 
  Building, 
  ShieldCheck, 
  Sparkles,
  Award,
  Send,
  ExternalLink
} from 'lucide-react';
import { CorrectionRequestModal } from './CorrectionRequestModal';
import { ApplicationDocument } from '../../types';

interface OfficerReviewViewProps {
  applicationId: string;
  onBack: () => void;
}

export const OfficerReviewView: React.FC<OfficerReviewViewProps> = ({
  applicationId,
  onBack
}) => {
  const { 
    applications, 
    officerApproveApplication, 
    officerRejectApplication, 
    setCertificateModal,
    showToast 
  } = useApp();

  const application = applications.find(a => a.id === applicationId);

  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [rejectPromptOpen, setRejectPromptOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Inconclusive revenue declaration.');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<ApplicationDocument | null>(null);

  if (!application) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Application {applicationId} not found.</p>
        <button onClick={onBack} className="mt-3 px-4 py-2 bg-slate-800 text-white rounded text-xs">
          Return to Queue
        </button>
      </div>
    );
  }

  const isApproved = application.status === 'approved';
  const isCorrection = application.status === 'correction_required';

  const handleApprove = () => {
    try {
      const cert = officerApproveApplication(application.id, 'All submitted proofs and revenue inquiries verified in accordance with statutory guidelines.');
      setCertificateModal(cert);
    } catch (err) {
      showToast('Error approving application', 'warning');
    }
  };

  const handleReject = () => {
    officerRejectApplication(application.id, rejectReason);
    setRejectPromptOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="font-bold text-slate-900 text-sm">{application.id}</span>
              <span aria-hidden="true">·</span>
              <span>Priority: {application.priority}</span>
              <span aria-hidden="true">·</span>
              <span className="uppercase text-amber-700 font-semibold">{application.status.replace(/_/g, ' ')}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Reviewing: {application.serviceName}
            </h1>
          </div>
        </div>

        {/* Primary Officer Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {!isApproved && (
            <>
              <button
                onClick={() => setIsCorrectionModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Request Correction</span>
              </button>

              <button
                onClick={() => setRejectPromptOpen(true)}
                className="px-3 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                Reject
              </button>

              <button
                onClick={handleApprove}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Application</span>
              </button>
            </>
          )}

          {isApproved && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                ✓ Approved & Certificate Generated
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Prompt Modal */}
      {rejectPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Confirm Rejection of {application.id}</h3>
            <p className="text-slate-600">Please provide statutory grounds for the rejection record:</p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectPromptOpen(false)}
                className="px-3 py-1.5 border rounded text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 bg-rose-600 text-white rounded font-bold hover:bg-rose-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Citizen Info & Documents Scrutiny */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Citizen Information & Application Record */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Citizen Details Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Applicant Citizen Information</h3>
              </div>
              <span className="font-mono text-xs text-slate-400">
                Identity: {application.personalDetails.maskedIdentityId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Full Legal Name</span>
                <span className="font-semibold text-slate-900 text-sm">{application.personalDetails.fullName}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Father / Husband Name</span>
                <span className="font-semibold text-slate-900 text-sm">{application.personalDetails.fatherHusbandName}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Gender & Date of Birth</span>
                <span className="text-slate-800">{application.personalDetails.gender} · {application.personalDetails.dateOfBirth}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Contact Details</span>
                <span className="text-slate-800">{application.personalDetails.mobile} · {application.personalDetails.email}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Permanent Residential Address</span>
                <span className="text-slate-800 font-medium">
                  {application.personalDetails.permanentAddress}, Taluka: {application.personalDetails.taluka}, District: {application.personalDetails.district} - {application.personalDetails.pincode}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Declared Annual Household Income</span>
                <span className="font-mono font-bold text-slate-900 text-sm text-indigo-700">
                  ₹{application.personalDetails.annualIncome?.toLocaleString('en-IN') || '1,80,000'} / annum
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Occupation & Source</span>
                <span className="text-slate-800">{application.personalDetails.occupation}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Application Purpose</span>
                <span className="text-slate-800 italic">{application.personalDetails.purposeOfCertificate}</span>
              </div>
            </div>
          </div>

          {/* Document Scrutiny Panel */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Submitted Proof Documents ({application.documents.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Click any document to inspect OCR heuristics
              </span>
            </div>

            <div className="space-y-4">
              {application.documents.map((doc) => {
                const analysis = doc.analysis;
                const isNeedsReview = doc.status === 'under_verification' || doc.status === 'needs_correction';
                const isResubmitted = doc.status === 'resubmitted';

                return (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-xl border transition-all text-xs ${
                      doc.status === 'needs_correction'
                        ? 'bg-amber-50/70 border-amber-300'
                        : isResubmitted
                        ? 'bg-indigo-50/50 border-indigo-200'
                        : 'bg-slate-50/40 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{doc.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            doc.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : doc.status === 'needs_correction'
                              ? 'bg-amber-200 text-amber-900'
                              : isResubmitted
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {doc.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] mt-1">
                          File: {doc.fileName} · Size: {doc.fileSize}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedDocForPreview(doc)}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 text-[11px] font-medium"
                      >
                        Inspect Proof
                      </button>
                    </div>

                    {/* AI Optical Verification Breakdown */}
                    {analysis && (
                      <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <span className="flex items-center gap-1 text-indigo-700 font-medium">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            AI Scrutiny: {analysis.detectedType}
                          </span>
                          <span className="font-mono text-slate-500">
                            Readability: <strong>{analysis.readabilityScore}%</strong> · Confidence: <strong>{analysis.confidenceScore}%</strong>
                          </span>
                        </div>

                        {/* Detected fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-white/70 p-2.5 rounded-lg border border-slate-100">
                          {analysis.detectedFields.map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 truncate">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate"><strong>{f.field}:</strong> {f.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Warning or issues if flagged */}
                        {analysis.potentialIssues.length > 0 && (
                          <div className="p-2 rounded bg-amber-100/70 text-amber-900 text-[11px] flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span><strong>Scrutiny Flag:</strong> {analysis.potentialIssues[0]}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Active correction reason note */}
                    {doc.correctionReason && (
                      <div className="mt-2.5 p-2 rounded bg-amber-100 text-amber-950 text-[11px]">
                        <strong>Officer Correction Notice:</strong> {doc.correctionReason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Application History & Remarks */}
        <div className="space-y-6">
          
          {/* Workflow Timeline Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Audit & Timeline Events
            </h3>

            <div className="space-y-4 text-xs">
              {application.timeline.map((evt) => (
                <div key={evt.id} className="pb-3 border-b border-slate-100 last:border-b-0 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                    <span>{evt.timestamp}</span>
                    <span className="uppercase">{evt.actorRole}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">{evt.title}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Document Preview Drawer / Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{selectedDocForPreview.name}</h3>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            {/* Simulated Document Viewer */}
            <div className="bg-slate-100 rounded-lg p-6 text-center border border-slate-200 space-y-2">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="font-mono text-slate-700 font-bold">{selectedDocForPreview.fileName}</div>
              <div className="text-[11px] text-slate-500">Synthetic Document Preview Container</div>
              <div className="mt-3 p-3 bg-white rounded border border-slate-200 text-left space-y-1">
                <div><strong>Document Status:</strong> {selectedDocForPreview.status}</div>
                <div><strong>OCR Readability:</strong> {selectedDocForPreview.analysis?.readabilityScore}% Quality</div>
                <div><strong>Recommendation:</strong> {selectedDocForPreview.analysis?.recommendation}</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDocForPreview(null)}
              className="w-full py-2 bg-slate-800 text-white rounded font-medium hover:bg-slate-700"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      )}

      {/* Correction Request Modal */}
      {isCorrectionModalOpen && (
        <CorrectionRequestModal
          application={application}
          onClose={() => setIsCorrectionModalOpen(false)}
        />
      )}

    </div>
  );
};
