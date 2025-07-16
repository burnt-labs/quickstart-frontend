import { NFT_TYPES, NFT_VARIANT_INFO, type NFTType } from "../config/constants";
import { Card, CardHeader, CardTitle } from './ui/Card';

interface NFTTypeSelectionProps {
  selectedType: NFTType;
  onTypeChange: (type: NFTType) => void;
}

export function NFTTypeSelection({ selectedType, onTypeChange }: NFTTypeSelectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select NFT Contract Variant</CardTitle>
        <p className="text-sm text-grey-text mt-2">
          Choose from XION's pre-audited CW721 contract variants. These contracts are ready to use without modifications.
        </p>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(NFT_VARIANT_INFO).map(([type, info]) => (
          <button
            key={type}
            onClick={() => onTypeChange(type as NFTType)}
            className={`
              relative p-4 rounded-lg border-2 text-left transition-all
              ${
                selectedType === type
                  ? "border-primary bg-[#2A2A2A]"
                  : "border-white/20 hover:border-white/40 bg-[#1D1D1D]/40"
              }
            `}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-base leading-6">
              {info.title}
            </h3>
              <a
                href={info.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 ml-2"
                onClick={(e) => e.stopPropagation()}
              >
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
            <p className="text-sm leading-5 text-grey-text mb-3">
              {info.description}
            </p>
            <div className="space-y-2">
              {/* Key features as badges */}
            <div className="flex flex-wrap gap-2">
              {info.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80"
                >
                  {feature}
                </span>
              ))}
            </div>
              
              {/* Visual indicators for key properties */}
              <div className="flex gap-3 text-xs text-grey-text">
                <span className="flex items-center gap-1">
                  {info.transferable ? (
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  Transferable
                </span>
                <span className="flex items-center gap-1">
                  {info.onChainMetadata ? (
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-grey-text" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  On-chain
                </span>
              </div>
            </div>
            {selectedType === type && (
              <div className="absolute top-2 right-2">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
}