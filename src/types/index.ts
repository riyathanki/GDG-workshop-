export type UserRole = 'citizen' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation?: string;
  department?: string;
  avatar?: string;
  mobile?: string;
  aadhaarMasked?: string; // Synthetic e.g. "XXXX-XXXX-4819"
  address?: string;
}

export type ServiceCategory = 
  | 'revenue'
  | 'social_welfare'
  | 'civic_administration'
  | 'education';

export interface ServiceRequirement {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  acceptedFormats: string[];
  maxSizeMb: number;
}

export interface GovernmentService {
  id: string;
  slug: string;
  name: string;
  department: string;
  category: ServiceCategory;
  description: string;
  purpose: string;
  estimatedDays: number;
  fee: number;
  eligibility: string[];
  requirements: ServiceRequirement[];
  popular?: boolean;
}

export type DocumentStatus = 
  | 'pending'
  | 'uploaded'
  | 'under_verification'
  | 'verified'
  | 'needs_correction'
  | 'resubmitted'
  | 'rejected';

export interface DocumentAnalysisResult {
  detectedType: string;
  detectedFields: {
    field: string;
    value: string;
    found: boolean;
  }[];
  readabilityScore: number; // 0-100
  qualityStatus: 'Good' | 'Fair' | 'Poor';
  potentialIssues: string[];
  confidenceScore: number; // 0-100
  recommendation: 'Auto-Approved' | 'Needs Officer Review' | 'Correction Advised';
}

export interface ApplicationDocument {
  id: string;
  requirementId: string;
  name: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  uploadDate?: string;
  fileUrl?: string;
  status: DocumentStatus;
  correctionReason?: string;
  correctionRequestedAt?: string;
  resubmittedAt?: string;
  analysis?: DocumentAnalysisResult;
}

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'documents_received'
  | 'initial_verification'
  | 'under_officer_review'
  | 'correction_required'
  | 'field_verification'
  | 'final_approval'
  | 'approved'
  | 'rejected';

export interface WorkflowTimelineEvent {
  id: string;
  stageName: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole | 'system';
  completed: boolean;
  active: boolean;
  iconType?: 'submit' | 'doc' | 'review' | 'correction' | 'approve' | 'cert';
}

export interface Application {
  id: string; // e.g. "APP-2026-004821"
  serviceId: string;
  serviceName: string;
  department: string;
  citizenId: string;
  citizenName: string;
  citizenMobile: string;
  citizenEmail: string;
  status: ApplicationStatus;
  priority: 'Normal' | 'Urgent' | 'High';
  createdAt: string;
  updatedAt: string;
  assignedOfficerName: string;
  assignedDepartment: string;
  currentStage: string;
  expectedNextStep: string;
  slaDays: number;
  personalDetails: {
    fullName: string;
    fatherHusbandName: string;
    gender: 'Male' | 'Female' | 'Other';
    dateOfBirth: string;
    mobile: string;
    email: string;
    maskedIdentityId: string; // Synthetic Masked ID
    permanentAddress: string;
    district: string;
    taluka: string;
    pincode: string;
    annualIncome?: number;
    occupation?: string;
    incomeSource?: string;
    purposeOfCertificate: string;
    category?: string;
  };
  documents: ApplicationDocument[];
  timeline: WorkflowTimelineEvent[];
  officerRemarks?: string;
  correctionNotes?: string;
  certificateId?: string;
}

export interface Certificate {
  id: string; // e.g. "CERT-2026-882193"
  applicationId: string;
  serviceName: string;
  department: string;
  citizenName: string;
  fatherHusbandName: string;
  address: string;
  district: string;
  issueDate: string;
  validUntil: string;
  issuingAuthority: string;
  officerDesignation: string;
  status: 'VALID' | 'REVOKED' | 'EXPIRED';
  qrVerificationUrl: string;
  digitalSignatureHash: string;
  metadata: {
    annualIncome?: string;
    category?: string;
    serviceSpecificDetail?: string;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  targetRole?: UserRole;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'alert';
  applicationId?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | 'system';
  action: string;
  entityId: string;
  entityType: 'application' | 'document' | 'certificate' | 'user';
  details: string;
  ipAddress: string;
}

export type AppLanguage = 'en' | 'hi' | 'gu';
