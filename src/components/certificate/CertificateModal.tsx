import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, CheckCircle2, ShieldCheck, Share2, Printer, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Certificate } from '../../types';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose
}) => {
  const { setCurrentView, setActiveVerifyCertId } = useApp();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate actual scannable QR code data URL
    const verifyUrl = `${window.location.origin}/verify/${certificate.id}`;
    QRCode.toDataURL(verifyUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));

    // Fire celebratory confetti for achievement
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, [certificate]);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenVerify = () => {
    setActiveVerifyCertId(certificate.id);
    setCurrentView('verify_certificate');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        
        {/* Top Control Bar */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-900">Digital Credential Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleOpenVerify}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium flex items-center gap-1.5 border border-indigo-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Public Verification</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-8 sm:p-10 bg-[#fdfdfc] text-slate-900 relative">
          
          {/* Decorative Outer Border */}
          <div className="border-4 border-double border-slate-800 p-6 sm:p-8 rounded-lg relative space-y-6">
            
            {/* Corner Embellishments */}
            <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono">GOVFLOW-SECURE-2026</div>
            <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono">HASH: {certificate.id}</div>

            {/* Header: Title & Authority */}
            <div className="text-center space-y-1.5 border-b-2 border-slate-800 pb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-900 text-slate-900 font-serif font-black text-xl mb-1">
                G
              </div>
              <h1 className="text-xs uppercase tracking-[0.25em] font-bold text-slate-600">
                GovFlow Public Services
              </h1>
              <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                DIGITAL SERVICE CERTIFICATE
              </h2>
              <p className="text-xs text-slate-500 font-medium font-sans">
                {certificate.department}
              </p>
            </div>

            {/* Certificate Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200 font-mono">
              <div>
                <span className="text-slate-500">Certificate ID: </span>
                <strong className="text-slate-900">{certificate.id}</strong>
              </div>
              <div>
                <span className="text-slate-500">Issued: </span>
                <strong className="text-slate-900">{certificate.issueDate}</strong>
              </div>
              <div>
                <span className="text-slate-500">Status: </span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {certificate.status}
                </span>
              </div>
            </div>

            {/* Certificate Attestation Prose */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
              <p>
                This is to officially certify that <strong>{certificate.citizenName}</strong>, son/daughter/spouse of <strong>{certificate.fatherHusbandName}</strong>, resident of <strong>{certificate.address}</strong>, has successfully fulfilled all statutory documentation requirements for the grant of:
              </p>

              <div className="text-center py-2 bg-indigo-50/40 border-y border-indigo-100 font-sans font-bold text-base text-indigo-950">
                {certificate.serviceName}
              </div>

              {certificate.metadata.annualIncome && (
                <p>
                  According to official inquiry reports and verified tax/salary submissions, the gross total annual household income is certified as <strong>{certificate.metadata.annualIncome}</strong>.
                </p>
              )}

              <p className="text-xs text-slate-600 font-sans leading-normal">
                This digital credential is authenticated under the GovFlow Cryptographic Integrity Registry. Any alterations render this certificate void.
              </p>
            </div>

            {/* Bottom Section: QR Code, Seal, Signature */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* QR Verification Element */}
              <div className="flex items-center gap-3 text-left">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Certificate QR Verification"
                    className="w-24 h-24 border border-slate-300 p-1 bg-white rounded shadow-2xs"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-200 animate-pulse rounded" />
                )}
                <div className="text-[11px] text-slate-500 space-y-0.5 max-w-[140px]">
                  <span className="font-bold text-slate-800 block">Scan to Verify</span>
                  <span>Instant public verification via official cryptographic hash.</span>
                </div>
              </div>

              {/* Digital Signature & Seal */}
              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic font-bold text-slate-900 text-sm text-indigo-900">
                  Digitally Signed By Authority
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {certificate.issuingAuthority}
                </div>
                <div className="text-[11px] text-slate-500">
                  {certificate.officerDesignation}
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 max-w-[200px] truncate">
                  {certificate.digitalSignatureHash}
                </div>
              </div>
            </div>

            {/* Mandatory Academic Prototype Disclaimer */}
            <div className="text-center pt-3 border-t border-slate-200 text-[10px] text-slate-400 italic">
              Prototype certificate — not an official government document. For academic/hackathon evaluation.
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">Cryptographically verifiable on GovFlow</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
