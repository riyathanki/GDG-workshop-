import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { ApplicationDocument } from '../../types';

interface DocumentResubmitModalProps {
  applicationId: string;
  document: ApplicationDocument;
  onClose: () => void;
}

export const DocumentResubmitModal: React.FC<DocumentResubmitModalProps> = ({
  applicationId,
  document,
  onClose
}) => {
  const { citizenResubmitDocument } = useApp();
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string } | null>({
    name: 'salary_slip_attested_clarity_scan.pdf',
    size: '2.4 MB',
    type: 'application/pdf'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResubmit = () => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    setTimeout(() => {
      citizenResubmitDocument(applicationId, document.id, selectedFile);
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-amber-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Resubmit Document for Correction
              </h3>
              <p className="text-xs text-slate-500">
                Application: <span className="font-mono">{applicationId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Officer's Correction Remark */}
          <div className="p-3.5 rounded-lg bg-amber-100/70 border border-amber-200 text-amber-900 space-y-1">
            <span className="font-bold block uppercase tracking-wider text-[10px]">
              Officer's Correction Request:
            </span>
            <p className="text-xs italic leading-relaxed">
              "{document.correctionReason || 'The uploaded file has ink smudging or faint official stamp. Please upload a clear, high-resolution scan showing authorized seal.'}"
            </p>
            {document.correctionRequestedAt && (
              <span className="text-[10px] text-amber-700 block font-mono">
                Requested on: {document.correctionRequestedAt}
              </span>
            )}
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Document Target:
            </label>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>{document.name}</span>
            </div>
          </div>

          {/* Replacement File Upload Area */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Upload Clear Replacement Scan (PDF/JPG/PNG):
            </label>
            <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 text-center bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors">
              <Upload className="w-6 h-6 text-indigo-500 mx-auto mb-1.5" />
              <div className="font-semibold text-slate-800">
                {selectedFile?.name || 'Choose replacement file'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {selectedFile?.size} · High-contrast 300 DPI scan recommended
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile({
                    name: 'fresh_clarity_salary_certificate_attested.pdf',
                    size: '2.8 MB',
                    type: 'application/pdf'
                  });
                }}
                className="mt-2.5 px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 font-medium hover:bg-slate-50"
              >
                Use Prepared Demo Scan
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Once submitted, the system will immediately alert the reviewing officer and update your status to <strong>"Under Review"</strong>.
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleResubmit}
            disabled={isSubmitting}
            className="px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <span>{isSubmitting ? 'Uploading...' : 'Submit Corrected Document'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
