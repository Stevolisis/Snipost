"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowBigUp, ArrowBigDown, MessageCircle, Bookmark } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { updateUserData } from '@/lib/redux/slices/auth'
import { toast } from 'sonner'
import api from '@/utils/axiosConfig'
import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { loadSnippetsStart, loadSnippetsSuccess, snippetsFailure } from '@/lib/redux/slices/snippets'

export default function ProfilePage({ params }) {
  const { userId } = params
  const { userData, jwtToken } = useAppSelector((state) => state.auth)
  const { snippets } = useAppSelector((state) => state.snippets)
  const dispatch = useAppDispatch()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if current user is following this profile
  const isFollowing = userData?.following?.some(
    follow => follow.entity.toString() === profile?._id.toString()
  )

    const fetchProfile = async () => {
        try {
        const response = await api.get(`/get-user/${userId}`)
        setProfile(response.data.user)
        } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile')
        } finally {
        setLoading(false)
        }
    }


    const fetchUser = async()=>{
        try{
        const response = await api.get("/me",{
            headers:{
            Authorization:`Bearer ${jwtToken}`
            }
        });
            dispatch(updateUserData(response.data.user));
        }catch(err){
            toast.error(err.message);
        }
    };

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
                await fetchUser();
                return 'Followed successfully!'
            },
            error: (err) => err.response?.data?.message || 'Failed to follow'
            }
        )
        } catch (err) {
        console.error('Follow error:', err);
        toast.error(err.message);
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
                await fetchUser();
                return 'Unfollowed successfully!'
            },
            error: (err) => err.response?.data?.message || 'Failed to unfollow'
            }
        )
        } catch (err) {
        console.error('Unfollow error:', err);
        toast.error(err.message);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    useEffect(() => {
        const fetchTrendingSnippets = async () => {
        try {
            dispatch(loadSnippetsStart());
            const response = await api.get(`/get-user-snippets/${userId}?timeRange=month&limit=10`);
            const snippets = response.data.snippets || [];
            dispatch(loadSnippetsSuccess(snippets));
        } catch (err) {
            if (err.response?.status === 401) {
            // Handle unauthorized error
            dispatch(disconnectWallet());
            disconnect();
            toast("Uh oh! Something went wrong.", {
                description: "Connect your wallet"
            });
            return
            }
            dispatch(snippetsFailure(err.message || 'Failed to load snippets'));
        }
        };

        fetchTrendingSnippets();
    }, [dispatch, userData?._id]);

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
                <Image
                  src={profile.avatar?.url || '/default-avatar.png'}
                  alt={profile.name}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div className="text-center">
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">@{profile.userName}</p>
                </div>
                <div className="flex gap-2 w-full">
                  <Button 
                    variant={isFollowing ? "outline" : "default"} 
                    className="w-full"
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {profile.walletAddress?.slice(0, 6)}...{profile.walletAddress?.slice(-4)}
                </div>
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
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:w-2/3 space-y-4">
          <Card className="bg-transparent hover:border-gray-600 transition-colors duration-200">
            <CardHeader>
              <CardTitle>Snippets</CardTitle>
            </CardHeader>
            <CardContent>
              {snippets?.length > 0 ? (
                <div className="space-y-4">
                  {snippets.map(snippet => (
                    <Card key={snippet._id} className="hover:border-primary transition-colors">
                      <CardHeader>
                        <Link href={`/snippet/${snippet._id}`}>
                          <CardTitle className="hover:underline">{snippet.title}</CardTitle>
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
                <p className="text-muted-foreground">No snippets yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}