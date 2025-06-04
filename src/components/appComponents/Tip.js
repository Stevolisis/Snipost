"use client"
import { BadgeDollarSign, CircleDollarSign, Copy, CupSoda } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { useState } from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import api from "@/utils/axiosConfig"

export function Tip({ walletAddress, snippetId, snippetTitle, receiverId, receiverType }) {
  const { connection } = useConnection()
  const { connected ,publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState(0.1) // Default tip amount
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { jwtToken } = useAppSelector((state) => state.auth)
  
  const recordTransaction = async (signature, amount) => {
    try {
      if (!jwtToken) {
        throw new Error("Please login to record transaction")
      }

      await api.post('/record-transaction', {
        signature,
        amount,
        transactionType: "reward",
        fee: 0.000005,
        sender: publicKey?.toString(),
        receiver: walletAddress,
        description: "Content creator tip",
        snippetId,
        snippetTitle,
        receiverId,
        receiverType
      }, {
        headers: { 
          Authorization: `Bearer ${jwtToken}` 
        }
      })
      toast.success("Transaction recorded successfully");
    } catch (error) {
      console.error("Transaction recording failed:", error)
      toast.error("Failed to record transaction. Check console for details.")
      throw error
    }
  }

const handleTip = async () => {
  if (!connected || !publicKey) {
    toast.error("Please connect your wallet first");
    return;
  }

  if (!walletAddress) {
    toast.error("Recipient wallet address not found");
    return;
  }

  if (amount < 0.001) {
    toast.error("Minimum tip amount is 0.001 SOL");
    return;
  }

  try {
    setIsLoading(true);
    
    const recipientAddress = new PublicKey(walletAddress);
    const platformAddress = new PublicKey(process.env.NEXT_PUBLIC_SNIPOST_WALLET_ADDRESS);
    
    const totalLamports = amount * 10**9;
    const platformFee = Math.floor(totalLamports * 0.12); // 12%
    const recipientAmount = totalLamports - platformFee;

    if(publicKey.toString() == recipientAddress.toString()) {
      return toast.error("You are not allowed to tip yourself");
    }
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
        toPubkey: recipientAddress,
        lamports: recipientAmount,
      }),
      // Transfer to platform (12%)
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: platformAddress,
        lamports: platformFee,
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

          // Record transaction (update this to include platform fee)
          await recordTransaction(signature, amount, platformFee / 10**9);
          
          return (
            <div className="flex flex-col gap-2">
              <p>Tip sent successfully!</p>
              <p className="text-sm text-gray-500">
                {platformFee / 10**9} SOL fee collected by Snipost
              </p>
              <a 
                href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
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
        error: (err) => err?.response?.data?.message || "Failed to complete transaction"
      }
    );
  } catch (error) {
    console.error("Tip error:", error);
    toast.error(error?.response?.data?.message || "An error occurred while sending tip");
  } finally {
    setIsLoading(false);
    setIsOpen(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"}> <CircleDollarSign/> </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-x-2 items-center">
            Award this post <CupSoda className="text-primary"/>
          </DialogTitle>
          <DialogDescription>
            Value great content by tipping great developers
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="amount" className="sr-only">
              Amount (SOL)
            </Label>
            <Input
              id="amount"
              placeholder="0.1"
              type="number"
              min={0.001}
              step={0.001}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>
          <span className="text-sm">SOL</span>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button onClick={handleTip} disabled={isLoading}>
            {isLoading ? "Sending..." : "Tip"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}