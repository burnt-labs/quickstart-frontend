import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import { AppStateProvider } from "./state/AppStateProvider";
import Layout from "./components/Layout";
import AssetBuilderV2Container from "./components/AssetBuilderV2Container";

const queryClient = new QueryClient();

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AbstraxionProvider
        config={{
          // Use the parent project's treasury which has instantiate2 permissions
          treasury: "xion1pjaelan8kfs42wpfestv0cmhy65fyudkfjg8yyld5mjwu0f2cwaqr4eu6e",
          // treasury: "xion1g5p0qwcfudynlyfw2y98v0mjq3g55sezx58stgsre9xamdvr72ts8407kw",
          restUrl: import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com",
          rpcUrl: import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443"
        }}
      >
        <AppStateProvider>
          <Layout>
            <AssetBuilderV2Container />
          </Layout>
        </AppStateProvider>
      </AbstraxionProvider>
    </QueryClientProvider>
  );
}