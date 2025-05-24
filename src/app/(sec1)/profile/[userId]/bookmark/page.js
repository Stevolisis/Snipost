"use client"
import api from '@/utils/axiosConfig';
import React, { useEffect } from 'react'
import {
  snippetsFailure,
  loadSnippetsStart,
  loadSnippetsSuccess,
  bookmarkSnippetApiSuccess,
  bookmarkSnippetSuccess
} from '@/lib/redux/slices/snippets';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, FileText, GitFork, UserPen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const page = () => {
    const dispatch = useAppDispatch();
    const { snippets = [], isLoading, error } = useAppSelector((state) => state.snippets);
    const { userData, jwtToken } = useAppSelector((state) => state.auth);

    const fetchBookmark = async () => {
      try {
        dispatch(loadSnippetsStart());
        const response = await api.get('/get-bookmark',{
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          });
        const bookmarks = response.data.bookmarks || [];
        dispatch(loadSnippetsSuccess(bookmarks));
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
        dispatch(snippetsFailure(err.message || 'Failed to load bookmark'));
      }
    };
  useEffect(() => {


    fetchBookmark();
  }, [dispatch, userData?._id]);

    const handleBookmark = async (entityId, entityType, hasBookmark) => {
        if (!userData) {
            return toast.error("Connect wallet first");
        }

        // 1. Optimistic update
        dispatch(bookmarkSnippetSuccess({ 
            snippetId: entityId, 
            userId: userData._id 
        }));

        try {
            // 2. API call
            let response;
            if(hasBookmark){
                response = await api.put("/unbookmark", { entityId, entityType },{
                    headers:{
                        Authorization: `Bearer ${jwtToken}`
                    }
                });
            }else{
                response = await api.put("/bookmark", { entityId, entityType },{
                    headers:{
                        Authorization: `Bearer ${jwtToken}`
                    }
                });
            }
            toast.success(response.data.message);

            // 3. Optional: Final sync with backend data
            dispatch(bookmarkSnippetApiSuccess(response.data.snippet));
            fetchBookmark();
            
        } catch (err) {
            console.log(err)
            toast.error("Bookmark failed");
            // Note: Automatic rollback isn't needed since we'll refetch snippets later
        }
    };

    if (isLoading && snippets.length === 0) {
        return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-4 py-4'>
            <Skeleton className="h-[460px] w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200" />
            <Skeleton className="h-[460px] w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200" />

            <Skeleton className="h-[460px] w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200" />
            <Skeleton className="h-[460px] w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200" />
        </div>
        );
    }

  if (error) {
    return (
      <div className="w-full px-4 py-4">
        <p>Error loading snippets: {error}</p>
      </div>
    );
  }


  return (
    <div className="w-full px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {snippets.map((snippet, i) => {
            const hasBookmark = snippet.entity?.bookmarkedBy?.some(v => v.entity === userData?._id);

            return snippet.entity && <Card key={i} className="w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200">
                <CardHeader>
                
                <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-2">
                        <Image
                            src={(snippet?.entity?.user?.entity?.avatar?.url) || '/logo.svg'}
                            alt={(snippet?.entity?.user?.entity?.name) || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full min-h-[25px] aspect-square object-cover"
                        />
                        <div>
                        <Link href={`/profile/${snippet?.entity?.user?.entity?._id}`} className="text-sm font-semibold text-foreground hover:underline">
                            <CardTitle className="text-sm text-gray-400 line-clamp-2 hover:underline">
                            {(snippet?.entity?.user?.entity?.name) || 'Unknown User'}
                            </CardTitle>
                        </Link>
                        </div>

                    </div>
                    
                    <div>
                        <Button 
                            variant={"outline"}
                            onClick={() => handleBookmark(snippet?.entity?._id, "Snippet", hasBookmark)}
                            className={`gap-1
                                ${hasBookmark ? "border-white!" : "border-white"}
                                hover:bg-accent/50  // Subtle hover
                            `}
                        > 
                        <Bookmark
                            className={hasBookmark ? "fill-white text-white!" : "fill-transparent"} 
                        /> 
                        </Button>
                    </div>
                </div>
                
                <div className='-mb-6 py-3'>
                    <Link href={`/snippet/${snippet?.entity?._id}`} className="text-2xl line-clamp-2 text-foreground 
                    font-bold hover:underline hover:underline-primary hover:text-primary transition-colors duration-150">
                    {snippet?.entity?.title || 'Untitled Snippet'}
                    </Link>
                </div>
                </CardHeader>

                <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {snippet?.entity?.description || 'No description available'}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                    {(snippet?.entity?.tags || []).map((tag, i) => (
                    <Button variant="outline" size={"sm"} key={i} className='text-xs text-muted-foreground'>#{tag}</Button>
                    ))}
                </div>
                </CardContent>
            </Card>
        })}
      </div>
    </div>
  )
}

export default page;