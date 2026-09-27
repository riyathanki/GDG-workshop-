import { GovernmentService } from '../types';

export const GOVERNMENT_SERVICES: GovernmentService[] = [
  {
    id: 'srv-income-cert',
    slug: 'income-certificate',
    name: 'Income Certificate',
    department: 'Revenue & District Administration',
    category: 'revenue',
    popular: true,
    estimatedDays: 7,
    fee: 50,
    purpose: 'Proof of family/individual annual income for education scholarships, fee concessions, welfare schemes, and subsidies.',
    description: 'Statutory certificate issued by the competent Revenue Authority declaring the applicant’s verified gross annual income from all legitimate sources.',
    eligibility: [
      'Applicant must be a bona fide resident of the state/district',
      'No pending tax default or fraudulent income declaration',
      'Self or family earner must provide valid proof of livelihood',
      'For student applicants, parent/guardian income declaration is required'
    ],
    requirements: [
      {
        id: 'doc-identity',
        name: 'Identity Proof',
        description: 'Synthetic Aadhaar card copy, Electoral Photo ID, or Passport (Masked)',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-address',
        name: 'Address Proof',
        description: 'Electricity bill (last 3 months), Water bill, or Ration Card copy',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-income',
        name: 'Income Proof',
        description: 'Salary slips (last 3 months), Form 16, or Talati / Patwari verified income report',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-photo',
        name: 'Applicant Photograph',
        description: 'Recent passport size color photograph with clear background',
        mandatory: true,
        acceptedFormats: ['JPG', 'PNG'],
        maxSizeMb: 2
      },
      {
        id: 'doc-affidavit',
        name: 'Self-Declaration Affidavit',
        description: 'Notarized self-declaration statement affirming accurate declared income',
        mandatory: false,
        acceptedFormats: ['PDF'],
        maxSizeMb: 5
      }
    ]
  },
  {
    id: 'srv-residence-cert',
    slug: 'residence-certificate',
    name: 'Residence Certificate',
    department: 'Revenue & Civic Administration',
    category: 'civic_administration',
    popular: true,
    estimatedDays: 5,
    fee: 30,
    purpose: 'Official proof of continuous stay in the designated revenue jurisdiction.',
    description: 'Certifies that the citizen is an established resident in the designated revenue village/ward for statutory quota and administrative purposes.',
    eligibility: [
      'Minimum continuous stay of 3 years in the specified administrative division',
      'Valid local utility bill or registered domicile rental/ownership agreement'
    ],
    requirements: [
      {
        id: 'doc-identity',
        name: 'Identity Proof',
        description: 'Government issued photo ID card',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-residence-proof',
        name: 'Continuous Residence Proof',
        description: 'Municipal property tax receipt or registered lease deed',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMb: 5
      },
      {
        id: 'doc-photo',
        name: 'Passport Photograph',
        description: 'Color photograph facing front',
        mandatory: true,
        acceptedFormats: ['JPG', 'PNG'],
        maxSizeMb: 2
      }
    ]
  },
  {
    id: 'srv-caste-cert',
    slug: 'caste-certificate',
    name: 'Caste Certificate',
    department: 'Social Justice & Empowerment',
    category: 'social_welfare',
    popular: true,
    estimatedDays: 15,
    fee: 40,
    purpose: 'Affirmation of caste category for educational reservations, scholarships, and statutory government welfare schemes.',
    description: 'Authenticates caste and tribal identity based on genealogy and revenue records for social justice entitlements.',
    eligibility: [
      'Applicant belongs to recognized SC, ST, OBC, or SEBC community',
      'Paternal lineage documentation dating back to the state notified base year'
    ],
    requirements: [
      {
        id: 'doc-identity',
        name: 'Identity Proof',
        description: 'Valid ID proof of applicant or father',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-lineage',
        name: 'Genealogy / School Leaving Record',
        description: 'School leaving certificate mentioning caste or father’s caste certificate',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-photo',
        name: 'Passport Photograph',
        description: 'Recent clear photograph',
        mandatory: true,
        acceptedFormats: ['JPG', 'PNG'],
        maxSizeMb: 2
      }
    ]
  },
  {
    id: 'srv-domicile-cert',
    slug: 'domicile-certificate',
    name: 'Domicile Certificate',
    department: 'District Collectorate & Revenue',
    category: 'revenue',
    popular: false,
    estimatedDays: 10,
    fee: 60,
    purpose: 'Document verifying permanent state domicile for state quota college admissions and public sector recruitments.',
    description: 'Certifies that a citizen has permanent domicile residence (minimum 10 years continuous schooling or family roots) in the state.',
    eligibility: [
      'Minimum continuous domicile of 10 years in the state',
      'Education records (SSC/HSC) from educational institutions located within state'
    ],
    requirements: [
      {
        id: 'doc-identity',
        name: 'Identity Proof',
        description: 'Voter ID or Passport',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-domicile-10yr',
        name: '10-Year Continuous Stay Proof',
        description: 'School certificates from Grade 1 to 10 or property registry documents',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMb: 8
      },
      {
        id: 'doc-photo',
        name: 'Passport Photo',
        description: 'Recent color photograph',
        mandatory: true,
        acceptedFormats: ['JPG', 'PNG'],
        maxSizeMb: 2
      }
    ]
  },
  {
    id: 'srv-birth-cert',
    slug: 'birth-certificate',
    name: 'Birth Certificate',
    department: 'Civic Health & Vital Statistics',
    category: 'civic_administration',
    popular: false,
    estimatedDays: 7,
    fee: 25,
    purpose: 'Official record of date, time, and location of birth under the Registration of Births and Deaths Act.',
    description: 'Vital administrative document validating legal name, parental lineage, and date of birth for school admission and passport issuance.',
    eligibility: [
      'Birth must have occurred within designated municipal/panchayat limits',
      'Institutional birth report from hospital or affidavit for delayed registration'
    ],
    requirements: [
      {
        id: 'doc-hospital-slip',
        name: 'Hospital Discharge / Birth Slip',
        description: 'Institutional birth intimation or discharge report',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-parent-id',
        name: 'Parents ID Proof',
        description: 'Identity proofs of both parents',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMb: 5
      }
    ]
  },
  {
    id: 'srv-scholarship',
    slug: 'scholarship-application',
    name: 'Post-Matric Scholarship Scheme',
    department: 'Higher Education & Social Welfare',
    category: 'education',
    popular: true,
    estimatedDays: 14,
    fee: 0,
    purpose: 'Financial assistance for tuition fees and maintenance allowance for higher education.',
    description: 'State financial grant for eligible undergraduate, postgraduate, and diploma students to foster inclusive education.',
    eligibility: [
      'Enrolled in a recognized college or polytechnic institution',
      'Annual family income within notified scheme threshold (less than ₹2,50,000)',
      'Minimum 55% aggregate marks in preceding qualifying examination'
    ],
    requirements: [
      {
        id: 'doc-income-cert',
        name: 'Valid Income Certificate',
        description: 'Issued by competent Revenue Authority for current fiscal year',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMb: 5
      },
      {
        id: 'doc-marksheet',
        name: 'Previous Year Marksheet',
        description: 'Verified marksheet from board or university',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-bank-passbook',
        name: 'Student Bank Account Proof',
        description: 'Passbook front page showing IFSC code and active account number',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5
      }
    ]
  },
  {
    id: 'srv-senior-citizen',
    slug: 'senior-citizen-certificate',
    name: 'Senior Citizen Identity Card',
    department: 'Social Welfare & Elder Care',
    category: 'social_welfare',
    popular: false,
    estimatedDays: 7,
    fee: 0,
    purpose: 'Privileges for senior citizens including transportation fare concessions and healthcare priority.',
    description: 'Identification issued to senior citizens aged 60 and above for accessing age-tailored public concessions.',
    eligibility: [
      'Citizen must have completed 60 years of age on the date of application',
      'Bona fide resident of the state'
    ],
    requirements: [
      {
        id: 'doc-age-proof',
        name: 'Age Proof Document',
        description: 'School leaving certificate, Birth Certificate, or Passport',
        mandatory: true,
        acceptedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5
      },
      {
        id: 'doc-address',
        name: 'Address Proof',
        description: 'Utility bill or Voter identity card',
        mandatory: true,
        acceptedFormats: ['PDF'],
        maxSizeMb: 5
      },
      {
        id: 'doc-photo',
        name: 'Passport Photograph',
        description: 'Color photograph',
        mandatory: true,
        acceptedFormats: ['JPG', 'PNG'],
        maxSizeMb: 2
      }
    ]
  }
];
