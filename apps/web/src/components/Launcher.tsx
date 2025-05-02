import { useEffect, useState } from "react";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { instantiateUserMap, predictUserMapAddress } from "../lib/userMap";
import { instantiateTreasury, predictTreasuryAddress } from "../lib/treasury";
import { requestFaucetTokens } from "../lib/faucet";
import { BaseButton } from "./ui/BaseButton";
import { MutedText, ArticleTitle } from "./ui/Typography";

export default function Launcher() {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const [userMapAddress, setUserMapAddress] = useState<string | null>(null);
  const [treasuryAddress, setTreasuryAddress] = useState<string | null>(null);
  const instantiateSalt = "salt5";

  useEffect(() => {
    if (client && account) {
      setUserMapAddress(
        predictUserMapAddress(account.bech32Address, instantiateSalt)
      );
    }
  }, [client, account]);

  useEffect(() => {
    if (userMapAddress && account) {
      setTreasuryAddress(
        predictTreasuryAddress(account.bech32Address, instantiateSalt)
      );
    }
  }, [userMapAddress, account]);

  const handleSingleInstantiate = async () => {
    if (!client || !account) return;
    await instantiateUserMap(
      client,
      account?.bech32Address,
      instantiateSalt,
      "batch"
    );
  };

  const handleInstantiateTreasury = async () => {
    if (!client || !account || !userMapAddress) return;
    await instantiateTreasury(
      client,
      account?.bech32Address,
      instantiateSalt,
      userMapAddress,
      "batch"
    );
  };

  const handleRequestFaucetTokens = async () => {
    if (!client || !account || !treasuryAddress) return;
    await requestFaucetTokens(client, {
      senderAddress: account.bech32Address,
      treasuryAddress,
      faucetAddress:
        "xion187wad6jfrjaxw0fq3gxa55lueutrnastn3z4paax9rw5694eya6sg08jmy",
    });
  };

  return (
    <article className="w-full mx-auto ">
      <header className="mb-4">
        <h1>User Map Launcher</h1>
        <ArticleTitle>Welcome {client ? "back" : "to Xion"}</ArticleTitle>
        <MutedText>{client && account && `${account.bech32Address}`}</MutedText>
      </header>
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
        <BaseButton disabled className="w-full" onClick={() => {}}>
          Single Click Launcher
        </BaseButton>

        <BaseButton className="w-full" onClick={handleSingleInstantiate}>
          Instantiate UserMap -{" "}
          <span className="text-xs break-all">{userMapAddress}</span>
        </BaseButton>

        <BaseButton className="w-full" onClick={handleInstantiateTreasury}>
          Instantiate Treasury -{" "}
          <span className="text-xs break-all">{treasuryAddress}</span>
        </BaseButton>

        <BaseButton className="w-full" onClick={handleRequestFaucetTokens}>
          Request Faucet Tokens to{" "}
          <span className="text-xs break-all">{treasuryAddress}</span>
        </BaseButton>
      </section>
      <header className="mb-4">
        <ArticleTitle>Copy & Paste</ArticleTitle>
        <MutedText>Copy and paste the following into your .env file</MutedText>
      </header>
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8">
        <div className="flex flex-col gap-2">
          <textarea
            readOnly
            className="w-full p-4 bg-white/10 rounded-lg font-mono text-sm"
            rows={7}
            value={`NEXT_PUBLIC_CONTRACT_ADDRESS="${userMapAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${treasuryAddress}"
NEXT_PUBLIC_RPC_URL="https://rpc.xion-testnet-2.burnt.com:443"
NEXT_PUBLIC_REST_URL="https://api.xion-testnet-2.burnt.com"`}
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                const text = `NEXT_PUBLIC_CONTRACT_ADDRESS="${userMapAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${treasuryAddress}"
NEXT_PUBLIC_RPC_URL="https://rpc.xion-testnet-2.burnt.com:443"
NEXT_PUBLIC_REST_URL="https://api.xion-testnet-2.burnt.com"`;
                navigator.clipboard.writeText(text);
              }}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </section>
    </article>
  );
}
