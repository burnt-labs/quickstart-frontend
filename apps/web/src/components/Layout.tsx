import xionLogo from "../assets/logo.png";
import { BaseButton } from "./ui/BaseButton";
import { useAppState } from "../state/AppStateContext";
import { NotLoggedIn } from "./NotLoggedIn";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loggedIn, setLoggedIn } = useAppState();

  const handleLoginClick = () => {
    setLoggedIn(!loggedIn);
  };

  return (
    <>
      <header className="flex justify-between items-center w-full border-b border-white/20 py-5 px-8 sm:px-24 mb-4">
        <img className="object-contain h-8" src={xionLogo} alt="Xion Logo" />
        <nav>
          <BaseButton
            className="hover:cursor-pointer"
            onClick={handleLoginClick}
          >
            {loggedIn ? "Logout" : "Login"}
          </BaseButton>
        </nav>
      </header>
      <main>{loggedIn ? children : <NotLoggedIn />}</main>
    </>
  );
}
