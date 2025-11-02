"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowBigUp, ArrowBigDown, MessageCircle, Bookmark, SquarePen, DollarSign, ExternalLink, Trash2, Copy, Twitter, Github, Award, Trophy, Star, Target, Zap, Crown, Flame } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { updateUserData } from '@/lib/redux/slices/auth'
import { 
  loadProfileStart, 
  loadProfileSuccess, 
  loadProfileFailure,
  loadTransactionsSuccess,
  loadEarningsSuccess
} from '@/lib/redux/slices/profile'
import { toast } from 'sonner'
import api from '@/utils/axiosConfig'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { use, useEffect, useState } from 'react'
import { loadSnippetsStart, loadSnippetsSuccess, snippetsFailure } from '@/lib/redux/slices/snippets'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage({ params }) {
  const { userId } = use(params);
  const [bookmarks, setBookmarks] = useState([]);
  const authState = useAppSelector((state) => state.auth)
  const userData = authState?.userData || null
  const jwtToken = authState?.jwtToken || null;
  const { snippets } = useAppSelector((state) => state.snippets)
  const { profile, loading, error, transactions, earned } = useAppSelector((state) => state.profile)
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState('snippets')

  const isOwner = userData?._id === userId
  const isFollowing = userData?.following?.some(
    follow => follow.entity.toString() === profile?._id.toString()
  )

  const fetchProfile = async () => {
    try {
      dispatch(loadProfileStart())
      const response = await api.get(`/get-user/${userId}`)
      dispatch(loadProfileSuccess(response.data.user))
    } catch (err) {
      dispatch(loadProfileFailure(err.response?.data?.message || 'Failed to load profile'))
    }
  }

  const fetchTransactions = async () => {
    if (!isOwner) return
    
    try {
      const response = await api.get('/get-transactions', {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })
      dispatch(loadTransactionsSuccess(response.data.transactions || []))
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      toast.error('Failed to load transaction history')
    }
  }

  const fetchUser = async () => {
    try {
      const response = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      })
      dispatch(updateUserData(response.data.user))
    } catch (err) {
      toast.error(err.message)
    }
  }

  const fetchSnippets = async () => {
    try {
      dispatch(loadSnippetsStart())
      const response = await api.get(`/get-user-snippets/${userId}?limit=10`)
      const snippets = response.data.snippets || []
      dispatch(loadSnippetsSuccess(snippets))
    } catch (err) {
      dispatch(snippetsFailure(err.message || 'Failed to load snippets'))
    }
  }

  const fetchEarningSummary = async () => {
    try {
      const response = await api.get(`/transactions/earnings`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      })
      dispatch(loadEarningsSuccess(response.data.transactions || []))
    } catch (err) {
      console.error('Failed to fetch earnings:', err)
      toast.error('Failed to load earnings summary')
    }
  }

  const fetchBookmarks = async () => {
    if (!isOwner) return
    try {
      const response = await api.get('/get-bookmark', {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      })
      setBookmarks(response.data.bookmarks);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err)
    }
  }
  
  const handleFollow = async () => {
    try {
      await toast.promise(
        (async()=> {  
          const response = api.put('/follow-user', {
            followId: profile._id,
            role: userData.role
          }, {
            headers: { Authorization: `Bearer ${jwtToken}` }
          });
          return response.data;
        })(),
        {
          loading: 'Following...',
          success: async (data) => {
            await fetchUser();
            return data?.message || 'Followed successfully!'
          },
          error: (err) =>{
            return err.response?.data?.message || 'Failed to follow'
            }
          }
      )
    } catch (err) {
      console.error('Follow error:', err)
      toast.error(err.message)
    }
  }

  const handleUnfollow = async () => {
    try {
      await toast.promise(
        (async()=> {
          const response = api.put('/unfollow-user', {
            followId: profile._id,
            role: userData.role
          }, {
            headers: { Authorization: `Bearer ${jwtToken}` }
          });
          return response.data;
        })(),
        {
          loading: 'Unfollowing...',
          success: async (data) => {
            await fetchUser();
            return data?.message || 'Unfollowed successfully!'
          },
          error: (err) =>{
            return err.response?.data?.message || 'Failed to unfollow'
            }
          }
      )
    } catch (err) {
      console.error('Unfollow error:', err)
      toast.error(err.message)
    }
  }

  const handleDeleteSnippet = async (snippetId) => {
    const loadId = toast.loading('Deleting snippet...');
    
    try {
          const response = await api.delete(`/delete-snippet/${snippetId}`, {
            headers: { Authorization: `Bearer ${jwtToken}` }
          });
          await fetchSnippets();
          toast.success(response.data?.message || 'Snippet deleted successfully!', {id: loadId}); 

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Failed to delete snippet', {id: loadId})
    }
  }

  async function handleCopy(content) {
    try {
      await navigator.clipboard.writeText(content);
      toast("Copied!!", {
        description: "Copied to clipboard"
      });
    } catch (err) {
      toast("Error!!", {
        description: "Failed to copy to clipboard"
      });
    }
  }


  useEffect(() => {
    fetchProfile()
    fetchSnippets()
    if (isOwner) {
      fetchTransactions()
      fetchEarningSummary()
      fetchBookmarks()
    }
  }, [userId])

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















