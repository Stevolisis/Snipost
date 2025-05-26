"use client"
import React, { useEffect, useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarGroup,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { History, IdCard, MessageCircle, NewspaperIcon, PackagePlus, Plus, Settings, User } from "lucide-react"
import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

// This is sample data.

export function AccountSidebar({ ...props }) {
  const [activeNav, setActiveNav] = useState("/account/profile") // Default to "Trending"
  const { 
    isConnected, 
    walletAddress, 
    jwtToken, 
    userData,
    isLoading 
  } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const data = {
  navMain: [
    {
      title: "My Account",
      url: `/profile/${userData._id}`,
      icon: User,
    },
    {
      title: "My Feed",
      url: "/feed/snippets",
      icon: NewspaperIcon,
    },
    {
      title: "DevCard",
      url: "/account/devcard",
      icon: IdCard,
    },
    {
      title: "History",
      url: "/account/history",
      icon: History,
      isActive: true,
    },
    {
      title: "Subscription",
      url: "/account/subscription",
      icon: PackagePlus,
      isActive: false,
    },
        {
      title: "Settings",
      url: "/account/settings",
      icon: Settings,
      isActive: false,
    },
        {
      title: "Support",
      url: "/account/support",
      icon: MessageCircle,
      isActive: false,
    },
  ],
}

  const navMainWithActiveState = data.navMain.map(item => ({
        ...item,
        isActive: item.url === activeNav
    }));

    useEffect(()=>{
        if(window){
            setActiveNav(window.location.pathname);
        }
    },[]);

    
  return (
    <>
    
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>

          <SidebarMenu>
            {userData && 
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href={`/profile/${userData._id}`}>
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {
                      userData?.avatar?.url ? 
                      <Image
                        src={userData.avatar.url}
                        alt={userData.avatar.public_id}
                        width={40}
                        height={40}
                        className='object-cover'
                      /> :
                      <Image
                        src="/default_avatar.png"
                        alt="Avatar"
                        width={40}
                        height={40}
                        className='object-cover'
                      />
                    }
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">@{userData?.userName}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            }
          </SidebarMenu>

          <Button onClick={()=>router.push("/snippet-editor")}>
            <Plus/>
            <p>Create Post</p>
          </Button>

        <SidebarMenu>
            {navMainWithActiveState.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={item.isActive}
                  onClick={() => setActiveNav(item.url)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarHeader>

        <SidebarRail />
      </Sidebar>
    
    </>
  )
}
