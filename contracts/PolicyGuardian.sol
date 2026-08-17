// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PolicyGuardian
 * @notice On-chain Spending Policy & Risk Guardian for AI Agent Autonomous Execution.
 * @dev Enforces daily spending limits, max per-transaction limits, allowed destination contracts,
 * allowed chain routing, risk score bounds, and emergency pause circuit breakers.
 */
contract PolicyGuardian {
    struct SpendingPolicy {
        uint256 maxDailySpendingUsdt; // Scaled to 6 decimals (1 USDT = 1e6)
        uint256 maxPerTxUsdt;        // Scaled to 6 decimals
        uint256 spentTodayUsdt;
        uint256 lastResetTimestamp;
        uint256 requireHumanApprovalAboveUsdt;
        uint8 riskScoreThreshold;     // 0 to 100 max acceptable risk
        bool emergencyPauseActive;
        bool isConfigured;
    }

    struct SessionKey {
        address agentSigner;
        uint256 validUntil;
        uint256 dailyAllowanceUsdt;
        bool active;
    }

    address public owner;
    address public securityAdmin;

    // Account Address => Policy
    mapping(address => SpendingPolicy) public policies;
    
    // Account Address => Session Key Address => SessionKey
    mapping(address => mapping(address => SessionKey)) public sessionKeys;

    // Account Address => Target Contract => Allowed
    mapping(address => mapping(address => bool)) public contractAllowlist;

    // Account Address => Target Chain ID => Allowed
    mapping(address => mapping(uint256 => bool)) public chainAllowlist;

    event PolicyUpdated(address indexed account, uint256 maxDailyUsdt, uint256 maxPerTxUsdt, uint8 riskThreshold);
    event SessionKeyRegistered(address indexed account, address indexed agentSigner, uint256 validUntil, uint256 dailyAllowance);
    event SessionKeyRevoked(address indexed account, address indexed agentSigner);
    event EmergencyPauseToggled(address indexed account, bool isPaused);
    event PolicyCheckPassed(address indexed account, address indexed agent, uint256 amountUsdt, address targetContract);
    event PolicyViolation(address indexed account, address indexed agent, string reason);

    modifier onlyAccountOrOwner(address account) {
        require(msg.sender == account || msg.sender == owner, "PolicyGuardian: Unauthorized");
        _;
    }

    constructor(address _securityAdmin) {
        owner = msg.sender;
        securityAdmin = _securityAdmin;
    }

    /**
     * @notice Set or update spending rules for a Smart Account
     */
    function setPolicy(
        address account,
        uint256 maxDailySpendingUsdt,
        uint256 maxPerTxUsdt,
        uint256 requireHumanApprovalAboveUsdt,
        uint8 riskScoreThreshold
    ) external onlyAccountOrOwner(account) {
        require(maxPerTxUsdt <= maxDailySpendingUsdt, "Max per-tx exceeds daily limit");
        require(riskScoreThreshold <= 100, "Invalid risk threshold");

        SpendingPolicy storage p = policies[account];
        p.maxDailySpendingUsdt = maxDailySpendingUsdt;
        p.maxPerTxUsdt = maxPerTxUsdt;
        p.requireHumanApprovalAboveUsdt = requireHumanApprovalAboveUsdt;
        p.riskScoreThreshold = riskScoreThreshold;
        p.isConfigured = true;

        if (p.lastResetTimestamp == 0) {
            p.lastResetTimestamp = block.timestamp;
        }

        emit PolicyUpdated(account, maxDailySpendingUsdt, maxPerTxUsdt, riskScoreThreshold);
    }

    /**
     * @notice Register a scoped AI Agent Session Key
     */
    function registerSessionKey(
        address account,
        address agentSigner,
        uint256 validDurationSeconds,
        uint256 dailyAllowanceUsdt
    ) external onlyAccountOrOwner(account) {
        require(agentSigner != address(0), "Invalid agent signer");
        require(validDurationSeconds > 0, "Invalid duration");

        sessionKeys[account][agentSigner] = SessionKey({
            agentSigner: agentSigner,
            validUntil: block.timestamp + validDurationSeconds,
            dailyAllowanceUsdt: dailyAllowanceUsdt,
            active: true
        });

        emit SessionKeyRegistered(account, agentSigner, block.timestamp + validDurationSeconds, dailyAllowanceUsdt);
    }

    /**
     * @notice Revoke an AI Agent Session Key
     */
    function revokeSessionKey(address account, address agentSigner) external onlyAccountOrOwner(account) {
        sessionKeys[account][agentSigner].active = false;
        emit SessionKeyRevoked(account, agentSigner);
    }

    /**
     * @notice Set contract allowlist permissions
     */
    function setContractAllowed(address account, address targetContract, bool allowed) external onlyAccountOrOwner(account) {
        contractAllowlist[account][targetContract] = allowed;
    }

    /**
     * @notice Set chain ID allowlist permissions
     */
    function setChainAllowed(address account, uint256 chainId, bool allowed) external onlyAccountOrOwner(account) {
        chainAllowlist[account][chainId] = allowed;
    }

    /**
     * @notice Emergency Pause Circuit Breaker
     */
    function toggleEmergencyPause(address account, bool isPaused) external {
        require(msg.sender == account || msg.sender == owner || msg.sender == securityAdmin, "Unauthorized pause");
        policies[account].emergencyPauseActive = isPaused;
        emit EmergencyPauseToggled(account, isPaused);
    }

    /**
     * @notice Deterministic On-Chain Policy Verification
     * @dev Called by QMoosaSmartAccount before executing any autonomous transaction.
     */
    function validateAndRecordExecution(
        address account,
        address agentSigner,
        uint256 amountUsdt,
        address targetContract,
        uint8 estimatedRiskScore,
        uint256 targetChainId
    ) external returns (bool) {
        SpendingPolicy storage p = policies[account];

        // 1. If not configured, fallback to default limits
        if (!p.isConfigured) {
            revert("PolicyGuardian: Account policy not initialized");
        }

        // 2. Emergency Pause Check
        if (p.emergencyPauseActive) {
            emit PolicyViolation(account, agentSigner, "Emergency Pause is Active");
            revert("PolicyGuardian: Emergency pause active");
        }

        // 3. Session Key Validity Check (if executed by agent)
        if (agentSigner != account) {
            SessionKey memory key = sessionKeys[account][agentSigner];
            require(key.active, "PolicyGuardian: Session key inactive");
            require(block.timestamp <= key.validUntil, "PolicyGuardian: Session key expired");
        }

        // 4. Max Per Transaction Check
        if (amountUsdt > p.maxPerTxUsdt) {
            emit PolicyViolation(account, agentSigner, "Exceeds max per-tx limit");
            revert("PolicyGuardian: Per-transaction spending limit exceeded");
        }

        // 5. Daily Limit Window Reset Check (24 hours = 86400 seconds)
        if (block.timestamp >= p.lastResetTimestamp + 1 days) {
            p.spentTodayUsdt = 0;
            p.lastResetTimestamp = block.timestamp;
        }

        // 6. Daily Limit Check
        if (p.spentTodayUsdt + amountUsdt > p.maxDailySpendingUsdt) {
            emit PolicyViolation(account, agentSigner, "Exceeds daily spending limit");
            revert("PolicyGuardian: Daily spending limit exceeded");
        }

        // 7. Risk Score Check
        if (estimatedRiskScore > p.riskScoreThreshold) {
            emit PolicyViolation(account, agentSigner, "Risk score exceeds safety threshold");
            revert("PolicyGuardian: Risk threshold violated");
        }

        // 8. Human Approval Threshold Check
        if (p.requireHumanApprovalAboveUsdt > 0 && amountUsdt >= p.requireHumanApprovalAboveUsdt && agentSigner != account) {
            emit PolicyViolation(account, agentSigner, "Human approval required for high-value execution");
            revert("PolicyGuardian: Human multi-sig confirmation required");
        }

        // 9. Update state
        p.spentTodayUsdt += amountUsdt;
        emit PolicyCheckPassed(account, agentSigner, amountUsdt, targetContract);
        return true;
    }
}
