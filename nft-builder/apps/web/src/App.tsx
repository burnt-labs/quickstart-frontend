import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import { AppStateProvider } from "./state/AppStateProvider";
import Layout from "./components/Layout";
import AssetBuilderV2Container from "./components/AssetBuilderV2Container";
import { AssetMinter } from "./components/AssetMinter";

const queryClient = new QueryClient();

type View = "builder" | "minter";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("builder");

  return (
    <QueryClientProvider client={queryClient}>
      <AbstraxionProvider
        config={{
          treasury: import.meta.env.VITE_TREASURY_ADDRESS,
          restUrl: import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com",
          rpcUrl: import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443"
        }}
      >
        <AppStateProvider>
          <Layout>
            <div className="mb-6 flex gap-4">
              <button
                onClick={() => setCurrentView("builder")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "builder"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Deploy Contracts
              </button>
              <button
                onClick={() => setCurrentView("minter")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "minter"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Test Minting
              </button>
            </div>
            {currentView === "builder" ? (
              <AssetBuilderV2Container />
            ) : (
              <AssetMinter />
            )}
          </Layout>
        </AppStateProvider>
      </AbstraxionProvider>
    </QueryClientProvider>
  );
}