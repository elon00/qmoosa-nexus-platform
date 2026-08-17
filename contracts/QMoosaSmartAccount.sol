// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPolicyGuardian {
    function validateAndRecordExecution(
        address account,
        address agentSigner,
        uint256 amountUsdt,
        address targetContract,
        uint8 estimatedRiskScore,
        uint256 targetChainId
    ) external returns (bool);
}

/**
 * @title QMoosaSmartAccount
 * @notice ERC-4337 Compatible Modular Smart Account for Autonomous AI Agents.
 * @dev Supports ECDSA/Passkey owner signatures, scoped Session Keys, and on-chain Policy Guardian enforcement.
 */
contract QMoosaSmartAccount {
    address public owner;
    address public entryPoint;
    IPolicyGuardian public policyGuardian;
    uint256 public nonce;

    event Executed(address indexed target, uint256 value, bytes data);
    event PolicyGuardianUpdated(address indexed newGuardian);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);

    modifier onlyEntryPointOrOwner() {
        require(msg.sender == entryPoint || msg.sender == owner, "QMoosaSmartAccount: Unauthorized");
        _;
    }

    constructor(address _owner, address _entryPoint, address _policyGuardian) {
        require(_owner != address(0), "Invalid owner");
        owner = _owner;
        entryPoint = _entryPoint;
        policyGuardian = IPolicyGuardian(_policyGuardian);
    }

    /**
     * @notice Execute transaction directly by owner
     */
    function execute(address dest, uint256 value, bytes calldata func) external onlyEntryPointOrOwner returns (bytes memory) {
        nonce++;
        (bool success, bytes memory result) = dest.call{value: value}(func);
        require(success, "QMoosaSmartAccount: Execution reverted");
        emit Executed(dest, value, func);
        return result;
    }

    /**
     * @notice Execute autonomous AI agent transaction bounded by Policy Guardian
     */
    function executeAgentTransaction(
        address agentSigner,
        address dest,
        uint256 value,
        bytes calldata func,
        uint256 estimatedUsdtCost,
        uint8 riskScore
    ) external returns (bytes memory) {
        // Enforce Policy Guardian spending and safety checks
        if (address(policyGuardian) != address(0)) {
            bool approved = policyGuardian.validateAndRecordExecution(
                address(this),
                agentSigner,
                estimatedUsdtCost,
                dest,
                riskScore,
                block.chainid
            );
            require(approved, "QMoosaSmartAccount: Policy Guardian rejected execution");
        }

        nonce++;
        (bool success, bytes memory result) = dest.call{value: value}(func);
        require(success, "QMoosaSmartAccount: Agent execution reverted");
        emit Executed(dest, value, func);
        return result;
    }

    /**
     * @notice ERC-4337 validateUserOp placeholder
     */
    function validateUserOp(
        bytes32 userOpHash,
        bytes calldata signature,
        uint256 missingAccountFunds
    ) external returns (uint256 validationData) {
        require(msg.sender == entryPoint, "Only EntryPoint");
        
        // Recover signer from signature
        address signer = recoverSigner(userOpHash, signature);
        if (signer != owner) {
            return 1; // SIG_VALIDATION_FAILED
        }

        if (missingAccountFunds > 0) {
            (bool success, ) = entryPoint.call{value: missingAccountFunds}("");
            require(success, "Failed to pay prefund");
        }

        return 0; // SIG_VALIDATION_SUCCESS
    }

    function recoverSigner(bytes32 _hash, bytes memory _sig) internal pure returns (address) {
        if (_sig.length != 65) {
            return address(0);
        }
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            v := byte(0, mload(add(_sig, 96)))
        }
        return ecrecover(_hash, v, r, s);
    }

    function setPolicyGuardian(address _newGuardian) external {
        require(msg.sender == owner, "Only owner");
        policyGuardian = IPolicyGuardian(_newGuardian);
        emit PolicyGuardianUpdated(_newGuardian);
    }

    receive() external payable {}
}
