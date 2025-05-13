"use client"
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Wallet } from 'lucide-react'
import Image from 'next/image'
import { ProfileDropDown } from './ProfileDropDown'
import { useWallet } from '@solana/wallet-adapter-react'
import { PhantomWalletName, SolflareWalletName } from '@solana/wallet-adapter-wallets'
import { useDispatch } from 'react-redux'
import { authenticateStart, authenticateSuccess, authFailure, connectWalletStart, connectWalletSuccess } from '@/lib/redux/slices/auth'
import api from '@/utils/axiosConfig'
import bs58 from "bs58"
import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Link from 'next/link'

const Header = () => {
  const { connect, connected, connecting, select, wallets, wallet, publicKey } = useWallet()
  const dispatch = useDispatch()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const searchRef = useRef(null)
  const timeoutRef = useRef()

  const { 
    isConnected, 
    walletAddress, 
    jwtToken, 
    userData,
    isLoading 
  } = useAppSelector((state) => state.auth)

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const response = await api.get(`/search-snippets?q=${encodeURIComponent(query)}`)
      setSearchResults(response.data.snippets || [])
      setOpen(true)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchQuery, performSearch])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleResultClick = (snippetId) => {
    router.push(`/snippet/${snippetId}`)
    setSearchQuery('')
    setSearchResults([])
    setOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setSearchResults([])
      setOpen(false)
    }
  }

  const handleWalletClick = useCallback(async () => {
    try {
      dispatch(connectWalletStart())
      const installedWallets = wallets.filter(w => w.readyState === 'Installed')
      const solflare = installedWallets.find(w => w.adapter.name === SolflareWalletName)
      const phantom = installedWallets.find(w => w.adapter.name === PhantomWalletName)
      
      const walletToConnect = solflare || phantom || installedWallets[0]

      if (!walletToConnect) {
        const choice = window.confirm(
          'No wallet detected. Would you like to install Phantom Wallet?'
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
      <div className="flex-1 max-w-md mx-6 relative">
        <form onSubmit={handleSearchSubmit}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  ref={searchRef}
                  placeholder="Search snippets..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search className="h-4 w-4" />
                </span>
              </div>
            </PopoverTrigger>
            
            <PopoverContent 
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
              sideOffset={8}
            >
              <Command shouldFilter={false}>
                <CommandInput placeholder="Search snippets..." value={searchQuery} onValueChange={setSearchQuery} />
                <CommandList>
                  {isSearching ? (
                    <CommandEmpty>Searching...</CommandEmpty>
                  ) : searchResults.length > 0 ? (
                    <CommandGroup className="w-full">
                      {searchResults.map((snippet) => (
                        <CommandItem 
                          key={snippet._id}
                          value={snippet._id}
                          className="cursor-pointer"
                        >
                          <Link href={`/snippet/${snippet._id}`}>
                            <div className="w-full">
                              <div className="font-medium line-clamp-1">{snippet.title}</div>
                              <div className="text-sm text-muted-foreground truncate line-clamp-1">
                                {snippet.description || 'No description'}
                              </div>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {snippet.tags?.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </Link>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>
                      {searchQuery.trim() ? 'No results found' : 'Start typing to search'}
                    </CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </form>
      </div>

      {/* Wallet Button */}
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