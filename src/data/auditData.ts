export interface AuditFinding {
  id: string;
  title: string;
  severity: 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Repository Reviewed' | 'Needs Independent Review';
  contract: string;
  description: string;
  resolution: string;
}

export interface FormalInvariant {
  id: string;
  name: string;
  expression: string;
  category:
    | 'Tokenomics Hard Cap'
    | 'Spending Policy Limits'
    | 'Access Control'
    | 'Re-entrancy Guard'
    | 'Cross-Chain Research';
  status: 'Repository Assertion' | 'Test Coverage Present' | 'Independent Proof Required';
  description: string;
}

export const SECURITY_AUDIT_REPORT = {
  overallScore: null,
  auditVersion: 'repository-internal-review',
  certifyingBody: 'No independent certifying body claimed',
  lastAuditDate: 'Not independently audited',
  contractsCovered: [
    'QMoosaToken.sol',
    'PolicyGuardian.sol',
    'QMoosaSmartAccount.sol',
    'QMoosaPaymaster.sol',
    'CrossChainRelayer.sol',
  ],
  summary:
    'Repository-internal security notes and invariants. This is not a CertiK audit, formal-verification certificate, external penetration test, or production security approval.',
  findings: [
    {
      id: 'QMS-01',
      title: 'Supply-cap logic review',
      severity: 'Informational',
      status: 'Repository Reviewed',
      contract: 'QMoosaToken.sol',
      description:
        'The source includes a supply-cap check. Repository review alone does not prove every privileged or upgrade path is safe.',
      resolution:
        'Keep automated tests for mint/cap behavior and obtain an independent contract review before production deployment.',
    },
    {
      id: 'QMS-02',
      title: 'Spending-window logic',
      severity: 'Low',
      status: 'Needs Independent Review',
      contract: 'PolicyGuardian.sol',
      description:
        'Daily spending boundaries and reset behavior are security-sensitive and require adversarial testing around timestamps and authorization.',
      resolution:
        'Add property/fuzz tests and independent review of time-window and policy-bypass cases.',
    },
    {
      id: 'QMS-03',
      title: 'Session-key replay protection',
      severity: 'Medium',
      status: 'Needs Independent Review',
      contract: 'QMoosaSmartAccount.sol',
      description:
        'Chain/domain separation and nonce handling require deployment-specific tests to prevent replay across accounts or networks.',
      resolution:
        'Add cross-chain/domain replay tests and verify the exact ERC-4337 integration used at deployment.',
    },
    {
      id: 'QMS-04',
      title: 'External-call / re-entrancy surface',
      severity: 'Medium',
      status: 'Needs Independent Review',
      contract: 'CrossChainRelayer.sol',
      description:
        'External-call ordering, proof replay and asset-release logic require dedicated adversarial review.',
      resolution:
        'Add re-entrancy, replay, malformed-proof and authorization tests before enabling value transfer.',
    },
  ] as AuditFinding[],
  formalInvariants: [
    {
      id: 'INV-01',
      name: 'Token hard-cap property',
      expression: 'TotalSupply(t) <= configured MAX_SUPPLY',
      category: 'Tokenomics Hard Cap',
      status: 'Repository Assertion',
      description:
        'A desired contract property represented in source/tests. It is not described as independently formally proven.',
    },
    {
      id: 'INV-02',
      name: 'Spending-limit property',
      expression: 'SpentInWindow(account) <= MaxDailySpending(account)',
      category: 'Spending Policy Limits',
      status: 'Independent Proof Required',
      description:
        'A desired policy invariant that requires property/fuzz testing and independent review.',
    },
    {
      id: 'INV-03',
      name: 'Emergency-pause property',
      expression: 'EmergencyPause(account) => autonomous execution denied',
      category: 'Access Control',
      status: 'Independent Proof Required',
      description:
        'A desired fail-closed property; repository source alone is not a proof over all execution paths.',
    },
    {
      id: 'INV-04',
      name: 'Relayer replay-safety property',
      expression: 'accepted proof/intent cannot be reused to release value twice',
      category: 'Cross-Chain Research',
      status: 'Independent Proof Required',
      description:
        'Cross-chain replay/non-malleability is a research requirement, not an independently proven guarantee.',
    },
  ] as FormalInvariant[],
};
