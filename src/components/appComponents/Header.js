// src/components/layout/Header.jsx
"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import Image from 'next/image'
import { ProfileDropDown } from './ProfileDropDown'
import { useWallet } from '@solana/wallet-adapter-react'
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


const Header = () => {
  const { connect, connected, connecting, wallet, publicKey, disconnect } = useWallet()
  const dispatch = useDispatch()
  const { isConnected, walletAddress, jwtToken, userData } = useAppSelector((state) => state.auth)
  const { setVisible, visible } = useWalletModal();
  const [userInitiatedConnection, setUserInitiatedConnection] = useState(false);
  const [prevVisible, setPrevVisible] = useState(false);
  
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

  const signInWithBackend = async () => {
    dispatch(authenticateStart());
    const loaderId = toast.loading("Signing in...");
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
      dispatch(authenticateSuccess(response.data));
      toast.success("Signed in successfully", { id: loaderId });
    } catch(err) {
      console.log("disconnecting due to error2: ", err.message);
      toast.error(`Sign in failed: ${err?.response?.data?.message||err.message}`, { id: loaderId });
      dispatch(authFailure(err.message));
      await disconnect();
    }
  }

  const connectToSelectedWallet = useCallback(async() => {
    if (!userInitiatedConnection || !wallet) return
    console.log("Connecting to wallet:", wallet.adapter.name);
    try{
      await connect();
    }catch(err){
      dispatch(disconnectWallet());
      console.log("disconnecting due to error3: ", err.message);
      await disconnect();
    }finally {
      setUserInitiatedConnection(false) // Reset after attempt
    }
  },[wallet, connect, disconnect, userInitiatedConnection])

  // Track when modal closes and user selected a wallet
  useEffect(() => {
    if (prevVisible && !visible && wallet) {
      // Modal just closed and we have a wallet selected
      setUserInitiatedConnection(true);
    }
    setPrevVisible(visible);
  }, [visible, wallet, prevVisible]);

  // Trigger connection when user selects wallet from modal
  useEffect(() => {
    if (userInitiatedConnection && wallet && !connected) {
      connectToSelectedWallet();
    }
  }, [userInitiatedConnection, wallet, connected, connectToSelectedWallet]);

  // Handle successful connection
  useEffect(() => {
    if (publicKey && userInitiatedConnection) {
      dispatch(connectWalletSuccess({
        walletAddress: publicKey.toBase58()
      }))
      signInWithBackend();
    }
  }, [publicKey, userInitiatedConnection]);
  
  
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

  // console.log(connected , walletAddress , jwtToken , userData , isConnected)
  useEffect(() => {
    if (jwtToken) {
      getNotifications();
    }
  }, []);
  // console.log("wjak: ", wallet?.adapter?.name, publicKey);

  return (
    <header className="sticky top-0 z-[50] flex items-center justify-between px-3 md:px-9 py-4 bg-background border-b border-border shadow-sm">
      <Link href="/start">
        <div className="text-xl font-bold text-white flex gap-x-1 items-center">
          <Image
            src="/logo.svg"
            alt="Snipost Logo"
            width={30}
            height={30}
            className='sm:h-[30px]! sm:w-[30px]! h-[23px] w-[23px]'
          />
          <h2 className='text-xl sm:text-2xl text-primary'>Snipost</h2>
        </div>
      </Link>

      <SearchComponent />
      {/* <WalletMultiButtonDynamic> */}
      {(connected && walletAddress && jwtToken && userData && isConnected) ? 
        <ProfileDropDown>
          <Button variant="default" className="gap-2 py-1! text-xs sm:text-base" onClick={() => handleWalletClick()}>
            <Wallet className="h-4 w-4" />
            {walletAddress.toString().slice(0, 4)}...{walletAddress.toString().slice(-4)}
          </Button>
        </ProfileDropDown>
        :
        <Button variant="default" className="gap-2 py-1! text-xs sm:text-base" onClick={() => handleWalletClick()}>
          <Wallet className="h-4 w-4" />
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      }  
      {/* </WalletMultiButtonDynamic> */}

    </header>
  )
}

export default Header