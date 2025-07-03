import { useState } from "react";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { LauncherView } from "./LauncherView";
import { useContractDeployment } from "../hooks/useContractDeployment";
import { useRumConfigs } from "../hooks/useRumConfigs";
import { DEFAULT_FRONTEND_TEMPLATE, type FrontendTemplate } from "../config/constants";
import { CONTRACT_TYPES, DEFAULT_CONTRACT_TYPE, type ContractType } from "../config/contractTypes";
import launcherContent from "../content/launcher.json";

export default function LauncherContainer() {
  const [contractType, setContractType] = useState<ContractType>(DEFAULT_CONTRACT_TYPE);
  const [frontendTemplate, setFrontendTemplate] = useState<FrontendTemplate>(DEFAULT_FRONTEND_TEMPLATE);
  
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  
  const rumConfigs = useRumConfigs();
  
  const deployment = useContractDeployment(contractType, frontendTemplate, account);

  const handleLaunch = async () => {
    if (!client || !account) return;

    try {
      if (contractType === CONTRACT_TYPES.RUM) {
        await deployment.deployMultiRum({
          senderAddress: account.bech32Address,
          client,
          rumConfigs: rumConfigs.configs,
        });
      } else {
        await deployment.deployUserMap({
          senderAddress: account.bech32Address,
          client,
        });
      }
    } catch {
      // Error is handled by the deployment hook
    }
  };

  return (
    <LauncherView
      // Content
      pageTitle={launcherContent.page_title}
      pageDescription={launcherContent.page_description}
      
      // State
      contractType={contractType}
      frontendTemplate={frontendTemplate}
      transactionHash={deployment.transactionHash}
      errorMessage={deployment.errorMessage}
      isPending={deployment.isPending}
      isSuccess={deployment.isSuccess}
      isLoadingContracts={deployment.isLoadingContracts}
      isDeployed={!!deployment.currentDeployment}
      textboxValue={deployment.textboxValue}
      rumConfigs={rumConfigs.configs}
      previousDeployments={deployment.previousDeployments}
      addresses={deployment.addresses}
      account={account}
      
      // Actions
      onContractTypeChange={setContractType}
      onFrontendTemplateChange={setFrontendTemplate}
      onLaunch={handleLaunch}
      onErrorClose={deployment.clearError}
      onRumConfigsChange={rumConfigs.setConfigs}
    />
  );
}