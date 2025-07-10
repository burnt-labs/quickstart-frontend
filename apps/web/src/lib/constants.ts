/**
 * Transaction and treasury related constants
 */

// Treasury configuration
export const TREASURY_CONFIG = {
  MAX_AMOUNT: "2500",
  DENOM: "uxion",
  DEFAULT_GAS_MULTIPLIER: 1.5,
  AUTO_GAS: "auto" as const,
} as const;

// Shared treasury limits
export const SHARED_TREASURY_LIMITS = {
  MAX_CONTRACTS: 15,
  FUTURE_SLOTS_COUNT: 5,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  MISSING_ENV_VARS: "Missing required environment variables",
  CLIENT_NOT_CONNECTED: "Client is not connected",
  TREASURY_CODE_ID_MISSING: "TREASURY_CODE_ID is not defined",
  USER_MAP_CODE_ID_MISSING: "USER_MAP_CODE_ID is not defined",
  RUM_CODE_ID_MISSING: "RUM_CODE_ID is not defined",
  FAUCET_ADDRESS_MISSING: "FAUCET_ADDRESS is not defined",
} as const;