import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";

export async function generateRequestFaucetTokensMessage(
  senderAddress: string,
  treasuryAddress: string,
  faucetAddress: string
) {
  const requestMsg = {
    faucet_to: { receiver_address: treasuryAddress },
  };

  const msgRequestMsg = MsgExecuteContract.fromPartial({
    sender: senderAddress,
    contract: faucetAddress,
    msg: toUtf8(JSON.stringify(requestMsg)),
    funds: [],
  });

  const wrappedMsg: EncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: msgRequestMsg,
  };

  return wrappedMsg;
}
