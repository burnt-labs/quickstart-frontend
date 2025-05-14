import { ContractAddresses } from "../types";
import {
  DEFAULT_FRONTEND_TEMPLATE,
  FRONTEND_TEMPLATES,
  FrontendTemplate,
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

  return `EXPO_PUBLIC_USER_MAP_CONTRACT_ADDRESS="${addresses.appAddress}"
EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS="${addresses.treasuryAddress}"
EXPO_PUBLIC_RPC_ENDPOINT="${rpcUrl}"
EXPO_PUBLIC_REST_ENDPOINT="${restUrl}"`;
}
