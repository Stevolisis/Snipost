"use client"
import React, { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import Image from 'next/image'
import { ProfileDropDown } from './ProfileDropDown'
import { useWallet } from '@solana/wallet-adapter-react'
import { PhantomWalletName, SolflareWalletName } from '@solana/wallet-adapter-wallets'
import { useDispatch } from 'react-redux'
import { authenticateStart, authenticateSuccess, authFailure, connectWalletStart, connectWalletSuccess } from '@/lib/redux/slices/auth'
import api from '@/utils/axiosConfig'
import bs58 from "bs58"
import { useAppSelector } from '@/lib/redux/hooks'
import Link from 'next/link'
import SearchComponent from './Search'

const Header = () => {
  const { connect, connected, connecting, select, wallets, wallet, publicKey } = useWallet()
  const dispatch = useDispatch()
  const { isConnected, walletAddress, jwtToken, userData, isLoading } = useAppSelector((state) => state.auth)

  const detectMobileWallet = () => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad/i.test(userAgent);
    
    if (isMobile) {
      // Try Phantom first
      window.location.href = 'https://phantom.app/ul/browse/' + window.location.href;
      setTimeout(() => {
        // Fallback to Solflare if Phantom fails
        window.location.href = 'solflare://browse/' + window.location.href;
      }, 250);
      return true;
    }
    return false;
  }

  const handleWalletClick = useCallback(async () => {
    try {
      // Check if on mobile first
      if (detectMobileWallet()) return;

      dispatch(connectWalletStart())
      const installedWallets = wallets.filter(w => w.readyState === 'Installed')
      const solflare = installedWallets.find(w => w.adapter.name === SolflareWalletName)
      const phantom = installedWallets.find(w => w.adapter.name === PhantomWalletName)
      
      const walletToConnect = solflare || phantom || installedWallets[0]

      if (!walletToConnect) {
        const choice = window.confirm(
          'No wallet extension detected. Would you like to install Phantom Wallet?'
        )
        if (choice) {
          window.open('https://phantom.app/', '_blank')
        }
        return
      }

      await select(walletToConnect.adapter.name)
      await connect()
    } catch (err) {
      alert(`Connection failed: ${err.message}`)
    }
  }, [wallets, select, connect])

  useEffect(() => {
    if (publicKey) {
      dispatch(connectWalletSuccess({
          walletAddress: publicKey.toBase58()
      }))

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
      signInWithBackend()
    }
  }, [publicKey, wallet])


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

      {publicKey ? 
        <ProfileDropDown>
          <Button variant="default" className="gap-2" onClick={() => handleWalletClick()}>
            <Wallet className="h-4 w-4" />
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </Button>
        </ProfileDropDown>
        :
        <Button variant="default" className="gap-2" onClick={() => handleWalletClick()}>
          <Wallet className="h-4 w-4" />
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      }
    </header>
  )
}

export default Header