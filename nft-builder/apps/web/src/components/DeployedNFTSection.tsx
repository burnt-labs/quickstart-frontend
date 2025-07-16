import type { DeployedNFT } from "../config/nftTypes";
import type { FrontendTemplate } from "../config/constants";
import { CodeDisplay } from "./ui/CodeDisplay";

interface DeployedNFTSectionProps {
  deployedNFT: DeployedNFT;
  frontendTemplate: FrontendTemplate;
}

export function DeployedNFTSection({ deployedNFT, frontendTemplate }: DeployedNFTSectionProps) {
  const explorerUrl = `https://explorer.testnet.xion.burnt.com/xion-testnet-2/tx/${deployedNFT.transactionHash}`;
  const contractUrl = `https://explorer.testnet.xion.burnt.com/xion-testnet-2/contracts/${deployedNFT.contractAddress}`;
  
  const integrationCode = `// Integration code for ${frontendTemplate}\n// Contract: ${deployedNFT.contractAddress}`;
  
  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-green-400"
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
          <div className="ml-4">
            <h3 className="text-lg font-medium text-green-900">
              NFT Contract Deployed Successfully!
            </h3>
            <p className="mt-2 text-sm text-green-700">
              Your {deployedNFT.name} ({deployedNFT.symbol}) NFT contract is now live on XION testnet.
            </p>
          </div>
        </div>
      </div>

      {/* Contract Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contract Details
        </h3>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-600">NFT Contract Address</dt>
            <dd className="mt-1">
              <a
                href={contractUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-primary-600 hover:text-primary-700 break-all"
              >
                {deployedNFT.contractAddress}
              </a>
            </dd>
          </div>
          
          {deployedNFT.minterAddress && (
            <div>
              <dt className="text-sm font-medium text-gray-600">Minter Contract Address</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900 break-all">
                {deployedNFT.minterAddress}
              </dd>
            </div>
          )}
          
          {deployedNFT.marketplaceAddress && (
            <div>
              <dt className="text-sm font-medium text-gray-600">Marketplace Contract Address</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900 break-all">
                {deployedNFT.marketplaceAddress}
              </dd>
            </div>
          )}
          
          <div>
            <dt className="text-sm font-medium text-gray-600">Deployment Transaction</dt>
            <dd className="mt-1">
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View on Explorer →
              </a>
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600">Deployed At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {deployedNFT.deploymentTime.toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            Mint NFT
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            View Collection
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Manage Contract
          </button>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Environment Variables
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Add these to your .env file:
        </p>
        <CodeDisplay
          code={`VITE_NFT_CONTRACT_ADDRESS=${deployedNFT.contractAddress}
${deployedNFT.minterAddress ? `VITE_NFT_MINTER_ADDRESS=${deployedNFT.minterAddress}` : ''}
${deployedNFT.marketplaceAddress ? `VITE_NFT_MARKETPLACE_ADDRESS=${deployedNFT.marketplaceAddress}` : ''}
VITE_RPC_URL=${import.meta.env.VITE_RPC_URL}
VITE_REST_URL=${import.meta.env.VITE_REST_URL}`}
          language="bash"
        />
      </div>

      {/* Integration Code */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Integration Code
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Use this code to integrate your NFT contract:
        </p>
        <CodeDisplay
          code={integrationCode}
          language={frontendTemplate === "vanilla" ? "javascript" : "typescript"}
        />
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-medium text-blue-900 mb-3">
          Next Steps
        </h3>
        <ol className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <span className="font-medium mr-2">1.</span>
            <span>Upload your NFT metadata and images to IPFS</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">2.</span>
            <span>Set the base URI in your contract to point to your metadata</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">3.</span>
            <span>Test minting on testnet before deploying to mainnet</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">4.</span>
            <span>Integrate the contract into your dApp using the provided code</span>
          </li>
        </ol>
      </div>
    </div>
  );
}