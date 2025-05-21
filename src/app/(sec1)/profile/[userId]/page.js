"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowBigUp, ArrowBigDown, MessageCircle, Bookmark, SquarePen, DollarSign, ExternalLink } from 'lucide-react'
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
import Link from 'next/link';
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
  const { userId } = use(params)
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

  const handleFollow = async () => {
    try {
      await toast.promise(
        api.put('/follow-user', {
          followId: profile._id,
          role: userData.role
        }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        }),
        {
          loading: 'Following...',
          success: async () => {
            await fetchUser()
            return 'Followed successfully!'
          },
          error: (err) => err.response?.data?.message || 'Failed to follow'
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
        api.put('/unfollow-user', {
          followId: profile._id,
          role: userData.role
        }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        }),
        {
          loading: 'Unfollowing...',
          success: async () => {
            await fetchUser()
            return 'Unfollowed successfully!'
          },
          error: (err) => err.response?.data?.message || 'Failed to unfollow'
        }
      )
    } catch (err) {
      console.error('Unfollow error:', err)
      toast.error(err.message)
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchSnippets()
    if (isOwner) {
      fetchTransactions()
      fetchEarningSummary()
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
                  <AvatarImage src={profile.avatar?.url} className="object-cover" />
                  <AvatarFallback>
                    {profile.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className='flex gap-x-2 items-center justify-center'>
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    {isOwner && (
                      <Link href={`/account/profile`} className='text-muted-foreground hover:text-primary'>
                        <SquarePen className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                  <p className="text-muted-foreground">@{profile.userName}</p>
                  {profile.walletAddress && (
                    <p className="text-sm font-mono mt-1 bg-muted px-2 py-1 rounded">
                      {profile.walletAddress.slice(0, 6)}...{profile.walletAddress.slice(-4)}
                    </p>
                  )}
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

          <Card className="bg-transparent hover:border-gray-600 transition-colors duration-200">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{profile.about || 'No description available'}</p>
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
                {isOwner ? 'Activity' : 'Public Activity'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="snippets">
              {snippets?.length > 0 ? (
                <div className="space-y-4">
                  {snippets.map(snippet => (
                    <Card key={snippet._id} className="hover:border-primary transition-colors">
                      <CardHeader>
                        <Link href={`/snippet/${snippet._id}`} className="hover:underline">
                          <CardTitle>{snippet.title}</CardTitle>
                        </Link>
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
                              <TableRow key={tx._id}>
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
                                      tx.status === 'confirmed' ? 'success' : 
                                      tx.status === 'failed' ? 'destructive' : 'warning'
                                    }
                                  >
                                    {tx.status}
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