"use client"
import React, { useCallback, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Search, Wallet } from 'lucide-react';
import Image from 'next/image';
import { ProfileDropDown } from './ProfileDropDown';
import { useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName, SolflareWalletName } from '@solana/wallet-adapter-wallets';
import { useDispatch } from 'react-redux';
import { authenticateStart, authenticateSuccess, authFailure, connectWalletStart, connectWalletSuccess } from '@/lib/redux/slices/auth';
import api from '@/utils/axiosConfig';
import bs58 from "bs58";
import { useAppSelector } from '@/lib/redux/hooks';

const Header = () => {
  const { connect, connected, connecting , select, wallets, wallet, publicKey } = useWallet()
  const dispatch = useDispatch();
  const { 
    isConnected, 
    walletAddress, 
    jwtToken, 
    userData,
    isLoading 
  } = useAppSelector((state) => state.auth);
  console.log("ttt: ", connecting, connected, wallets, wallet, publicKey);
 const handleWalletClick = useCallback(async () => {
    try {
      dispatch(connectWalletStart());
      const installedWallets = wallets.filter(w => w.readyState === 'Installed');
      const solflare = installedWallets.find(w => w.adapter.name === SolflareWalletName);
      const phantom = installedWallets.find(w => w.adapter.name === PhantomWalletName);
      
      const walletToConnect = solflare || phantom || installedWallets[0];

      if (!walletToConnect) {
        const choice = window.confirm(
          'No wallet detected. Would you like to install Phantom Wallet?'
        );
        if (choice) {
          window.open('https://phantom.app/', '_blank');
        }
        return;
      }

      await select(walletToConnect.adapter.name);
      await connect();
    } catch (err) {
      alert(`Connection failed: ${err.message}`);
    }
  }, [wallets, select, connect]);




  useEffect(() => {
    // if(connected){
    //   return;
    // }
    if (publicKey) {
      dispatch(connectWalletSuccess({
          walletAddress: publicKey.toBase58()
      }));

      const signInWithBackend = async () => {
        dispatch(authenticateStart());
        try{
          const timestamp = Date.now();
          const message = `signin-user:${timestamp}`;
          const messageBytes = new TextEncoder().encode(message);
          const signature = await wallet.adapter.signMessage(messageBytes);
          const signatureBase58 = bs58.encode(signature); // Using bs58 encoding
          
          const response = await api.post("/user-sign-in",{
            publicKey: publicKey.toBase58(),
            signature: signatureBase58,
            message
          });
          dispatch(authenticateSuccess(response.data))

        }catch(err){
          dispatch(authFailure(err.message));
        }
      }
      signInWithBackend();
    }
  }, [publicKey, wallet]);

  return (
    <header className="sticky top-0 z-[50] flex items-center justify-between px-6 md:px-9 py-4 bg-background border-b border-border shadow-sm">

    <div className="text-xl font-bold text-white flex gap-x-2 items-center">
      <Image
        src="/logo.svg"
        alt="Snipost Logo"
        width={30}
        height={30}
      />
      <h2 className='text-2xl text-primary'>Snipost</h2>
    </div>

    {/* Search */}
    <div className="flex-1 max-w-md mx-6">
      <div className="relative">
        <Input
          placeholder="Search snippets..."
          className="pl-10"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">
          <Search className="h-4 w-4" />
        </span>
      </div>
    </div>

    {/* Feed Type Section */}

    {/* Wallet Button */}
    {
      publicKey ? 
        <ProfileDropDown>
          <Button variant="default" className="gap-2" onClick={()=>handleWalletClick()}>
            <Wallet className="h-4 w-4" />
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </Button>
        </ProfileDropDown>
        :
        <Button variant="default" className="gap-2" onClick={()=>handleWalletClick()}>
          <Wallet className="h-4 w-4" />
          {connecting ? "Connecting..." :"Connect Wallet"}
        </Button>
    }

  </header>
  )
}

export default Header