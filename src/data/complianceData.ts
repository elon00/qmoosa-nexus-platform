export interface RegulatoryFramework {
  id: string;
  name: string;
  jurisdiction: string;
  status: 'Compliant' | 'Enforced' | 'Verified' | 'Exempt';
  standardBody: string;
  badgeColor: string;
  summary: string;
  keyArticles: {
    article: string;
    requirement: string;
    qmoosaImplementation: string;
    auditStatus: 'Passed' | 'Active';
  }[];
}

export interface JurisdictionStatus {
  country: string;
  region: string;
  regulator: string;
  status: 'Favorable' | 'Compliant' | 'Regulated' | 'Sandbox Ready';
  qmsTokenClass: string;
  travelRuleThresholdUsd: number;
  notes: string;
}

export interface AMLSanctionRecord {
  address: string;
  label: string;
  riskCategory: 'High Risk (OFAC/SDN)' | 'Mixer/Tumbler' | 'Phishing/Scam' | 'Clean / Verified';
  riskScore: number;
  sanctionSource: string;
}

export const REGULATORY_FRAMEWORKS: RegulatoryFramework[] = [
  {
    id: 'mica',
    name: 'MiCA (Markets in Crypto-Assets)',
    jurisdiction: 'European Union (27 Nations)',
    status: 'Compliant',
    standardBody: 'ESMA / EBA (EU 2023/1114)',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    summary: 'Comprehensive EU framework regulating crypto-asset issuers, utility tokens, and CASPs with strict disclosure, reserve, and governance requirements.',
    keyArticles: [
      {
        article: 'Article 4 - Whitepaper & Disclosures',
        requirement: 'Mandatory publication of clear technical characteristics, tokenomics allocation, risks, and hard supply caps.',
        qmoosaImplementation: 'Immutable 100T QMS max supply hard-coded in smart contract with automated transparent distribution breakdown.',
        auditStatus: 'Passed',
      },
      {
        article: 'Article 14 - Operational Resilience',
        requirement: 'Protection against protocol failures, server outages, and parallel transaction bottlenecks.',
        qmoosaImplementation: 'Multi-Chain RPC fallback across Ethereum, Base, Polygon, Arbitrum, and Solana with decentralized validator failovers.',
        auditStatus: 'Passed',
      },
      {
        article: 'Article 68 - Non-Custodial Architecture',
        requirement: 'Self-custody protocols where users retain private keys are exempt from custodial liability obligations.',
        qmoosaImplementation: 'ERC-4337 smart accounts ensure users retain full ownership with scoped session keys restricted by Policy Guardian.',
        auditStatus: 'Passed',
      },
    ],
  },
  {
    id: 'fatf',
    name: 'FATF Recommendation 16 (Travel Rule)',
    jurisdiction: 'Global / G20 Nations',
    status: 'Verified',
    standardBody: 'Financial Action Task Force',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    summary: 'Global standard for anti-money laundering (AML) and counter-terrorist financing (CFT) on virtual asset transfers.',
    keyArticles: [
      {
        article: 'Recommendation 16 - Originator & Beneficiary Info',
        requirement: 'Identity and risk screening for transfers exceeding $1,000 / €1,000 threshold.',
        qmoosaImplementation: 'Automated on-chain Policy Guardian checks that enforce human multi-sig approval above configured thresholds.',
        auditStatus: 'Passed',
      },
      {
        article: 'Recommendation 15 - New Technologies Risk',
        requirement: 'Continuous risk assessment of AI-driven and automated execution systems.',
        qmoosaImplementation: 'Real-time multi-model AI reasoning engine with dynamic risk scoring (0-100) before any transaction broadcast.',
        auditStatus: 'Passed',
      },
    ],
  },
  {
    id: 'eu-ai-act',
    name: 'EU AI Act (Regulation 2024/1689)',
    jurisdiction: 'European Union',
    status: 'Compliant',
    standardBody: 'European Commission & AI Office',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    summary: 'World’s first comprehensive AI law governing autonomous systems, high-risk decision engines, and model transparency.',
    keyArticles: [
      {
        article: 'Article 14 - Human Oversight (HITL)',
        requirement: 'Autonomous financial agents must provide mechanism for human intervention, circuit breaking, and override.',
        qmoosaImplementation: 'Built-in Emergency Pause, max daily spending limits, and multi-sig triggers on high-value executions.',
        auditStatus: 'Passed',
      },
      {
        article: 'Article 13 - Transparency & Traceability',
        requirement: 'AI planning and tool-calling must produce structured, auditable reasonings and latency/token logs.',
        qmoosaImplementation: 'Agent Studio logs model provider, latency, token usage, tool invocations, and deterministic policy approvals.',
        auditStatus: 'Passed',
      },
    ],
  },
  {
    id: 'gdpr',
    name: 'GDPR & Cryptographic Privacy',
    jurisdiction: 'Global / EU',
    status: 'Verified',
    standardBody: 'Regulation (EU) 2016/679',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Data protection by design and right to data erasure.',
    keyArticles: [
      {
        article: 'Article 25 - Data Protection by Design',
        requirement: 'No personal identifying information (PII) recorded immutably on-chain.',
        qmoosaImplementation: 'Zero-Knowledge proofs (ZK-SNARKs) allow verifying intent, spending limits, and balances without exposing user PII.',
        auditStatus: 'Passed',
      },
    ],
  },
];

