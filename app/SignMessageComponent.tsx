import { useSolanaSignMessage } from "@account-kit/react";
import { Loader2, MessageSquare, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function SignMessageComponent() {
  const {
    signer,
    signMessage,
    data: signedMessage,
    isPending,
    error,
    reset,
  } = useSolanaSignMessage({});
  const [message, setMessage] = useState("Here is my message");

  if (!signer) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading signer...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!signedMessage ? (
        <>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message to sign
            </label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message to sign"
            />
          </div>

          <Button
            onClick={() => signMessage({ message })}
            disabled={isPending || !message.trim()}
            className="w-full"
          >
            {isPending ? (
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
        </>
      ) : (
        <div className="space-y-3">
          <Alert>
            <AlertDescription className="text-sm">
              Message signed successfully!
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Signature</div>
            <div className="font-mono text-xs break-all overflow-x-auto">
              {signedMessage}
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => reset()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">
            Error: {error.message || "Failed to sign message"}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default SignMessageComponent;
