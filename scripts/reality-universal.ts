/**
 * QMoosa Nexus repository-internal verification gates.
 *
 * Passing these checks means the checked-in implementation satisfies these
 * repository-defined assertions. It does NOT establish an independent audit,
 * FIPS module validation, legal compliance, mainnet readiness, or production
 * certification.
 */
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha256.js';
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';
import {
  createPqcHybridSignature,
  generatePqcKeyPair,
  verifyPqcSignature,
} from '../src/utils/pqcCrypto.js';
import {
  DEFAULT_AGENT_WALLETS,
  TOKENOMICS_ALLOCATION,
  TOTAL_QMS_MAX_SUPPLY,
} from '../src/data/genesis.js';

interface GateResult {
  gate: number;
  name: string;
  passed: boolean;
  details: string;
}

const gates: GateResult[] = [];

function gate(name: string, check: () => void, details: string): void {
  const number = gates.length + 1;
  try {
    check();
    gates.push({ gate: number, name, passed: true, details });
    console.log(`[PASS ${number}] ${name}: ${details}`);
  } catch (error: any) {
    gates.push({
      gate: number,
      name,
      passed: false,
      details: error?.message || String(error),
    });
    console.error(`[FAIL ${number}] ${name}: ${error?.message || String(error)}`);
  }
}

console.log('QMoosa Nexus — repository-internal verification gates');
console.log('Independent production/security certification: NOT CLAIMED');

gate(
  'Reality manifest',
  () => {
    const manifestPath = path.resolve('REALITY_MANIFEST.json');
    assert.ok(fs.existsSync(manifestPath));
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.strictEqual(manifest.system, 'QMOOSA-NEXUS-PLATFORM');
    assert.strictEqual(manifest.status, 'RESEARCH_TESTNET_ORIENTED_PROTOTYPE');
    assert.strictEqual(manifest.truthTaxonomy.independentAudit, false);
    assert.strictEqual(manifest.truthTaxonomy.productionCertified, false);
    assert.strictEqual(manifest.truthTaxonomy.complianceCertified, false);
  },
  'prototype status and external-verification limits are machine-readable'
);

gate(
  'Cryptographic path randomness check',
  () => {
    const cryptoFile = fs.readFileSync(path.resolve('src/utils/pqcCrypto.ts'), 'utf8');
    assert.ok(!cryptoFile.includes('Math.random()'));
  },
  'Math.random() is absent from the selected PQC utility path'
);

let dsaKeyPair: ReturnType<typeof generatePqcKeyPair>;
gate(
  'ML-DSA-65 integration wire sizes',
  () => {
    dsaKeyPair = generatePqcKeyPair('ML-DSA-65');
    assert.strictEqual(dsaKeyPair.publicKey.length / 2, 1952);
    assert.strictEqual(dsaKeyPair.keySizeBits, 1952 * 8);
  },
  'application-layer ML-DSA-65 public-key invariant passed; FIPS module validation is not claimed'
);

gate(
  'Tokenomics design arithmetic',
  () => {
    const totalAllocation = TOKENOMICS_ALLOCATION.reduce(
      (sum, item) => sum + item.amountQms,
      0
    );
    assert.strictEqual(totalAllocation, TOTAL_QMS_MAX_SUPPLY);
    assert.strictEqual(TOTAL_QMS_MAX_SUPPLY, 1_000_000_000_000_000);
  },
  'design allocations sum to the configured cap; deployment/market value is not implied'
);

gate(
  'ML-DSA signing and tamper rejection',
  () => {
    const keyPair = dsaKeyPair || generatePqcKeyPair('ML-DSA-65');
    const payload = 'NEXUS_INTERNAL_GATE';
    const sig = createPqcHybridSignature(payload, keyPair, 0.005, 'demo-service');
    assert.strictEqual(sig.mlDsaComponent.length / 2, 3309);
    assert.strictEqual(
      verifyPqcSignature(
        sig.hybridSignature,
        payload,
        keyPair.publicKey,
        0.005,
        'demo-service'
      ).valid,
      true
    );
    const tampered = sig.hybridSignature.replace('PQC-HYBRID-x402.', 'CORRUPTED.');
    assert.strictEqual(
      verifyPqcSignature(tampered, payload, keyPair.publicKey, 0.005, 'demo-service').valid,
      false
    );
  },
  'repository integration accepts a generated signature and rejects the tested tamper case'
);

gate(
  'ML-KEM-768 integration and implicit-rejection behavior',
  () => {
    const pair = ml_kem768.keygen(new Uint8Array(64).fill(0x29));
    assert.strictEqual(pair.publicKey.length, 1184);
    assert.strictEqual(pair.secretKey.length, 2400);
    const enc = ml_kem768.encapsulate(pair.publicKey);
    assert.strictEqual(enc.cipherText.length, 1088);
    assert.strictEqual(enc.sharedSecret.length, 32);
    const dec = ml_kem768.decapsulate(enc.cipherText, pair.secretKey);
    assert.deepStrictEqual(Buffer.from(dec), Buffer.from(enc.sharedSecret));
    const bad = new Uint8Array(enc.cipherText);
    bad[0] ^= 0x11;
    const rejected = ml_kem768.decapsulate(bad, pair.secretKey);
    assert.strictEqual(rejected.length, 32);
    assert.notDeepStrictEqual(Buffer.from(rejected), Buffer.from(enc.sharedSecret));
  },
  'selected ML-KEM integration invariants and corrupted-ciphertext behavior passed'
);

gate(
  'Policy and Conway design invariants',
  () => {
    const wallet = DEFAULT_AGENT_WALLETS[0];
    assert.strictEqual(
      wallet.policy.maxDailySpendingUsdt - wallet.policy.usedTodayUsdt,
      75.5
    );
    const evolvesAlive = (neighbors: number, alive: boolean) =>
      alive ? neighbors === 2 || neighbors === 3 : neighbors === 3;
    assert.strictEqual(evolvesAlive(1, true), false);
    assert.strictEqual(evolvesAlive(2, true), true);
    assert.strictEqual(evolvesAlive(3, false), true);
  },
  'repository policy arithmetic and cellular-automaton rules passed'
);

gate(
  'RFC 5869 known-answer test',
  () => {
    const ikm = new Uint8Array(22).fill(0x0b);
    const salt = new Uint8Array([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
      0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
    ]);
    const info = new Uint8Array([
      0xf0, 0xf1, 0xf2, 0xf3, 0xf4,
      0xf5, 0xf6, 0xf7, 0xf8, 0xf9,
    ]);
    const okm = Buffer.from(hkdf(sha256, ikm, salt, info, 42)).toString('hex');
    assert.strictEqual(
      okm,
      '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865'
    );
  },
  'RFC 5869 HKDF-SHA256 KAT passed'
);

const allPassed = gates.every((item) => item.passed);
fs.mkdirSync('reality', { recursive: true });
fs.writeFileSync(
  'reality/URS_SCORECARD.json',
  JSON.stringify(
    {
      system: 'QMOOSA-NEXUS-PLATFORM',
      reportType: 'REPOSITORY_INTERNAL_VERIFICATION',
      timestamp: new Date().toISOString(),
      checksPassed: gates.filter((item) => item.passed).length,
      totalChecks: gates.length,
      independentAudit: false,
      productionCertification: false,
      legalComplianceCertification: false,
      gates,
    },
    null,
    2
  )
);

console.log(
  allPassed
    ? 'INTERNAL CHECKS PASSED — NOT A PRODUCTION OR INDEPENDENT SECURITY CERTIFICATION'
    : 'INTERNAL CHECK FAILURE — see output above'
);

if (!allPassed) process.exit(1);
