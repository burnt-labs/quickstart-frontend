import {
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";
import xionLogo from "../assets/image.png";
import { BaseButton } from "./ui/BaseButton";

export default function Header() {
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
    <header className="flex justify-between items-center w-full border-b border-white/20 py-5 mb-4">
      <div className="flex-1 container mx-auto px-4 flex items-center justify-between">
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
      </div>
    </header>
  );
}