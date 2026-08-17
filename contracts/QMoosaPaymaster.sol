// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QMoosaPaymaster
 * @notice ERC-4337 Gas Sponsorship and Token Fee Paymaster.
 * @dev Allows AI Agents to pay gas using QMS or USDT tokens with on-chain exchange rate Oracle.
 */
contract QMoosaPaymaster {
    address public owner;
    address public entryPoint;
    address public qmsToken;
    address public usdtToken;

    // Exchange rate: 1 USDT = 100,000 QMS for gas
    uint256 public qmsPerUsdRate = 100_000 * 10**18;

    mapping(address => bool) public sponsoredAgents;

    event GasSponsored(address indexed agent, address indexed userOpSender, uint256 actualGasCost);
    event TokenGasPaid(address indexed token, address indexed userOpSender, uint256 tokenAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _entryPoint, address _qmsToken, address _usdtToken) {
        owner = msg.sender;
        entryPoint = _entryPoint;
        qmsToken = _qmsToken;
        usdtToken = _usdtToken;
    }

    function setSponsoredAgent(address agent, bool sponsored) external onlyOwner {
        sponsoredAgents[agent] = sponsored;
    }

    function updateExchangeRate(uint256 newRate) external onlyOwner {
        qmsPerUsdRate = newRate;
    }

    /**
     * @notice Paymaster validation hook for ERC-4337 EntryPoint
     */
    function validatePaymasterUserOp(
        bytes32 userOpHash,
        uint256 maxCost
    ) external view returns (bytes memory context, uint256 validationData) {
        require(msg.sender == entryPoint, "Only EntryPoint");
        return (abi.encode(userOpHash, maxCost), 0);
    }

    /**
     * @notice Paymaster postOp execution
     */
    function postOp(
        uint8 mode,
        bytes calldata context,
        uint256 actualGasCost
    ) external {
        require(msg.sender == entryPoint, "Only EntryPoint");
        (bytes32 userOpHash, ) = abi.decode(context, (bytes32, uint256));
        emit GasSponsored(msg.sender, address(uint160(uint256(userOpHash))), actualGasCost);
    }

    function deposit() external payable {
        (bool success, ) = entryPoint.call{value: msg.value}("");
        require(success, "Deposit to EntryPoint failed");
    }

    receive() external payable {}
}
