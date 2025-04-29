"use client";

import { useSigner } from "@account-kit/react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  MessageSquare,
  SendHorizontal,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function DirectSignerComponent() {
  const signer = useSigner();
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [isSigningTx, setIsSigningTx] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
    txid?: string;
  } | null>(null);

  if (!signer) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading signer...</span>
      </div>
    );
  }

  const getSolanaSigner = () => {
    try {
      return signer.toSolanaSigner();
    } catch (error) {
      console.error("Signer not authenticated", error);
      return null;
    }
  };

  const solanaSigner = getSolanaSigner();

  if (!solanaSigner) {
    return (
      <div className="flex items-center justify-center py-4">
        <Alert variant="destructive">
          <AlertDescription>
            Signer not authenticated. Please connect your wallet.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const signMessage = async (message: string) => {
    setIsSigningMessage(true);
    setResult(null);
    try {
      const signature = await solanaSigner.signMessage(
        new TextEncoder().encode(message)
      );
      console.log(signature);
      setResult({
        type: "success",
        message: `Message signed successfully! Signature: ${signature
          .toString()
          .slice(0, 20)}...`,
      });
    } catch (error) {
      console.error(error);
      setResult({
        type: "error",
        message: `Error signing message: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      setIsSigningMessage(false);
    }
  };

  const sendTransaction = async () => {
    setIsSigningTx(true);
    setResult(null);
    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_CONNECTION_URL ?? ""
      );

      const instructions = [
        SystemProgram.transfer({
          fromPubkey: new PublicKey(solanaSigner.address),
          toPubkey: new PublicKey(
            "51qQAbHVZfZF3XmMgbmwvXkMypCQqcnUodrKAoUmu2Tx"
          ),
          lamports: 50000000, // 0.05 SOL
        }),
      ];

      // constructs a transaction with the provided instructions
      const transaction = await solanaSigner.createTransfer(
        instructions,
        connection
      );

      // addSignature signs the transaction with the Solana wallet
      await solanaSigner.addSignature(transaction);

      const txid = await connection.sendTransaction(transaction);
      setResult({
        type: "success",
        message: `Transaction sent successfully! TXID: ${txid}`,
        txid: txid,
      });
    } catch (error) {
      console.error(error);
      setResult({
        type: "error",
        message: `Error sending transaction: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      setIsSigningTx(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-3 rounded-md">
        <div className="text-sm text-muted-foreground mb-1">
          Your Solana Address
        </div>
        <Badge variant="outline" className="font-mono text-xs break-all">
          {solanaSigner.address}
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => signMessage("Message as a string or Uint8Array")}
          disabled={isSigningMessage}
          className="flex-1"
        >
          {isSigningMessage ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Sign Message
            </>
          )}
        </Button>

        <Button
          onClick={() => sendTransaction()}
          disabled={isSigningTx}
          className="flex-1"
        >
          {isSigningTx ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <SendHorizontal className="mr-2 h-4 w-4" />
              Send Transaction
            </>
          )}
        </Button>
      </div>

      {result && (
        <Alert variant={result.type === "success" ? "default" : "destructive"}>
          <AlertDescription className="text-sm break-all">
            {result.message}
          </AlertDescription>
        </Alert>
      )}

      {result && result.type === "success" && result.txid && (
        <Button
          variant="default"
          className="w-full mt-2"
          onClick={() =>
            window.open(
              `https://explorer.solana.com/tx/${result.txid}?cluster=devnet`,
              "_blank"
            )
          }
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Transaction
        </Button>
      )}
    </div>
  );
}
