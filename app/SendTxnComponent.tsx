import { useSolanaTransaction } from "@account-kit/react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

function SendTxnComponent() {
  const {
    sendTransaction,
    isPending,
    signer,
    reset,
    data: { hash: txHash = null } = {},
  } = useSolanaTransaction();

  if (!signer) {
    return <div>Loading alchemy signer...</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      Solana Address {signer.address}
      <button
        onClick={() =>
          // sendTransaction({
          //   transfer: {
          //     amount: 1000000,
          //     toAddress: "51qQAbHVZfZF3XmMgbmwvXkMypCQqcnUodrKAoUmu2Tx",
          //   },
          // })
          sendTransaction({
            instructions: [
              SystemProgram.transfer({
                fromPubkey: new PublicKey(signer.address),
                toPubkey: new PublicKey(
                  "51qQAbHVZfZF3XmMgbmwvXkMypCQqcnUodrKAoUmu2Tx"
                ),
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
          View transaction
        </a>
      )}
    </div>
  );
}

export default SendTxnComponent;
