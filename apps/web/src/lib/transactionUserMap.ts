import { EncodeObject } from "@cosmjs/proto-signing";
import {
  generateInstantiateUserMapMessage,
  predictUserMapAddress,
} from "./userMap";
import {
  generateInstantiateTreasuryMessage,
  predictTreasuryAddress,
} from "./treasury";
import { generateRequestFaucetTokensMessage } from "./faucet";
import { FRONTEND_TEMPLATES, type FrontendTemplate } from "../config/constants";
import { executeBatchTransaction } from "./transaction";
import { REDIRECT_URLS } from "@burnt-labs/quick-start-utils";
import { ERROR_MESSAGES } from "./constants";

export async function assembleUserMapTransaction({
  senderAddress,
  saltString,
  frontendTemplate,
}: {
  senderAddress: string;
  saltString: string;
  frontendTemplate: FrontendTemplate;
}) {
  const messages: EncodeObject[] = [];
  const TREASURY_CODE_ID = import.meta.env.VITE_TREASURY_CODE_ID;
  const USER_MAP_CODE_ID = import.meta.env.VITE_USER_MAP_CODE_ID;
  const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

  if (!TREASURY_CODE_ID || !USER_MAP_CODE_ID || !FAUCET_ADDRESS) {
    const missing = [];
    if (!TREASURY_CODE_ID) missing.push(ERROR_MESSAGES.TREASURY_CODE_ID_MISSING);
    if (!USER_MAP_CODE_ID) missing.push(ERROR_MESSAGES.USER_MAP_CODE_ID_MISSING);
    if (!FAUCET_ADDRESS) missing.push(ERROR_MESSAGES.FAUCET_ADDRESS_MISSING);
    throw new Error(`${ERROR_MESSAGES.MISSING_ENV_VARS}: ${missing.join(", ")}`);
  }

  const appAddress = predictUserMapAddress(senderAddress, saltString);
  
  // Create both treasury contracts
  const webTreasuryAddress = predictTreasuryAddress(senderAddress, saltString);
  const mobileTreasuryAddress = predictTreasuryAddress(senderAddress, `${saltString}-mobile-treasury`);

  const userMapMessage = await generateInstantiateUserMapMessage(
    senderAddress,
    saltString,
    USER_MAP_CODE_ID
  );
  
  // Web treasury with web redirect URL
  const webTreasuryMessage = await generateInstantiateTreasuryMessage(
    senderAddress,
    saltString,
    [appAddress],
    TREASURY_CODE_ID,
    REDIRECT_URLS.WEB,
    "Allow execution of UserMap contract",
    "This pays fees for executing messages on the UserMap contract."
  );
  
  // Mobile treasury with mobile redirect URL
  const mobileTreasuryMessage = await generateInstantiateTreasuryMessage(
    senderAddress,
    `${saltString}-mobile-treasury`,
    [appAddress],
    TREASURY_CODE_ID,
    REDIRECT_URLS.MOBILE,
    "Allow execution of UserMap contract",
    "This pays fees for executing messages on the UserMap contract."
  );
  
  // Fund both treasuries
  const requestWebFaucetTokensMessage = await generateRequestFaucetTokensMessage(
    senderAddress,
    webTreasuryAddress,
    FAUCET_ADDRESS
  );
  
  const requestMobileFaucetTokensMessage = await generateRequestFaucetTokensMessage(
    senderAddress,
    mobileTreasuryAddress,
    FAUCET_ADDRESS
  );

  messages.push(
    userMapMessage, 
    webTreasuryMessage, 
    mobileTreasuryMessage,
    requestWebFaucetTokensMessage,
    requestMobileFaucetTokensMessage
  );

  // Return the treasury address based on the selected template
  const treasuryAddress = frontendTemplate === FRONTEND_TEMPLATES.MOBILE 
    ? mobileTreasuryAddress 
    : webTreasuryAddress;

  return { messages, appAddress, treasuryAddress };
}

export { executeBatchTransaction };
