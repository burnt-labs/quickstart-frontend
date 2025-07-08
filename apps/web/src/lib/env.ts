/**
 * Type-safe environment variable helper
 */

interface EnvConfig {
  TREASURY_CODE_ID: number;
  USER_MAP_CODE_ID: number;
  RUM_CODE_ID: number;
  FAUCET_ADDRESS: string;
  REST_URL: string;
}

/**
 * Get required environment variables with proper error handling
 * @returns Validated environment configuration
 * @throws Error with specific missing variables
 */
export function getRequiredEnvVars(): EnvConfig {
  const env = {
    TREASURY_CODE_ID: import.meta.env.VITE_TREASURY_CODE_ID,
    USER_MAP_CODE_ID: import.meta.env.VITE_USER_MAP_CODE_ID,
    RUM_CODE_ID: import.meta.env.VITE_RUM_CODE_ID,
    FAUCET_ADDRESS: import.meta.env.VITE_FAUCET_ADDRESS,
    REST_URL: import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com",
  };

  const missing: string[] = [];
  
  if (!env.TREASURY_CODE_ID) missing.push("VITE_TREASURY_CODE_ID");
  if (!env.USER_MAP_CODE_ID) missing.push("VITE_USER_MAP_CODE_ID");
  if (!env.RUM_CODE_ID) missing.push("VITE_RUM_CODE_ID");
  if (!env.FAUCET_ADDRESS) missing.push("VITE_FAUCET_ADDRESS");

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    TREASURY_CODE_ID: Number(env.TREASURY_CODE_ID),
    USER_MAP_CODE_ID: Number(env.USER_MAP_CODE_ID),
    RUM_CODE_ID: Number(env.RUM_CODE_ID),
    FAUCET_ADDRESS: env.FAUCET_ADDRESS,
    REST_URL: env.REST_URL,
  };
}

/**
 * Get optional environment variables
 */
export function getOptionalEnvVars() {
  return {
    RPC_URL: import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443",
  };
}