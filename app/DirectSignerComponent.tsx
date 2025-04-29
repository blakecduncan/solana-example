import { useSigner } from "@account-kit/react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { SolanaSigner } from "@account-kit/signer";

export default function DirectSignerComponent() {
  const signer = useSigner();

  if (!signer) {
    return <div>Loading signer...</div>;
  }

  const signMessage = async (message: string) => {
    const solanaSigner = signer.toSolanaSigner();
    const signature = await solanaSigner.signMessage(
      new TextEncoder().encode("Message as a string or Uint8Array")
    );
    console.log(signature);
  };

  const sendTransaction = async () => {
    // After signing, use @solana/web3.js to send the transaction to the network.
    const connection = new Connection(process.env.SOLANA_CONNECTION_URL ?? "");
    async function signTransaction(
      signer: SolanaSigner,
      toAddress: string,
      value: number
    ) {
      const instructions = [
        SystemProgram.transfer({
          fromPubkey: new PublicKey(signer.address),
          toPubkey: new PublicKey(toAddress),
          lamports: value,
        }),
      ];

      // constructs a transaction with the provided instructions
      const transaction = await signer.createTransfer(instructions, connection);

      // addSignature signs the transaction with the Solana wallet
      await signer.addSignature(transaction);

      return transaction;
    }

    const signedTransaction = await signTransaction(
      signer.toSolanaSigner(),
      "51qQAbHVZfZF3XmMgbmwvXkMypCQqcnUodrKAoUmu2Tx",
      50000000 // 0.05 SOL
    );

    await connection.sendTransaction(signedTransaction);
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <button onClick={() => signMessage("Message as a string or Uint8Array")}>
        Sign Message
      </button>
      <button onClick={() => sendTransaction()}>Send Transaction</button>
    </div>
  );
}
