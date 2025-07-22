export function NotLoggedIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 mb-6">
          Please connect your wallet to start building and deploying asset contracts on XION.
        </p>
        <p className="text-sm text-gray-500">
          Use the connect button in the header to get started.
        </p>
      </div>
    </div>
  );
}