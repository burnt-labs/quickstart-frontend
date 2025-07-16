import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import {
  Abstraxion,
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [, setShowModal] = useModal();
  const { client } = useAbstraxionSigningClient();
  console.log("🚀 ~ Layout ~ client:", client)

  return (
    <div className="min-h-screen flex flex-col">
      <Abstraxion onClose={() => setShowModal(false)} />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}