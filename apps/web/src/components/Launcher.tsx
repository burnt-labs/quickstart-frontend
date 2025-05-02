import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { instantiateTest } from "../lib/transactions";
import { instantiateUserMap } from "../lib/instantiate";
import { BaseButton } from "./ui/BaseButton";
import { SectionTitle, MutedText } from "./ui/Typography";

export default function Launcher() {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  const handleInstantiate = async () => {
    if (!client || !account) return;
    await instantiateTest(client, account?.bech32Address);
  };

  const handleSingleInstantiate = async () => {
    if (!client || !account) return;
    await instantiateUserMap(client, account?.bech32Address);
  };

  return (
    <article className="w-full mx-auto ">
      <header className="mb-4">
        <h1>User Map Launcher</h1>
        <SectionTitle>Welcome {client ? "back" : "to Xion"}</SectionTitle>
        <MutedText>{client && account && `${account.bech32Address}`}</MutedText>
      </header>
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8">
        <BaseButton className="w-full" onClick={handleInstantiate}>
          Start
        </BaseButton>

        <BaseButton className="w-full" onClick={handleSingleInstantiate}>
          Manually Instantiate UserMap
        </BaseButton>
      </section>
    </article>
  );
}
