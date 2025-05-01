import { useAppState } from "../state/AppStateContext";
import { BaseButton } from "./ui/BaseButton";
import { SectionTitle } from "./ui/Typography";

export function NotLoggedIn() {
  const { setLoggedIn } = useAppState();
  return (
    <article className="max-w-screen-md mx-auto bg-white/5 rounded-lg p-8 flex flex-col">
      <header>
        <h1>Welcome to Xion</h1>
      </header>
      <section className="w-full flex flex-col gap-4">
        <SectionTitle>Login to get started</SectionTitle>
        <BaseButton className="w-full" onClick={() => setLoggedIn(true)}>
          Login
        </BaseButton>
      </section>
    </article>
  );
}
