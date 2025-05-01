import Layout from "./components/Layout";
import Launcher from "./components/Launcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateProvider } from "./state/AppStateProvider";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <Layout>
          <Launcher />
        </Layout>
      </AppStateProvider>
    </QueryClientProvider>
  );
}
