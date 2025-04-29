import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { alchemy, sepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";
import { Connection } from "@solana/web3.js";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google", mode: "popup" },
        { type: "social", authProviderId: "facebook", mode: "popup" },
      ],
      [
        {
          type: "external_wallets",
          walletConnect: { projectId: "your-project-id" },
        },
      ],
    ],
    addPasskeyOnSignup: false,
  },
};

console.log(process.env.NEXT_PUBLIC_SOLANA_CONNECTION_URL);
console.log(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
console.log(process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID);
export const config = createConfig(
  {
    transport: alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "",
    }), // TODO: add your Alchemy API key - https://dashboard.alchemy.com/accounts
    chain: sepolia,
    ssr: true, // more about ssr: https://accountkit.alchemy.com/react/ssr
    storage: cookieStorage, // more about persisting state with cookies: https://accountkit.alchemy.com/react/ssr#persisting-the-account-state
    enablePopupOauth: true, // must be set to "true" if you plan on using popup rather than redirect in the social login flow
    policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID ?? "",
    solana: {
      connection: new Connection(
        process.env.NEXT_PUBLIC_SOLANA_CONNECTION_URL ?? "",
        {
          wsEndpoint: "wss://api.devnet.solana.com",
          commitment: "confirmed",
        }
      ),
      // Optional - gas sponsorship policy ID
      policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID ?? "",
    },
  },
  uiConfig
);

export const queryClient = new QueryClient();
