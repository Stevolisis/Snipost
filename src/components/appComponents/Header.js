import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Search, Wallet } from 'lucide-react';
import Image from 'next/image';
import { ProfileDropDown } from './ProfileDropDown';

const Header = () => {
  return (
    <header className="sticky top-0 z-[100] flex items-center justify-between px-6 md:px-9 py-4 bg-background border-b border-border shadow-sm">

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
    <ProfileDropDown>
      <Button variant="default" className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    </ProfileDropDown>
  </header>
  )
}

export default Header