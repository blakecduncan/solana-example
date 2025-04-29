"use client";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import SendTxnComponent from "./SendTxnComponent";
import BatchedTxnComponent from "./BatchedTxnComponent";
import SignMessageComponent from "./SignMessageComponent";
import DirectSignerComponent from "./DirectSignerComponent";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 gap-4 justify-center">
      <div className="w-full max-w-4xl">
        <Card className="border-none shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Account Kit Demo
            </CardTitle>
            <CardDescription>
              Interact with Solana blockchain using Account Kit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {signerStatus.isInitializing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Initializing...
                </p>
              </div>
            ) : user ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Logged in as
                    </p>
                    <p className="font-medium">
                      {user.email ?? "Anonymous User"}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => logout()}>
                    Log out
                  </Button>
                </div>

                <Tabs defaultValue="direct" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="direct">Direct Signer</TabsTrigger>
                    <TabsTrigger value="send">Send Transaction</TabsTrigger>
                    <TabsTrigger value="batched">Batched Txn</TabsTrigger>
                    <TabsTrigger value="sign">Sign Message</TabsTrigger>
                  </TabsList>
                  <TabsContent value="direct" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Direct Signer</CardTitle>
                        <CardDescription>
                          Use the signer directly to sign messages and
                          transactions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DirectSignerComponent />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="send" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Send Transaction</CardTitle>
                        <CardDescription>
                          Send a single transaction to the Solana network
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SendTxnComponent />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="batched" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Batched Transactions</CardTitle>
                        <CardDescription>
                          Send multiple transactions in a single batch
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <BatchedTxnComponent />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="sign" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sign Message</CardTitle>
                        <CardDescription>
                          Sign a message with your Solana wallet
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SignMessageComponent />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 gap-4">
                <p className="text-muted-foreground">
                  Connect your wallet to get started
                </p>
                <Button size="lg" onClick={openAuthModal}>
                  Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