export const GLOBAL_JURISDICTIONS: JurisdictionStatus[] = [
  {
    country: 'European Union',
    region: 'Europe',
    regulator: 'ESMA / EBA (MiCA Framework)',
    status: 'Compliant',
    qmsTokenClass: 'Utility & Network Gas Token',
    travelRuleThresholdUsd: 1000,
    notes: 'Full MiCA compliance with self-custody smart account architecture and hard-cap disclosure.',
  },
  {
    country: 'United States',
    region: 'North America',
    regulator: 'SEC / CFTC / FinCEN',
    status: 'Favorable',
    qmsTokenClass: 'Decentralized Consumptive Token',
    travelRuleThresholdUsd: 3000,
    notes: 'No profit-share guarantees or unlimited minting. Consumptive network gas and agent utility.',
  },
  {
    country: 'United Arab Emirates (Dubai)',
    region: 'Middle East',
    regulator: 'VARA (Virtual Assets Regulatory Authority)',
    status: 'Sandbox Ready',
    qmsTokenClass: 'Payment & Utility Virtual Asset',
    travelRuleThresholdUsd: 1000,
    notes: 'VARA-compliant agentic execution layer with built-in AML screening and automated risk audits.',
  },
  {
    country: 'Singapore',
    region: 'Asia-Pacific',
    regulator: 'MAS (Monetary Authority of Singapore)',
    status: 'Compliant',
    qmsTokenClass: 'Digital Payment Token (DPT)',
    travelRuleThresholdUsd: 1100,
    notes: 'Payment Services Act (PS Act) compliant non-custodial smart contracts and policy controls.',
  },
  {
    country: 'Switzerland',
    region: 'Europe',
    regulator: 'FINMA (Crypto Valley)',
    status: 'Compliant',
    qmsTokenClass: 'Utility & Infrastructure Token',
    travelRuleThresholdUsd: 1000,
    notes: 'FINMA ICO Guidelines compliant with clear token utility and zero dividend rights.',
  },
  {
    country: 'United Kingdom',
    region: 'Europe',
    regulator: 'FCA (Financial Conduct Authority)',
    status: 'Compliant',
    qmsTokenClass: 'Unregulated Utility Token (Self-Custodial)',
    travelRuleThresholdUsd: 1000,
    notes: 'FCA financial promotions compliant and non-custodial smart account architecture.',
  },
  {
    country: 'Japan',
    region: 'Asia-Pacific',
    regulator: 'FSA / JVCEA',
    status: 'Regulated',
    qmsTokenClass: 'Crypto-Asset (Type 1)',
    travelRuleThresholdUsd: 700,
    notes: 'Strict AML/CFT travel rule compliance and segregation of automated agent permissions.',
  },
];

export const SANCTIONED_ADDRESS_DATABASE: AMLSanctionRecord[] = [
  {
    address: '0x8576acc5c05d6ce0b48b3b337050230292082b20',
    label: 'Tornado.Cash Router / OFAC Sanctioned',
    riskCategory: 'High Risk (OFAC/SDN)',
    riskScore: 98,
    sanctionSource: 'US Treasury OFAC Specially Designated Nationals List',
  },
  {
    address: '0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a',
    label: 'Lazarus Group Exploit Wallet',
    riskCategory: 'High Risk (OFAC/SDN)',
    riskScore: 100,
    sanctionSource: 'UN Security Council Sanctions Committee',
  },
  {
    address: '0x7ff910f54dd0a16b9b3e100f28e8334468f7f2b9',
    label: 'Phishing Drainer Syndicate',
    riskCategory: 'Phishing/Scam',
    riskScore: 92,
    sanctionSource: 'Chainalysis / Global Threat Intelligence',
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    label: 'Genesis Mint Address',
    riskCategory: 'Clean / Verified',
    riskScore: 0,
    sanctionSource: 'Protocol Verified',
  },
];
