export interface RegulatoryFramework {
  id: string;
  name: string;
  jurisdiction: string;
  status: 'Research Mapping' | 'Legal Review Required';
  standardBody: string;
  badgeColor: string;
  summary: string;
  keyArticles: {
    article: string;
    requirement: string;
    qmoosaImplementation: string;
    auditStatus: 'Design Mapping' | 'Needs Legal Review';
  }[];
}

export interface JurisdictionStatus {
  country: string;
  region: string;
  regulator: string;
  status: 'Legal Review Required';
  qmsTokenClass: string;
  travelRuleThresholdUsd: number | null;
  notes: string;
}

export interface AMLSanctionRecord {
  address: string;
  label: string;
  riskCategory: 'Demo High Risk' | 'Demo Neutral';
  riskScore: number;
  sanctionSource: string;
}

/**
 * Regulatory research mapping only.
 *
 * These records are not legal advice, a compliance determination, a token
 * classification, or evidence that QMoosa satisfies a regulator's rules.
 */
export const REGULATORY_FRAMEWORKS: RegulatoryFramework[] = [
  {
    id: 'mica',
    name: 'MiCA research checklist',
    jurisdiction: 'European Union',
    status: 'Legal Review Required',
    standardBody: 'EU regulatory framework',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary:
      'Design-time checklist for disclosure, governance and operational-resilience questions. Qualified EU legal review is required before any compliance claim.',
    keyArticles: [
      {
        article: 'Disclosure / whitepaper requirements',
        requirement: 'Assess applicable issuer, offer, whitepaper and disclosure obligations.',
        qmoosaImplementation: 'Repository contains tokenomics and risk-disclosure drafts.',
        auditStatus: 'Needs Legal Review',
      },
      {
        article: 'Operational-resilience considerations',
        requirement: 'Assess resilience, incident, governance and service-provider obligations where applicable.',
        qmoosaImplementation: 'Policy controls and fail-closed design goals are research features, not regulatory certification.',
        auditStatus: 'Needs Legal Review',
      },
    ],
  },
  {
    id: 'fatf',
    name: 'FATF / AML-CFT research checklist',
    jurisdiction: 'International',
    status: 'Legal Review Required',
    standardBody: 'FATF guidance / local implementing law',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary:
      'Research checklist for AML/CFT and travel-rule considerations. The repository does not provide a production sanctions/AML data service.',
    keyArticles: [
      {
        article: 'Travel-rule considerations',
        requirement: 'Determine whether local implementation applies to the actual service/provider model.',
        qmoosaImplementation: 'Human-approval and policy-limit concepts exist; identity/travel-rule infrastructure is not certified.',
        auditStatus: 'Needs Legal Review',
      },
      {
        article: 'New-technology risk',
        requirement: 'Assess risks of automated and AI-assisted transaction systems.',
        qmoosaImplementation: 'Prototype policy scoring and human-approval concepts are present.',
        auditStatus: 'Design Mapping',
      },
    ],
  },
  {
    id: 'eu-ai-act',
    name: 'EU AI Act research checklist',
    jurisdiction: 'European Union',
    status: 'Legal Review Required',
    standardBody: 'EU AI regulatory framework',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary:
      'Design checklist for transparency, logging and human oversight. Applicability/classification requires legal and product analysis.',
    keyArticles: [
      {
        article: 'Human oversight',
        requirement: 'Assess whether and how human oversight obligations apply.',
        qmoosaImplementation: 'Prototype policy limits and approval thresholds demonstrate a possible HITL design.',
        auditStatus: 'Design Mapping',
      },
      {
        article: 'Transparency / logging',
        requirement: 'Assess documentation and logging duties for the actual deployed AI system.',
        qmoosaImplementation: 'Planner metadata is available in the prototype, but provider and production logging must be verified.',
        auditStatus: 'Needs Legal Review',
      },
    ],
  },
  {
    id: 'gdpr',
    name: 'GDPR/privacy research checklist',
    jurisdiction: 'European Union / EEA',
    status: 'Legal Review Required',
    standardBody: 'EU data-protection framework',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary:
      'Privacy-by-design checklist. Data-controller/processor roles, lawful basis, retention and data-subject rights require deployment-specific analysis.',
    keyArticles: [
      {
        article: 'Data protection by design',
        requirement: 'Minimize personal data and establish lawful processing/retention controls.',
        qmoosaImplementation: 'The prototype should avoid putting PII into public-chain or demo logs; this is a design requirement, not certification.',
        auditStatus: 'Needs Legal Review',
      },
    ],
  },
];

export const GLOBAL_JURISDICTIONS: JurisdictionStatus[] = [
  {
    country: 'European Union',
    region: 'Europe',
    regulator: 'Jurisdiction-specific / EU authorities',
    status: 'Legal Review Required',
    qmsTokenClass: 'Undetermined',
    travelRuleThresholdUsd: null,
    notes: 'Do not infer MiCA, securities, payments or AML classification from repository design labels.',
  },
  {
    country: 'United States',
    region: 'North America',
    regulator: 'Federal and state authorities as applicable',
    status: 'Legal Review Required',
    qmsTokenClass: 'Undetermined',
    travelRuleThresholdUsd: null,
    notes: 'Token/service classification depends on facts, offering structure, custody, use and jurisdiction.',
  },
  {
    country: 'United Arab Emirates',
    region: 'Middle East',
    regulator: 'Relevant UAE / emirate authority',
    status: 'Legal Review Required',
    qmsTokenClass: 'Undetermined',
    travelRuleThresholdUsd: null,
    notes: 'No VARA or other UAE approval/sandbox participation is claimed without external evidence.',
  },
  {
    country: 'Singapore',
    region: 'Asia-Pacific',
    regulator: 'MAS where applicable',
    status: 'Legal Review Required',
    qmsTokenClass: 'Undetermined',
    travelRuleThresholdUsd: null,
    notes: 'No Payment Services Act license, exemption or token classification is claimed.',
  },
  {
    country: 'United Kingdom',
    region: 'Europe',
    regulator: 'FCA / other authority where applicable',
    status: 'Legal Review Required',
    qmsTokenClass: 'Undetermined',
    travelRuleThresholdUsd: null,
    notes: 'Financial-promotion, AML and cryptoasset rules require deployment-specific review.',
  },
];

/**
 * Synthetic fixtures for UI testing only.
 * This is NOT a sanctions database and MUST NOT be used to clear real addresses.
 */
export const SANCTIONED_ADDRESS_DATABASE: AMLSanctionRecord[] = [
  {
    address: '0x0000000000000000000000000000000000000001',
    label: 'Demo high-risk fixture',
    riskCategory: 'Demo High Risk',
    riskScore: 95,
    sanctionSource: 'Synthetic UI fixture — not an OFAC/UN/EU data source',
  },
  {
    address: '0x0000000000000000000000000000000000000002',
    label: 'Demo neutral fixture',
    riskCategory: 'Demo Neutral',
    riskScore: 5,
    sanctionSource: 'Synthetic UI fixture — not a sanctions clearance',
  },
];
