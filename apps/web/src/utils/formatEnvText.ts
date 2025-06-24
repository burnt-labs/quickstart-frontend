import { FrontendTemplate, constants } from "@burnt-labs/quick-start-utils";
import { VERIFICATION_CONTRACT_ADDRESS, RUM_CODE_ID } from "../lib/rum";

const { FRONTEND_TEMPLATES } = constants;

export function formatEnvTextWithRum(
  addresses: { 
    appAddress: string; 
    treasuryAddress: string;
    userMapAddress?: string;
    rumAddress?: string;
  },
  template: FrontendTemplate,
  rpcUrl: string,
  restUrl: string,
  contractType: "usermap" | "rum" = "usermap"
) {
  if (contractType === "rum") {
    // For RUM contracts, show RUM-specific env vars
    const rumAddress = addresses.rumAddress || addresses.appAddress;
    if (template === FRONTEND_TEMPLATES.WEBAPP) {
      return `NEXT_PUBLIC_CONTRACT_ADDRESS="${rumAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${addresses.treasuryAddress}"
NEXT_PUBLIC_RPC_URL="${rpcUrl}"
NEXT_PUBLIC_REST_URL="${restUrl}"
NEXT_PUBLIC_CODE_ID="${RUM_CODE_ID}"
NEXT_PUBLIC_VERIFICATION_CONTRACT_ADDRESS="${VERIFICATION_CONTRACT_ADDRESS}"
NEXT_PUBLIC_RUM_CONTRACT_ADDRESS="${rumAddress}"

# Reclaim Protocol Configuration
# You need to add these values from your Reclaim dashboard (https://dev.reclaimprotocol.org)
NEXT_PUBLIC_RECLAIM_APP_ID="your-reclaim-app-id"
NEXT_PUBLIC_RECLAIM_PROVIDER_ID="your-reclaim-provider-id"
# IMPORTANT: Never commit your App Secret to version control
NEXT_PUBLIC_RECLAIM_APP_SECRET="your-reclaim-app-secret"`;
    }

    return `EXPO_PUBLIC_USER_MAP_CONTRACT_ADDRESS="${rumAddress}"
EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS="${addresses.treasuryAddress}"
EXPO_PUBLIC_RPC_ENDPOINT="${rpcUrl}"
EXPO_PUBLIC_REST_ENDPOINT="${restUrl}"
EXPO_PUBLIC_CODE_ID="${RUM_CODE_ID}"
EXPO_PUBLIC_VERIFICATION_CONTRACT_ADDRESS="${VERIFICATION_CONTRACT_ADDRESS}"
EXPO_PUBLIC_RUM_CONTRACT_ADDRESS="${rumAddress}"

# Reclaim Protocol Configuration
# You need to add these values from your Reclaim dashboard (https://dev.reclaimprotocol.org)
# 1. Create an account and application
# 2. Add a "Twitter User Profile" provider to get the Provider ID
# 3. Copy your App ID, Provider ID, and App Secret below
EXPO_PUBLIC_RECLAIM_APP_ID="your-reclaim-app-id"
EXPO_PUBLIC_RECLAIM_PROVIDER_ID="your-reclaim-provider-id"
# IMPORTANT: Never commit your App Secret to version control
EXPO_PUBLIC_RECLAIM_APP_SECRET="your-reclaim-app-secret"`;
  }

  // Default User Map format
  const userMapAddress = addresses.userMapAddress || addresses.appAddress;
  if (template === FRONTEND_TEMPLATES.WEBAPP) {
    return `NEXT_PUBLIC_CONTRACT_ADDRESS="${userMapAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${addresses.treasuryAddress}"
NEXT_PUBLIC_RPC_URL="${rpcUrl}"
NEXT_PUBLIC_REST_URL="${restUrl}"`;
  }

  return `EXPO_PUBLIC_USER_MAP_CONTRACT_ADDRESS="${userMapAddress}"
EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS="${addresses.treasuryAddress}"
EXPO_PUBLIC_RPC_ENDPOINT="${rpcUrl}"
EXPO_PUBLIC_REST_ENDPOINT="${restUrl}"`;
}