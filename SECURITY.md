# Security Policy

## Status

QMoosa Nexus is a research/testnet-oriented prototype. It is not independently audited production financial infrastructure.

## Reporting

Use GitHub private security reporting when available. Do not publish credentials, private keys, seed phrases, exploitable transaction details, personal data, or active secrets in public issues.

A useful report includes:

- affected commit/version
- affected endpoint/contract/component
- reproduction steps
- security impact
- expected vs actual behavior
- suggested mitigation if known

## High-risk areas

Extra review is required for:

- Policy Guardian and account-abstraction authorization
- smart-account/session-key logic
- paymaster and relayer code
- transaction signing/broadcast
- cryptographic key handling
- provider credentials
- compliance/sanctions decisions
- cross-chain/ZK claims
- token mint/supply controls

## Current boundaries

- demo/simulated transactions must not be presented as live settlement;
- unknown addresses must not be auto-cleared by a local sanctions list;
- repository-generated audit scores are not independent audits;
- contract addresses are unverified until explorer/bytecode evidence is recorded;
- AI fallback adapters must be labeled simulation unless a real provider call occurred.

## Production prerequisites

Independent security review, deployment provenance, secrets management, monitoring/incident response, release/rollback procedures and applicable legal review are required before production use.
