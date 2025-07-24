import { useState, useEffect } from "react";
import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";

/**
 * Hook to discover the Abstraxion grantee address by sending a test transaction
 * and observing what address actually signs it.
 */
export function useGranteeAddress() {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const [granteeAddress, setGranteeAddress] = useState<string | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check localStorage for cached grantee address
  useEffect(() => {
    if (account?.bech32Address) {
      const cached = localStorage.getItem(`grantee_${account.bech32Address}`);
      if (cached) {
        setGranteeAddress(cached);
      }
    }
  }, [account?.bech32Address]);

  const discoverGranteeAddress = async () => {
    if (!client || !account) {
      setError("Wallet not connected");
      return;
    }

    setIsDiscovering(true);
    setError(null);

    try {
      // Send a minimal transaction (bank send to self with 0 amount)
      // This will fail but we can catch the error and extract the sender
      const result = await client.simulate(
        account.bech32Address,
        [
          {
            typeUrl: "/cosmos.bank.v1beta1.MsgSend",
            value: {
              fromAddress: account.bech32Address,
              toAddress: account.bech32Address,
              amount: [{ denom: "uxion", amount: "0" }],
            },
          },
        ],
        undefined
      );

      // If simulation succeeds, we might be able to extract info
      console.log("Simulation result:", result);
      
      // The actual implementation would need to parse the result
      // to find the actual signer address
      setError("Unable to extract grantee address from simulation");
    } catch (err: any) {
      console.error("Discovery error:", err);
      
      // Try to extract the signer address from the error message
      // Error messages often contain the actual signer address
      const errorMsg = err.toString();
      const match = errorMsg.match(/xion1[a-z0-9]{38,}/);
      
      if (match && match[0] !== account.bech32Address) {
        const discoveredAddress = match[0];
        setGranteeAddress(discoveredAddress);
        
        // Cache it for future use
        localStorage.setItem(`grantee_${account.bech32Address}`, discoveredAddress);
        
        console.log("Discovered grantee address:", discoveredAddress);
      } else {
        setError("Could not extract grantee address from transaction");
      }
    } finally {
      setIsDiscovering(false);
    }
  };

  return {
    granteeAddress,
    isDiscovering,
    error,
    discoverGranteeAddress,
    // Allow manual override
    setGranteeAddress: (address: string) => {
      setGranteeAddress(address);
      if (account?.bech32Address) {
        localStorage.setItem(`grantee_${account.bech32Address}`, address);
      }
    },
  };
}