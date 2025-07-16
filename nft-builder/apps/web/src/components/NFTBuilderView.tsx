import { NFTDeploymentMode } from "./NFTDeploymentMode";
import { NFTContractSelector } from "./NFTContractSelector";
import { NFTConfigWizard } from "./NFTConfigWizard";
import { DeploymentSection } from "./DeploymentSection";
import { DeployedNFTSection } from "./DeployedNFTSection";
import { SuccessMessage } from "./ui/SuccessMessage";
import { ErrorMessage } from "./ui/ErrorMessage";
import { NotLoggedIn } from "./ui/NotLoggedIn";
import type { NFTType, FrontendTemplate } from "../config/constants";
import type { NFTConfig, DeployedNFT } from "../config/nftTypes";

interface NFTBuilderViewProps {
  // State
  deploymentMode: 'template' | 'custom' | null;
  nftType: NFTType;
  frontendTemplate: FrontendTemplate;
  activeStep: number;
  steps: string[];
  nftConfig: NFTConfig;
  transactionHash: string;
  errorMessage: string;
  isPending: boolean;
  isSuccess: boolean;
  isDeployed: boolean;
  deployedNFT: DeployedNFT | null;
  account?: { bech32Address: string };
  excludeAdvanced?: boolean;
  
  // Actions
  onDeploymentModeChange: (mode: 'template' | 'custom') => void;
  onNftTypeChange: (type: NFTType) => void;
  onFrontendTemplateChange: (template: FrontendTemplate) => void;
  onStepChange: (step: number) => void;
  onConfigChange: (config: Partial<NFTConfig>) => void;
  onDeploy: () => void;
  onErrorClose: () => void;
  onExcludeAdvancedChange?: (exclude: boolean) => void;
}

export function NFTBuilderView({
  deploymentMode,
  nftType,
  frontendTemplate,
  activeStep,
  steps,
  nftConfig,
  transactionHash,
  errorMessage,
  isPending,
  isSuccess,
  isDeployed,
  deployedNFT,
  account,
  excludeAdvanced,
  onDeploymentModeChange,
  onNftTypeChange,
  onFrontendTemplateChange,
  onStepChange,
  onConfigChange,
  onDeploy,
  onErrorClose,
  onExcludeAdvancedChange,
}: NFTBuilderViewProps) {
  if (!account) {
    return <NotLoggedIn />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="">
        <h1 className="text-4xl font-bold mb-2">
          New Contract Setup
        </h1>
        <p className="text-base text-grey-text leading-5">
          Create and deploy contracts on XION blockchain with our builder. <br />
          Follow the step-by-step workflow to configure your contract parameters.
        </p>
      </div>

      {errorMessage && (
        <ErrorMessage message={errorMessage} onClose={onErrorClose} />
      )}

      {isSuccess && transactionHash && (
        <SuccessMessage transactionHash={transactionHash} />
      )}

      {!isDeployed ? (
        <>
          <NFTDeploymentMode
            selectedMode={deploymentMode}
            onModeChange={onDeploymentModeChange}
          />

          {deploymentMode === 'template' && (
            <>
              <NFTContractSelector
                selectedType={nftType}
                onTypeChange={onNftTypeChange}
                excludeAdvanced={excludeAdvanced}
                onExcludeAdvancedChange={onExcludeAdvancedChange}
              />

              <NFTConfigWizard
                activeStep={activeStep}
                steps={steps}
                config={nftConfig}
                nftType={nftType}
                onStepChange={onStepChange}
                onConfigChange={onConfigChange}
                onDeploy={onDeploy}
              />

              <DeploymentSection
                isReady={activeStep === steps.length - 1}
                isPending={isPending}
                frontendTemplate={frontendTemplate}
                onDeploy={onDeploy}
                onTemplateChange={onFrontendTemplateChange}
              />
            </>
          )}

          {deploymentMode === 'custom' && (
            <div className="bg-[#1D1D1D]/80 rounded-lg shadow-sm border border-white/20 p-6">
              <h3 className="text-lg font-semibold mb-4">Upload WASM Binary</h3>
              <p className="text-grey-text">Custom WASM upload functionality coming soon...</p>
            </div>
          )}
        </>
      ) : (
        <DeployedNFTSection
          deployedNFT={deployedNFT!}
          frontendTemplate={frontendTemplate}
        />
      )}
    </div>
  );
}