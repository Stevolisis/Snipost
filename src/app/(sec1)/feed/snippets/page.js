"use client"
import api from '@/utils/axiosConfig';
import React, { useEffect, useState } from 'react'
import {
  snippetsFailure,
  loadSnippetsStart,
  loadSnippetsSuccess
} from '@/lib/redux/slices/snippets';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import SnipCard from '@/components/appComponents/SnipCard';
import { Skeleton } from '@/components/ui/skeleton';
import QuickNavigation from '@/components/appComponents/QuickNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { disconnectWallet } from '@/lib/redux/slices/auth';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Presentation, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  const dispatch = useAppDispatch();
  const { snippets = [], isLoading, error } = useAppSelector((state) => state.snippets);
  const { userData, jwtToken } = useAppSelector((state) => state.auth);
  const { disconnect } = useWallet();
  const [activeSection, setActiveSection] = useState('snippets');
  const [developers, setDevelopers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingDevs, setLoadingDevs] = useState(true)
  const [loadingCompanies, setLoadingCompanies] = useState(true)


  // Mock data for companies and featured snaps
  const featuredCompanies = [
    { id: 1, name: "Solana Labs", logo: "/solana-labs.png", description: "Building the future of web3", snippetCount: "1.2k", url: "/companies/solana-labs" },
    { id: 2, name: "Magic Eden", logo: "/magic-eden.png", description: "NFT marketplace on Solana", snippetCount: "845", url: "/companies/magic-eden" },
    { id: 3, name: "Phantom", logo: "/phantom.png", description: "Crypto wallet for the future", snippetCount: "2.1k", url: "/companies/phantom" },
    { id: 4, name: "Jupiter", logo: "/jupiter.png", description: "Swap aggregation on Solana", snippetCount: "932", url: "/companies/jupiter" }
  ];



  const featuredSnaps = [
    { id: 1, title: "Netflix", description:"Not just codes but illustrations", image: "https://ik.imagekit.io/snipost/uploads/c12be05d07064c61a98688e0a6a13e8c_SVCQ-SH6B.png", views: "2.4k", url: "/snaps/solana-program-anatomy" },
    { id: 2, title: "Snipost Codes", description:"Simple code explaniers", image: "https://ik.imagekit.io/snipost/uploads/05aeeb5e2ee648e69f5ec24e7cfa66e7_QG05hsQD2.png", views: "1.8k", url: "/snaps/wallet-integration" },
    { id: 3, title: "Code and Infographics", description:"Elegant visual explainer template for devs.", image: "https://ik.imagekit.io/snipost/uploads/c0fc788ef5014163a958144758f315ee_0l7VIY8yi.png", views: "3.1k", url: "/snaps/anchor-basics" }
  ];

    
  const cards = [
    {
      title: "Create Visual Snap",
      description: "Explain complex concepts visually",
      icon: Presentation,
      href: "/snap-editor",
      bgImage:
        "https://res.cloudinary.com/dbkcvkodl/image/upload/v1758836085/1758836085648Screenshot%202025-03-23%20150336.png",
    },
    {
      title: "Explore Companies",
      description: "See SDKs and tools from top projects",
      icon: Building2,
      href: "/#",
    },
    {
      title: "Connect with Devs",
      description: "Find and collaborate with developers",
      icon: Users,
      href: "/snipdevs",
    },
  ];


  const fetchAllUsers = async () => {
    try {
      setLoadingDevs(true)
      const response = await api.get('/get-all-users?limit=10&sortByXp=true', {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      
      setDevelopers(response?.data?.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load developers');
    } finally {
      setLoadingDevs(false)
    }
  };

  const fetchAllCompanies = async () => {
    try {
      setLoadingCompanies(true)
      const response = await api.get('/get-all-companies?limit=10&sortByXp=true', {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      
        setCompanies(response?.data?.companies);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load developers');
    } finally {
      setLoadingCompanies(false)
    }
  };

    
  useEffect(() => {
    fetchAllUsers();
    // fetchAllCompanies();
  }, []);

  const fetchTrends = async () => {
    try {
      dispatch(loadSnippetsStart());
      const response = await api.get('/get-trending-snippets?timeRange=all&limit=10');
      const snippets = response.data.snippets || [];
      dispatch(loadSnippetsSuccess(snippets));
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(disconnectWallet());
        disconnect();
        toast("Uh oh! Something went wrong.", {
          description: "Connect your wallet"
        });
        return;
      }
      dispatch(snippetsFailure(err.message || 'Failed to load snippets'));
    }
  }

  useEffect(() => {
    const fetchTrendingSnippets = async () => {
      try {
        dispatch(loadSnippetsStart());
        const response = jwtToken ? await api.get('/get-recommended-snippets?timeRange=all&limit=10', {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        }) : await api.get('/get-trending-snippets?timeRange=all&limit=10');
        const snippets = response.data.snippets || [];
        dispatch(loadSnippetsSuccess(snippets));
      } catch (err) {
        if (err.response?.status === 401) {
          dispatch(disconnectWallet());
          disconnect();
          toast("Uh oh! Something went wrong.", {
            description: "Connect your wallet"
          });
          await fetchTrends();
          return;
        }
        dispatch(snippetsFailure(err.message || 'Failed to load snippets'));
      }
    };

    fetchTrendingSnippets();
  }, [dispatch, userData?._id]);

  if (isLoading && snippets.length === 0) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-4 sm:px-6 py-4'>
        <Skeleton className="h-[460px] w-full" />
        <Skeleton className="h-[460px] w-full" />
        <Skeleton className="h-[460px] w-full" />
        <Skeleton className="h-[460px] w-full" />
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <Card>
  //         <CardContent className="p-4 text-center">
  //           <p>Error loading snippets: {error}</p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <>
      <QuickNavigation />
      
      {/* Enhanced Quick Actions Section */}
      <div className="w-full px-4 sm:px-6 my-8 mb-2">
        <Card className="bg-muted/50 borderp py-3 sm:py-4">
          <CardContent className="px-3 sm:px-4">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
              {cards.map((item, i) => (
                <Link key={i} href={item.href} className="snap-start">
                  <Card className="bg-background border hover:shadow-md transition-shadow flex-shrink-0 w-[280px] sm:w-80 md:w-auto relative overflow-hidden">
                    {item.bgImage && (
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-20"
                        style={{ backgroundImage: `url(${item.bgImage})` }}
                      />
                    )}
                    <CardContent className="p-4 flex items-center gap-4 relative z-10">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="w-full md:w-[82vw] px-4 sm:px-6 py-8 space-y-12">
        {/* === Snip Developers Section - Only show if data exists === */}
        {(developers.length > 0 || loadingDevs) && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Developers on Snipost</h2>
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <Link href="/snipdevs">View all</Link>
              </Button>
            </div>

            <div id="custom-scroll" className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {loadingDevs ? (
                // Loading Skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="min-w-[180px] border flex-shrink-0">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Skeleton className="h-12 w-12 rounded-full mb-2" />
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16 mb-3" />
                      <Skeleton className="h-8 w-full rounded-md" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Actual Developer Cards
                developers.map((dev) => (
                  <Card
                    key={dev._id}
                    className="min-w-[180px] border hover:shadow-md transition-shadow flex-shrink-0"
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <img
                        src={dev?.avatar?.url || '/default_avatar.png'}
                        alt={dev?.userName}
                        className="h-12 w-12 rounded-full mb-2 object-cover"
                      />
                      <h3 className="font-medium">{dev?.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-2">
                        {dev?.userName}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/${dev._id}`}>View Profile</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}

        {/* === SDK / Company Slider Section - Only show if data exists === */}
        {(companies.length > 0 || loadingCompanies) && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Discover SDKs & Companies</h2>
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <Link href="/companies">View all</Link>
              </Button>
            </div>

            <div id="custom-scroll" className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {loadingCompanies ? (
                // Loading Skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="min-w-[200px] border flex-shrink-0">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Skeleton className="h-12 w-12 rounded-full mb-2" />
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32 mb-3" />
                      <Skeleton className="h-8 w-full rounded-md" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Actual Company Cards
                companies.map((company) => (
                  <Card
                    key={company._id}
                    className="min-w-[200px] border hover:shadow-md transition-shadow flex-shrink-0"
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <img
                        src={company?.avatar?.url || company?.logo || '/default_company.png'}
                        alt={company?.name}
                        className="h-12 w-12 rounded-full mb-2 object-cover"
                      />
                      <h3 className="font-medium">{company?.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-2">
                        {company?.company_size && company?.industry 
                          ? `${company.company_size} - ${company.industry}`
                          : company?.description || 'Technology Company'
                        }
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dev_org/${company.username}/documentations`}>Explore SDK</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}
      </div>

      <div className="w-full px-4 sm:px-6 py-4">
        {/* Content Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'snippets', label: 'Code Snippets', count: snippets.length },
            { id: 'snaps', label: 'Visual Snaps', count: featuredSnaps.length },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeSection === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(tab.id)}
              className="whitespace-nowrap"
            >
              {tab.label}
              <Badge variant="secondary" className="ml-2">
                {tab.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Snippets Section */}
        {activeSection === 'snippets' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {snippets.length === 0 ? (
              <>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p>No snippets found</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p>No snippets found</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              snippets.map((snippet) => (
                <SnipCard snippet={snippet} key={snippet._id} />
              ))
            )}
          </div>
        )}

        {/* Snaps Section */}
        {activeSection === 'snaps' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSnaps.map((snap) => (
                <Card key={snap.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted relative">
                      <img 
                        src={snap.image} 
                        alt={snap.title}
                        className="w-full h-full object-contain rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/80">
                          {snap.views} views
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{snap.title}</h3>
                      <p className='text-muted-foreground'>{snap.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Create Snap CTA */}
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-6 text-center">
                <Presentation className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Create Your First Snap</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Visual explainers help others understand your work better
                </p>
                <Button asChild>
                  <Link href="/snap-editor">
                    <Zap className="h-4 w-4 mr-2" />
                    Start Creating Snaps
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

export default Page;