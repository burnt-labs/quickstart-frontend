import { useAppState } from "../state/AppStateContext";
import { BaseButton } from "./ui/BaseButton";
import { SectionTitle } from "./ui/Typography";

export default function Launcher() {
  const { loggedIn } = useAppState();
  return (
    <article className="max-w-screen-md mx-auto bg-white/5 rounded-lg p-8">
      <header>
        <h1>User Map Launcher</h1>
      </header>
      <section className="mb-4">
        <SectionTitle>Welcome {loggedIn ? "back" : "to Xion"}</SectionTitle>
      </section>
      <section className="flex flex-col gap-4">
        <h2>Launch it:</h2>
        <BaseButton className="w-full">Start</BaseButton>
      </section>
    </article>
  );
}
