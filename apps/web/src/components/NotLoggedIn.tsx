import { useModal } from "@burnt-labs/abstraxion";
import { BaseButton } from "./ui/BaseButton";
import { SubsectionTitle } from "./ui/Typography";

export function NotLoggedIn() {
  const [, setShowModal] = useModal();

  const handleLoginClick = () => {
    setShowModal(true);
  };

  return (
    <article className="w-full mx-auto flex flex-col max-w-screen-md">
      <header className="mb-4">
        <h1>Welcome to XION Dev Quick Start</h1>
        <SubsectionTitle>Login to get started</SubsectionTitle>
      </header>
      <section className="w-full bg-white/5 rounded-lg p-8">
        <BaseButton className="w-full" onClick={handleLoginClick}>
          Login
        </BaseButton>
      </section>
    </article>
  );
}
