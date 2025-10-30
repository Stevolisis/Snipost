"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Plus,
  FileText,
  SquareCode,
  FolderSync,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export function CompanyAppSidebar({ ...props }) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState({ url: "/dev_org/snippets" });
  const { userData } = useAppSelector((state) => state.auth);
  const { docs, isLoading } = useAppSelector((state) => state.documentations);

  const data = {
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Documentation", url: "/dev_org/documentations", icon: FileText },
      { title: "Code Examples", url: "/dev_org/snippets", icon: SquareCode },
      { title: "Updates", url: "/dev_org/updates", icon: FolderSync },
    ],
    tags: [
      {
        name: `#${userData?.username || "solana"}`,
        url: `/feed/tag/${userData?.username || "solana"}`,
        emoji: "🚀",
      },
    ],
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveItem({ url: window.location.pathname });
    }
  }, []);

  return (
    <Sidebar className="border-r-0" {...props}>
      {/* Header Section */}
      <SidebarHeader>
        <SidebarMenu>
          {userData && (
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={`/dev_org/${userData.username}/examples`}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {userData?.avatar?.url ? (
                      <Image
                        src={userData.avatar.url}
                        alt={userData.avatar.public_id}
                        width={40}
                        height={40}
                        className="object-cover rounded-lg h-full w-full"
                      />
                    ) : (
                      <Image
                        src="/default_avatar.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="object-cover rounded-lg h-full w-full"
                      />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userData?.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      @{userData?.username}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        <Button onClick={() => router.push("/docs/create_documentation")}>
          <Plus />
          <p>Create Content</p>
        </Button>

        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={activeItem.url === item.url}
                onClick={() => setActiveItem({ url: item.url })}
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

      {/* Documentation Section */}
      {!isLoading && docs.length > 0 && (
        <SidebarContent
          className="overflow-y-auto max-h-[300px]"
          id="custom-scroll"
        >
          <SidebarGroup>
            <SidebarGroupLabel>Documentation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>📘 Docs</SidebarMenuButton>
                  <SidebarMenuSub>
                    <TooltipProvider>
                      {docs.map((doc) => (
                        <Tooltip key={doc._id}>
                          <TooltipTrigger asChild>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                asChild
                                isActive={activeItem.url.endsWith(doc.slug)}
                                onClick={() =>
                                  setActiveItem({
                                    url: `/dev_org/${userData?.username}/documentations/${doc.slug}`,
                                  })
                                }
                              >
                                <Link
                                  href={`/dev_org/${userData?.username}/documentations/${doc.slug}`}
                                >
                                  <span>📄</span>
                                  <span className="truncate">{doc.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {doc.title}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}

      {/* Skeleton while loading */}
      {isLoading && (
        <SidebarContent className="overflow-y-auto max-h-[300px]" id="custom-scroll">
          <SidebarGroup>
            <SidebarGroupLabel>Documentation</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-6 w-[85%] mx-auto rounded-md bg-muted"
                  />
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}

      {/* Tags Section */}
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="mt-4">tags</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.tags.map((tag) => (
                <SidebarMenuItem key={tag.name} className="text-gray-400">
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem.url === tag.url}
                    onClick={() => setActiveItem({ url: tag.url })}
                  >
                    <Link href={tag.url}>
                      <span>{tag.emoji}</span>
                      <span>{tag.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
