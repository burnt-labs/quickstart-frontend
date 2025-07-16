interface SuccessMessageProps {
  transactionHash: string;
}

export function SuccessMessage({ transactionHash }: SuccessMessageProps) {
  const explorerUrl = `https://explorer.testnet.xion.burnt.com/xion-testnet-2/tx/${transactionHash}`;
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-green-400"
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
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Transaction Successful!
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>Your NFT contract has been deployed successfully.</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-green-600"
            >
              View on Explorer →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}