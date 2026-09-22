# QMoosa Nexus Protocol

Prototype/research platform for **account-abstraction policy controls, AI-assisted transaction planning, multi-chain UX experiments, post-quantum cryptography integration, and Conway cellular-automaton research**.

## Reality status

**STATUS: RESEARCH / TESTNET-ORIENTED PROTOTYPE — NOT MAINNET, NOT INDEPENDENTLY AUDITED**

The repository contains real application code, Solidity contracts, policy logic, cryptographic integration tests, and testnet-oriented network configuration. It also contains demo/simulation surfaces. These must not be confused with live financial infrastructure.

### Currently evidenced

- React/TypeScript application and Express API
- Solidity source for token, policy-guardian, smart-account, paymaster and relayer experiments
- application-layer ML-DSA / ML-KEM integration tests
- repository CI and dependency/secret scanning
- deterministic policy constraints and human-approval concepts
- EVM/Solana testnet network configuration
- local/in-memory block, faucet, agent, and wallet demonstrations

### Not independently established

- production mainnet deployment
- independently verified contract deployments
- independent smart-contract or cryptographic audit
- FIPS validation of this application as a cryptographic module
- legal/regulatory compliance in any jurisdiction
- live sanctions-screening coverage
- a production QMoosa L1
- real validator counts, TPS, TVL, liquidity, users, volume or revenue
- live Claude/DeepSeek/local-model routing unless an actual provider integration is configured and evidenced
- atomic cross-chain settlement or ZK bridge security

## Security boundary

The current web/API experience must treat mutation, block, faucet, wallet, agent-execution and cross-chain flows as **prototype/simulation** unless a response contains externally verifiable network evidence.

Unknown wallet addresses are never considered “clean” merely because they are absent from a bundled demo list.

See [SECURITY.md](SECURITY.md).

## Development

Requirements:

- Node.js 22+
- npm

```bash
git clone https://github.com/elon00/qmoosa-nexus-platform.git
cd qmoosa-nexus-platform
npm ci
npm run lint
npm test
npm run build
```

Run locally:

```bash
cp .env.example .env.local
npm run dev
```

## AI provider configuration

The application can use Gemini when a valid server-side key/model are configured:

```env
GEMINI_API_KEY=
GEMINI_MODEL=
APP_URL=http://localhost:3000
```

Fallback planners and non-Gemini model adapters are simulation/demo logic unless separately connected to the named provider. Static latency, token-count or cost fields are not performance benchmarks.

## Contract source and deployment evidence

Contract source lives under `contracts/`.

The repository also contains candidate/testnet address metadata. **An address in a manifest is not treated as verified merely because it is syntactically valid.** Before publication as a deployed contract, record:

1. chain/network;
2. transaction hash;
3. deployer;
4. block number;
5. bytecode/source verification link;
6. exact source commit;
7. constructor/initialization parameters.

Until those are reproducibly verified, the UI/API must label the address **unverified candidate/testnet metadata**.

## Tokenomics

QMS supply/allocation tables are **design/governance proposals** unless backed by a verified deployed contract and governance state. They are not an investment offer, exchange-listing commitment, liquidity guarantee, staking-return promise, or evidence of market value.

## Compliance research

MiCA, FATF, GDPR, securities, travel-rule and AI-regulation material in this repository is a **design/research checklist**, not legal advice or certification.

A production compliance program requires qualified legal review, jurisdiction-specific analysis, operational controls, current sanctions/data providers, retention policies, and audit evidence.

## Cryptography

The repository exercises ML-DSA/ML-KEM application-layer integrations. Using NIST-standardized algorithms does not make the whole application a FIPS-validated cryptographic module or establish whole-system quantum resistance.

## CI and security

The repository runs:

- TypeScript lint/type checks
- production build
- feature/PQC/reality tests
- npm dependency audit
- secret scanning

Green CI is necessary engineering evidence, not a production certificate.

## Production-readiness gate

Before production/mainnet use, require at minimum:

1. verified deployments and release provenance;
2. independent smart-contract/security review;
3. authenticated APIs and strict authorization for every mutation;
4. real provider integrations with failure/timeout handling;
5. managed secrets and key rotation;
6. monitoring, alerting, backup/recovery and incident response;
7. load/performance testing under documented workloads;
8. legal/compliance review for token/financial activity;
9. externally verifiable operational evidence.

## License

MIT, as currently declared by the repository.
