import { ContractAddresses } from "../types";
import {
  DEFAULT_FRONTEND_TEMPLATE,
  FRONTEND_TEMPLATES,
  FrontendTemplate,
  INSTANTIATE_SALT,
} from "../config/constants";

export function formatEnvText(
  addresses: ContractAddresses,
  template: FrontendTemplate = DEFAULT_FRONTEND_TEMPLATE,
  rpcUrl: string,
  restUrl: string
) {
  if (template === FRONTEND_TEMPLATES.WEBAPP) {
    return `NEXT_PUBLIC_CONTRACT_ADDRESS="${addresses.appAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${addresses.treasuryAddress}"
NEXT_PUBLIC_RPC_URL="${rpcUrl}"
NEXT_PUBLIC_REST_URL="${restUrl}"`;
  }

  if (template === FRONTEND_TEMPLATES.RUM) {
    // RUM contracts have their own deployment without UserMap
    return `EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS="${addresses.treasuryAddress}"
EXPO_PUBLIC_RPC_ENDPOINT="${rpcUrl}"
EXPO_PUBLIC_REST_ENDPOINT="${restUrl}"
EXPO_PUBLIC_CODE_ID="1289"
EXPO_PUBLIC_VERIFICATION_CONTRACT_ADDRESS="xion1qf8jtznwf0tykpg7e65gwafwp47rwxl4x2g2kldvv357s6frcjlsh2m24e"
EXPO_PUBLIC_RUM_CONTRACT_ADDRESS="${addresses.rumAddress}"

# Reclaim Protocol Configuration
# You need to add these values from your Reclaim dashboard (https://dev.reclaimprotocol.org)
# 1. Create an account and application
# 2. Add a "Twitter User Profile" provider to get the Provider ID
# 3. Copy your App ID, Provider ID, and App Secret below
EXPO_PUBLIC_RECLAIM_APP_ID="<YOUR_RECLAIM_APP_ID>"
EXPO_PUBLIC_RECLAIM_PROVIDER_ID="<YOUR_RECLAIM_PROVIDER_ID>"
# IMPORTANT: Never commit your App Secret to version control
EXPO_PUBLIC_RECLAIM_APP_SECRET="<YOUR_RECLAIM_APP_SECRET>"`;
  }

  return `EXPO_PUBLIC_USER_MAP_CONTRACT_ADDRESS="${addresses.appAddress}"
EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS="${addresses.treasuryAddress}"
EXPO_PUBLIC_RPC_ENDPOINT="${rpcUrl}"
EXPO_PUBLIC_REST_ENDPOINT="${restUrl}"`;
}
