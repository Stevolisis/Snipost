"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/utils/axiosConfig';
import { ArrowBigDown, ArrowBigUp, Bookmark, CircleDollarSign, MessageCircle, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {
  loadTrendingSnippetsStart,
  loadTrendingSnippetsSuccess,
  snippetsFailure,
  upvoteSnippetSuccess,
  downvoteSnippetSuccess
} from '@/lib/redux/slices/snippets';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Tip } from '@/components/appComponents/Tip';

const SnippetsPage = () => {
  const dispatch = useAppDispatch();
  const { trendingSnippets = [], isLoading, error } = useAppSelector((state) => state.snippets);
  const { userData } = useAppSelector((state) => state.auth);
  const [localVotes, setLocalVotes] = useState({});

  useEffect(() => {
    const fetchTrendingSnippets = async () => {
      try {
        dispatch(loadTrendingSnippetsStart());
        const response = await api.get('/get-trending-snippets?timeRange=month&limit=10');
        const snippets = response.data.snippets || [];
        dispatch(loadTrendingSnippetsSuccess(snippets));
        
        // Initialize local votes state with proper fallbacks
        const initialVotes = {};
        snippets.forEach((snippet) => {
          const upvotes = snippet.upvotes || [];
          const downvotes = snippet.downvotes || [];
          
          initialVotes[snippet._id] = {
            upvoted: upvotes.some ? upvotes.some((v) => v.entity && v.entity._id === userData?._id) : false,
            downvoted: downvotes.some ? downvotes.some((v) => v.entity && v.entity._id === userData?._id) : false
          };
        });
        setLocalVotes(initialVotes);
      } catch (err) {
        dispatch(snippetsFailure(err.message || 'Failed to load snippets'));
      }
    };

    fetchTrendingSnippets();
  }, [dispatch, userData?._id]);

  const handleVote = async (snippetId, action) => {
    if (!userData) {
      toast.error('Please login to vote');
      return;
    }

    const snippet = trendingSnippets.find(s => s._id === snippetId);
    if (!snippet) return;

    // Save current state for potential rollback
    const previousVotes = {...localVotes};
    const previousSnippetState = {...snippet};

    try {
      // Optimistic update
      const newLocalVotes = {...localVotes};
      const isUpvoted = newLocalVotes[snippetId]?.upvoted || false;
      const isDownvoted = newLocalVotes[snippetId]?.downvoted || false;

      if (action === 'upvote') {
        newLocalVotes[snippetId] = {
          upvoted: !isUpvoted,
          downvoted: false
        };
      } else {
        newLocalVotes[snippetId] = {
          upvoted: false,
          downvoted: !isDownvoted
        };
      }
      setLocalVotes(newLocalVotes);

      // Dispatch optimistic Redux update
      if (action === 'upvote') {
        dispatch(upvoteSnippetSuccess({ 
          snippetId, 
          userId: userData._id,
          isUpvoting: !isUpvoted
        }));
      } else {
        dispatch(downvoteSnippetSuccess({ 
          snippetId, 
          userId: userData._id,
          isDownvoting: !isDownvoted
        }));
      }

      // Make API call
      await api.patch(`/snippets/${snippetId}/vote`, { action });

    } catch (err) {
      // Revert on error
      setLocalVotes(previousVotes);
      toast.error(`Failed to ${action} snippet`);
      
      // Dispatch action to revert Redux state
      if (action === 'upvote') {
        dispatch(upvoteSnippetSuccess({ 
          snippetId, 
          userId: userData._id,
          isUpvoting: previousVotes[snippetId]?.upvoted || false
        }));
      } else {
        dispatch(downvoteSnippetSuccess({ 
          snippetId, 
          userId: userData._id,
          isDownvoting: previousVotes[snippetId]?.downvoted || false
        }));
      }
    }
  };

  const getVoteCounts = (snippetId) => {
    const snippet = trendingSnippets.find(s => s._id === snippetId);
    if (!snippet) return { upvotes: 0, downvotes: 0 };

    const upvotes = snippet.upvotes || [];
    const downvotes = snippet.downvotes || [];
    const localVote = localVotes[snippetId] || { upvoted: false, downvoted: false };
    
    let upvoteCount = snippet.upvoteCount || 0;
    let downvoteCount = snippet.downvoteCount || 0;

    if (localVote.upvoted !== (upvotes.some && upvotes.some(v => v.entity && v.entity._id === userData?._id))) {
      upvoteCount += localVote.upvoted ? 1 : -1;
    }

    if (localVote.downvoted !== (downvotes.some && downvotes.some(v => v.entity && v.entity._id === userData?._id))) {
      downvoteCount += localVote.downvoted ? 1 : -1;
    }

    return { upvotes: upvoteCount, downvotes: downvoteCount };
  };

  if (isLoading && trendingSnippets.length === 0) {
    return (
      <div className="w-full px-4 py-4">
        <p>Loading snippets...</p>
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
        {trendingSnippets.map((snippet) => {
          const { upvotes, downvotes } = getVoteCounts(snippet._id);
          const isUpvoted = localVotes[snippet._id]?.upvoted ?? false;
          const isDownvoted = localVotes[snippet._id]?.downvoted ?? false;

          return (
            <Card key={snippet._id} className="w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Image
                    src={snippet.user?.avatar?.url || '/default-avatar.png'}
                    alt={snippet.user?.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full min-h-[25px] aspect-square object-cover"
                  />
                  <div>
                    <Link href={`/profile/${snippet.user?._id}`} className="text-sm font-semibold text-foreground hover:underline">
                      <CardTitle className="text-sm text-gray-400 line-clamp-2 hover:underline">
                        {snippet.user?.name || 'Unknown User'}
                      </CardTitle>
                    </Link>
                  </div>
                </div>
                
                <div className='-mb-6 py-3'>
                  <Link href={`/snippet/${snippet._id}`} className="text-2xl line-clamp-2 text-foreground 
                    font-bold hover:underline hover:underline-primary hover:text-primary transition-colors duration-150">
                    {snippet.title || 'Untitled Snippet'}
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {snippet.description || 'No description available'}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {(snippet.tags || []).map((tag, i) => (
                    <Button variant="outline" size={"sm"} key={i} className='text-xs text-muted-foreground'>#{tag}</Button>
                  ))}
                </div>

                <div className='pt-4'>
                  {snippet.codeBlocks?.[0]?.content ? (
                    <SyntaxHighlighter
                      language={(snippet.codeBlocks[0].language || 'javascript').toLowerCase()}
                      style={atomDark}
                      customStyle={{
                        margin: 0,
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        background: '#1e1e1e',
                        maxHeight: '350px',
                        overflowX: 'scroll',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#4b5563 transparent'
                      }}
                      showLineNumbers={true}
                    >
                      {snippet.codeBlocks[0].content.substring(0, 400) + (snippet.codeBlocks[0].content.length > 400 ? '...' : '')}
                    </SyntaxHighlighter>
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                      No code available
                    </div>
                  )}
                </div>

                <div className='flex gap-x-2 items-center justify-between pt-3'>
                  <div className='flex gap-x-2 items-center'>
                    <div className='flex items-center gap-x-2 mr-3'>
                      <Button 
                        variant={isUpvoted ? "default" : "outline"} 
                        size={'sm'}
                        onClick={() => handleVote(snippet._id, 'upvote')}
                        disabled={isLoading}
                      > 
                        <ArrowBigUp className={isUpvoted ? "text-white" : ""}/> 
                        <p className={isUpvoted ? "text-white" : ""}>{upvotes}</p>
                      </Button>
                      
                      <Button 
                        variant={isDownvoted ? "destructive" : "outline"} 
                        size={'sm'}
                        onClick={() => handleVote(snippet._id, 'downvote')}
                        disabled={isLoading}
                      > 
                        <ArrowBigDown className={isDownvoted ? "text-white" : ""}/> 
                        <p className={isDownvoted ? "text-white" : ""}>{downvotes}</p>
                      </Button>
                    </div>

                    <div>
                      <Button variant={"outline"}> 
                        <MessageCircle/> 
                        <p>{snippet.commentNo || 0}</p>
                      </Button>
                    </div>

                    <div>
                      <Button variant={"outline"}> 
                        <Bookmark/> 
                        <p>{(snippet.bookmarkedBy || []).length}</p>
                      </Button>
                    </div>
                  </div>

                  <div>
                    {/* <Button variant={"link"}> <CircleDollarSign/> </Button> */}
                    <Tip walletAddress={snippet.user.walletAddress} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  )
}

export default SnippetsPage;