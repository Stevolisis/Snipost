"use client"
import React, { use, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GitFork, ArrowLeft, Code, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { fetchForksStart, fetchForksSuccess, fetchForksFailure } from '@/lib/redux/slices/fork'
import api from '@/utils/axiosConfig'
import { format } from 'date-fns'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link';

export default function SnippetForksPage({ params }) {
  const { snippetId } = use(params)
  const router = useRouter()
  const dispatch = useAppDispatch();
  const { forks, loading } = useAppSelector((state) => state.fork)

  useEffect(() => {
    const fetchForks = async () => {
      try {
        dispatch(fetchForksStart())
        const response = await api.get(`/get-forks/Snippet/${snippetId}`)
        dispatch(fetchForksSuccess(response.data.forks));
      } catch (error) {
        dispatch(fetchForksFailure(error.message))
        toast.error('Failed to fetch forks')
      }
    }
    fetchForks();
  }, [snippetId, dispatch]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-semibold flex items-center">
            <GitFork className="mr-2 h-5 w-5" />
            Forks
            <Badge variant="outline" className="ml-2">
              {forks.length}
            </Badge>
          </h1>
        </div>
        <Button 
          onClick={() => router.push(`/snippet/${snippetId}`)}
          variant="outline"
          size="sm"
        >
          <Code className="h-4 w-4 mr-1" />
          View Original
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ForkSkeleton key={i} />
          ))}
        </div>
      ) : forks.length > 0 ? (
        
          <div>
            {forks.map((fork, i) => (
              <Card className='mb-4' key={i}>
                <ForkCard fork={fork} />
              </Card>
            ))}
          </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <GitFork className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No forks yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Be the first to fork this snippet and create your own version.
            </p>
            <Button 
              onClick={() => router.push(`/snippet/${snippetId}`)}
              className='bg-[#A246FD] text-gray-900'
            >
              Back to Snippet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ForkCard({ fork }) {
  const router = useRouter();
  
  return (
    <div className="px-5 hover:bg-accent/50 transition-colors">
      <div className="flex items-center flex-wrap md:flex-unwrap gap-x-4">
        {/* Avatar column */}
        <Avatar className="h-10 w-10">
            <AvatarImage className='object-cover' src={fork?.forkedBy?.entity?.avatar?.url || "/api/placeholder/40/40"} alt={fork?.forkedBy?.entity?.name || 'User'} />
            <AvatarFallback>
            {(fork?.forkedBy?.entity?.name?.[0] || 'A')}
            </AvatarFallback>
        </Avatar> 
        
        {/* Main content column */}
        <div className="flex-1">
            <div className="flex items-center text-white">
                <Link href={`/profile/${fork?.forkedBy?.entity?._id}`} className="font-medium hover:underline hover:text-primary transition-colors duration-100 cursor-pointer">
                    {fork?.forkedBy?.entity?.name || 'Anonymous'}
                </Link>
                <span className="mx-1">•</span>
                <span className='text-muted-foreground text-sm'>Forked on {format(new Date(fork?.forkedAt), 'MMM d, yyyy')}</span>
            </div>
        </div>

        {/* Main Fork Btn */}
        <div className='flex justify-end w-full mt-1 md:block md:w-fit md:mt-0'>     
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/snippet/${fork?.content?.entity?._id}`);
                }}
              >
                <Code className="h-3.5 w-3.5 mr-1" />
                View Fork
              </Button>
        </div>
        
      </div>
    </div>
  )
}

function ForkSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex">
        <Skeleton className="h-10 w-10 rounded-full mr-4" />
        
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <div>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
          
          <Skeleton className="h-4 w-full max-w-md mb-3" />
          
          <div className="flex items-center">
            <Skeleton className="h-5 w-full mr-2" />
            <Skeleton className="h-4 w-full mr-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </Card>
  )
}