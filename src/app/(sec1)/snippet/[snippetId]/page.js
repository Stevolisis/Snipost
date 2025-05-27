"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowBigDown, ArrowBigUp, GitFork, Bookmark, CircleDollarSign, MessageCircle, FileText, UserPen } from 'lucide-react';
import React, { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { CodeLanguage } from '@/components/appComponents/CodeLanguage';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import CommentBox from '@/components/appComponents/CommentBox';
import Comment from '@/components/appComponents/Comment';
import api from '@/utils/axiosConfig';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => {
    return mod.Prism;
  }),
  {
    ssr: false,
    loading: () => (
      <pre className="p-4 rounded-md overflow-x-auto">
        Loading code snippet...
      </pre>
    )
  }
);
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { disconnectWallet, updateUserData } from '@/lib/redux/slices/auth';
import { Tip } from '@/components/appComponents/Tip';
import { bookmarkSnippetApiSuccess, bookmarkSnippetSuccess, downvoteSnippetApiSuccess, downvoteSnippetSuccess, loadSnippetStart, loadSnippetSuccess, snippetsFailure, upvoteSnippetApiSuccess, upvoteSnippetSuccess } from '@/lib/redux/slices/snippets';
import { loadCommentsSuccess, loadCommentsStart, commentsFailure } from '@/lib/redux/slices/comments';
import { Skeleton } from '@/components/ui/skeleton';
import { Fork } from '@/components/appComponents/Fork';
import { useRouter } from 'next/navigation';


