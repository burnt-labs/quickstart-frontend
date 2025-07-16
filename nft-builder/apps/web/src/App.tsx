import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import { AppStateProvider } from "./state/AppStateProvider";
import Layout from "./components/Layout";
import NFTBuilder from "./components/NFTBuilder";
import NFTBuilderV2Container from "./components/NFTBuilderV2Container";

const queryClient = new QueryClient();

export default function App() {
  const [version, setVersion] = useState<'v1' | 'v2'>('v2'); // Default to v2

  return (
    <QueryClientProvider client={queryClient}>
      <AbstraxionProvider
        config={{
          treasury: import.meta.env.VITE_TREASURY_ADDRESS || "", // Re-enabled - update .env.local with your treasury
          restUrl: import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com",
          rpcUrl: import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443"
        }}
      >
        <AppStateProvider>
          <Layout>
            {/* Version Toggle */}
            <div className="mb-6 flex justify-end">
              <div className="inline-flex items-center gap-2 bg-[#1D1D1D]/80 rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setVersion('v1')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    version === 'v1' 
                      ? 'bg-white text-black' 
                      : 'text-grey-text hover:text-white'
                  }`}
                >
                  V1 (Wizard)
                </button>
                <button
                  onClick={() => setVersion('v2')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    version === 'v2' 
                      ? 'bg-white text-black' 
                      : 'text-grey-text hover:text-white'
                  }`}
                >
                  V2 (Cards)
                </button>
              </div>
            </div>
            
            {/* Render selected version */}
            {version === 'v1' ? <NFTBuilder /> : <NFTBuilderV2Container />}
          </Layout>
        </AppStateProvider>
      </AbstraxionProvider>
    </QueryClientProvider>
  );
}