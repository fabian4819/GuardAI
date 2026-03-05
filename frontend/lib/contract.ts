import { parseAbi } from "viem";
import deployment from "../../deployment.json" assert { type: "json" };

export const VAULT_ADDRESS = deployment.vaultSentinel as `0x${string}`;
export const TOKEN_ADDRESS = deployment.mockERC20 as `0x${string}`;

export const VAULT_ABI = parseAbi([
    "function deposit(uint256 amount) external",
    "function getUserBalance(address user) external view returns (uint256)",
    "function lastRiskScore() external view returns (uint256)",
    "function vaultState() external view returns (uint8)",
    "function riskThreshold() external view returns (uint256)",
    "function triggerEmergency() external",
    "function resetVault() external",
    "event RiskScoreUpdated(uint256 score, uint256 timestamp)",
    "event EmergencyTriggered(uint256 riskScore, uint256 timestamp)",
    "event FundsReturned(address indexed user, uint256 amount)",
]);

export const TOKEN_ABI = parseAbi([
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address owner) external view returns (uint256)",
    "function mint(address to, uint256 amount) external",
]);

export const VAULT_STATES = ["🟢 ACTIVE", "🟡 GUARDED", "🔴 EMERGENCY"] as const;
