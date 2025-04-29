"use client"
import { useSolanaTransaction } from "@account-kit/react"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, RotateCcw, SendHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

function BatchedTxnComponent() {
  const {
    sendTransaction,
    isPending,
    signer,
    reset,
    error,
    data: { hash: txHash = null } = {},
  } = useSolanaTransaction({})

  if (!signer) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading signer...</span>
      </div>
    )
  }

  const handleSendBatchedTransaction = () => {
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

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-3 rounded-md">
        <div className="text-sm text-muted-foreground mb-1">Your Solana Address</div>
        <Badge variant="outline" className="font-mono text-xs break-all">
          {signer.address}
        </Badge>
      </div>

      <Card className="border border-dashed">
        <CardContent className="p-3 space-y-2">
          <div className="text-sm font-medium">Batch Details:</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Transfer 0.1 SOL to recipient</div>
            <div>• Transfer 0.05 SOL to recipient</div>
          </div>
        </CardContent>
      </Card>

      {!txHash ? (
        <Button onClick={handleSendBatchedTransaction} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Batch...
            </>
          ) : (
            <>
              <SendHorizontal className="mr-2 h-4 w-4" />
              Send Batched Transaction
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-3">
          <Alert>
            <AlertDescription className="text-sm">Batched transaction sent successfully!</AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={() => reset()}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              variant="default"
              className="flex-1"
              onClick={() => window.open(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`, "_blank")}
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
  )
}

export default BatchedTxnComponent
