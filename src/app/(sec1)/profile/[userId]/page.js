"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowBigUp, ArrowBigDown, MessageCircle, Bookmark, SquarePen, DollarSign, ExternalLink, Trash2, Copy, Twitter, Github } from 'lucide-react'
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
  const { userData, jwtToken } = useAppSelector((state) => state.auth)
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
            console.log(data);
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
    try {
      await toast.promise(
        (async() => {  
          const response = api.delete(`/delete-snippet/${snippetId}`, {
            headers: { Authorization: `Bearer ${jwtToken}` }
          });
          return response.data;
        })(),
        {
          loading: 'Deleting snippet...',
          success: (data) => {
            console.log("pppppppp: ", data);
            fetchSnippets()
            return data?.message || 'Snippet deleted successfully!'
          },
          error: (err) => {
            console.log(err);
            return err.response?.data?.message || 'Failed to delete snippet'
          }
        }
      )
    } catch (err) {
      console.error('Delete error:', err)
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
                          return <Link href={social.link} key={i} className=' rounded-full border border-muted-foreground p-3 hover:border-primary hover:text-primary transition-colors duration-150'>
                              <Twitter size={18}/>
                            </Link>
                        }
                        if (social.platform === 'Github') {
                          return <Link href={social.link} key={i} className=' rounded-full border border-muted-foreground p-3 hover:border-primary hover:text-primary transition-colors duration-150'>
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

          {/* XP Display */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Developer XP
                </span>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {profile.xp || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Level {Math.floor((profile.xp || 0) / 1000) + 1}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${((profile.xp || 0) % 1000) / 10}%` }}
                  ></div>
                </div>
              </div>
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
                          <Link href={`/snippet/${snippet._id}`} className="hover:underline">
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