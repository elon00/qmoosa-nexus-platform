/**
 * Generate a repository-internal, cryptographically signed evidence report.
 *
 * The ML-DSA signature authenticates the generated report only. This is NOT
 * an independent audit, FIPS validation, legal certification, or production
 * readiness certificate.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { sha256 } from '@noble/hashes/sha256.js';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';

function run(args: string[], title: string): void {
  console.log(`▶ ${title}`);
  try {
    execFileSync(process.execPath, args, { stdio: 'inherit' });
  } catch {
    console.error(`FAILED: ${title}`);
    process.exit(1);
  }
}

console.log('QMoosa Nexus — generating repository-internal evidence report');

run(['--import', 'tsx', 'tests/all_features.test.ts'], 'Repository regression suite');
run(['--import', 'tsx', 'tests/nist-pqc.test.mjs'], 'PQC integration tests');
run(['scripts/audit-crypto.mjs'], 'Cryptographic integration audit');
run(['--import', 'tsx', 'scripts/reality-universal.ts'], 'Repository-internal verification gates');

const reporterSeed = new Uint8Array(32).fill(0x57);
const reporter = ml_dsa65.keygen(reporterSeed);

const payload = {
  protocol: 'QMoosa-Nexus-Platform',
  reportType: 'REPOSITORY_INTERNAL_EVIDENCE',
  generatedAt: new Date().toISOString(),
  projectStatus: 'RESEARCH_TESTNET_ORIENTED_PROTOTYPE',
  evidence: {
    repositoryChecksExecuted: true,
    pqcIntegrationTestsExecuted: true,
    cryptographicIntegrationAuditExecuted: true,
    internalVerificationGatesExecuted: true,
  },
  limitations: {
    independentVerification: false,
    externalSecurityAudit: false,
    fipsModuleValidation: false,
    productionCertification: false,
    legalComplianceCertification: false,
    mainnetVerification: false,
    contractDeploymentVerification: false,
  },
  reporter: {
    signatureScheme: 'ML-DSA-65 integration',
    publicKeyHex: Buffer.from(reporter.publicKey).toString('hex'),
    note:
      'This key belongs to the repository-generated report process; it is not an independent certification authority.',
  },
};

const canonical = Buffer.from(
  JSON.stringify(payload, Object.keys(payload).sort())
);
const reportHash = Buffer.from(sha256(canonical)).toString('hex');
const signatureHex = Buffer.from(
  ml_dsa65.sign(canonical, reporter.secretKey)
).toString('hex');

const report = {
  ...payload,
  sha256: reportHash,
  signatureHex,
};

fs.mkdirSync('reality', { recursive: true });
fs.writeFileSync(
  'reality/URS_EVIDENCE_CERTIFICATE.json',
  JSON.stringify(report, null, 2)
);

const markdown = `# QMoosa Nexus — Internal Evidence Report

Generated: \`${payload.generatedAt}\`  
SHA-256: \`${reportHash}\`  
ML-DSA signature length: \`${signatureHex.length / 2} bytes\`

## Checks executed

- repository regression suite
- PQC integration tests
- cryptographic integration audit
- repository-internal verification gates

## Limitations

This report is created by the repository itself. It is **not**:

- an independent security audit;
- FIPS validation of the application;
- legal or regulatory certification;
- verified mainnet/testnet deployment evidence;
- verified contract-bytecode provenance;
- production-readiness certification.

The ML-DSA signature authenticates this generated report only.
`;

fs.writeFileSync('reality/URS_EVIDENCE_CERTIFICATE.md', markdown);

console.log('Internal evidence report generated');
console.log(`  SHA-256: ${reportHash}`);
console.log('  Independent audit: NOT CLAIMED');
console.log('  Production certification: NOT CLAIMED');
