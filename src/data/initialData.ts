import { Application, AuditLogItem, Certificate, NotificationItem, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-citizen-riya',
    name: 'Riya Patel',
    email: 'riya.patel@mockgov.example',
    role: 'citizen',
    mobile: '+91 98251 04821',
    aadhaarMasked: 'XXXX-XXXX-4821',
    address: 'B-402, Shivalik Residency, Drive-In Road, Ahmedabad, Gujarat - 380054'
  },
  {
    id: 'usr-citizen-aarav',
    name: 'Aarav Shah',
    email: 'aarav.shah@mockgov.example',
    role: 'citizen',
    mobile: '+91 98790 12345',
    aadhaarMasked: 'XXXX-XXXX-1234',
    address: '14, Green Valley Society, Alkapuri, Vadodara, Gujarat - 390007'
  },
  {
    id: 'usr-citizen-meera',
    name: 'Meera Joshi',
    email: 'meera.joshi@mockgov.example',
    role: 'citizen',
    mobile: '+91 94280 67890',
    aadhaarMasked: 'XXXX-XXXX-6789',
    address: 'Plot 88, Sector 19, Gandhinagar, Gujarat - 382019'
  },
  {
    id: 'usr-officer-rajesh',
    name: 'Rajesh Verma',
    email: 'rajesh.verma@govflow.internal',
    role: 'officer',
    designation: 'Sub-Divisional Revenue Magistrate (SDM)',
    department: 'Revenue & District Administration',
    mobile: '+91 98250 88200'
  },
  {
    id: 'usr-admin-sunita',
    name: 'Dr. Sunita Rao',
    email: 'sunita.rao@govflow.internal',
    role: 'admin',
    designation: 'Director General of Digital Public Services',
    department: 'Administrative Reforms & Public Grievance',
    mobile: '+91 98110 55443'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'APP-2026-004821',
    serviceId: 'srv-income-cert',
    serviceName: 'Income Certificate',
    department: 'Revenue & District Administration',
    citizenId: 'usr-citizen-riya',
    citizenName: 'Riya Patel',
    citizenMobile: '+91 98251 04821',
    citizenEmail: 'riya.patel@mockgov.example',
    status: 'under_officer_review',
    priority: 'Normal',
    createdAt: '2026-09-24T10:14:00Z',
    updatedAt: '2026-09-26T11:30:00Z',
    assignedOfficerName: 'Rajesh Verma (SDM)',
    assignedDepartment: 'Revenue Sub-Division West',
    currentStage: 'Officer Document & Lineage Scrutiny',
    expectedNextStep: 'Officer verification of submitted salary slip & declaration',
    slaDays: 7,
    personalDetails: {
      fullName: 'Riya K. Patel',
      fatherHusbandName: 'Kamleshbhai Patel',
      gender: 'Female',
      dateOfBirth: '1998-05-14',
      mobile: '+91 98251 04821',
      email: 'riya.patel@mockgov.example',
      maskedIdentityId: 'XXXX-XXXX-4821',
      permanentAddress: 'B-402, Shivalik Residency, Drive-In Road',
      district: 'Ahmedabad',
      taluka: 'Daskroi',
      pincode: '380054',
      annualIncome: 180000,
      occupation: 'Private Sector & Family Agriculture',
      incomeSource: 'Salaried Employment + Farm Land Proceeds',
      purposeOfCertificate: 'Higher Education Merit-cum-Means Tuition Scholarship',
      category: 'General'
    },
    documents: [
      {
        id: 'doc-inst-1',
        requirementId: 'doc-identity',
        name: 'Identity Proof',
        fileName: 'riya_patel_electoral_id_masked.pdf',
        fileSize: '1.4 MB',
        fileType: 'application/pdf',
        uploadDate: '2026-09-24T10:18:00Z',
        fileUrl: '#mock-view-id',
        status: 'verified',
        analysis: {
          detectedType: 'Electoral Photo Identity Card (EPIC)',
          detectedFields: [
            { field: 'Applicant Full Name', value: 'Riya K. Patel', found: true },
            { field: 'Relation Name', value: 'Kamleshbhai Patel', found: true },
            { field: 'EPIC Reference Hash', value: 'GJ/07/042/1892', found: true }
          ],
          readabilityScore: 96,
          qualityStatus: 'Good',
          potentialIssues: [],
          confidenceScore: 98,
          recommendation: 'Auto-Approved'
        }
      },
      {
        id: 'doc-inst-2',
        requirementId: 'doc-address',
        name: 'Address Proof',
        fileName: 'electricity_bill_aug2026.pdf',
        fileSize: '2.1 MB',
        fileType: 'application/pdf',
        uploadDate: '2026-09-24T10:20:00Z',
        fileUrl: '#mock-view-address',
        status: 'verified',
        analysis: {
          detectedType: 'Utility Bill (Torrent Power)',
          detectedFields: [
            { field: 'Consumer Name', value: 'Kamleshbhai Patel', found: true },
            { field: 'Service Address', value: 'B-402 Shivalik Residency, Ahmedabad', found: true },
            { field: 'Billing Month', value: 'August 2026', found: true }
          ],
          readabilityScore: 92,
          qualityStatus: 'Good',
          potentialIssues: [],
          confidenceScore: 94,
          recommendation: 'Auto-Approved'
        }
      },
      {
        id: 'doc-inst-3',
        requirementId: 'doc-income',
        name: 'Income Proof',
        fileName: 'employer_salary_slip_and_declaration.pdf',
        fileSize: '3.4 MB',
        fileType: 'application/pdf',
        uploadDate: '2026-09-24T10:22:00Z',
        fileUrl: '#mock-view-income',
        status: 'under_verification',
        analysis: {
          detectedType: 'Employer Salary Statement',
          detectedFields: [
            { field: 'Employee Name', value: 'Riya K. Patel', found: true },
            { field: 'Annual Gross Figures', value: '₹1,80,000 INR', found: true },
            { field: 'Employer Stamp / Seal', value: 'Partially faint signature imprint', found: true }
          ],
          readabilityScore: 78,
          qualityStatus: 'Fair',
          potentialIssues: ['Employer seal stamp has mild smudging along the bottom edge'],
          confidenceScore: 82,
          recommendation: 'Needs Officer Review'
        }
      },
      {
        id: 'doc-inst-4',
        requirementId: 'doc-photo',
        name: 'Applicant Photograph',
        fileName: 'riya_recent_portrait.jpg',
        fileSize: '840 KB',
        fileType: 'image/jpeg',
        uploadDate: '2026-09-24T10:24:00Z',
        fileUrl: '#mock-view-photo',
        status: 'verified',
        analysis: {
          detectedType: 'Passport Size Color Photograph',
          detectedFields: [
            { field: 'Face Visibility', value: 'Clear frontal view', found: true },
            { field: 'Background Contrast', value: 'Plain light off-white', found: true }
          ],
          readabilityScore: 99,
          qualityStatus: 'Good',
          potentialIssues: [],
          confidenceScore: 99,
          recommendation: 'Auto-Approved'
        }
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        stageName: 'Submission',
        title: 'Application Submitted',
        description: 'Citizen Riya Patel submitted Income Certificate application with 4 attached documents.',
        timestamp: '24 Sep 2026, 10:25 AM',
        actor: 'Riya Patel',
        actorRole: 'citizen',
        completed: true,
        active: false,
        iconType: 'submit'
      },
      {
        id: 'tl-2',
        stageName: 'Intake',
        title: 'Documents Received & Registered',
        description: 'System generated tracking identifier APP-2026-004821 and dispatched receipt SMS.',
        timestamp: '24 Sep 2026, 10:26 AM',
        actor: 'GovFlow Ingestion Engine',
        actorRole: 'system',
        completed: true,
        active: false,
        iconType: 'doc'
      },
      {
        id: 'tl-3',
        stageName: 'Automated Check',
        title: 'Automated Document Verification',
        description: 'Optical structure analysis completed: 3 documents passed integrity checks, 1 flagged for manual officer scrutiny.',
        timestamp: '24 Sep 2026, 10:30 AM',
        actor: 'GovFlow AI Heuristic Analyzer',
        actorRole: 'system',
        completed: true,
        active: false,
        iconType: 'doc'
      },
      {
        id: 'tl-4',
        stageName: 'Officer Scrutiny',
        title: 'Officer Review in Progress',
        description: 'Assigned to Sub-Divisional Revenue Magistrate Rajesh Verma for statutory scrutiny.',
        timestamp: '26 Sep 2026, 11:30 AM',
        actor: 'Rajesh Verma (SDM)',
        actorRole: 'officer',
        completed: false,
        active: true,
        iconType: 'review'
      },
      {
        id: 'tl-5',
        stageName: 'Inspection',
        title: 'Field Verification / Revenue Record Validation',
        description: 'Cross-verifying family agricultural revenue entry with district land repository.',
        timestamp: 'Pending Officer Action',
        actor: 'Talati / Revenue Inspector',
        actorRole: 'officer',
        completed: false,
        active: false,
        iconType: 'review'
      },
      {
        id: 'tl-6',
        stageName: 'Decision',
        title: 'Final Approval & Digital Seal',
        description: 'Affixing cryptographic signature and seal by Competent Issuing Authority.',
        timestamp: 'Pending Final Verification',
        actor: 'Competent Authority',
        actorRole: 'officer',
        completed: false,
        active: false,
        iconType: 'approve'
      },
      {
        id: 'tl-7',
        stageName: 'Issuance',
        title: 'Certificate Generation & Public QR Registry',
        description: 'Issuance of tamper-evident digital certificate with unique QR code verification.',
        timestamp: 'Scheduled post-approval',
        actor: 'GovFlow Trust Engine',
        actorRole: 'system',
        completed: false,
        active: false,
        iconType: 'cert'
      }
    ]
  },
  {
    id: 'APP-2026-004822',
    serviceId: 'srv-caste-cert',
    serviceName: 'Caste Certificate',
    department: 'Social Justice & Empowerment',
    citizenId: 'usr-citizen-aarav',
    citizenName: 'Aarav Shah',
    citizenMobile: '+91 98790 12345',
    citizenEmail: 'aarav.shah@mockgov.example',
    status: 'initial_verification',
    priority: 'Normal',
    createdAt: '2026-09-25T14:20:00Z',
    updatedAt: '2026-09-25T14:45:00Z',
    assignedOfficerName: 'Pooja Trivedi (Social Welfare Officer)',
    assignedDepartment: 'Social Justice Vadodara',
    currentStage: 'Genealogy Document Ingestion',
    expectedNextStep: 'Verification of paternal lineage records prior to 1978',
    slaDays: 15,
    personalDetails: {
      fullName: 'Aarav H. Shah',
      fatherHusbandName: 'Hiteshbhai Shah',
      gender: 'Male',
      dateOfBirth: '2001-11-20',
      mobile: '+91 98790 12345',
      email: 'aarav.shah@mockgov.example',
      maskedIdentityId: 'XXXX-XXXX-1234',
      permanentAddress: '14, Green Valley Society, Alkapuri',
      district: 'Vadodara',
      taluka: 'Vadodara City',
      pincode: '390007',
      purposeOfCertificate: 'State Civil Services Examination Reservation',
      category: 'SEBC'
    },
    documents: [
      {
        id: 'doc-aarav-1',
        requirementId: 'doc-identity',
        name: 'Identity Proof',
        fileName: 'aarav_voter_card.pdf',
        fileSize: '1.1 MB',
        fileType: 'application/pdf',
        uploadDate: '2026-09-25T14:25:00Z',
        status: 'verified'
      },
      {
        id: 'doc-aarav-2',
        requirementId: 'doc-lineage',
        name: 'School Leaving Record',
        fileName: 'father_school_leaving_1975.pdf',
        fileSize: '4.2 MB',
        fileType: 'application/pdf',
        uploadDate: '2026-09-25T14:30:00Z',
        status: 'under_verification'
      }
    ],
    timeline: [
      {
        id: 'tl-aarav-1',
        stageName: 'Submission',
        title: 'Application Submitted',
        description: 'Citizen Aarav Shah submitted Caste Certificate request.',
        timestamp: '25 Sep 2026, 02:20 PM',
        actor: 'Aarav Shah',
        actorRole: 'citizen',
        completed: true,
        active: false,
        iconType: 'submit'
      },
      {
        id: 'tl-aarav-2',
        stageName: 'Verification',
        title: 'Initial Document Ingestion',
        description: 'Document package received and indexed into Social Justice scrutiny queue.',
        timestamp: '25 Sep 2026, 02:45 PM',
        actor: 'GovFlow Ingestion Engine',
        actorRole: 'system',
        completed: true,
        active: true,
        iconType: 'doc'
      }
    ]
  },
  {
    id: 'APP-2026-004823',
    serviceId: 'srv-domicile-cert',
    serviceName: 'Domicile Certificate',
    department: 'District Collectorate & Revenue',
    citizenId: 'usr-citizen-meera',
    citizenName: 'Meera Joshi',
    citizenMobile: '+91 94280 67890',
    citizenEmail: 'meera.joshi@mockgov.example',
    status: 'approved',
    priority: 'Normal',
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-09-23T16:00:00Z',
    assignedOfficerName: 'Rajesh Verma (SDM)',
    assignedDepartment: 'Gandhinagar Revenue Division',
    currentStage: 'Certificate Issued & Dispatched',
    expectedNextStep: 'Applicant can download or verify certificate via QR code',
    slaDays: 10,
    certificateId: 'CERT-2026-882193',
    personalDetails: {
      fullName: 'Meera Joshi',
      fatherHusbandName: 'Dineshbhai Joshi',
      gender: 'Female',
      dateOfBirth: '1995-02-18',
      mobile: '+91 94280 67890',
      email: 'meera.joshi@mockgov.example',
      maskedIdentityId: 'XXXX-XXXX-6789',
      permanentAddress: 'Plot 88, Sector 19',
      district: 'Gandhinagar',
      taluka: 'Gandhinagar',
      pincode: '382019',
      purposeOfCertificate: 'Medical Post-Graduate Admission State Quota',
      category: 'General'
    },
    documents: [
      {
        id: 'doc-meera-1',
        requirementId: 'doc-identity',
        name: 'Identity Proof',
        fileName: 'meera_passport_masked.pdf',
        fileSize: '1.8 MB',
        fileType: 'application/pdf',
        uploadDate: '2026-09-20T09:10:00Z',
        status: 'verified'
      },
      {
        id: 'doc-meera-2',
        requirementId: 'doc-domicile-10yr',
        name: '10-Year Continuous Stay Proof',
        fileName: 'academic_records_grade1_to_12.pdf',
        fileSize: '5.2 MB',
        fileType: 'application/pdf',
        uploadDate: '2026-09-20T09:15:00Z',
        status: 'verified'
      }
    ],
    timeline: [
      {
        id: 'tl-meera-1',
        stageName: 'Submission',
        title: 'Application Submitted',
        description: 'Application submitted with verified continuous academic credentials.',
        timestamp: '20 Sep 2026, 09:15 AM',
        actor: 'Meera Joshi',
        actorRole: 'citizen',
        completed: true,
        active: false,
        iconType: 'submit'
      },
      {
        id: 'tl-meera-2',
        stageName: 'Review',
        title: 'Officer Review & Field Verification',
        description: 'Verified residential continuous presence of 10+ years at Sector 19.',
        timestamp: '22 Sep 2026, 03:00 PM',
        actor: 'Rajesh Verma (SDM)',
        actorRole: 'officer',
        completed: true,
        active: false,
        iconType: 'review'
      },
      {
        id: 'tl-meera-3',
        stageName: 'Approval',
        title: 'Application Approved',
        description: 'Statutory approval granted by District Collectorate Competent Authority.',
        timestamp: '23 Sep 2026, 03:45 PM',
        actor: 'Rajesh Verma (SDM)',
        actorRole: 'officer',
        completed: true,
        active: false,
        iconType: 'approve'
      },
      {
        id: 'tl-meera-4',
        stageName: 'Certificate',
        title: 'Certificate Generated & Registered',
        description: 'Prototype Certificate CERT-2026-882193 issued with tamper-evident QR code.',
        timestamp: '23 Sep 2026, 04:00 PM',
        actor: 'GovFlow Trust Engine',
        actorRole: 'system',
        completed: true,
        active: false,
        iconType: 'cert'
      }
    ]
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'CERT-2026-882193',
    applicationId: 'APP-2026-004823',
    serviceName: 'Domicile Certificate',
    department: 'District Collectorate & Revenue Department',
    citizenName: 'Meera Joshi',
    fatherHusbandName: 'Dineshbhai Joshi',
    address: 'Plot 88, Sector 19, Gandhinagar, Gujarat - 382019',
    district: 'Gandhinagar',
    issueDate: '23 September 2026',
    validUntil: 'Lifetime / Permanent',
    issuingAuthority: 'Sub-Divisional Magistrate & Revenue Officer',
    officerDesignation: 'Executive Magistrate, Revenue Sub-Division',
    status: 'VALID',
    qrVerificationUrl: 'https://ais-dev-zp37wjwtim3yfseob7anew-801390428447.asia-southeast1.run.app/verify/CERT-2026-882193',
    digitalSignatureHash: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    metadata: {
      category: 'General',
      serviceSpecificDetail: 'Continuous residence verified in Gandhinagar district for 18 continuous years.'
    }
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-citizen-riya',
    targetRole: 'citizen',
    title: 'Application Status Update',
    message: 'Your Income Certificate application APP-2026-004821 is currently under review by SDM Rajesh Verma.',
    timestamp: '26 Sep 2026, 11:30 AM',
    read: false,
    type: 'info',
    applicationId: 'APP-2026-004821'
  },
  {
    id: 'notif-2',
    userId: 'usr-officer-rajesh',
    targetRole: 'officer',
    title: 'New Application Assigned',
    message: 'Income Certificate application APP-2026-004821 from Riya Patel assigned for scrutiny.',
    timestamp: '24 Sep 2026, 10:32 AM',
    read: true,
    type: 'info',
    applicationId: 'APP-2026-004821'
  },
  {
    id: 'notif-3',
    userId: 'usr-citizen-meera',
    targetRole: 'citizen',
    title: 'Certificate Issued',
    message: 'Your Domicile Certificate (CERT-2026-882193) has been approved and issued. Download anytime.',
    timestamp: '23 Sep 2026, 04:00 PM',
    read: true,
    type: 'success',
    applicationId: 'APP-2026-004823'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-101',
    timestamp: '24 Sep 2026, 10:14:12 AM',
    actorName: 'Riya Patel',
    actorRole: 'citizen',
    action: 'Application Draft Created',
    entityId: 'APP-2026-004821',
    entityType: 'application',
    details: 'Initiated new Income Certificate application draft.',
    ipAddress: '103.24.12.89'
  },
  {
    id: 'aud-102',
    timestamp: '24 Sep 2026, 10:24:45 AM',
    actorName: 'Riya Patel',
    actorRole: 'citizen',
    action: 'Documents Uploaded & Submitted',
    entityId: 'APP-2026-004821',
    entityType: 'document',
    details: 'Uploaded 4 required proof documents and confirmed statutory declaration.',
    ipAddress: '103.24.12.89'
  },
  {
    id: 'aud-103',
    timestamp: '24 Sep 2026, 10:30:02 AM',
    actorName: 'GovFlow AI Engine',
    actorRole: 'system',
    action: 'Document Analysis Completed',
    entityId: 'APP-2026-004821',
    entityType: 'document',
    details: 'Optical heuristics analyzed: 3 passed, 1 flagged for employer stamp verification.',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'aud-104',
    timestamp: '26 Sep 2026, 11:30:19 AM',
    actorName: 'Rajesh Verma (SDM)',
    actorRole: 'officer',
    action: 'Application Opened for Review',
    entityId: 'APP-2026-004821',
    entityType: 'application',
    details: 'Officer commenced comprehensive scrutiny of applicant income records.',
    ipAddress: '10.14.88.21'
  }
];
