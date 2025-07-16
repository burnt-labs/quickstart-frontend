import { NFT_VARIANT_INFO, type NFTType } from "../config/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';

interface ContractVariantInfoProps {
  selectedType: NFTType;
}

export function ContractVariantInfo({ selectedType }: ContractVariantInfoProps) {
  const variantInfo = NFT_VARIANT_INFO[selectedType];
  
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">Selected: {variantInfo.title}</CardTitle>
        <CardDescription>{variantInfo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Key Properties</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-grey-text">Transferable:</span>
                <span className={variantInfo.transferable ? "text-primary" : "text-red-500"}>
                  {variantInfo.transferable ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-grey-text">On-chain Metadata:</span>
                <span className={variantInfo.onChainMetadata ? "text-primary" : "text-grey-text"}>
                  {variantInfo.onChainMetadata ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-grey-text">Updatable:</span>
                <span className={variantInfo.updatableMetadata ? "text-primary" : "text-grey-text"}>
                  {variantInfo.updatableMetadata ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Use Cases</h4>
            <p className="text-sm text-grey-text">
              {getUseCases(selectedType)}
            </p>
          </div>
          
          <div>
            <a
              href={variantInfo.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
            >
              View Contract Source
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getUseCases(type: NFTType): string {
  const useCases: Record<NFTType, string> = {
    "cw721-base": "Basic NFT collections, digital art, profile pictures",
    "cw721-updatable": "Dynamic NFTs, evolving game characters, upgradeable avatars",
    "cw721-metadata-onchain": "Fully on-chain generative art, immutable collectibles",
    "cw721-soulbound": "Identity badges, certificates, proof-of-participation",
    "cw721-expiration": "Subscription NFTs, time-limited memberships, event passes",
    "cw721-fixed-price": "Simple marketplaces, direct-to-consumer NFT sales",
    "cw721-non-transferable": "Achievements, diplomas, permanent credentials",
    "cw2981-royalties": "Artist collections, creator-focused NFTs with automatic royalties",
  };
  
  return useCases[type] || "General NFT collections";
}