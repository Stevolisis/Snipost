"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { FileText, Code2, Bell, Zap, MapPin, Building2, Calendar, Globe, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Company data structure
const companyData = {
  name: "CodeFlow Solutions",
  description: "Enterprise-grade developer tools and documentation platform",
  info: [
    { icon: MapPin, label: "San Francisco, CA" },
    { icon: Building2, label: "50-200 employees" },
    { icon: Calendar, label: "Founded 2021" },
    { icon: Globe, label: "codeflow.dev", isLink: true }
  ],
  sidebar: {
    companyType: "SaaS Platform",
    industry: "Developer Tools",
    headquarters: "San Francisco, CA",
    techStack: ["React", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS"],
    pricing: "Enterprise pricing available"
  }
}

// Navigation tabs structure
const navigationTabs = [
  { href: "/documentations", label: "README", icon: FileText },
  { href: "/examples", label: "Code Examples", icon: Code2 },
  { href: "/updates", label: "Updates", icon: Bell },
]

// Similar companies data
const similarCompanies = [
  { 
    name: "DevStream", 
    location: "Austin, TX",
    industry: "Developer Tools",
    color: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40"
  },
  { 
    name: "CodeAtlas", 
    location: "New York, NY",
    industry: "Documentation",
    color: "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40"
  },
  { 
    name: "SnippetBase", 
    location: "London, UK",
    industry: "Code Sharing",
    color: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40"
  },
  { 
    name: "FlowDocs", 
    location: "Toronto, CA",
    industry: "API Documentation",
    color: "bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40"
  }
]

export default function DevOrgLayout({ children }) {
  const { id } = useParams()
  const pathname = usePathname()
  const basePath = `/dev_org/profile/${id}`

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 md:px-20 py-8 space-y-10">
        {/* Header Section with gradient background */}
        <Card className="border-none bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/30 shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
          <CardContent className="pt-6 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-primary">Active Platform</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                  {companyData.name}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                  {companyData.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {companyData.info.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Icon className="h-4 w-4 text-primary" />
                          {item.isLink ? (
                            <Link href="#" className="text-primary hover:underline font-medium">
                              {item.label}
                            </Link>
                          ) : (
                            <span>{item.label}</span>
                          )}
                        </div>
                        {index < companyData.info.length - 1 && (
                          <Separator orientation="vertical" className="h-4" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs and Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          <div>
            {/* Navigation Tabs */}
            <div className="relative mb-8">
              <div className="absolute bottom-0 left-0 w-full h-px bg-border" />
              <div className="flex flex-wrap gap-6 relative">
                {navigationTabs.map((tab) => {
                  const Icon = tab.icon
                  const fullPath = `${basePath}${tab.href}`
                  const isActive = pathname === fullPath || pathname.startsWith(fullPath + '/')

                  return (
                    <Link
                      key={tab.href}
                      href={fullPath}
                      className={cn(
                        "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                        isActive
                          ? "text-primary border-primary"
                          : "text-muted-foreground border-transparent hover:text-foreground"
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
            <div className="max-w-5xl">{children}</div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Similar Companies Card */}
            <Card className="border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span>Similar Companies</span>
                  <Badge variant="secondary" className="text-xs">
                    {similarCompanies.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {similarCompanies.map((company, idx) => (
                  <Link 
                    key={idx} 
                    href="#"
                    className={cn(
                      "block p-3 rounded-lg border-2 transition-all group",
                      company.color
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                          {company.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3" />
                          <span>{company.location}</span>
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {company.industry}
                        </Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}