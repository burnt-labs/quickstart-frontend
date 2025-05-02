import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { BaseButton } from "./ui/BaseButton";
import { SectionTitle, MutedText } from "./ui/Typography";

export default function Launcher() {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  return (
    <article className="w-full mx-auto ">
      <header className="mb-4">
        <h1>User Map Launcher</h1>
        <SectionTitle>Welcome {client ? "back" : "to Xion"}</SectionTitle>
        <MutedText>{client && account && `${account.bech32Address}`}</MutedText>
      </header>
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8">
        <BaseButton className="w-full">Start</BaseButton>
      </section>
    </article>
  );
}
