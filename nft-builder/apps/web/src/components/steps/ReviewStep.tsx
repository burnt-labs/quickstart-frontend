import type { NFTConfig } from "../../config/nftTypes";
import type { NFTType } from "../../config/constants";
import { NFT_TYPES } from "../../config/constants";

interface ReviewStepProps {
  config: NFTConfig;
  nftType: NFTType;
}

export function ReviewStep({ config, nftType }: ReviewStepProps) {
  const formatPrice = (priceInMicro?: string) => {
    if (!priceInMicro) return "Free";
    const price = parseInt(priceInMicro) / 1000000;
    return `${price} XION`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Not set";
    return date.toLocaleString();
  };

  const getNFTTypeLabel = (type: NFTType) => {
    switch (type) {
      case NFT_TYPES.CW721_BASE:
        return "Basic NFT";
      case NFT_TYPES.CW721_UPDATABLE:
        return "NFT with Royalties";
      case NFT_TYPES.CW721_METADATA_ONCHAIN:
        return "NFT Collection";
      case NFT_TYPES.CW721_EXPIRATION:
        return "NFT + Marketplace";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl leading-7 font-semibold">
          Basic Information
        </h3>
        <p className="text-sm leading-5 text-grey-text mt-1">
          Provide the basic details for your NFT collection.
        </p>
      </div>

      <div className="space-y-6">
        {/* Contract Type */}
        <div className="bg-white/5 border rounded-lg border-white/10 p-4">
          <h4 className="text-sm font-semibold text-white mb-2">Contract Type</h4>
          <p className="text-sm text-grey-text">{getNFTTypeLabel(nftType)}</p>
        </div>

        {/* Basic Information */}
        <div className="bg-white/5 border rounded-lg border-white/10 p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Basic Information</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-grey-text">Name:</dt>
              <dd className="text-sm font-medium text-white">{config.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-grey-text">Symbol:</dt>
              <dd className="text-sm font-medium text-white">{config.symbol}</dd>
            </div>
            <div>
              <dt className="text-sm text-grey-text mb-1">Description:</dt>
              <dd className="text-sm text-white">{config.description}</dd>
            </div>
            {config.baseUri && (
              <div>
                <dt className="text-sm text-grey-text mb-1">Base URI:</dt>
                <dd className="text-sm text-white font-mono break-all">{config.baseUri}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Minting Rules */}
        <div className="bg-white/5 border rounded-lg border-white/10 p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Minting Rules</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-grey-text">Max Supply:</dt>
              <dd className="text-sm font-medium text-white">
                {config.maxSupply?.toLocaleString() || "Unlimited"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-grey-text">Mint Price:</dt>
              <dd className="text-sm font-medium text-white">{formatPrice(config.mintPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-grey-text">Per Address Limit:</dt>
              <dd className="text-sm font-medium text-white">
                {config.perAddressLimit || "No limit"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-grey-text">Start Time:</dt>
              <dd className="text-sm font-medium text-white">{formatDate(config.startTime)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-grey-text">End Time:</dt>
              <dd className="text-sm font-medium text-white">{formatDate(config.endTime)}</dd>
            </div>
          </dl>
        </div>

        {/* Royalties */}
        {(config.royaltyPercentage || 0) > 0 && (
          <div className="bg-white/5 border rounded-lg border-white/10 p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Royalties</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-grey-text">Percentage:</dt>
                <dd className="text-sm font-medium text-white">{config.royaltyPercentage}%</dd>
              </div>
              <div>
                <dt className="text-sm text-grey-text mb-1">Payment Address:</dt>
                <dd className="text-sm font-medium text-white font-mono break-all">
                  {config.royaltyPaymentAddress}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Features */}
        <div className="bg-white/5 border rounded-lg border-white/10 p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Features</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <span className={`text-sm ${config.isSoulbound ? 'text-green-600' : 'text-gray-400'}`}>
                {config.isSoulbound ? '✓' : '✗'} Soulbound
              </span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm ${config.isBurnable ? 'text-green-600' : 'text-gray-400'}`}>
                {config.isBurnable ? '✓' : '✗'} Burnable
              </span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm ${config.isPausable ? 'text-green-600' : 'text-gray-400'}`}>
                {config.isPausable ? '✓' : '✗'} Pausable
              </span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm ${config.isFreezable ? 'text-green-600' : 'text-gray-400'}`}>
                {config.isFreezable ? '✓' : '✗'} Freezable
              </span>
            </div>
          </div>
        </div>

        {/* Whitelist */}
        {config.whitelistAddresses && config.whitelistAddresses.length > 0 && (
          <div className="bg-white/5 border rounded-lg border-white/10 p-4">
            <h4 className="text-sm font-semibold text-white mb-3">
              Whitelist ({config.whitelistAddresses.length} addresses)
            </h4>
            <div className="max-h-32 overflow-y-auto">
              <ul className="space-y-1">
                {config.whitelistAddresses.slice(0, 5).map((address, index) => (
                  <li key={index} className="text-sm text-grey-text font-mono">
                    {address}
                  </li>
                ))}
                {config.whitelistAddresses.length > 5 && (
                  <li className="text-sm text-grey-text italic">
                    ...and {config.whitelistAddresses.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Deployment Notice */}
        <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-400">
                Ready to Deploy
              </h3>
              <div className="mt-1 text-sm text-yellow-600">
                <p>
                  Please ensure all information is correct. Smart contracts cannot be modified after deployment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}