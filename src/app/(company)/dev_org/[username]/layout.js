"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { FileText, Code2, Bell, MapPin, Building2, Globe, Users, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { loadProfileFailure, loadProfileStart, loadProfileSuccess } from "@/lib/redux/slices/profile"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { toast } from "sonner"
import api from "@/utils/axiosConfig"
import { docsFailure, loadDocsStart, loadDocsSuccess } from "@/lib/redux/slices/documentations"
import Image from "next/image"

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
  const { username } = useParams()
  const pathname = usePathname()
  const basePath = `/dev_org/${username}`
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.profile)
  const { userData } = useAppSelector((state) => state.auth);
  const [similarCompanies, setSimilarCompanies] = useState([]);

  const fetchProfile = async () => {
    const loadingId = toast.loading('Loading profile...');
    try {
      dispatch(loadProfileStart())
      const { data } = await api.get(`/get-company/${username}`)
      dispatch(loadProfileSuccess(data.company));
      toast.success('Profile loaded successfully', { id: loadingId })
    } catch (err) {
      dispatch(loadProfileFailure(err.response?.data?.message || 'Failed to load profile'));
      toast.error(err.response?.data?.message || 'Failed to load profile', { id: loadingId })
    }
  }

  const fetchCompanies = async () => {
    const loadingId = toast.loading('Loading companies...');
    try {
      const { data } = await api.get(`/get-all-companies?limit=${7}`)
      setSimilarCompanies(data.companies);
      toast.success("Companies loaded successfully", { id: loadingId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load companies', { id: loadingId })
    }
  }

  const fetchCompanyDocs = async () => {
    try {
      dispatch(loadDocsStart());
      const { data } = await api.get(`get-company-documentations/${userData._id}`);
      dispatch(loadDocsSuccess(data?.documentations || []));
    } catch (err) {
      dispatch(docsFailure(err?.response?.data?.message || "Failed to load documentations"));
      toast.error(err?.response?.data?.message || "Failed to load documentations");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCompanies();
    fetchCompanyDocs();
  }, [username]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="md:w-1/3 space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="md:w-2/3 space-y-4">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p>{error || 'Profile not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 md:px-20 py-8 space-y-10">

        {/* Header Section - Plain Banner with User Info */}
        <section className="relative w-full">
          {/* Banner Image */}
          <div className="relative h-40 w-full rounded-t-xl overflow-hidden">
            <Image
              src={profile?.banner?.url || ""}
              alt="Profile banner"
              fill
              className="object-cover"
              priority
            />
            {/* Optional overlay for readability */}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Profile Info Card */}
          <div className="absolute bottom-0 left-3 sm:left-6 transform translate-y-1/2 flex items-end gap-4">
            {/* Avatar Box */}
            <div className="flex items-center justify-center w-24 h-24 max-w-24 max-h-24 aspect-square rounded-md bg-background shadow-md border border-border overflow-hidden">
              <Image
                src={userData?.avatar?.url || "/placeholder.svg"}
                alt={`${userData?.name || "User"} avatar`}
                width={96}
                height={96}
                className="object-contain"
              />
            </div>

            {/* User Info */}
            <div className="flex flex-col space-y-2 mt-18">
              <h1 className="text-2xl font-semibold text-foreground">
                {userData?.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center text-sm sm:text-base gap-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{profile?.location || "Unknown"}</span>
                </div>

                <div className="flex items-center text-sm sm:text-base gap-1">
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{profile?.company_size || "N/A"}</span>
                </div>

                <div className="flex items-center text-sm sm:text-base gap-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{profile?.followers?.length || 0} followers</span>
                </div>

                {profile?.company_website && (
                  <Link
                    href={profile.company_website}
                    target="_blank"
                    className="flex items-center text-sm sm:text-base gap-1 hover:text-primary transition-colors"
                  >
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Website</span>
                  </Link>
                )}
              </div>

              {profile?.description && (
                <p className="text-sm text-muted-foreground max-w-xl mt-2">
                  {profile.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Tabs and Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 mt-30 sm:mt-28">
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
                    href={`/dev_org/${company.username}`}
                    className={cn(
                      "block p-3 rounded-lg border-2 transition-all group",
                      "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40"
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
                          {company.followers?.length || 0} Followers
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
