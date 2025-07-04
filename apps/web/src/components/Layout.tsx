import {
  Abstraxion,
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";
import xionLogo from "../assets/logo.png";
import { BaseButton } from "./ui/BaseButton";
import { NotLoggedIn } from "./NotLoggedIn";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { client, logout } = useAbstraxionSigningClient();
  const [, setShowModal] = useModal();

  const handleLoginClick = () => {
    if (client) {
      logout?.();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <Abstraxion onClose={() => setShowModal(false)} />
      {client ? (
        <>
          <header className="flex justify-between items-center w-full border-b border-white/20 py-5 px-8 sm:px-24 mb-4">
            <img
              className="object-contain h-8"
              src={xionLogo}
              alt="Xion Logo"
            />
            <nav>
              <BaseButton
                className="hover:cursor-pointer"
                onClick={handleLoginClick}
              >
                {client ? "Logout" : "Login"}
              </BaseButton>
            </nav>
          </header>
          <main className="flex justify-between items-center w-full py-5 px-8 sm:px-24 mb-4">
            {children}
          </main>
        </>
      ) : (
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 flex flex-col items-center justify-center">
            <NotLoggedIn />
          </main>
          <footer className="flex h-[100px] p-8">
            <Footer />
          </footer>
        </div>
      )}
    </>
  );
}
