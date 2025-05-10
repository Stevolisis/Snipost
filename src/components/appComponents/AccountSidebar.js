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
import { History, IdCard, MessageCircle, PackagePlus, Settings, User } from "lucide-react"

// This is sample data.
const data = {
  navMain: [
    {
      title: "My Account",
      url: "/account/profile",
      icon: User,
    },
    {
      title: "SnipCard",
      url: "/account/snipcard",
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

export function AccountSidebar({ ...props }) {
    const [activeNav, setActiveNav] = useState("/account/profile") // Default to "Trending"

    // Update navMain data with dynamic active state
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
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Image
                      src="/logo2.svg"
                      alt="Avatar"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Steven Joseph</span>
                    <span className="truncate text-xs">Pro Coder</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

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
