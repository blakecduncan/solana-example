import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, RotateCcw, SendHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSolanaTransaction } from "@account-kit/react";

function SendTxnComponent() {
  const {
    sendTransaction,
    isPending,
    signer,
    reset,
    data: { hash: txHash = null } = {},
    error,
  } = useSolanaTransaction();

  if (!signer) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading signer...</span>
      </div>
    );
  }

  const handleSendTransaction = () => {
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
    });
  };
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-3 rounded-md">
        <div className="text-sm text-muted-foreground mb-1">
          Your Solana Address
        </div>
        <Badge variant="outline" className="font-mono text-xs break-all">
          {signer.address}
        </Badge>
      </div>

      {!txHash ? (
        <Button
          onClick={handleSendTransaction}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <SendHorizontal className="mr-2 h-4 w-4" />
              Send 0.05 SOL
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-3">
          <Alert>
            <AlertDescription className="text-sm">
              Transaction sent successfully!
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => reset()}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              variant="default"
              className="flex-1"
              onClick={() =>
                window.open(
                  `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
                  "_blank"
                )
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Transaction
            </Button>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">
            Error: {error.message || "Failed to send transaction"}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default SendTxnComponent;
