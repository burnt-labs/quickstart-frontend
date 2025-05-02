import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateProvider } from "./state/AppStateProvider";
import Layout from "./components/Layout";
import Launcher from "./components/Launcher";

const queryClient = new QueryClient();

const treasuryConfig = {
  treasury: import.meta.env.VITE_TREASURY_ADDRESS,
  restUrl: import.meta.env.VITE_REST_URL,
  rpcUrl: import.meta.env.VITE_RPC_URL,
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AbstraxionProvider config={treasuryConfig}>
        <AppStateProvider>
          <Layout>
            <Launcher />
          </Layout>
        </AppStateProvider>
      </AbstraxionProvider>
    </QueryClientProvider>
  );
}
