import { FrontendTemplate, constants } from "@burnt-labs/quick-start-utils";
import { VERIFICATION_CONTRACT_ADDRESS, RUM_CODE_ID } from "../lib/rum";

const { FRONTEND_TEMPLATES } = constants;

export function formatEnvTextWithRum(
  addresses: { appAddress: string; treasuryAddress: string },
  template: FrontendTemplate,
  rpcUrl: string,
  restUrl: string,
  contractType: "usermap" | "rum" = "usermap",
  reclaimCredentials?: { appId: string; appSecret: string; providerId: string }
) {
  if (contractType === "rum") {
    // For RUM contracts, include additional environment variables
    const appId = reclaimCredentials?.appId || "your-reclaim-app-id";
    const providerId = reclaimCredentials?.providerId || "your-reclaim-provider-id";
    
    if (template === FRONTEND_TEMPLATES.WEBAPP) {
      return `NEXT_PUBLIC_CONTRACT_ADDRESS="${addresses.appAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${addresses.treasuryAddress}"
NEXT_PUBLIC_RPC_URL="${rpcUrl}"
NEXT_PUBLIC_REST_URL="${restUrl}"
NEXT_PUBLIC_CODE_ID="${RUM_CODE_ID}"
NEXT_PUBLIC_VERIFICATION_CONTRACT_ADDRESS="${VERIFICATION_CONTRACT_ADDRESS}"
NEXT_PUBLIC_RUM_CONTRACT_ADDRESS="${addresses.appAddress}"
NEXT_PUBLIC_RECLAIM_APP_ID="${appId}"
# Add your Reclaim App Secret manually (do not commit to version control):
# NEXT_PUBLIC_RECLAIM_APP_SECRET="your-secret-here"
NEXT_PUBLIC_RECLAIM_PROVIDER_ID="${providerId}"`;
    }

    return `EXPO_PUBLIC_USER_MAP_CONTRACT_ADDRESS="${addresses.appAddress}"
EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS="${addresses.treasuryAddress}"
EXPO_PUBLIC_RPC_ENDPOINT="${rpcUrl}"
EXPO_PUBLIC_REST_ENDPOINT="${restUrl}"
EXPO_PUBLIC_CODE_ID="${RUM_CODE_ID}"
EXPO_PUBLIC_VERIFICATION_CONTRACT_ADDRESS="${VERIFICATION_CONTRACT_ADDRESS}"
EXPO_PUBLIC_RUM_CONTRACT_ADDRESS="${addresses.appAddress}"
EXPO_PUBLIC_RECLAIM_APP_ID="${appId}"
EXPO_PUBLIC_RECLAIM_PROVIDER_ID="${providerId}"

# Add your Reclaim App Secret manually (do not commit to version control):
EXPO_PUBLIC_RECLAIM_APP_SECRET="your-secret-here"`;
  }

  // Default User Map format
  if (template === FRONTEND_TEMPLATES.WEBAPP) {
    return `NEXT_PUBLIC_CONTRACT_ADDRESS="${addresses.appAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${addresses.treasuryAddress}"
NEXT_PUBLIC_RPC_URL="${rpcUrl}"
NEXT_PUBLIC_REST_URL="${restUrl}"`;
  }

  return `EXPO_PUBLIC_USER_MAP_CONTRACT_ADDRESS="${addresses.appAddress}"
EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS="${addresses.treasuryAddress}"
EXPO_PUBLIC_RPC_ENDPOINT="${rpcUrl}"
EXPO_PUBLIC_REST_ENDPOINT="${restUrl}"`;
}