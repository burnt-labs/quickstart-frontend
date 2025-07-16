import { BaseCard } from "../BaseCard";
import type { NFTConfig } from "../../../config/nftTypes";
import { Input, FormField } from "../../ui/form";
import { useEffect } from "react";

interface UploadDeployCardProps {
  config: NFTConfig;
  onConfigChange: (config: Partial<NFTConfig>) => void;
  completed: boolean;
  expanded: boolean;
  onDeploy: () => void;
  onEdit: () => void;
  disabled?: boolean;
}

export function UploadDeployCard({
  config,
  onConfigChange,
  completed,
  expanded,
  onDeploy,
  onEdit,
  disabled
}: UploadDeployCardProps) {
  const canDeploy = config.baseUri && config.contractUri;

  useEffect(() => {
    console.log('config', config);
  }, [config]);

  return (
    <BaseCard
      title="Upload & Deploy"
      description="Upload metadata and deploy to XION"
      completed={completed}
      expanded={expanded}
      onEdit={onEdit}
      disabled={disabled}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NFT Images URL */}
          <FormField label="NFT Images Url" required>
            <Input
              type="url"
              id="baseUri"
              value={config.baseUri || ''}
              onChange={(e) => onConfigChange({ baseUri: e.target.value })}
              placeholder="https://"
            />
          </FormField>

          {/* NFT Metadata URL */}
          <FormField label="NFT Metadata Url" required>
            <Input
              type="url"
              id="contractUri"
              value={config.contractUri || ''}
              onChange={(e) => onConfigChange({ contractUri: e.target.value })}
              placeholder="https://"
            />
          </FormField>
        </div>

        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary mb-2">
            Important: Metadata Requirements
          </h4>
          <ul className="space-y-1 text-sm text-white/80">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Images should be hosted on IPFS or a reliable CDN</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Metadata must follow the CW721 metadata standard</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Ensure URLs are publicly accessible before deployment</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onDeploy}
          disabled={!canDeploy}
          className={`
            w-full py-3 px-4 font-medium rounded-lg transition-colors
            ${
              canDeploy
                ? "bg-white text-black hover:bg-white/90"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            }
          `}
        >
          Deploy Contract
        </button>
      </div>
    </BaseCard>
  );
}