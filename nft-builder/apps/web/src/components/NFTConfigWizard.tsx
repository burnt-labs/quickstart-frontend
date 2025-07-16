import { BasicInfoStep } from "./steps/BasicInfoStep";
import { MintingRulesStep } from "./steps/MintingRulesStep";
import { RoyaltiesStep } from "./steps/RoyaltiesStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { ReviewStep } from "./steps/ReviewStep";
import { Card } from './ui/Card';
import type { NFTConfig } from "../config/nftTypes";
import type { NFTType } from "../config/constants";

interface NFTConfigWizardProps {
  activeStep: number;
  steps: string[];
  config: NFTConfig;
  nftType: NFTType;
  onStepChange: (step: number) => void;
  onConfigChange: (config: Partial<NFTConfig>) => void;
  onDeploy?: () => void;
}

export function  NFTConfigWizard({
  activeStep,
  steps,
  config,
  nftType,
  onStepChange,
  onConfigChange,
  onDeploy,
}: NFTConfigWizardProps) {
  const renderStep = () => {
    const currentStepName = steps[activeStep];
    
    switch (currentStepName) {
      case "Basic Info":
        return <BasicInfoStep config={config} onChange={onConfigChange} />;
      case "Minting Rules":
        return <MintingRulesStep config={config} onChange={onConfigChange} nftType={nftType} />;
      case "Pricing":
        return <MintingRulesStep config={config} onChange={onConfigChange} nftType={nftType} />;
      case "Expiration Rules":
        return <MintingRulesStep config={config} onChange={onConfigChange} nftType={nftType} />;
      case "Royalties":
        return <RoyaltiesStep config={config} onChange={onConfigChange} nftType={nftType} />;
      case "Features":
        return <FeaturesStep config={config} onChange={onConfigChange} nftType={nftType} />;
      case "Review & Deploy":
        return <ReviewStep config={config} nftType={nftType} />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    const currentStepName = steps[activeStep];
    
    switch (currentStepName) {
      case "Basic Info":
        return config.name && config.symbol && config.description;
      case "Minting Rules":
        return config.maxSupply && config.maxSupply > 0;
      case "Pricing":
        return config.fixedPrice && config.fixedPrice !== "0";
      case "Expiration Rules":
        return true; // Or add validation for expiration days
      case "Royalties":
        // For royalties variant, ensure royalty fields are filled
        if (nftType === 'cw2981-royalties') {
          return config.royaltyPercentage !== undefined && 
                 config.royaltyPercentage > 0 && 
                 !!config.royaltyPaymentAddress;
        }
        return true; // Royalties are optional for other variants
      case "Features":
        return true; // Features step doesn't require validation
      case "Review & Deploy":
        return true; // Review step is always allowed
      default:
        return true;
    }
  };

  return (
    <Card className="p-0">
      {/* Step indicators */}
      <div className="border-b border-white/20">
        <nav className="flex">
          {steps.map((step, index) => (
            <button
              key={step}
              onClick={() => index <= activeStep && onStepChange(index)}
              disabled={index > activeStep}
              className={`
                flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors
                ${
                  index === activeStep
                    ? "text-primary border-primary"
                    : index < activeStep
                    ? "text-white border-transparent hover:text-white/80"
                    : "text-white/40 border-transparent cursor-not-allowed"
                }
              `}
            >
              <span className="flex items-center justify-center">
                {index < activeStep ? (
                  <svg
                    className="h-5 w-5 text-primary mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="mr-2">{index + 1}.</span>
                )}
                {step}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Step content */}
      <div className="p-6">
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="border-t border-white/20 px-6 py-4 flex justify-between">
        <button
          onClick={() => onStepChange(activeStep - 1)}
          disabled={activeStep === 0}
          className={`
            px-4 py-2 text-sm font-medium rounded-md
            ${
              activeStep === 0
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-white/20 text-white border border-white/20 hover:bg-white/30"
            }
          `}
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (activeStep === steps.length - 1 && onDeploy) {
              // On the last step (Review), trigger deployment
              onDeploy();
            } else {
              // Otherwise, go to next step
              onStepChange(activeStep + 1);
            }
          }}
          disabled={!canProceed()}
          className={`
            px-4 py-2 text-sm font-medium rounded-md
            ${
              !canProceed()
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-white text-black hover:bg-white/90"
            }
          `}
        >
          {activeStep === steps.length - 1 ? "Deploy" : activeStep === steps.length - 2 ? "Review" : "Next"}
        </button>
      </div>
    </Card>
  );
}