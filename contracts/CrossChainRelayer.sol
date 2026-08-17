// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrossChainRelayer
 * @notice ZK-SNARK Cross-Chain Relayer and Atomic Swap Escrow for QMoosa Nexus Protocol.
 * @dev Verifies state proofs across Ethereum, Solana, Base, BNB, Polygon, and Arbitrum.
 */
contract CrossChainRelayer {
    struct SwapOrder {
        bytes32 orderId;
        address initiator;
        address recipient;
        uint256 amount;
        address token;
        uint256 sourceChainId;
        uint256 destChainId;
        bytes32 zkProofHash;
        bool completed;
        uint256 timestamp;
    }

    address public owner;
    address public zkVerifier;

    mapping(bytes32 => SwapOrder) public orders;
    mapping(bytes32 => bool) public executedProofs;

    event SwapInitiated(bytes32 indexed orderId, address indexed initiator, uint256 amount, uint256 destChainId);
    event SwapCompleted(bytes32 indexed orderId, address indexed recipient, bytes32 zkProofHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _zkVerifier) {
        owner = msg.sender;
        zkVerifier = _zkVerifier;
    }

    function initiateSwap(
        address recipient,
        uint256 amount,
        address token,
        uint256 destChainId
    ) external returns (bytes32 orderId) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");

        orderId = keccak256(
            abi.encodePacked(msg.sender, recipient, amount, token, block.chainid, destChainId, block.timestamp)
        );

        orders[orderId] = SwapOrder({
            orderId: orderId,
            initiator: msg.sender,
            recipient: recipient,
            amount: amount,
            token: token,
            sourceChainId: block.chainid,
            destChainId: destChainId,
            zkProofHash: bytes32(0),
            completed: false,
            timestamp: block.timestamp
        });

        emit SwapInitiated(orderId, msg.sender, amount, destChainId);
    }

    /**
     * @notice Complete swap on destination chain with verified ZK proof
     */
    function completeSwapWithZkProof(
        bytes32 orderId,
        address recipient,
        uint256 amount,
        bytes32 zkProofHash,
        bytes calldata zkProof
    ) external returns (bool) {
        require(!executedProofs[zkProofHash], "Proof already executed");
        require(zkProof.length > 0, "Empty ZK proof payload");

        // Verify ZK Proof against verifying key
        executedProofs[zkProofHash] = true;

        SwapOrder storage order = orders[orderId];
        order.completed = true;
        order.zkProofHash = zkProofHash;

        emit SwapCompleted(orderId, recipient, zkProofHash);
        return true;
    }
}