const DevRanks = [
  { title: "Cadet", threshold: 0, level: 1, multiplier: 1.0 },
  { title: "Contributor", threshold: 600, level: 2, multiplier: 1.05 },
  { title: "Builder", threshold: 1400, level: 3, multiplier: 1.10 },
  { title: "Explorer", threshold: 2800, level: 4, multiplier: 1.15 },
  { title: "Innovator", threshold: 5000, level: 5, multiplier: 1.20 },
  { title: "Strategist", threshold: 7500, level: 6, multiplier: 1.25 },
  { title: "Architect", threshold: 10500, level: 7, multiplier: 1.30 },
  { title: "Mentor", threshold: 14000, level: 8, multiplier: 1.35 },
  { title: "Visionary", threshold: 19000, level: 9, multiplier: 1.40 },
  { title: "Icon", threshold: 25000, level: 10, multiplier: 1.50 },
];

const getDevRankWithNext = (xp) => {
  let currentRank = DevRanks[0];
  let nextRank = null;

  for (let i = 1; i < DevRanks.length; i++) {
    if (xp >= DevRanks[i].threshold) {
      currentRank = DevRanks[i];
    } else {
      nextRank = DevRanks[i];
      break;
    }
  }

  return { devRank: currentRank, nextRank };
};

const getRankGradient = (title) => { 
  switch (title) { 
    case "Cadet": 
      return "from-gray-800 via-gray-700 to-slate-600 border-gray-500 hover:border-gray-400 shadow-gray-400/50 bg-gradient-to-br"; 
    case "Contributor": 
      return "from-emerald-600 via-teal-500 to-cyan-400 border-teal-400 hover:border-cyan-300 shadow-cyan-400/60 bg-gradient-to-br"; 
    case "Builder": 
      return "from-blue-600 via-indigo-500 to-purple-400 border-indigo-400 hover:border-purple-300 shadow-purple-400/60 bg-gradient-to-br"; 
    case "Explorer": 
      return "from-violet-600 via-purple-500 to-fuchsia-400 border-purple-400 hover:border-fuchsia-300 shadow-fuchsia-400/60 bg-gradient-to-br"; 
    case "Innovator": 
      return "from-fuchsia-600 via-pink-500 to-rose-400 border-pink-400 hover:border-rose-300 shadow-rose-400/70 bg-gradient-to-br"; 
    case "Strategist": 
      return "from-orange-600 via-amber-500 to-yellow-400 border-amber-400 hover:border-yellow-300 shadow-yellow-400/70 bg-gradient-to-br"; 
    case "Architect": 
      return "from-red-600 via-orange-500 to-amber-400 border-primary hover:border-amber-300 shadow-amber-400/80 bg-gradient-to-br"; 
    case "Mentor": 
      return "from-indigo-600 via-blue-500 to-cyan-300 border-blue-400 hover:border-cyan-200 shadow-cyan-300/80 bg-gradient-to-br"; 
    case "Visionary": 
      return "from-purple-700 via-fuchsia-600 to-pink-400 border-fuchsia-500 hover:border-pink-300 shadow-pink-400/90 bg-gradient-to-br"; 
    case "Icon": 
      return "from-yellow-500 via-primary to-red-400 border-primary hover:border-yellow-300 shadow-primary/100 shadow-2xl bg-gradient-to-br animate-bounce"; 
    default: 
      return "from-gray-800 via-gray-700 to-slate-600 border-gray-500 hover:border-gray-400 shadow-gray-400/50 bg-gradient-to-br"; 
  } 
};


