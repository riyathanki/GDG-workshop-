import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Save, 
  Sparkles,
  HelpCircle,
  FileCheck2,
  Info
} from 'lucide-react';
import { ApplicationDocument, DocumentAnalysisResult } from '../../types';

export const ApplicationWizard: React.FC = () => {
  const { 
    currentUser, 
    activeServiceForWizard, 
    services, 
    createApplication, 
    setCurrentView, 
    setActiveTrackingAppId,
    showToast,
    t 
  } = useApp();

  // If no service selected, default to Income Certificate (Primary Demo Service)
  const service = activeServiceForWizard || services.find(s => s.slug === 'income-certificate') || services[0];

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Personal Information
  const [personalDetails, setPersonalDetails] = useState({
    fullName: currentUser.name || 'Riya K. Patel',
    fatherHusbandName: 'Kamleshbhai Patel',
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    dateOfBirth: '1998-05-14',
    mobile: currentUser.mobile || '+91 98251 04821',
    email: currentUser.email || 'riya.patel@mockgov.example',
    maskedIdentityId: currentUser.aadhaarMasked || 'XXXX-XXXX-4821',
    permanentAddress: 'B-402, Shivalik Residency, Drive-In Road',
    district: 'Ahmedabad',
    taluka: 'Daskroi',
    pincode: '380054'
  });

  // Step 2: Service Details
  const [serviceDetails, setServiceDetails] = useState({
    annualIncome: 180000,
    occupation: 'Private Sector & Family Agriculture',
    incomeSource: 'Salaried Employment + Farm Land Proceeds',
    purposeOfCertificate: 'Higher Education Merit-cum-Means Tuition Scholarship',
    category: 'General'
  });

  // Step 3 & 4: Documents and their verification results
  const [documents, setDocuments] = useState<ApplicationDocument[]>(() => {
    return service.requirements.map((req, idx) => {
      // Seed realistic synthetic document files
      const defaultFileName = 
        req.id === 'doc-identity' ? 'riya_patel_electoral_id_masked.pdf' :
        req.id === 'doc-address' ? 'electricity_bill_aug2026.pdf' :
        req.id === 'doc-income' ? 'employer_salary_slip_and_declaration.pdf' :
        req.id === 'doc-photo' ? 'riya_recent_portrait.jpg' : 'self_declaration_affidavit.pdf';

      const defaultStatus = 
        req.id === 'doc-income' ? 'under_verification' : 'verified';

      const defaultAnalysis: DocumentAnalysisResult = {
        detectedType: req.name,
        detectedFields: [
          { field: 'Applicant Full Name', value: 'Riya K. Patel', found: true },
          { field: 'Relation / Lineage', value: 'Verified', found: true },
          { field: 'Document Authenticity Markers', value: 'Standard Structure', found: true }
        ],
        readabilityScore: req.id === 'doc-income' ? 78 : 96,
        qualityStatus: req.id === 'doc-income' ? 'Fair' : 'Good',
        potentialIssues: req.id === 'doc-income' ? ['Employer seal has slight ink smudging; manual review queued'] : [],
        confidenceScore: req.id === 'doc-income' ? 82 : 98,
        recommendation: req.id === 'doc-income' ? 'Needs Officer Review' : 'Auto-Approved'
      };

      return {
        id: `doc-wiz-${idx + 1}`,
        requirementId: req.id,
        name: req.name,
        fileName: defaultFileName,
        fileSize: '1.8 MB',
        fileType: 'application/pdf',
        uploadDate: new Date().toISOString(),
        status: defaultStatus,
        analysis: defaultAnalysis
      };
    });
  });

  // Step 6: Consent
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Steps Header array
  const steps = [
    { number: 1, title: 'Personal' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Documents' },
    { number: 4, title: 'Verification' },
    { number: 5, title: 'Review' },
    { number: 6, title: 'Submit' }
  ];

  const handleSimulateUpload = (reqId: string, customName?: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.requirementId === reqId) {
        return {
          ...doc,
          fileName: customName || `${doc.name.toLowerCase().replace(/\s+/g, '_')}_scan.pdf`,
          fileSize: '2.4 MB',
          fileType: 'application/pdf',
          status: 'verified',
          uploadDate: new Date().toISOString(),
          analysis: {
            detectedType: `${doc.name} (Valid OCR Structure)`,
            detectedFields: [
              { field: 'Name Verification', value: personalDetails.fullName, found: true },
              { field: 'Date / Stamp Validation', value: 'Clear Stamp Detected', found: true }
            ],
            readabilityScore: 97,
            qualityStatus: 'Good',
            potentialIssues: [],
            confidenceScore: 99,
            recommendation: 'Auto-Approved'
          }
        };
      }
      return doc;
    }));
    showToast(`Synthetic file uploaded for ${reqId}`, 'success');
  };

  const handleSubmit = () => {
    if (!consentGiven) {
      showToast('Please check the statutory declaration consent to submit', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const created = createApplication({
        serviceId: service.id,
        serviceName: service.name,
        department: service.department,
        citizenId: currentUser.id,
        citizenName: personalDetails.fullName,
        citizenMobile: personalDetails.mobile,
        citizenEmail: personalDetails.email,
        status: 'under_officer_review',
        priority: 'Normal',
        assignedOfficerName: 'Rajesh Verma (SDM)',
        assignedDepartment: service.department,
        currentStage: 'Document & Scrutiny Queue',
        expectedNextStep: 'Assigned officer review of income and residency proofs',
        slaDays: service.estimatedDays,
        personalDetails: {
          ...personalDetails,
          ...serviceDetails
        },
        documents
      });

      setIsSubmitting(false);
      showToast(`Application ${created.id} submitted successfully!`, 'success');
      setActiveTrackingAppId(created.id);
      setCurrentView('citizen_tracking');
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Top Breadcrumb & Service Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => setCurrentView('citizen_services')}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Services Catalog</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">
            Application for {service.name}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{service.department}</span>
            <span aria-hidden="true">·</span>
            <span>Est. SLA: {service.estimatedDays} days</span>
            <span aria-hidden="true">·</span>
            <span>Fee: {service.fee === 0 ? 'Free' : `₹${service.fee}`}</span>
          </div>
        </div>

        <button
          onClick={() => {
            showToast('Draft progress saved successfully', 'info');
          }}
          className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5 text-slate-400" />
          <span>Save Draft</span>
        </button>
      </div>

      {/* Multi-Step Wizard Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0 hidden sm:block" />
          
          {steps.map((st) => {
            const isCompleted = currentStep > st.number;
            const isCurrent = currentStep === st.number;

            return (
              <div 
                key={st.number} 
                className="relative z-10 flex flex-col items-center cursor-pointer"
                onClick={() => {
                  if (st.number < currentStep) setCurrentStep(st.number);
                }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : isCurrent 
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 shadow-xs' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : st.number}
                </div>
                <span className={`text-[11px] font-medium mt-1.5 hidden sm:inline ${
                  isCurrent ? 'text-indigo-600 font-semibold' : 'text-slate-500'
                }`}>
                  {st.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        
        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Step 1: Personal Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify applicant profile information. Pre-filled with synthetic demo citizen credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Full Name of Applicant (as per identity record) *
                </label>
                <input
                  type="text"
                  value={personalDetails.fullName}
                  onChange={e => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Father / Husband Name *
                </label>
                <input
                  type="text"
                  value={personalDetails.fatherHusbandName}
                  onChange={e => setPersonalDetails({ ...personalDetails, fatherHusbandName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={personalDetails.gender}
                  onChange={e => setPersonalDetails({ ...personalDetails, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={personalDetails.dateOfBirth}
                  onChange={e => setPersonalDetails({ ...personalDetails, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Mobile Number (SMS Updates) *
                </label>
                <input
                  type="tel"
                  value={personalDetails.mobile}
                  onChange={e => setPersonalDetails({ ...personalDetails, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={personalDetails.email}
                  onChange={e => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">
                  Permanent Residential Address *
                </label>
                <input
                  type="text"
                  value={personalDetails.permanentAddress}
                  onChange={e => setPersonalDetails({ ...personalDetails, permanentAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  value={personalDetails.district}
                  onChange={e => setPersonalDetails({ ...personalDetails, district: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Taluka / Sub-Division *
                </label>
                <input
                  type="text"
                  value={personalDetails.taluka}
                  onChange={e => setPersonalDetails({ ...personalDetails, taluka: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Service Specific Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Step 2: Service Specific Particulars
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Financial and declaration specifics required for statutory assessment of {service.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Total Annual Household Income (in ₹ INR) *
                </label>
                <input
                  type="number"
                  value={serviceDetails.annualIncome}
                  onChange={e => setServiceDetails({ ...serviceDetails, annualIncome: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Rupees: ₹1,80,000 (One Lakh Eighty Thousand Only)
                </span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Occupation / Source Category *
                </label>
                <input
                  type="text"
                  value={serviceDetails.occupation}
                  onChange={e => setServiceDetails({ ...serviceDetails, occupation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">
                  Sources of Income Details *
                </label>
                <input
                  type="text"
                  value={serviceDetails.incomeSource}
                  onChange={e => setServiceDetails({ ...serviceDetails, incomeSource: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">
                  Specific Purpose for Applying *
                </label>
                <input
                  type="text"
                  value={serviceDetails.purposeOfCertificate}
                  onChange={e => setServiceDetails({ ...serviceDetails, purposeOfCertificate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Required Documents Upload */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Step 3: Document Upload Interface
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload synthetic supporting documents. Accepted formats: PDF, JPG, PNG (Max 5MB per file).
              </p>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => {
                const isUploaded = !!doc.fileName;

                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span>{doc.name}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                            {doc.status === 'verified' ? 'Uploaded & Scanned' : 'Ready for Scrutiny'}
                          </span>
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          {doc.fileName ? (
                            <span className="font-mono text-slate-700">{doc.fileName} ({doc.fileSize})</span>
                          ) : (
                            <span>No file selected yet</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleSimulateUpload(doc.requirementId)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Simulate Upload</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Automated Document Verification */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Step 4: Automated Document Verification Engine</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulated pre-scrutiny heuristics examining OCR readability, field detection, and potential issues.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {documents.map((doc) => {
                const analysis = doc.analysis;
                const isNeedsReview = analysis?.recommendation === 'Needs Officer Review';

                return (
                  <div 
                    key={doc.id}
                    className={`p-4 rounded-xl border transition-all text-xs ${
                      isNeedsReview 
                        ? 'bg-amber-50/50 border-amber-200' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {doc.name}
                        </div>
                        <div className="text-slate-500 mt-0.5 font-mono">
                          {doc.fileName} · Detected as: {analysis?.detectedType}
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                        isNeedsReview
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {analysis?.recommendation}
                      </span>
                    </div>

                    {/* Detected fields */}
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-2 rounded bg-slate-50">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Readability</span>
                        <span className="font-bold text-slate-800 font-mono text-xs">{analysis?.readabilityScore}% Quality ({analysis?.qualityStatus})</span>
                      </div>

                      <div className="p-2 rounded bg-slate-50">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Confidence</span>
                        <span className="font-bold text-slate-800 font-mono text-xs">{analysis?.confidenceScore}% Heuristic Score</span>
                      </div>

                      <div className="p-2 rounded bg-slate-50">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Detected Fields</span>
                        <span className="font-bold text-slate-800 font-mono text-xs">{analysis?.detectedFields.length} key fields found</span>
                      </div>
                    </div>

                    {/* Potential issues notice */}
                    {analysis?.potentialIssues && analysis.potentialIssues.length > 0 && (
                      <div className="mt-2 text-amber-700 bg-amber-100/60 p-2 rounded flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Advisory:</strong> {analysis.potentialIssues[0]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Review Application */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Step 5: Review Application Summary
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Check all recorded fields prior to submitting your formal request.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
              <div className="p-4 bg-slate-50 flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Applicant Particulars
                </span>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div><strong>Full Name:</strong> {personalDetails.fullName}</div>
                <div><strong>Relation:</strong> {personalDetails.fatherHusbandName}</div>
                <div><strong>Gender / DOB:</strong> {personalDetails.gender} · {personalDetails.dateOfBirth}</div>
                <div><strong>Mobile:</strong> {personalDetails.mobile}</div>
                <div className="sm:col-span-2"><strong>Address:</strong> {personalDetails.permanentAddress}, {personalDetails.district}</div>
              </div>

              <div className="p-4 bg-slate-50 flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Service & Financial Details
                </span>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div><strong>Annual Declared Income:</strong> ₹{serviceDetails.annualIncome.toLocaleString('en-IN')}</div>
                <div><strong>Occupation:</strong> {serviceDetails.occupation}</div>
                <div className="sm:col-span-2"><strong>Purpose:</strong> {serviceDetails.purposeOfCertificate}</div>
              </div>

              <div className="p-4 bg-slate-50 flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Attached Proof Documents ({documents.length})
                </span>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="p-4 space-y-2">
                {documents.map(d => (
                  <div key={d.id} className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{d.name}</span>
                    </span>
                    <span className="font-mono text-slate-400">{d.fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Consent & Final Submit */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Step 6: Statutory Consent & Final Submission
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm your statutory declaration to record the application in the GovFlow real-time tracking registry.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 leading-relaxed">
              <h4 className="font-bold text-slate-900">Statutory Self-Declaration Statement:</h4>
              <p>
                "I hereby solemnly affirm that the information and enclosures furnished in this application for <strong>{service.name}</strong> are true and accurate to the best of my knowledge and belief. I acknowledge that this is a digital prototype system demonstrating government service workflows with synthetic credentials."
              </p>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={e => setConsentGiven(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-800">
                I have read and consent to the statutory terms. I confirm submission of my application package.
              </span>
            </label>
          </div>
        )}

        {/* Navigation Buttons Bar */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStep > 1) setCurrentStep(prev => prev - 1);
              else setCurrentView('citizen_services');
            }}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentStep === 1 ? 'Cancel' : t('back')}</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>{t('continue')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!consentGiven || isSubmitting}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : t('submitApplication')}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
