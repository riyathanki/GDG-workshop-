import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, Send, FileText } from 'lucide-react';
import { Application } from '../../types';

interface CorrectionRequestModalProps {
  application: Application;
  onClose: () => void;
}

export const CorrectionRequestModal: React.FC<CorrectionRequestModalProps> = ({
  application,
  onClose
}) => {
  const { officerRequestCorrection } = useApp();
  
  // Default to the first document or income proof
  const initialDoc = application.documents.find(d => d.requirementId === 'doc-income') || application.documents[0];
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDoc?.id || '');
  const [reason, setReason] = useState<string>(
    'The employer stamp is faint and smudged along the seal border. Please upload a clear high-resolution scanned copy with visible official seal.'
  );
  const [remarks, setRemarks] = useState<string>(
    'Identity proof and address proof verified. Income proof requires clear seal before final statutory signing.'
  );
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!reason.trim() || !selectedDocId) return;

    setIsSending(true);
    setTimeout(() => {
      officerRequestCorrection(application.id, selectedDocId, reason, remarks);
      setIsSending(false);
      onClose();
    }, 700);
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
                Dispatch Correction Request
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {application.id} · {application.citizenName}
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Document Requiring Correction: *
            </label>
            <select
              value={selectedDocId}
              onChange={e => setSelectedDocId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-amber-500"
            >
              {application.documents.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.fileName || 'Pending upload'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Specific Reason for Rejection / Correction: *
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="State clear reasons so the citizen understands how to fix the document..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-amber-500 leading-relaxed font-sans"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              This reason will immediately display on the citizen's mobile dashboard and push notification.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Officer Remarks:
            </label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Internal file remarks for departmental record..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-amber-500"
            />
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
            onClick={handleSend}
            disabled={isSending || !reason.trim()}
            className="px-5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Dispatching...' : 'Send Correction Request'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