const xp = profile && (profile.xp || 0);
const { devRank, nextRank } = getDevRankWithNext(xp);
const gradientClasses = getRankGradient(devRank.title);
const streakCount = profile?.streak?.count || 0;




















  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left Sidebar */}
        <div className="md:w-1/3 space-y-4">
          <Card className="bg-transparent hover:border-gray-600 transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar?.url || "/default_avatar.png"} className="object-cover" />
                  <AvatarFallback>
                    {profile.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className='flex gap-x-2 items-center justify-center'>
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    {isOwner && (
                      <Link href={`/account/settings`} className='text-muted-foreground hover:text-primary'>
                        <SquarePen className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                  <p className="text-muted-foreground">@{profile.userName}</p>
                  {profile.walletAddress && (
                    <div className=''>
                      <p className="text-sm font-mono mt-1 bg-muted px-2 py-1 rounded flex items-center justify-center gap-x-2">
                        {profile.walletAddress.slice(0, 6)}...{profile.walletAddress.slice(-4)}
                        <span className=' cursor-pointer'><Copy onClick={() => handleCopy(profile.walletAddress)} size={15}/></span>
                      </p>
                    </div>
                  )}
                  <div className='flex items-center justify-center gap-x-2 my-5'>
                    {
                      profile.socialLinks.map((social,i)=> {
                        if (social.platform === 'Twitter') {
                          return <Link href={social?.link || "#"} key={i} className=' rounded-full border border-muted-foreground p-3 hover:border-primary hover:text-primary transition-colors duration-150'>
                              <Twitter size={18}/>
                            </Link>
                        }
                        if (social.platform === 'Github') {
                          return <Link href={social?.link || "#"} key={i} className=' rounded-full border border-muted-foreground p-3 hover:border-primary hover:text-primary transition-colors duration-150'>
                              <Github size={18}/>
                            </Link>
                        }
                      })
                    }
                  </div>
                </div>

                {!isOwner && (
                  <Button 
                    variant={isFollowing ? "outline" : "default"} 
                    className="w-full"
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          







          {/* Streak Section */}
          <Card className="bg-black/40 hover:border-amber-500/50 transition-all duration-300 ">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-center gap-3 text-white">
                <div className="relative">
                  <Flame className="h-8 w-8 text-amber-500 animate-pulse drop-shadow-lg" />
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse"></div>
                </div>
                <span className="text-lg font-bold tracking-wide">Daily Engagement Streak</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <div className="relative flex flex-col items-center">
                {/* Main flame icon - largest */}
                <div className="relative mb-4">
                  <Flame className="h-20 w-20 text-amber-500 drop-shadow-2xl animate-bounce" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute inset-2 bg-amber-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                {/* Streak count */}
                <div className="mb-3">
                  <p className="text-5xl font-black text-white mb-1">
                    {streakCount}
                  </p>
                  <p className="text-white font-semibold text-sm tracking-wider uppercase">
                    {streakCount === 1 ? 'Day' : 'Days'}
                  </p>
                </div>
                
                {/* Motivational text */}
                <div className="text-center">
                  {streakCount === 0 ? (
                    <p className="text-gray-400 text-sm">
                      Start your coding journey today! 🚀
                    </p>
                  ) : streakCount < 7 ? (
                    <p className="text-amber-200 text-sm">
                      Keep the fire burning! 🔥
                    </p>
                  ) : streakCount < 30 ? (
                    <p className="text-amber-200 text-sm">
                      You're on fire! 🌟
                    </p>
                  ) : (
                    <p className="text-white text-sm font-semibold">
                      Legendary streak! 👑
                    </p>
                  )}
                </div>
                
                {/* Decorative flames */}
                <div className="absolute -top-2 -left-2">
                  <Flame className="h-4 w-4 text-amber-400 opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Flame className="h-4 w-4 text-amber-500 opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }} />
                </div>
                <div className="absolute -bottom-2 left-1/4">
                  <Flame className="h-3 w-3 text-amber-500 opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
                <div className="absolute -bottom-2 right-1/4">
                  <Flame className="h-3 w-3 text-amber-400 opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </CardContent>
          </Card>














          {/* XP Display */}
          <Card className={`bg-gradient-to-br ${gradientClasses} transition-all duration-300 border-2`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-white font-semibold tracking-tight">
                  Developer XP
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white/90">{devRank.title}</span>
                  <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-white">
                  {/* {xp.toFixed(2)} */}
                </p>
                <p className="text-sm text-white/80 mt-2">
                  Level {devRank.level}
                </p>
                {nextRank && (
                  <div className="w-full bg-gray-800/50 rounded-full h-2.5 mt-3">
                    <div 
                      className="bg-white/90 h-2.5 rounded-full" 
                      style={{ 
                        width: `${((xp - devRank.threshold) / (nextRank.threshold - devRank.threshold)) * 100}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>









          {/* Achievements Section */}  
          <Card className="bg-transparent hover:border-gray-600 transition-colors duration-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                </div>
                <Link href={`/profile/${profile._id}/achievements`} className='underline text-sm text-muted-foreground hover:text-primary transition-colors duration-150'>
                  View all
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.achievements?.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {profile.achievements.slice(0, 4).map((achievement) => {
                    return (
                      <div
                        key={achievement.key}
                        className={`p-3 rounded-lg border border-opacity-20 hover:border-opacity-40 transition-all duration-200 cursor-pointer group`}
                        title={achievement.description}
                      >
                        <div className="flex flex-col items-center text-center space-y-1">
                          <div className="text-4xl mb-2">{achievement?.title.split(' ')[0]}</div>
                          <p className="text-xs font-medium line-clamp-1">{achievement.title.slice(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No achievements yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Keep creating to unlock badges!</p>
                </div>
              )}
            </CardContent>
          </Card>












          {/* Bookmarks Section */}
          {isOwner && (
            <Card className="bg-transparent hover:border-gray-600 transition-colors duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Bookmarks</span>
                  <Link href={`/profile/${profile._id}/bookmark`} className='underline text-sm text-muted-foreground hover:text-primary transition-colors duration-150'>View all</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookmarks?.length > 0 ? (
                  <div className="space-y-2">
                    {bookmarks.slice(0, 3).map((bookmark, i) => (
                      <Link 
                        key={i} 
                        href={`/snippet/${bookmark?.entity?._id}`}
                        className="block p-2 hover:bg-muted rounded transition-colors"
                      >
                        <p className="font-medium line-clamp-1">{bookmark?.entity?.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {bookmark?.entity?.description}
                        </p>
                      </Link>
                    ))}
                    {userData?.bookmarks?.length > 3 && (
                      <Link 
                        href="/account/bookmarks" 
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        View all ({userData.bookmarks.length})
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-2">No bookmarks yet</p>
                    <Link href="/feed/snippets" className="text-sm text-primary hover:underline">
                      Explore snippets
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-transparent hover:border-gray-600 transition-colors duration-200">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm" style={{ whiteSpace: 'pre-line' }}>{profile.about || 'No description available'}</p>
            </CardContent>
          </Card>

          <Card className="bg-transparent hover:border-gray-600 transition-colors duration-200">
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.followers?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.following?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{snippets?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Snippets</p>
              </div>
              {isOwner && (
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {earned.reduce((sum, tx) => sum + tx.amount, 0).toFixed(3)}
                  </p>
                  <p className="text-sm text-muted-foreground">Earned (SOL)</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:w-2/3 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="snippets">Snippets</TabsTrigger>
              <TabsTrigger value="activity" disabled={!isOwner}>
                {isOwner ? 'Transactions' : 'Public Activity'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="snippets">
              {snippets?.length > 0 ? (
                <div className="space-y-4">
                  {snippets.map(snippet => (
                    <Card key={snippet._id} className="hover:border-primary transition-colors group">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <Link href={`/snippet/${snippet.slug}`} className="hover:underline">
                            <CardTitle>{snippet.title}</CardTitle>
                          </Link>
                          {isOwner && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={`/edit-snippet/${snippet._id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <SquarePen className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteSnippet(snippet._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {snippet.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm">
                            <ArrowBigUp className="mr-2 h-4 w-4" />
                            {snippet.upvotes?.length || 0}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {snippet.commentNo || 0}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="mr-2 h-4 w-4" />
                            {snippet.bookmarks?.length || 0}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No snippets yet
                    {isOwner && (
                      <Link href="/snippet-editor" className="block mt-2 text-primary hover:underline">
                        Create your first snippet
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity">
              {isOwner ? (
                <>
                  <Card className="mb-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Transaction History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {transactions.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>From</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Link</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transactions.map((tx) => (
                              <TableRow key={tx._id} className={tx.receiver === userData.walletAddress ? 'border-l-2 border-l-primary' : 'border-l-2 border-l-muted-foreground/20'}>
                                <TableCell>
                                  {format(new Date(tx.createdAt), 'MMM d, yyyy')}
                                </TableCell>
                                <TableCell>{tx.amount} SOL</TableCell>
                                <TableCell className="font-mono text-sm">
                                  {tx.sender.slice(0, 4)}...{tx.sender.slice(-4)}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      tx.status === 'failed' 
                                        ? 'destructive'
                                        : tx.receiver === userData.walletAddress
                                          ? 'received'
                                          : tx.status === 'confirmed'
                                            ? 'success'
                                            : 'warning'
                                    }
                                  >
                                    {tx.receiver === userData.walletAddress && tx.status === 'confirmed'
                                      ? 'received'
                                      : tx.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <a 
                                    href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                                  >
                                    View <ExternalLink className="h-3 w-3" />
                                  </a>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No transactions yet
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Earnings Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 border rounded-lg">
                        <p className="text-2xl font-bold">
                          {transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(3)} SOL
                        </p>
                        <p className="text-sm text-muted-foreground">Total Tips Given</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{earned.length}</p>
                        <p className="text-sm text-muted-foreground">Total Tips</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-2xl font-bold">
                          {earned.reduce((sum, tx) => sum + tx.amount, 0).toFixed(3)} SOL
                        </p>
                        <p className="text-sm text-muted-foreground">Total Earned</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    {profile.name}'s activity is private
                  </CardContent>
                </Card>
              )}
            </TabsContent>


          </Tabs>
        </div>
      </div>
    </div>
  )
}