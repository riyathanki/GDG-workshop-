import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Application, 
  ApplicationStatus, 
  AppLanguage, 
  AuditLogItem, 
  Certificate, 
  GovernmentService, 
  NotificationItem, 
  User, 
  UserRole 
} from '../types';
import { INITIAL_USERS, INITIAL_APPLICATIONS, INITIAL_CERTIFICATES, INITIAL_NOTIFICATIONS, INITIAL_AUDIT_LOGS } from '../data/initialData';
import { GOVERNMENT_SERVICES } from '../data/servicesData';
import { TRANSLATIONS } from '../data/translations';

export type AppView = 
  | 'citizen_home'
  | 'citizen_services'
  | 'citizen_wizard'
  | 'citizen_applications'
  | 'citizen_tracking'
  | 'citizen_documents'
  | 'officer_portal'
  | 'admin_dashboard'
  | 'verify_certificate';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (role: UserRole, userId?: string) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  
  // Navigation contextual IDs
  activeServiceForWizard: GovernmentService | null;
  setActiveServiceForWizard: (svc: GovernmentService | null) => void;
  activeTrackingAppId: string | null;
  setActiveTrackingAppId: (id: string | null) => void;
  activeReviewAppId: string | null;
  setActiveReviewAppId: (id: string | null) => void;
  activeVerifyCertId: string | null;
  setActiveVerifyCertId: (id: string | null) => void;

  // Data collections
  services: GovernmentService[];
  applications: Application[];
  certificates: Certificate[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];

  // Actions
  createApplication: (appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => Application;
  updateApplication: (appId: string, updates: Partial<Application>) => void;
  officerRequestCorrection: (appId: string, docId: string, reason: string, remarks?: string) => void;
  citizenResubmitDocument: (appId: string, docId: string, fileDetails: { name: string; size: string; type: string }) => void;
  officerApproveApplication: (appId: string, remarks?: string) => Certificate;
  officerRejectApplication: (appId: string, reason: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;

  // UI state & Preferences
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;

  // Modals
  serviceDetailModal: GovernmentService | null;
  setServiceDetailModal: (svc: GovernmentService | null) => void;
  certificateModal: Certificate | null;
  setCertificateModal: (cert: Certificate | null) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  isDemoGuideOpen: boolean;
  setIsDemoGuideOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;

  // Toast alert
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'govflow_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial or persisted state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return INITIAL_USERS.find(u => u.role === 'citizen') || INITIAL_USERS[0];
  });

  const [currentView, setCurrentView] = useState<AppView>('citizen_home');
  const [activeServiceForWizard, setActiveServiceForWizard] = useState<GovernmentService | null>(null);
  const [activeTrackingAppId, setActiveTrackingAppId] = useState<string | null>('APP-2026-004821');
  const [activeReviewAppId, setActiveReviewAppId] = useState<string | null>(null);
  const [activeVerifyCertId, setActiveVerifyCertId] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_apps`);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_certs`);
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audits`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // UI preferences
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Modals
  const [serviceDetailModal, setServiceDetailModal] = useState<GovernmentService | null>(null);
  const [certificateModal, setCertificateModal] = useState<Certificate | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_apps`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_certs`, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audits`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en'][key] || key;
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const addAuditLog = (action: string, entityId: string, entityType: 'application' | 'document' | 'certificate' | 'user', details: string) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    
    const newEntry: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: formattedDate,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      entityId,
      entityType,
      details,
      ipAddress: '103.24.12.89'
    };

    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: formattedDate,
      read: false,
      ...item
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  const switchUser = (role: UserRole, userId?: string) => {
    let target = INITIAL_USERS.find(u => userId ? u.id === userId : u.role === role);
    if (!target) {
      target = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    }
    setCurrentUser(target);

    // Contextually switch default view
    if (role === 'citizen') {
      setCurrentView('citizen_home');
    } else if (role === 'officer') {
      setCurrentView('officer_portal');
      setActiveReviewAppId(null);
    } else if (role === 'admin') {
      setCurrentView('admin_dashboard');
    }

    showToast(`Switched role to: ${target.name} (${target.role.toUpperCase()})`, 'info');
  };

  const createApplication = (appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Application => {
    const appNumber = 4824 + applications.length;
    const newId = `APP-2026-00${appNumber}`;
    const nowIso = new Date().toISOString();
    const nowFormatted = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newApp: Application = {
      ...appData,
      id: newId,
      createdAt: nowIso,
      updatedAt: nowIso,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          stageName: 'Submission',
          title: 'Application Submitted',
          description: `Citizen ${appData.citizenName} submitted ${appData.serviceName} application.`,
          timestamp: nowFormatted,
          actor: appData.citizenName,
          actorRole: 'citizen',
          completed: true,
          active: false,
          iconType: 'submit'
        },
        {
          id: `tl-${Date.now()}-2`,
          stageName: 'Intake',
          title: 'Documents Received & Registered',
          description: `Application registered with tracking number ${newId}. Receipt generated.`,
          timestamp: nowFormatted,
          actor: 'GovFlow System',
          actorRole: 'system',
          completed: true,
          active: false,
          iconType: 'doc'
        },
        {
          id: `tl-${Date.now()}-3`,
          stageName: 'Initial Verification',
          title: 'Automated Document Verification',
          description: 'Automated optical structure scan completed on uploaded documents.',
          timestamp: nowFormatted,
          actor: 'GovFlow AI Heuristic Analyzer',
          actorRole: 'system',
          completed: true,
          active: true,
          iconType: 'doc'
        },
        {
          id: `tl-${Date.now()}-4`,
          stageName: 'Officer Scrutiny',
          title: 'Under Officer Review',
          description: `Queued for scrutiny by ${appData.assignedOfficerName}.`,
          timestamp: 'In Progress',
          actor: appData.assignedOfficerName,
          actorRole: 'officer',
          completed: false,
          active: false,
          iconType: 'review'
        },
        {
          id: `tl-${Date.now()}-5`,
          stageName: 'Field Validation',
          title: 'Field Verification / Revenue Cross-Check',
          description: 'Validation with relevant district revenue registers.',
          timestamp: 'Scheduled',
          actor: 'Field Inspector',
          actorRole: 'officer',
          completed: false,
          active: false,
          iconType: 'review'
        },
        {
          id: `tl-${Date.now()}-6`,
          stageName: 'Final Decision',
          title: 'Statutory Approval & Digital Signature',
          description: 'Issuance approval by Competent Authority.',
          timestamp: 'Scheduled',
          actor: 'Competent Authority',
          actorRole: 'officer',
          completed: false,
          active: false,
          iconType: 'approve'
        },
        {
          id: `tl-${Date.now()}-7`,
          stageName: 'Issuance',
          title: 'Certificate Generation & QR Registration',
          description: 'Issuance of official digital certificate with public QR verification.',
          timestamp: 'Scheduled',
          actor: 'GovFlow Trust Engine',
          actorRole: 'system',
          completed: false,
          active: false,
          iconType: 'cert'
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);

    // Audit Log
    addAuditLog('Application Submitted', newId, 'application', `New application submitted for ${newApp.serviceName}`);

    // Notification for Citizen
    addNotification({
      userId: currentUser.id,
      targetRole: 'citizen',
      title: 'Application Successfully Submitted',
      message: `Your application ${newId} for ${newApp.serviceName} has been recorded. Tracking is now active.`,
      type: 'success',
      applicationId: newId
    });

    // Notification for Officer
    addNotification({
      userId: 'usr-officer-rajesh',
      targetRole: 'officer',
      title: 'New Application Assigned',
      message: `New application ${newId} (${newApp.serviceName}) assigned for scrutiny.`,
      type: 'info',
      applicationId: newId
    });

    return newApp;
  };

  const updateApplication = (appId: string, updates: Partial<Application>) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  // OFFICER ACTION: Request Correction
  const officerRequestCorrection = (appId: string, docId: string, reason: string, remarks?: string) => {
    const nowFormatted = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const targetDoc = app.documents.find(d => d.id === docId);
      const updatedDocs = app.documents.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            status: 'needs_correction' as const,
            correctionReason: reason,
            correctionRequestedAt: nowFormatted
          };
        }
        return d;
      });

      const updatedTimeline = [
        ...app.timeline,
        {
          id: `tl-corr-${Date.now()}`,
          stageName: 'Correction Required',
          title: `Document Correction Requested: ${targetDoc?.name || 'Document'}`,
          description: `Officer remarked: "${reason}". Applicant must resubmit legible document.`,
          timestamp: nowFormatted,
          actor: currentUser.name,
          actorRole: 'officer' as const,
          completed: true,
          active: true,
          iconType: 'correction' as const
        }
      ];

      return {
        ...app,
        status: 'correction_required' as ApplicationStatus,
        currentStage: `Correction Requested: ${targetDoc?.name || 'Document'}`,
        expectedNextStep: 'Awaiting citizen resubmission of corrected proof',
        officerRemarks: remarks || reason,
        correctionNotes: reason,
        documents: updatedDocs,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString()
      };
    }));

    // Audit log
    addAuditLog('Correction Requested', appId, 'application', `Officer requested correction for document: ${reason}`);

    // Notify citizen
    const targetApp = applications.find(a => a.id === appId);
    if (targetApp) {
      addNotification({
        userId: targetApp.citizenId,
        targetRole: 'citizen',
        title: 'Action Required: Document Correction',
        message: `Your ${targetApp.serviceName} application (${appId}) requires document correction. Reason: ${reason}`,
        type: 'warning',
        applicationId: appId
      });
    }

    showToast(`Correction request dispatched to citizen for ${appId}`, 'warning');
  };

  // CITIZEN ACTION: Resubmit Document
  const citizenResubmitDocument = (appId: string, docId: string, fileDetails: { name: string; size: string; type: string }) => {
    const nowFormatted = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const targetDoc = app.documents.find(d => d.id === docId);
      const updatedDocs = app.documents.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            fileName: fileDetails.name,
            fileSize: fileDetails.size,
            fileType: fileDetails.type,
            status: 'resubmitted' as const,
            resubmittedAt: nowFormatted,
            analysis: {
              detectedType: 'Resubmitted Proof Document (High Quality Scan)',
              detectedFields: [
                { field: 'Legibility Check', value: 'Clear & Unobstructed', found: true },
                { field: 'Valid Official Stamp', value: 'Clearly Visible', found: true },
                { field: 'Applicant Verification', value: 'Identity & Details Match', found: true }
              ],
              readabilityScore: 98,
              qualityStatus: 'Good' as const,
              potentialIssues: [],
              confidenceScore: 97,
              recommendation: 'Auto-Approved' as const
            }
          };
        }
        return d;
      });

      const updatedTimeline = [
        ...app.timeline,
        {
          id: `tl-resub-${Date.now()}`,
          stageName: 'Citizen Resubmission',
          title: `Document Resubmitted: ${targetDoc?.name || 'Document'}`,
          description: `Citizen uploaded fresh copy "${fileDetails.name}". Automated re-analysis passed. Returned to officer queue.`,
          timestamp: nowFormatted,
          actor: currentUser.name,
          actorRole: 'citizen' as const,
          completed: true,
          active: true,
          iconType: 'doc' as const
        }
      ];

      return {
        ...app,
        status: 'under_officer_review' as ApplicationStatus,
        currentStage: 'Resubmitted Document Ready for Final Scrutiny',
        expectedNextStep: 'Assigned officer review of newly uploaded document',
        documents: updatedDocs,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString()
      };
    }));

    // Audit log
    addAuditLog('Document Resubmitted', appId, 'document', `Citizen uploaded replacement file: ${fileDetails.name}`);

    // Notify Officer
    addNotification({
      userId: 'usr-officer-rajesh',
      targetRole: 'officer',
      title: 'Document Resubmitted by Citizen',
      message: `Citizen has resubmitted corrected document for ${appId}. Ready for final decision.`,
      type: 'info',
      applicationId: appId
    });

    showToast('Corrected document uploaded successfully! Officer has been notified.', 'success');
  };

  // OFFICER ACTION: Final Approval & Certificate Generation
  const officerApproveApplication = (appId: string, remarks?: string): Certificate => {
    const app = applications.find(a => a.id === appId);
    if (!app) throw new Error('Application not found');

    const certNumber = `CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowFormatted = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`;
    const validUntilFormatted = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const nowTimestamp = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newCertificate: Certificate = {
      id: certNumber,
      applicationId: app.id,
      serviceName: app.serviceName,
      department: app.department,
      citizenName: app.personalDetails.fullName,
      fatherHusbandName: app.personalDetails.fatherHusbandName,
      address: `${app.personalDetails.permanentAddress}, ${app.personalDetails.district} - ${app.personalDetails.pincode}`,
      district: app.personalDetails.district,
      issueDate: nowFormatted,
      validUntil: validUntilFormatted,
      issuingAuthority: 'Revenue Sub-Divisional Officer & Executive Magistrate',
      officerDesignation: currentUser.designation || 'Sub-Divisional Magistrate (SDM)',
      status: 'VALID',
      qrVerificationUrl: `${window.location.origin}/verify/${certNumber}`,
      digitalSignatureHash: `SHA256: ${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      metadata: {
        annualIncome: app.personalDetails.annualIncome ? `₹${app.personalDetails.annualIncome.toLocaleString('en-IN')} (Rupees One Lakh Eighty Thousand Only)` : undefined,
        category: app.personalDetails.category,
        serviceSpecificDetail: `Issued on basis of Talati revenue inquiry and valid proof submissions.`
      }
    };

    // Update application state
    setApplications(prev => prev.map(a => {
      if (a.id !== appId) return a;

      const updatedDocs = a.documents.map(d => ({
        ...d,
        status: 'verified' as const
      }));

      const updatedTimeline = [
        ...a.timeline.map(step => ({ ...step, completed: true, active: false })),
        {
          id: `tl-appr-${Date.now()}`,
          stageName: 'Final Approval',
          title: 'Application Approved by Officer',
          description: `Approved by ${currentUser.name} (${currentUser.designation || 'Competent Authority'}). Remarks: ${remarks || 'All statutory requirements and proof records verified.'}`,
          timestamp: nowTimestamp,
          actor: currentUser.name,
          actorRole: 'officer' as const,
          completed: true,
          active: false,
          iconType: 'approve' as const
        },
        {
          id: `tl-cert-${Date.now()}`,
          stageName: 'Certificate Issued',
          title: `Prototype Certificate Generated (${certNumber})`,
          description: 'Official digital certificate signed and registered in GovFlow verification registry with live QR validation.',
          timestamp: nowTimestamp,
          actor: 'GovFlow Trust Engine',
          actorRole: 'system' as const,
          completed: true,
          active: true,
          iconType: 'cert' as const
        }
      ];

      return {
        ...a,
        status: 'approved' as ApplicationStatus,
        currentStage: 'Certificate Issued & Ready for Download',
        expectedNextStep: 'Applicant may download or verify certificate via QR code',
        officerRemarks: remarks || 'All criteria verified. Statutory approval granted.',
        certificateId: certNumber,
        documents: updatedDocs,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString()
      };
    }));

    // Add certificate
    setCertificates(prev => [newCertificate, ...prev]);

    // Audit log
    addAuditLog('Application Approved & Certificate Issued', appId, 'certificate', `Officer granted approval. Certificate ${certNumber} generated.`);

    // Notification for Citizen
    addNotification({
      userId: app.citizenId,
      targetRole: 'citizen',
      title: 'Congratulations! Application Approved',
      message: `Your ${app.serviceName} application (${app.id}) has been approved! Certificate ${certNumber} is ready for download.`,
      type: 'success',
      applicationId: app.id
    });

    showToast(`Application ${appId} Approved! Certificate ${certNumber} generated.`, 'success');
    return newCertificate;
  };

  // OFFICER ACTION: Reject Application
  const officerRejectApplication = (appId: string, reason: string) => {
    const nowTimestamp = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    setApplications(prev => prev.map(a => {
      if (a.id !== appId) return a;

      const updatedTimeline = [
        ...a.timeline.map(step => ({ ...step, active: false })),
        {
          id: `tl-rej-${Date.now()}`,
          stageName: 'Application Rejected',
          title: 'Application Rejected by Competent Authority',
          description: `Grounds for rejection: ${reason}`,
          timestamp: nowTimestamp,
          actor: currentUser.name,
          actorRole: 'officer' as const,
          completed: true,
          active: true,
          iconType: 'review' as const
        }
      ];

      return {
        ...a,
        status: 'rejected' as ApplicationStatus,
        currentStage: 'Rejected by Officer',
        expectedNextStep: 'Citizen may reapply with correct credentials or file representation',
        officerRemarks: reason,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString()
      };
    }));

    addAuditLog('Application Rejected', appId, 'application', `Grounds: ${reason}`);

    const targetApp = applications.find(a => a.id === appId);
    if (targetApp) {
      addNotification({
        userId: targetApp.citizenId,
        targetRole: 'citizen',
        title: 'Application Update: Rejection Notice',
        message: `Your ${targetApp.serviceName} application (${appId}) was not approved. Reason: ${reason}`,
        type: 'alert',
        applicationId: appId
      });
    }

    showToast(`Application ${appId} marked as rejected.`, 'warning');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_apps`);
    localStorage.removeItem(`${STORAGE_KEY}_certs`);
    localStorage.removeItem(`${STORAGE_KEY}_notifs`);
    localStorage.removeItem(`${STORAGE_KEY}_audits`);
    
    setApplications(INITIAL_APPLICATIONS);
    setCertificates(INITIAL_CERTIFICATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(INITIAL_USERS[0]);
    setCurrentView('citizen_home');
    setActiveTrackingAppId('APP-2026-004821');

    showToast('Demo data successfully reset to baseline!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers: INITIAL_USERS,
        switchUser,
        currentView,
        setCurrentView,
        activeServiceForWizard,
        setActiveServiceForWizard,
        activeTrackingAppId,
        setActiveTrackingAppId,
        activeReviewAppId,
        setActiveReviewAppId,
        activeVerifyCertId,
        setActiveVerifyCertId,
        services: GOVERNMENT_SERVICES,
        applications,
        certificates,
        notifications,
        auditLogs,
        createApplication,
        updateApplication,
        officerRequestCorrection,
        citizenResubmitDocument,
        officerApproveApplication,
        officerRejectApplication,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        language,
        setLanguage,
        t,
        highContrast,
        toggleHighContrast,
        fontSize,
        setFontSize,
        serviceDetailModal,
        setServiceDetailModal,
        certificateModal,
        setCertificateModal,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isDemoGuideOpen,
        setIsDemoGuideOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
