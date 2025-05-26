import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { disconnectWallet } from "@/lib/redux/slices/auth";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useWallet } from "@solana/wallet-adapter-react";
import { Bell, History, IdCard, MessageCircle, PackagePlus, Settings, User } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner";

export function ProfileDropDown({ children }) {
  const { isConnected, walletAddress, jwtToken, userData, isLoading } = useAppSelector((state) => state.auth);
  const { disconnect } = useWallet();
  const dispatch = useAppDispatch();

  const menuItems = [
    {
      group: [
        {
          label: "Profile",
          icon: User,
          href: `/profile/${userData?._id}`,
          shortcut: "⇧⌘P",
        },
        {
          label: "Notifications",
          icon: Bell,
          href: `/notifications`,
          shortcut: "⇧⌘N",
        },
        {
          label: "DevCard",
          icon: IdCard,
          href: "/account/devcard",
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

  const handleLogout = async() => {
    await disconnect();
    dispatch(disconnectWallet());
    toast.success("Logged out succesfully")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div href="#" className="flex items-center gap-x-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {
                userData?.avatar.url ? 
                <Image
                  src={userData.avatar.url}
                  alt={userData.avatar.public_id || "Profile Avatar"}
                  width={50}
                  height={50}
                  className='object-cover'
                /> :
                <Image
                  src="/default_avatar.png"
                  alt="Avatar"
                  width={50}
                  height={50}
                  className='object-cover'
                />
              }
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userData?.name}</span>
              <span className="truncate text-xs text-muted-foreground">@{userData?.userName}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <DropdownMenuGroup>
              {section.group.map((item) => (
                <Link href={item.href} key={item.label}>
                  <DropdownMenuItem className='cursor-pointer'>
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
          <DropdownMenuItem className=' cursor-pointer hover:bg-red-500! transition-colors duration-150' onClick={()=> handleLogout()}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}