"use client"
import React, { useEffect, useState } from 'react';
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Telescope,
  Trash2,
  TrendingUp,
  Users2,
} from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "My Feed",
      url: "/feed/snippets",
      icon: Home,
    },
    {
      title: "Following",
      url: "/feed/following",
      icon: Users2,
    },
    {
      title: "Trending",
      url: "/feed/trending",
      icon: TrendingUp,
      isActive: true,
    },
    // {
    //   title: "Explore",
    //   url: "/feed/explore",
    //   icon: Telescope,
    //   isActive: false,
    // },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  workspaces: [
    {
      name: "Upvotes",
      url: "/feed/mostupvotes",
      emoji: "🏠",
    },
    {
      name: "Comments",
      url: "/feed/mostcomments",
      emoji: "💼",
    },
    {
      name: "Views",
      url: "/feed/mostviews",
      emoji: "🎨",
    },
    {
      name: "latest",
      url: "/feed/latest",
      emoji: "🏡",
    },
    {
      name: "Downvotes",
      url: "/feed/mostdownvotes",
      emoji: "🧳",
    },
  ],
}

export function AppSidebar({ ...props }) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState({
    url: '/feed/snippets'
  });
  const { 
    isConnected, 
    walletAddress, 
    jwtToken, 
    userData,
    isLoading 
  } = useAppSelector((state) => state.auth);

  const navMainWithActiveState = data.navMain.map(item => ({
    ...item,
    isActive: activeItem.url === item.url
  }))

  // Update workspaces with dynamic active state
  const workspacesWithActiveState = data.workspaces.map(workspace => ({
    ...workspace,
    isActive: activeItem.url === workspace.url
  }))


  useEffect(()=>{
      if(window){
          setActiveItem({
            url: window.location.pathname
          });
      }
  },[]);
  
  return (
    <>
    
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>

          <SidebarMenu>
            {userData && <SidebarMenuItem>
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
            </SidebarMenuItem>}
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
                  onClick={() => setActiveItem({
                    value: item.url
                  })}
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


        <SidebarContent>
          {/* <NavFavorites favorites={data.favorites} /> */}
          
          <SidebarGroup>
            <SidebarGroupLabel>Filter by most</SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu>

                {workspacesWithActiveState.map((workspace) => (
                  <SidebarMenuItem key={workspace.name}>
                    <SidebarMenuButton 
                      asChild
                      isActive={workspace.isActive}
                      onClick={() => setActiveItem({
                        value: workspace.url
                      })}
                    >
                      <Link href={workspace.url}>
                        <span>{workspace.emoji}</span>
                        <span>{workspace.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>







          {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    
    </>
  )
}
