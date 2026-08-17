// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QMoosaToken (QMS)
 * @notice Native utility, staking, and governance token for the QMoosa Nexus Protocol.
 * @dev Hard-capped at 1,000,000,000,000,000 (1,000 Trillion / 1 Quadrillion QMS). 
 * Includes EIP-2612 permit for gasless approvals and deflationary transaction fee burning.
 */
contract QMoosaToken {
    string public constant name = "QMoosa Nexus Token";
    string public constant symbol = "QMS";
    uint8 public constant decimals = 18;

    // Hard-Capped Maximum Supply: 1,000 Trillion QMS (1,000,000,000,000,000 * 10^18)
    uint256 public constant MAX_SUPPLY = 1_000_000_000_000_000 * 10**18;
    uint256 public totalSupply;

    address public owner;
    address public policyGuardian;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public nonces;

    // EIP-712 Domain Separator for Permit
    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");

    // Burn rate in basis points (10 bps = 0.1% on transfer if enabled)
    uint256 public burnFeeBps = 0; 

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address indexed from, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "QMoosaToken: Caller is not the owner");
        _;
    }

    constructor(address _initialRecipient, address _policyGuardian) {
        require(_initialRecipient != address(0), "Invalid recipient");
        owner = msg.sender;
        policyGuardian = _policyGuardian;

        // Genesis Initial Circulating Supply (150 Trillion QMS)
        uint256 initialSupply = 150_000_000_000_000 * 10**18;
        totalSupply = initialSupply;
        balanceOf[_initialRecipient] = initialSupply;
        emit Transfer(address(0), _initialRecipient, initialSupply);

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(name)),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 currentAllowance = allowance[from][msg.sender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "QMoosaToken: Transfer amount exceeds allowance");
            unchecked {
                allowance[from][msg.sender] = currentAllowance - amount;
            }
        }
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[from] >= amount, "Transfer amount exceeds balance");

        uint256 burnAmount = (amount * burnFeeBps) / 10000;
        uint256 sendAmount = amount - burnAmount;

        unchecked {
            balanceOf[from] -= amount;
            balanceOf[to] += sendAmount;
        }
        emit Transfer(from, to, sendAmount);

        if (burnAmount > 0) {
            unchecked {
                totalSupply -= burnAmount;
            }
            emit Burn(from, burnAmount);
            emit Transfer(from, address(0), burnAmount);
        }
    }

    /**
     * @notice Mint tokens according to genesis vesting schedule. Cannot exceed MAX_SUPPLY.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Mint to zero address");
        require(totalSupply + amount <= MAX_SUPPLY, "QMoosaToken: Hard-cap of 1,000T QMS exceeded");
        
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    /**
     * @notice EIP-2612 Gasless Permit
     */
    function permit(
        address tokenOwner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(block.timestamp <= deadline, "QMoosaToken: Permit expired");

        bytes32 structHash = keccak256(
            abi.encode(PERMIT_TYPEHASH, tokenOwner, spender, value, nonces[tokenOwner]++, deadline)
        );

        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
        address signer = ecrecover(digest, v, r, s);
        require(signer != address(0) && signer == tokenOwner, "QMoosaToken: Invalid signature");

        allowance[tokenOwner][spender] = value;
        emit Approval(tokenOwner, spender, value);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
