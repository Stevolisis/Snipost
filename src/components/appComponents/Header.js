// src/components/layout/Header.jsx
"use client"
import React, { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import Image from 'next/image'
import { ProfileDropDown } from './ProfileDropDown'
import { useWallet } from '@solana/wallet-adapter-react'
import { PhantomWalletName, SolflareWalletName } from '@solana/wallet-adapter-wallets'
import { useDispatch } from 'react-redux'
import { authenticateStart, authenticateSuccess, authFailure, connectWalletStart, connectWalletSuccess, disconnectWallet } from '@/lib/redux/slices/auth'
import api from '@/utils/axiosConfig'
import bs58 from "bs58"
import { useAppSelector } from '@/lib/redux/hooks'
import Link from 'next/link'
import SearchComponent from './Search'
import { loadNotificationsFailure, loadNotificationsStart, loadNotificationsSuccess } from '@/lib/redux/slices/notifications'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner';
import dynamic from 'next/dynamic'
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Header = () => {
  const { connect, connected, connecting, wallet, publicKey, disconnect } = useWallet()
  const dispatch = useDispatch()
  const { isConnected, walletAddress, jwtToken, userData } = useAppSelector((state) => state.auth)
  const { setVisible,  } = useWalletModal();

  const handleWalletClick = useCallback(async () => {
    try {
      dispatch(connectWalletStart())

      setVisible(true);
    } catch (err) {
      toast.error(`Connection failed: ${err.message}`);
      dispatch(disconnectWallet());
      await disconnect();
    }
  }, [setVisible, dispatch, disconnect])

  
  const signInWithBackend = async () => {
    dispatch(authenticateStart())
    try{
      const timestamp = Date.now()
      const message = `signin-user:${timestamp}`
      const messageBytes = new TextEncoder().encode(message)
      const signature = await wallet.adapter.signMessage(messageBytes)
      const signatureBase58 = bs58.encode(signature)
      
      const response = await api.post("/user-sign-in",{
        publicKey: publicKey.toBase58(),
        signature: signatureBase58,
        message
      })
      dispatch(authenticateSuccess(response.data))
    } catch(err) {
      dispatch(authFailure(err.message))
    }
  }

  const connectToSelectedWallet = useCallback(async() => {
    try{
      await connect();
    }catch(err){
      dispatch(disconnectWallet());
      await disconnect();
    }
  },[wallet])

  useEffect(() => {
    connectToSelectedWallet();
    if (publicKey) {
      dispatch(connectWalletSuccess({
          walletAddress: publicKey.toBase58()
      }))
      signInWithBackend();
    }
  }, [publicKey, wallet]);


  
  
  const getNotifications = async () => {
    try{
      dispatch(loadNotificationsStart())
      const response = await api.get("/get-notifications",{
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      })
      dispatch(loadNotificationsSuccess(response.data));
    } catch(err) {
      dispatch(loadNotificationsFailure(err?.response?.data?.message || "Failed to load notifications"))
      console.error("Error loading notifications:", err);
    }
  }


  useEffect(() => {
    if (jwtToken) {
      getNotifications();
    }
  }, []);
  // console.log("wjak: ", wallet, publicKey);

  return (
    <header className="sticky top-0 z-[50] flex items-center justify-between px-6 md:px-9 py-4 bg-background border-b border-border shadow-sm">
      <Link href="/start">
        <div className="text-xl font-bold text-white flex gap-x-2 items-center">
          <Image
            src="/logo.svg"
            alt="Snipost Logo"
            width={30}
            height={30}
          />
          <h2 className='text-2xl text-primary'>Snipost</h2>
        </div>
      </Link>

      <SearchComponent />
      {/* <WalletMultiButtonDynamic> */}
      {(connected && walletAddress && jwtToken && userData && isConnected) ? 
        <ProfileDropDown>
          <Button variant="default" className="gap-2" onClick={() => handleWalletClick()}>
            <Wallet className="h-4 w-4" />
            {walletAddress.toString().slice(0, 4)}...{walletAddress.toString().slice(-4)}
          </Button>
        </ProfileDropDown>
        :
        <Button variant="default" className="gap-2" onClick={() => handleWalletClick()}>
          <Wallet className="h-4 w-4" />
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      }  
      {/* </WalletMultiButtonDynamic> */}

    </header>
  )
}

export default Header