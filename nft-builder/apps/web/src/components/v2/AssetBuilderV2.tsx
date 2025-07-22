import { useState, useEffect } from "react";
import { DeploymentModeCard } from "./cards/DeploymentModeCard";
import { SelectTemplateCard } from "./cards/SelectTemplateCard";
import { BasicInputsCard } from "./cards/BasicInputsCard";
import { AdvancedOptionsCard } from "./cards/AdvancedOptionsCard";
import { UploadDeployCard } from "./cards/UploadDeployCard";
import type { AssetType } from "../../config/constants";
import { DEFAULT_ASSET_TYPE } from "../../config/constants";
import { useAssetConfig } from "../../hooks/useAssetConfig";
import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { useAssetDeployment } from "../../hooks/useAssetDeployment";

type CardStep = 'deployment-mode' | 'select-template' | 'basic-inputs' | 'advanced-options' | 'upload-deploy';

interface CardState {
  completed: boolean;
  expanded: boolean;
}

export function AssetBuilderV2() {
  const [deploymentMode, setDeploymentMode] = useState<'template' | 'custom' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AssetType>(DEFAULT_ASSET_TYPE);
  const assetConfig = useAssetConfig();
  const { data: account } = useAbstraxionAccount();
  
  // Track card states
  const [cardStates, setCardStates] = useState<Record<CardStep, CardState>>({
    'deployment-mode': { completed: false, expanded: true },
    'select-template': { completed: false, expanded: false },
    'basic-inputs': { completed: false, expanded: false },
    'advanced-options': { completed: false, expanded: false },
    'upload-deploy': { completed: false, expanded: false },
  });

  const updateCardState = (card: CardStep, updates: Partial<CardState>) => {
    setCardStates(prev => ({
      ...prev,
      [card]: { ...prev[card], ...updates }
    }));
  };

  const handleCardComplete = (currentCard: CardStep, nextCard?: CardStep) => {
    updateCardState(currentCard, { completed: true, expanded: false });
    if (nextCard) {
      updateCardState(nextCard, { expanded: true });
    }
  };

  const handleCardEdit = (card: CardStep) => {
    // Collapse all cards first
    Object.keys(cardStates).forEach(key => {
      updateCardState(key as CardStep, { expanded: false });
    });
    // Then expand the selected card
    updateCardState(card, { expanded: true });
  };

  // Update royalty payment address when account changes
  useEffect(() => {
    if (account?.bech32Address && selectedTemplate === 'cw2981-royalties') {
      assetConfig.updateConfig({
        royaltyPaymentAddress: account.bech32Address
      });
    }
  }, [account?.bech32Address, selectedTemplate]);

  // Get deployment functionality
  const { client: signingClient } = useAbstraxionSigningClient();
  const deployment = useAssetDeployment(selectedTemplate, account);
  

  const handleDeploy = async () => {
    if (!account?.bech32Address || !signingClient) {
      console.error("Wallet not connected or signing client not available");
      return;
    }

    await deployment.deployAsset({
      senderAddress: account.bech32Address,
      client: signingClient,
      assetConfig: assetConfig.config,
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="">
        <h1 className="text-4xl font-bold mb-2">New Contract Setup</h1>
        <p className="text-base text-grey-text leading-5">
          Create and deploy contracts on XION blockchain with our builder.<br />
          Follow the step-by-step workflow to configure your contract parameters.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <DeploymentModeCard
          deploymentMode={deploymentMode}
          onModeChange={setDeploymentMode}
          completed={cardStates['deployment-mode'].completed}
          expanded={cardStates['deployment-mode'].expanded}
          onContinue={() => handleCardComplete('deployment-mode', 'select-template')}
          onEdit={() => handleCardEdit('deployment-mode')}
        />

        {deploymentMode === 'template' && (
          <>
            <SelectTemplateCard
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              completed={cardStates['select-template'].completed}
              expanded={cardStates['select-template'].expanded}
              onContinue={() => handleCardComplete('select-template', 'basic-inputs')}
              onEdit={() => handleCardEdit('select-template')}
              disabled={!cardStates['deployment-mode'].completed}
            />

            <BasicInputsCard
              config={assetConfig.config}
              onConfigChange={assetConfig.updateConfig}
              completed={cardStates['basic-inputs'].completed}
              expanded={cardStates['basic-inputs'].expanded}
              onContinue={() => handleCardComplete('basic-inputs', 'advanced-options')}
              onEdit={() => handleCardEdit('basic-inputs')}
              disabled={!cardStates['select-template'].completed}
            />

            <AdvancedOptionsCard
              config={assetConfig.config}
              onConfigChange={assetConfig.updateConfig}
              selectedTemplate={selectedTemplate}
              completed={cardStates['advanced-options'].completed}
              expanded={cardStates['advanced-options'].expanded}
              onContinue={() => handleCardComplete('advanced-options', 'upload-deploy')}
              onEdit={() => handleCardEdit('advanced-options')}
              disabled={!cardStates['basic-inputs'].completed}
            />

            <UploadDeployCard
              config={assetConfig.config}
              onConfigChange={assetConfig.updateConfig}
              completed={cardStates['upload-deploy'].completed}
              expanded={cardStates['upload-deploy'].expanded}
              onDeploy={handleDeploy}
              onEdit={() => handleCardEdit('upload-deploy')}
              disabled={!cardStates['advanced-options'].completed}
              isPending={deployment.isPending}
              isSuccess={deployment.isSuccess}
              errorMessage={deployment.errorMessage}
              transactionHash={deployment.transactionHash}
              deployedAsset={deployment.deployedAsset}
            />
          </>
        )}

        {deploymentMode === 'custom' && (
          <div className="bg-[#1D1D1D]/80 rounded-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold mb-4">Upload WASM Binary</h3>
            <p className="text-grey-text">Custom WASM upload functionality coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}