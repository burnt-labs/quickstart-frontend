import { PageTitle, MutedText } from "./ui/Typography";
import { ContractSelectionSection } from "./ContractSelectionSection";
import { MultiRumConfigSection } from "./MultiRumConfigSection";
import { DeployedContractsSection } from "./DeployedContractsSection";
import { LaunchSection } from "./LaunchSection";
import { FrameworkSelectionSection } from "./FrameworkSelectionSection";
import { InstallationSection } from "./InstallationSection";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";
import { CONTRACT_TYPES, type ContractType } from "../config/contractTypes";
import { FRONTEND_TEMPLATES, type FrontendTemplate } from "../config/constants";
import type { RumConfig } from "../hooks/useRumConfigs";
import type { DeployedContract } from "../hooks/useContractDeployment";

interface LauncherViewProps {
  // Content
  pageTitle: string;
  pageDescription: string;
  
  // State
  contractType: ContractType;
  frontendTemplate: FrontendTemplate;
  transactionHash: string;
  errorMessage: string;
  isPending: boolean;
  isSuccess: boolean;
  isLoadingContracts: boolean;
  isDeployed: boolean;
  textboxValue: string;
  rumConfigs: RumConfig[];
  previousDeployments: DeployedContract[];
  addresses: {
    appAddress: string;
    treasuryAddress: string;
    rumAddress?: string;
  } | null;
  account?: { bech32Address: string };
  
  // Actions
  onContractTypeChange: (type: ContractType) => void;
  onFrontendTemplateChange: (template: FrontendTemplate) => void;
  onLaunch: () => void;
  onErrorClose: () => void;
  onRumConfigsChange: (configs: RumConfig[]) => void;
}

export function LauncherView({
  pageTitle,
  pageDescription,
  contractType,
  frontendTemplate,
  transactionHash,
  errorMessage,
  isPending,
  isSuccess,
  isLoadingContracts,
  isDeployed,
  textboxValue,
  rumConfigs,
  previousDeployments,
  addresses,
  account,
  onContractTypeChange,
  onFrontendTemplateChange,
  onLaunch,
  onErrorClose,
  onRumConfigsChange,
}: LauncherViewProps) {
  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto">
      <header className="mb-4">
        <PageTitle>{pageTitle}</PageTitle>
        <MutedText>{pageDescription}</MutedText>
      </header>

      <ContractSelectionSection
        contractType={contractType}
        onContractTypeChange={onContractTypeChange}
        disabled={isPending}
      />

      {contractType === CONTRACT_TYPES.RUM && (
        <>
          {isLoadingContracts && (
            <div className="w-full max-w-screen-md mb-4 p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
              <p className="text-sm text-zinc-400">Checking for existing contracts...</p>
            </div>
          )}
          <MultiRumConfigSection
            configs={rumConfigs}
            onConfigsChange={onRumConfigsChange}
            disabled={isPending || isLoadingContracts}
            onLaunch={onLaunch}
            isPending={isPending}
            existingContractsCount={previousDeployments.length}
          />
        </>
      )}

      <DeployedContractsSection
        contractType={contractType}
        deployedContracts={previousDeployments}
      />

      {contractType === CONTRACT_TYPES.USER_MAP && (
        <LaunchSection
          onLaunch={onLaunch}
          isPending={isPending || isLoadingContracts}
          isSuccess={isSuccess}
          transactionHash={transactionHash}
          errorMessage={errorMessage}
          onErrorClose={onErrorClose}
          contractType={contractType}
          isDeployed={isDeployed}
        />
      )}

      {contractType === CONTRACT_TYPES.RUM && (isSuccess || errorMessage) && (
        <div className="w-full max-w-screen-md">
          {isSuccess && <SuccessMessage transactionHash={transactionHash} />}
          {errorMessage && (
            <ErrorMessage errorMessage={errorMessage} onClose={onErrorClose} />
          )}
        </div>
      )}

      {addresses && (
        <>
          {contractType === CONTRACT_TYPES.USER_MAP && (
            <FrameworkSelectionSection
              frontendTemplate={frontendTemplate}
              onTemplateChange={onFrontendTemplateChange}
            />
          )}

          <InstallationSection
            frontendTemplate={contractType === CONTRACT_TYPES.RUM ? FRONTEND_TEMPLATES.RUM : frontendTemplate}
            textboxValue={textboxValue}
            account={account}
          />
        </>
      )}
    </div>
  );
}