import { useState, useEffect } from "react";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { LauncherView } from "./LauncherView";
import { useContractDeployment } from "../hooks/useContractDeployment";
import { useRumConfigs } from "../hooks/useRumConfigs";
import {
  DEFAULT_FRONTEND_TEMPLATE,
  type FrontendTemplate,
} from "../config/constants";
import {
  CONTRACT_TYPES,
  DEFAULT_CONTRACT_TYPE,
  type ContractType,
} from "../config/contractTypes";
import launcherContent from "../content/launcher.json";
import { useAnalytics } from "../hooks/useAnalytics";

export default function LauncherContainer() {
  const [contractType, setContractType] = useState<ContractType>(
    DEFAULT_CONTRACT_TYPE
  );
  const [frontendTemplate, setFrontendTemplate] = useState<FrontendTemplate>(
    DEFAULT_FRONTEND_TEMPLATE
  );

  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const { track } = useAnalytics(account?.bech32Address);

  const rumConfigs = useRumConfigs();

  const deployment = useContractDeployment(
    contractType,
    frontendTemplate,
    account
  );

  // Universal tracking wrapper with base data
  const trackAction = (eventName: string, data?: Record<string, any>) => {
    track(eventName, {
      contract_type: contractType,
      frontend_template: frontendTemplate,
      ...data,
    });
  };

  // Metrics tracker added inside the handler to reduce # of actions/boilerplate
  const handleLaunch = async () => {
    if (!client || !account) return;

    trackAction('step_2_launch_clicked', {
      contract_type: contractType, // Make explicit eventhough 0 length means standard usermap
      rum_configs_count: contractType === CONTRACT_TYPES.RUM ? rumConfigs.configs.length : 0,
    });

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

  // Track events first, items we miss can be done using onClick handlers.
  // Track deployment success (triggers Step 4 visibility)
  useEffect(() => {
    if (deployment.isSuccess && deployment.transactionHash) {
      trackAction('step_2_deployment_success', {
        transaction_hash: deployment.transactionHash,
        has_addresses: !!deployment.addresses,
      });
      
      // Step 4 becomes visible after successful deployment
      if (deployment.addresses) {
        trackAction('step_4_build_visible');
      }
    }
  }, [deployment.isSuccess, deployment.transactionHash, deployment.addresses]);

  // Track deployment errors
  useEffect(() => {
    if (deployment.errorMessage) {
      trackAction('deployment_error', {
        error_message: deployment.errorMessage,
      });
    }
  }, [deployment.errorMessage]);

  // Track wallet connection (Login)
  useEffect(() => {
    if (account?.bech32Address) {
      trackAction('login_wallet_connected');
    }
  }, [account?.bech32Address]);

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
      onTrack={trackAction} // standard onclick metric handler for all buttons
    />
  );
}