const Page = ({params}) => {
  const { snippetId } = use(params);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [copiedBlocks, setCopiedBlocks] = useState({});
  const { userData, jwtToken, disconnect } = useAppSelector((state) => state.auth)
  const { snippet, isLoading } = useAppSelector((state) => state.snippets);
  const commentState = useAppSelector((state) => state.comments);
  const dispatch = useAppDispatch();
  const geeksForGeeksRef = useRef(null);
  const targetUser = snippet?.user;
  const hasUpvoted = snippet?.upvotes?.some(v => (v.entity?._id || v.entity ) === userData?._id);
  const hasDownvoted = snippet?.downvotes?.some(v => (v.entity?._id || v.entity ) === userData?._id);
  const hasBookmark = snippet?.bookmarkedBy?.some(v => (v.entity?._id || v.entity ) === userData?._id);
  const hasForked = snippet?.forks?.some(v => (v.forkedBy.entity || v.forkedBy.entity?._id) === userData?._id);

  // Check if current user is already following the target user
  const isFollowing = userData?.following?.some(
    follow => follow.entity === targetUser?._id
  );
  
  const fetchUser = async()=>{
    try{
      const response = await api.get("/me",{
        headers:{
          Authorization:`Bearer ${jwtToken}`
        }
      });
      dispatch(updateUserData(response.data.user));
    }catch(err){
    }
  };

  const handleFollow = async () => {
    if (!jwtToken) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await toast.promise(
        (async()=>{

          const response = api.put('/follow-user', {
            followId: targetUser._id,
            role: userData.role
          }, {
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          });
          return (await response).data;

        })(),
        {
          loading: 'Following user...',
          success: async(data) => {
            await fetchUser();
            return data?.message || 'Followed successfully!';
          },
          error: (err) => {
            return err.response?.data?.message || 'Failed to follow user';
          }
        }
      );
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleUnfollow = async () => {
    if (!jwtToken) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await toast.promise(
       (async()=> {   
          const response = api.put('/unfollow-user', {
            followId: targetUser._id,
            role: targetUser.role
          }, {
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          });
          return response.data;
        })(),
        {
          loading: 'Unfollowing user...',
          success: async(data) => {
            await fetchUser();
            return data?.message || 'Unfollowed successfully!';
          },
          error: (err) => {
            return err.response?.data?.message || 'Failed to unfollow user';
          }
        }
      );
    } catch (err) {
      console.error('Unfollow error:', err);
    }
  };

  const handleVote = async (type, id) => {
      if (!userData) {
          toast.error("Please connect your wallet first");
          return;
      }

      // Optimistic UI update
      if (type === 'upvote') {
          dispatch(upvoteSnippetSuccess({ 
              snippetId: id, 
              userId: userData._id,
          }));
      } else {
          dispatch(downvoteSnippetSuccess({
              snippetId: id,
              userId: userData._id, 
          }));
      }

      try {
          const response = await api.put(`/${type}-snippet/${id}`, {}, {
              headers: {
                  Authorization: `Bearer ${jwtToken}`
              }
          });

          console.log("Api: ", response);

          type === "upvote" ? dispatch(upvoteSnippetApiSuccess(response.data.snippet)) 
          : dispatch(downvoteSnippetApiSuccess(response.data.snippet))
          
      // The actual state will be updated when we refetch the snippets
      } catch (err) {
          console.error(`${type} error:`, err);
          toast.error(`Failed to ${type}`);
      }
  };


  const handleBookmark = async (entityId, entityType) => {
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
        
        // 3. Optional: Final sync with backend data
        dispatch(bookmarkSnippetApiSuccess(response.data.snippet));
        
    } catch (err) {
        toast.error("Bookmark failed");
        // Note: Automatic rollback isn't needed since we'll refetch snippets later
    }
  };
    
  useEffect(() => {
    // Check hash after component mounts
    if (window.location.hash === '#comment') {
      if (geeksForGeeksRef.current) {
        geeksForGeeksRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });


  useEffect(() => {
    const fetchSnippetData = async () => {
      try {
        dispatch(loadSnippetStart());
        const response = await api.get(`/get-snippet/${snippetId}`,{
          headers:{
            Authorization: `Bearer ${jwtToken}`
          }
        });
        dispatch(loadSnippetSuccess(response.data.snippet));
      } catch (err) {
        if (err.response?.status === 401) {
          // Handle unauthorized error
          dispatch(disconnectWallet());
          disconnect();
          toast("Uh oh! Something went wrong.", {
            description: "Connect your wallet"
          })
        }
        toast.error("Something went wrong. Try again");
      } finally {
        dispatch(snippetsFailure());
      }
    };


    const fetchSnippetCommentData = async () => {
      try {
        dispatch(loadCommentsStart());
        const response = await api.get(`get-comments?contentId=${snippetId}&contentType=Snippet`,{
          headers:{
            Authorization: `Bearer ${jwtToken}`
          }
        });
        dispatch(loadCommentsSuccess(response.data.comments || []))
      } catch (err) {
        dispatch(commentsFailure());
        if (err.response?.status === 401) {
          // Handle unauthorized error
          dispatch(disconnectWallet());
          disconnect();
          toast("Uh oh! Something went wrong.", {
            description: "Connect your wallet"
          })
        }
        toast.error("Something went wrong. Try again");
      }
    };

    fetchSnippetData();
    fetchSnippetCommentData();
  }, [snippetId, dispatch]);

  async function handleCopy(content, blockId) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedBlocks(prev => ({ ...prev, [blockId]: true }));
      
      toast("Copied!!", {
        description: "Copied to clipboard"
      });

      setTimeout(() => {
        setCopiedBlocks(prev => ({ ...prev, [blockId]: false }));
      }, 1000);
    } catch (err) {
      toast("Error!!", {
        description: "Failed to copy to clipboard"
      });
    }
  }

  if (isLoading) {
    return (
      <div className='px-5 flex flex-col md:flex-row gap-5'>
        <div className='flex-grow md:flex-[2]'>
          <Skeleton className="h-[620px] w-full" />
        </div>
        <div className='md:flex-[1] md:max-w-[400px] flex flex-col gap-y-3'>
          <Skeleton className="h-[380px] w-full"/>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="w-full px-4 py-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      {
        snippet && 
        <div className='px-5 flex flex-col md:flex-row gap-5'>
          <div className='flex-grow md:flex-[2]'>
            <Card className="w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
              <CardHeader>
                <div className='-mb-8 py-3'>
                  <h1 className="text-3xl text-foreground font-bold">
                    {snippet.title}
                  </h1>
                </div>
              </CardHeader>

              <CardContent>
                { snippet?.isFork && 
                  <div className='flex items-center gap-x-2 mb-2'>
                    <GitFork size={12} /><span className='text-xs'>forked from</span>
                    <Link href={`/snippet/${snippet?.originalContent.entity}`} className='hover:text-[#A246FD]'>
                      <FileText size={18} />
                    </Link>
                    <Link href={`/profile/${snippet?.originalAuthor.entity}`} className='hover:text-[#A246FD]'>
                      <UserPen size={18} />
                    </Link>
                    
                  </div>
                }

                <div style={{ whiteSpace: 'pre-line' }}>
                  {snippet.description}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {snippet.tags.map((tag, i) => (
                    <Button variant="outline" size={"sm"} key={i} className='text-xs text-muted-foreground'>#{tag}</Button>
                  ))}
                </div>

                <div className='flex gap-x-2 items-center justify-between pt-5'>
                  <div className='flex gap-x-2 items-center'>
                    <div className='flex items-center gap-x-2'>
                      <Button
                        variant="outline"
                        onClick={() => handleVote('upvote', snippet._id)}
                        disabled={isLoading}
                        className={`
                            gap-1
                            ${hasUpvoted ? "border-green-500!" : "border-green-500"}
                            hover:bg-accent/50  // Subtle hover
                        `}
                      >
                        <ArrowBigUp 
                            className={hasUpvoted ? "fill-green-500 text-green-500!" : "fill-transparent"} 
                        />
                        <span className={hasUpvoted ? "text-green-500" : ""}>
                            {snippet.upvoteCount}
                        </span>
                      </Button>
      
                      <Button
                        variant="outline"
                        onClick={() => handleVote('downvote', snippet._id)}
                        disabled={isLoading}
                        className={`
                            gap-1
                            ${hasDownvoted ? "border-red-500!" : "border-red-500"}
                            hover:bg-accent/50  // Subtle hover
                        `}
                      >
                        <ArrowBigDown 
                            className={hasDownvoted ? "fill-red-500 text-red-500!" : "fill-transparent"} 
                        />
                      </Button>
                    </div>

                    <div>
                      <Fork snippet={snippet} contentType="Snippet" hasForked={hasForked}/>
                    </div>
    
                    <div>
                        <Button 
                            variant={"outline"}
                            onClick={() => handleBookmark(snippet._id, "Snippet")}
                            className={`gap-1
                                ${hasBookmark ? "border-white!" : "border-white"}
                                hover:bg-accent/50  // Subtle hover
                            `}
                        > 
                        <Bookmark
                            className={hasBookmark ? "fill-white text-white!" : "fill-transparent"} 
                        /> 
                        <p className={hasBookmark ? "text-white" : ""}>
                            {snippet.bookmarkCount}
                        </p>
                        </Button>
                    </div>
                  </div>

                  <div>
                    <Tip 
                      walletAddress={snippet.user?.walletAddress}  
                      snippetId={snippet._id} 
                      snippetTitle={snippet.title}
                      receiverId={snippet.user?._id}
                      receiverType={snippet?.user?.role}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className='flex flex-col gap-y-10 mt-6'>
              {snippet.codeBlocks.map((code,i) => (
                <Card key={i} className="rounded-bl-sm rounded-br-sm">
                  <CardHeader className="flex justify-between items-center">
                    <div><h3 className='hover:underline hover:text-primary transition-colors duration-150 cursor-pointer'>{code.name}</h3></div>

                    <div className='flex items-center gap-x-2'>
                      <div className="hidden md:block">
                        <CodeLanguage languages={[{
                          value: code.language.toLowerCase(),
                          label: code.language.toLowerCase()
                        }]}/>
                      </div>
                      <div>
                        <Button 
                          variant="outline"
                          onClick={() => handleCopy(code.content, code._id)}
                        >
                          {copiedBlocks[code._id] ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className='pt-4'>
                      <SyntaxHighlighter
                        language={code.language.toLowerCase()}
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
                        {code.content}
                      </SyntaxHighlighter>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="my-6 w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
              <CardContent>
                <div className='flex gap-x-2 items-center justify-between'>
                  <div className='flex gap-x-2 items-center'>
                    <div className='flex items-center gap-x-2'>
                        <Button
                          variant="outline"
                          onClick={() => handleVote('upvote', snippet._id)}
                          disabled={isLoading}
                          className={`
                              gap-1
                              ${hasUpvoted ? "border-green-500!" : "border-green-500"}
                              hover:bg-accent/50  // Subtle hover
                          `}
                        >
                          <ArrowBigUp 
                              className={hasUpvoted ? "fill-green-500 text-green-500!" : "fill-transparent"} 
                          />
                          <span className={hasUpvoted ? "text-green-500" : ""}>
                              {snippet.upvoteCount}
                          </span>
                        </Button>
        
                        <Button
                          variant="outline"
                          onClick={() => handleVote('downvote', snippet._id)}
                          disabled={isLoading}
                          className={`
                              gap-1
                              ${hasDownvoted ? "border-red-500!" : "border-red-500"}
                              hover:bg-accent/50  // Subtle hover
                          `}
                        >
                          <ArrowBigDown 
                            className={hasDownvoted ? "fill-red-500 text-red-500!" : "fill-transparent"} 
                          />
                        </Button>
                        </div>
        
                        <div>
                          <Fork snippet={snippet} contentType="Snippet" hasForked={hasForked}/>
                        </div>
        
                        <div>
                            <Button 
                                variant={"outline"}
                                onClick={() => handleBookmark(snippet._id, "Snippet")}
                                className={`gap-1
                                    ${hasBookmark ? "border-white!" : "border-white"}
                                    hover:bg-accent/50  // Subtle hover
                                `}
                            > 
                            <Bookmark
                                className={hasBookmark ? "fill-white text-white!" : "fill-transparent"} 
                            /> 
                            <p className={hasBookmark ? "text-white" : ""}>
                                {snippet.bookmarkCount}
                            </p>
                            </Button>
                        </div>
                  </div>

                  <div>
                    <Tip snippet={snippet} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-transparent mb-12" ref={geeksForGeeksRef} >
              <CardContent>
                <CommentBox snippetId={snippetId} />
              </CardContent>
            </Card>

            {commentState.comments.map((comment, i) => (
              <Comment key={i} comment={comment}/>
            ))}
          </div>

          <div className='md:flex-[1] md:max-w-[400px] flex flex-col gap-y-3'>
            <Card className="w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Image
                    src={snippet.user?.avatar?.url || "/default_avatar.png"}
                    alt={snippet.user?.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <Link href={`/profile/${snippet.user?._id}`} className="text-sm font-semibold text-foreground hover:underline">
                      <CardTitle className="text-sm text-gray-400 line-clamp-2 hover:underline">
                        {snippet.user?.name || 'Unknown User'}
                      </CardTitle>
                    </Link>

                    <CardDescription className="text-[11px] text-muted-foreground">
                      by @{snippet.user?.userName || 'unknown'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="-mt-4">
                <div className='text-sm md:text-base'>
                  {snippet.user?.about || 'No description available'}
                </div>
                <div className='pt-4'>
                  <Button 
                    variant={isFollowing ? "outline" : "default"} 
                    className="w-full"
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {snippet?.collaborators.length !== 0 && (
              <Card className="hidden sm:block w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
                <CardHeader className="text-xl">Collaborators</CardHeader>
                <Separator/>
                <CardContent className="flex items-center flex-wrap gap-y-2 pt-6">
                  {snippet.collaborators.map((i) => (
                    <Link href="/#" key={i} className='flex flex-col gap-2 -ml-2'>
                      <Image 
                        src={"/profile.png"}
                        alt='collaborators'
                        width={37}
                        height={37}
                        className='rounded-full min-h-[25px] aspect-square object-cover border-2 border-secondary'
                      />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      }
    </>
  )
}

export default Page;