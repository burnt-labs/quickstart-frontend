import { BaseCard } from "../BaseCard";
import type { AssetConfig, DeployedAsset } from "../../../config/assetTypes";
import { Input, FormField } from "../../ui/form";
import { useEffect } from "react";
import { Spinner } from "../../ui/Spinner";
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface UploadDeployCardProps {
  config: AssetConfig;
  onConfigChange: (config: Partial<AssetConfig>) => void;
  completed: boolean;
  expanded: boolean;
  onDeploy: () => void;
  onEdit: () => void;
  disabled?: boolean;
  isPending?: boolean;
  isSuccess?: boolean;
  errorMessage?: string;
  transactionHash?: string;
  deployedAsset?: DeployedAsset | null;
}

export function UploadDeployCard({
  config,
  onConfigChange,
  completed,
  expanded,
  onDeploy,
  onEdit,
  disabled,
  isPending,
  isSuccess,
  errorMessage,
  transactionHash,
  deployedAsset
}: UploadDeployCardProps) {
  // Allow deployment without metadata URLs - they're optional
  const canDeploy = true;

  useEffect(() => {
    console.log('config', config);
    console.log('canDeploy', canDeploy);
  }, [config, canDeploy]);

  return (
    <BaseCard
      title="Configure & Deploy"
      description="Set your asset metadata location and deploy to XION"
      completed={completed}
      expanded={expanded}
      onEdit={onEdit}
      disabled={disabled}
    >
      <div className="space-y-6">
        <div className="space-y-6">
          <FormField 
            label="Base URI (Metadata Folder)" 
            description="IPFS or URL where your metadata JSON files are stored"
          >
            <Input
              type="url"
              id="baseUri"
              value={config.baseUri || ''}
              onChange={(e) => onConfigChange({ baseUri: e.target.value })}
              placeholder="ipfs://QmXxxx.../ or https://example.com/metadata/"
            />
          </FormField>

          <FormField 
            label="Contract URI (Optional)" 
            description="URL to collection metadata. For CW2981, this becomes the collection image URL."
          >
            <Input
              type="url"
              id="contractUri"
              value={config.contractUri || ''}
              onChange={(e) => onConfigChange({ contractUri: e.target.value })}
              placeholder="Leave empty or add collection metadata URL"
            />
          </FormField>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-sm text-grey-text">
              <strong>Base URI Example:</strong> If base URI is <code className="text-primary">ipfs://QmXxxx.../</code>, then:
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm text-grey-text">
              <li>Token #1: <code>ipfs://QmXxxx.../1.json</code></li>
              <li>Token #2: <code>ipfs://QmXxxx.../2.json</code></li>
            </ul>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary mb-2">
            Important: Base URI Setup
          </h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Upload all your asset metadata files (1.json, 2.json, etc.) to IPFS first</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Base URI should end with a forward slash (/) if using folders</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Once deployed, the base URI cannot be changed</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Each metadata file should include: name, description, image, and attributes</span>
            </li>
          </ul>
        </div>

        {/* Deployment Status */}
        {isPending && (
          <div className="bg-blue-900/20 border border-blue-600/40 rounded-lg p-4">
            <div className="flex items-center">
              <Spinner className="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-400">
                  Deploying Asset Contract...
                </h3>
                <p className="mt-1 text-sm text-blue-600">
                  Please wait while your asset contract is being deployed.
                </p>
              </div>
            </div>
          </div>
        )}

        {isSuccess && deployedAsset && (
          <div className="bg-green-900/20 border border-green-600/40 rounded-lg p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-green-400">
                  Deployment Successful!
                </h3>
                <div className="mt-2 space-y-1">
                  <div>
                    <span className="text-sm text-green-600">Asset Contract:</span>
                    <code className="ml-2 text-xs text-green-400 font-mono break-all">
                      {deployedAsset.contractAddress}
                    </code>
                  </div>
                  {transactionHash && (
                    <div>
                      <a
                        href={`https://explorer.burnt.com/xion-testnet-2/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-400 hover:text-green-300 underline"
                      >
                        View on Explorer →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-900/20 border border-red-600/40 rounded-lg p-4">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-400">
                  Deployment Failed
                </h3>
                <p className="mt-1 text-sm text-red-600">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {!isSuccess && (
          <button
            onClick={onDeploy}
            disabled={!canDeploy || isPending}
            className={`
              w-full py-3 px-4 font-medium rounded-lg transition-colors
              ${
                canDeploy && !isPending
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              }
            `}
          >
            {isPending ? "Deploying..." : "Deploy Contract"}
          </button>
        )}
      </div>
    </BaseCard>
  );
}