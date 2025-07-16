import { useState, useEffect } from "react";
import { NFTBuilderView } from "./NFTBuilderView";
import { useNFTConfig } from "../hooks/useNFTConfig";
import { DEFAULT_NFT_TYPE, DEFAULT_FRONTEND_TEMPLATE, NFT_VARIANT_INFO } from "../config/constants";
import type { NFTType, FrontendTemplate } from "../config/constants";

export default function NFTBuilderContainer() {
  const [deploymentMode, setDeploymentMode] = useState<'template' | 'custom' | null>(null);
  const [nftType, setNftType] = useState<NFTType>(DEFAULT_NFT_TYPE);
  const [frontendTemplate, setFrontendTemplate] = useState<FrontendTemplate>(DEFAULT_FRONTEND_TEMPLATE);
  const [activeStep, setActiveStep] = useState(0);
  const [excludeAdvanced, setExcludeAdvanced] = useState(false);
  
  // Simplified for now - no wallet connection
  const account = { bech32Address: "xion1example..." };
  
  const nftConfig = useNFTConfig();

  // Update config based on selected variant
  useEffect(() => {
    const variantInfo = NFT_VARIANT_INFO[nftType];
    nftConfig.updateConfig({
      isTransferable: variantInfo.transferable,
      onChainMetadata: variantInfo.onChainMetadata,
      isUpdatable: variantInfo.updatableMetadata,
      isSoulbound: !variantInfo.transferable,
    });
  }, [nftType]);

  const handleDeploy = async () => {
    console.log("Deploy NFT with config:", nftConfig.config);
    // Deployment logic will be added later
  };

  // Dynamic steps based on selected variant
  const getSteps = () => {
    const baseSteps = ["Basic Info"];
    
    // Add variant-specific steps
    if (nftType === "cw721-fixed-price") {
      baseSteps.push("Pricing");
    }
    
    if (nftType === "cw721-expiration") {
      baseSteps.push("Expiration Rules");
    }
    
    if (nftType === "cw2981-royalties") {
      baseSteps.push("Royalties");
    }
    
    if (!NFT_VARIANT_INFO[nftType].transferable) {
      // Skip minting rules for non-transferable
    } else {
      baseSteps.push("Minting Rules");
    }
    
    baseSteps.push("Features", "Review & Deploy");
    return baseSteps;
  };

  const steps = getSteps();

  return (
    <NFTBuilderView
      // State
      deploymentMode={deploymentMode}
      nftType={nftType}
      frontendTemplate={frontendTemplate}
      activeStep={activeStep}
      steps={steps}
      nftConfig={nftConfig.config}
      transactionHash=""
      errorMessage=""
      isPending={false}
      isSuccess={false}
      isDeployed={false}
      deployedNFT={null}
      account={account}
      excludeAdvanced={excludeAdvanced}
      
      // Actions
      onDeploymentModeChange={setDeploymentMode}
      onNftTypeChange={setNftType}
      onFrontendTemplateChange={setFrontendTemplate}
      onStepChange={setActiveStep}
      onConfigChange={nftConfig.updateConfig}
      onDeploy={handleDeploy}
      onErrorClose={() => {}}
      onExcludeAdvancedChange={setExcludeAdvanced}
    />
  );
}