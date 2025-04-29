import { useSolanaSignMessage } from '@account-kit/react'
import { SolanaSigner } from "@account-kit/signer";
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';

function SignMessageComponent() {
  const {
    signer,
    data,
    signMessage,
    data: signedMessage,
    reset,
  } = useSolanaSignMessage({
  });
	
  if (!signer) {
    return <div>Loading signer...</div>;
  }
  
  return <div>
    <button onClick={() => signMessage({ message: "Here is my message" })}> Sign </button>
    Message Signed: {signedMessage}
  </div>
}

export default SignMessageComponent;