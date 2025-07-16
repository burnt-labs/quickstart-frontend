import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";
import xionLogo from "../assets/image.png";
import { BaseButton } from "./ui/BaseButton";

export default function Header() {
  const { data: account } = useAbstraxionAccount();
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
  );
}