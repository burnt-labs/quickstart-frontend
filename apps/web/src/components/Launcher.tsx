import { useState } from "react";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { BaseButton } from "./ui/BaseButton";
import { MutedText, ArticleTitle } from "./ui/Typography";
import { useLaunchTransaction } from "../hooks/useLaunchTransaction";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";
export default function Launcher() {
  const [userMapAddress, setUserMapAddress] = useState("");
  const [treasuryAddress, setTreasuryAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [textboxValue, setTextboxValue] = useState(
    "Once you've launched your contract, copy and paste the following into your .env file"
  );
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const instantiateSalt = "salt5";

  const {
    mutateAsync: launchTransaction,
    isPending,
    isSuccess,
  } = useLaunchTransaction({
    onSuccess: (data) => {
      setUserMapAddress(data.userMapAddress);
      setTreasuryAddress(data.treasuryAddress);
      setTextboxValue(
        `NEXT_PUBLIC_CONTRACT_ADDRESS="${userMapAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${treasuryAddress}"
NEXT_PUBLIC_RPC_URL="https://rpc.xion-testnet-2.burnt.com:443"
NEXT_PUBLIC_REST_URL="https://api.xion-testnet-2.burnt.com"`
      );
      setTransactionHash(data.tx.transactionHash);
      console.log("Transaction result:", data.tx);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error("Transaction failed:", error);
    },
  });

  const handleLaunchClick = async () => {
    if (!client || !account) return;

    try {
      await launchTransaction({
        senderAddress: account.bech32Address,
        saltString: instantiateSalt,
        client,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <article className="w-full mx-auto ">
      <header className="mb-4">
        <h1>User Map Launcher</h1>
        <ArticleTitle>Welcome {client ? "back" : "to Xion"}</ArticleTitle>
        <MutedText>{client && account && `${account.bech32Address}`}</MutedText>
      </header>
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
        <BaseButton
          className="w-full"
          onClick={handleLaunchClick}
          disabled={isPending}
        >
          {isPending ? "Launching..." : "Single Click Launcher"}
        </BaseButton>
      </section>
      {isSuccess && <SuccessMessage transactionHash={transactionHash} />}
      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
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
            value={textboxValue}
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
