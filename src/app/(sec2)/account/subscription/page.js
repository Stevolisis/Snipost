"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, Gift, Wallet, Star, Copy, Loader, LogOut } from 'lucide-react';
import { connectWalletStart, disconnectWallet, updateUserData } from '@/lib/redux/slices/auth';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import api from '@/utils/axiosConfig';
import { SubscriptionPlans } from '@/constants/SubscriptionPlans';

const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('PRO');
  const [solAmount, setSolAmount] = useState('');
  const [loadingSolPrice, setLoadingSolPrice] = useState(false);
  const [user, setUser] = useState(null);
  const { jwtToken } = useAppSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [walletAddress, setWalletAddress] = useState('');
  const getDiscountedPrice = (price) => billingCycle === 'annual' ? price * 0.1 : price;
  const { connect, signTransaction, sendTransaction, connected, wallet, publicKey, disconnect } = useWallet();
  const { setVisible, visible } = useWalletModal();
  const { connection } = useConnection();
  const dispatch = useAppDispatch();


  const getFinalPrice = () => {
    const basePrice = SubscriptionPlans[selectedPlan].price;
    if (billingCycle === 'annual') {
      return basePrice * 12 * 0.9; // 10% off yearly
    }
    return basePrice;
  };

  const convertToSOL = async (usdPrice) => {
    try {
      setLoadingSolPrice(true);
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const data = await res.json();
      const solPrice = data.solana.usd;
      const sol = (usdPrice / solPrice).toFixed(4);
      setSolAmount(sol);
    } catch (err) {
      toast.error("Error fetching SOL price: " + err.message);
    } finally {
      setLoadingSolPrice(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/me", {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      setUser(res.data.user);
      setSelectedPlan(res.data.user?.subscription?.plan || 'FREE')
      dispatch(updateUserData({
        ...res.data.user, 
        bookmarks:[], 
        transactions:[],
        createdAt: null,
        isUsernameChangeExceeded: null,
        userNameChangeCount: null,
        notifications: null,
        verification_code: null,
        settings: null
      }))
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    convertToSOL(getFinalPrice());
  }, [selectedPlan, billingCycle]);




  const handleSubscribe = async () => {
    try {
      if (!publicKey || !signTransaction) return toast.error("Connect your wallet first");

      const receiver = new PublicKey(process.env.NEXT_PUBLIC_SNIPOST_WALLET_ADDRESS);
      const amountLamports = Math.floor(Number(solAmount) * 1e9);

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();

      // Create transaction with two transfers
      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash
      }).add(
        // Transfer to recipient (88%)
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiver,
          lamports: amountLamports,
        })
      );
      
      // Sign and send transaction
      const signature = await sendTransaction(transaction, connection);
        
      toast.promise(
        (async () => {
          try {
            // Wait for confirmation
            const confirmation = await connection.confirmTransaction({
              signature,
              blockhash,
              lastValidBlockHeight: (await connection.getBlockHeight()) + 150
            }, "confirmed");

            if (confirmation.value.err) {
              throw new Error("Transaction failed");
            }

            // Record transaction And Subscribe (update this to include platform fee)            
            await api.post('/subscribe-to-plan', { 
              plan: selectedPlan,
              billingCycle: selectedPlan !== "FREE" ? billingCycle : undefined
            }, {
              headers: { Authorization: `Bearer ${jwtToken}` }
            });

            await api.post('/record-subscription-transaction', {
              signature: signature,
              amount: Number(solAmount),
              transactionType: 'subscription',
              fee: 0.00005,
              sender: publicKey.toBase58(),
              receiver: receiver.toBase58(),
              receiverId: "PLATFORM",
              receiverType: "System",
              description: `${selectedPlan} plan upgrade`,
              snippetId: null,
              snippetTitle: null
            }, {
              headers: { Authorization: `Bearer ${jwtToken}` }
            });
            
            await fetchUser();

            return (
              <div className="flex flex-col gap-2">
                <p>Tip sent successfully!</p>
                <p className="text-sm text-gray-500">
                  {amountLamports / 10**9} SOL fee collected by Snipost
                </p>
                <a 
                  href={`https://explorer.solana.com/tx/${signature}?cluster=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View transaction on Explorer
                </a>
              </div>
            );
          } catch (error) {
            console.error("Confirmation error:", error);
            throw new Error("Transaction confirmation failed");
          }
        })(),
        {
          loading: "Processing transaction...",
          success: (data) => data,
          error: (err) => err?.response?.data?.message || "Transaction failed",
          duration: 8000
        }
      );


      toast.success("Payment successful and subscription upgraded!");
    } catch (error) {
      toast.error("Transaction failed: " + error.message);
    }
  };





  const handleWalletClick = useCallback(async () => {
    try {
      dispatch(connectWalletStart());
      setVisible(true);
    } catch (err) {
      toast.error(`Connection failed: ${err.message}`);
      console.log("disconnecting due to error: ", err.message);
      dispatch(disconnectWallet());
      await disconnect();
    }
  }, [setVisible, dispatch, disconnect])



  const connectToSelectedWallet = useCallback(async() => {
    if (!wallet) return

    try{
      await connect();
      await fetchUser();
    }catch(err){
      dispatch(disconnectWallet());
      console.log("disconnecting due to error3: ", err.message);
      await disconnect();
    }
  },[wallet, connect, disconnect])

  useEffect(() => {
    if (wallet && !connected) {
      connectToSelectedWallet();
    }
  }, [wallet, connected, connectToSelectedWallet]);







  return (
    <div className="min-h-screen bg-background p-6 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Fast-track your growth</h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Work smarter, learn faster, and stay ahead with AI tools, custom feeds, and pro features. 
            Because copy-pasting code isn't a long-term strategy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Plans */}
          <div className="space-y-6">
            {/* Billing Cycle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm md:text-lg font-semibold">Billing cycle</h3>
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Buy as a gift</span>
                </div>
              </div>
              
              <Tabs value={billingCycle} onValueChange={(val) => setBillingCycle(val)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="annual" className="relative">
                    Annual
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">Save 10%</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Plan Cards */}
            <div className="space-y-4">
              {Object.entries(SubscriptionPlans).map(([key, plan]) => {
                const finalPrice = billingCycle === 'annual'
                ? plan.price * 12 * 0.9
                : plan.price;
                return(
                  <Card 
                    key={key} 
                    className={`cursor-pointer transition-all ${
                      selectedPlan === key 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    <CardHeader className="pb-0 md:pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPlan === key 
                              ? 'bg-primary border-primary' 
                              : 'border-muted-foreground'
                          }`}>
                            {selectedPlan === key && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                          </div>
                          <CardTitle className=" text-lg md:text-xl">{plan.name}</CardTitle>
                          {key === 'PRO' && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">{plan.price === 0 ? 'Free' : `$${finalPrice.toFixed(4)}`}</div>
                          {billingCycle === 'annual' && plan.price > 0 && (
                            <div className="text-xs text-muted-foreground line-through">${(plan.price * 12).toFixed(4)}</div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-600" />
                            <span>{plan.codeBlocks} code blocks/post</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-600" />
                            <span>{plan.maxCodeLines} max code lines/Code block</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-600" />
                            <span>{plan.privateSnippets} private snippets</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-600" />
                            <span>{plan.folders} folders</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-600" />
                            <span>{plan.artboards} artboards</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-600" />
                            <span>{plan.designElements} design elements</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-600" />
                            <span>Export: {plan.exportFormat.join(', ')}</span>
                          </div>
                          {plan.premiumTemplates && (
                            <div className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-600" />
                              <span>Premium templates</span>
                            </div>
                          )}
                          {plan.canPublish && (
                            <div className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-600" />
                              <span>Publish custom templates</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm font-medium ml-2">4.8/5</span>
              <span className="text-xs md:text-sm text-muted-foreground">based on 2,398+ Chrome Store reviews</span>
            </div>
          </div>

          {/* Right Side - Payment */}
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="wallet">Connect Wallet</TabsTrigger>
                    <TabsTrigger value="manual" disabled>Send to Address</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent className="space-y-4">
                {paymentMethod === 'wallet' && (
                  <div className="text-center space-y-6 p-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Wallet className="h-10 w-10 text-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg md:text-xl mb-2">Connect Your Wallet</h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-6">
                        Connect your Solana wallet to pay with SOL directly
                      </p>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center">
                      <div className="text-lg font-semibold text-primary mb-1">
                        {loadingSolPrice ? <Loader className='text-primary animate-spin' /> : `${solAmount} SOL`}
                      </div>
                      <div className="text-sm text-muted-foreground">≈ ${getFinalPrice().toFixed(4)} USD</div>
                    </div>

                    <div className="space-y-3">
                      { publicKey ? 
                        <div className='flex gap-x-2'>
                          <Button className="flex-1 h-10 md:h-12 text-xs md:text-base bg-purple-600 hover:bg-purple-700 text-white">
                            <Wallet className="h-5 w-5 mr-2" />
                            {publicKey?.toBase58().slice(0, 5)}...${publicKey?.toBase58().slice(-4)}
                          </Button>
                          <Button onClick={async()=> await disconnect()} className='w-12 h-10 md:h-12 bg-red-500 hover:bg-destructive text-white flex justify-center items-center'>
                            <LogOut className="h-7 w-7" /> 
                          </Button>
                        </div> : 
                        <Button onClick={()=>handleWalletClick()} className="w-full h-10 md:h-12 text-xs md:text-base bg-purple-600 hover:bg-purple-700 text-white">
                          <Wallet className="h-5 w-5 mr-2" />
                          Connect Wallet
                        </Button>
                      }
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Transaction will be processed instantly after wallet confirmation
                    </p>
                  </div>
                )}

                {paymentMethod === 'manual' && (
                  <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Wallet className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Manual SOL Transfer</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Send the exact amount to complete your subscription
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-background p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Amount to send:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(solAmount)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-2xl font-bold text-primary">{solAmount} SOL</div>
                        <div className="text-sm text-muted-foreground">
                          ≈ ${getDiscountedPrice(SubscriptionPlans[selectedPlan].price).toFixed(4)} USD
                        </div>
                      </div>

                      <div className="bg-background p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Send to wallet:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="font-mono text-sm break-all bg-muted p-2 rounded">
                          7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yourWallet">Your wallet address (for verification)</Label>
                        <Input
                          id="yourWallet"
                          placeholder="Enter your SOL wallet address"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <strong>Important:</strong> Send the exact amount from your wallet.
                      Your subscription will be activated automatically after 1 confirmation on the Solana network.
                    </div>
                  </div>
                )}
              </CardContent>

              {SubscriptionPlans[selectedPlan].price > 0 && selectedPlan !== user?.subscription?.plan && (
                <CardFooter className="flex-col space-y-4">
                  <Button
                    onClick={handleSubscribe}
                    className="w-full h-10 md:h-12 text-sm md:text-lg font-semibold"
                  >
                    Subscribe now
                  </Button>
                </CardFooter>
              )}

              {(SubscriptionPlans[selectedPlan].price > 0 && selectedPlan === user?.subscription?.plan) && (
                <CardFooter className="flex-col space-y-4">
                  <Button
                    disabled
                    className="w-full h-10 md:h-12 text-sm md:text-lg font-semibold opacity-70 cursor-not-allowed"
                  >
                    Current Plan
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;