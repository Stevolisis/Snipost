"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, SquareCode, FolderSync } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  {
    href: "/docs/create_documentation",
    label: "Documentation",
    icon: FileText,
  },
  {
    href: "/docs/create_example",
    label: "Code Example",
    icon: SquareCode,
  },
  {
    href: "/docs/create_update",
    label: "Updates",
    icon: FolderSync,
  },
]

export default function Layout({ children }) {
  const pathname = usePathname()

  return (
      <div className="px-6 md:px-24 py-6 sm:py-10">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Create New Content</h2>
          <p className="text-sm text-muted-foreground">
            Choose what you want to create and share with the community
          </p>
        </div>

        {/* Tabs */}
        <div className="relative mt-8">
          {/* Base line under all tabs */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-border" />

          <div className="flex flex-wrap gap-6 relative">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = pathname.startsWith(tab.href)

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2",
                    active
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto w-full mt-10">{children}</div>
      </div>
    )
}
