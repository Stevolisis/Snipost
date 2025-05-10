import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { History, IdCard, MessageCircle, PackagePlus, Settings, User } from "lucide-react";
import Image from "next/image"
import Link from "next/link"

export function ProfileDropDown({ children }) {
  const menuItems = [
    {
      group: [
        {
          label: "Profile",
          icon: User,
          href: "/account/profile",
          shortcut: "⇧⌘P",
        },
        {
          label: "SnipCard",
          icon: IdCard,
          href: "/account/snipcard",
          shortcut: "⌘B",
        },
        {
          label: "History",
          icon: History,
          href: "/account/history",
          shortcut: "⌘S",
        },
      ],
    },
    {
      group: [
        {
          label: "Subscription",
          icon: PackagePlus,
          href: "/account/subscription",
        },
        {
          label: "Settings",
          icon: Settings,
          href: "/account/settings",
          shortcut: "⌘T",
        },
        {
          label: "Support",
          icon: MessageCircle,
          href: "/account/support",
        },
      ],
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <Link href="#" className="flex items-center gap-x-2">
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
              <span className="truncate text-xs text-muted-foreground">@stevolisis</span>
            </div>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <DropdownMenuGroup>
              {section.group.map((item) => (
                <Link href={item.href} key={item.label}>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-x-2">
                      <item.icon />
                      {item.label}
                    </div>
                    {item.shortcut && (
                      <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
            {sectionIndex < menuItems.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}

        <DropdownMenuSeparator />
        <Link href="/logout">
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}