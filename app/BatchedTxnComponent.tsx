import React from "react";
import { useSolanaTransaction } from "@account-kit/react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

function BatchedTxnComponent() {
  const {
    sendTransaction,
    isPending,
    signer,
    reset,
    data: { hash: txHash = null } = {},
  } = useSolanaTransaction({});

  if (!signer) {
    return <div>Loading alchemy signer...</div>;
  }

  return (
    <div>
      Solana Address {signer.address}
      <button
        onClick={() =>
          sendTransaction({
            instructions: [
              SystemProgram.transfer({
                fromPubkey: new PublicKey(signer.address),
                toPubkey: new PublicKey("51qQAbHVZfZF3XmMgbmwvXkMypCQqcnUodrKAoUmu2Tx"),
                lamports: 100000000, // 0.1 SOL
              }),
              SystemProgram.transfer({
                fromPubkey: new PublicKey(signer.address),
                toPubkey: new PublicKey("51qQAbHVZfZF3XmMgbmwvXkMypCQqcnUodrKAoUmu2Tx"),
                lamports: 50000000, // 0.05 SOL
              }),
            ],
          })
        }
      >
        Go make Transfer
      </button>
      {!!txHash && <button onClick={() => reset()}> Reset </button>}
      {!!txHash && (
        <a
          href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
          target="_blank"
        >
          Go To Tracker
        </a>
      )}
    </div>
  );
}

export default BatchedTxnComponent;
