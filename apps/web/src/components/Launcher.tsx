import { useEffect, useState } from "react";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { BaseButton } from "./ui/BaseButton";
import { MutedText, ArticleTitle } from "./ui/Typography";
import { useLaunchTransaction } from "../hooks/useLaunchTransaction";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";
import { useStoredContractAddresses } from "../hooks/useStoredContractAddresses";
import { ContractAddresses } from "../utils/localStorageClient";
import { DownloadButton } from "./DownloadButton";
import { INSTANTIATE_SALT } from "../config/constants";
function getTextboxValue(addresses: ContractAddresses) {
  return `NEXT_PUBLIC_CONTRACT_ADDRESS="${addresses.userMapAddress}"
NEXT_PUBLIC_TREASURY_ADDRESS="${addresses.treasuryAddress}"
NEXT_PUBLIC_RPC_URL="https://rpc.xion-testnet-2.burnt.com:443"
NEXT_PUBLIC_REST_URL="https://api.xion-testnet-2.burnt.com"`;
}

export default function Launcher() {
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [textboxValue, setTextboxValue] = useState(
    "Once you've launched your contract, copy and paste the following into your .env file"
  );
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  // Grabs the stored contract addresses from local storage
  // this is used as the flag to check if the contract has been launched
  const { addresses, saveAddresses } = useStoredContractAddresses(
    account?.bech32Address
  );

  useEffect(() => {
    if (addresses) {
      setTextboxValue(getTextboxValue(addresses));
    }
  }, [addresses]);

  const {
    mutateAsync: launchTransaction,
    isPending,
    isSuccess,
  } = useLaunchTransaction({
    onSuccess: (data) => {
      const newAddresses = {
        userMapAddress: data.userMapAddress,
        treasuryAddress: data.treasuryAddress,
      };
      saveAddresses(newAddresses);
      setTextboxValue(getTextboxValue(newAddresses));
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
        saltString: INSTANTIATE_SALT,
        client,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto">
      <article className="w-full mx-auto ">
        <header className="mb-4">
          <ArticleTitle>User Map Launcher</ArticleTitle>
          <MutedText>
            {client && account && `${account.bech32Address}`}
          </MutedText>
        </header>
        {!addresses && (
          <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
            <BaseButton
              className="w-full"
              onClick={handleLaunchClick}
              disabled={isPending}
            >
              {isPending ? "Launching..." : "Launch User Map & Fund Treasury"}
            </BaseButton>
          </section>
        )}
      </article>
      <article className="w-full mx-auto ">
        {isSuccess && <SuccessMessage transactionHash={transactionHash} />}
        {errorMessage && (
          <ErrorMessage
            errorMessage={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
      </article>
      <article className="w-full mx-auto ">
        <header className="mb-4">
          <ArticleTitle>Copy & Paste</ArticleTitle>
          <MutedText>
            Copy and paste the following into your .env file
          </MutedText>
        </header>
        <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8">
          <div className="flex flex-col gap-2">
            <textarea
              readOnly
              className="w-full p-4 bg-white/10 rounded-lg font-mono text-sm"
              rows={7}
              value={textboxValue}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(textboxValue);
                }}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
              >
                Copy
              </button>
              {addresses && (
                <DownloadButton
                  text={textboxValue}
                  fileName=".env"
                  label="Download"
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                />
              )}
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
