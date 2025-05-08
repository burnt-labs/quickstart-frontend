import { ContractAddresses } from "./localStorageClient";
import { FRONTEND_TEMPLATES } from "../config/constants";

export function formatEnvText(
  addresses: ContractAddresses,
  platform: FRONTEND_TEMPLATES = FRONTEND_TEMPLATES.NEXTJS
) {
  const RPC_URL = import.meta.env.VITE_RPC_URL;
  const REST_URL = import.meta.env.VITE_REST_URL;

  if (platform === "nextjs") {
    return `NEXT_PUBLIC_CONTRACT_ADDRESS="${addresses.appAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${addresses.treasuryAddress}"
NEXT_PUBLIC_RPC_URL="${RPC_URL}"
NEXT_PUBLIC_REST_URL="${REST_URL}"`;
  }

  return `USER_MAP_CONTRACT_ADDRESS="${addresses.appAddress}"
TREASURY_CONTRACT_ADDRESS="${addresses.treasuryAddress}"
RPC_ENDPOINT="${RPC_URL}"
REST_ENDPOINT="${REST_URL}"`;
}
