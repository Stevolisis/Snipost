"use client"
import React from 'react'
import { ArrowBigDown, ArrowBigUp, Bookmark, FileText, GitFork, MessageCircle, UserPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {
  upvoteSnippetSuccess,
  downvoteSnippetSuccess,
  upvoteSnippetApiSuccess,
  downvoteSnippetApiSuccess,
  bookmarkSnippetSuccess,
  bookmarkSnippetApiSuccess,
  
} from '@/lib/redux/slices/snippets';
import { Tip } from '@/components/appComponents/Tip';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import api from '@/utils/axiosConfig';
import { toast } from 'sonner';
import { Fork } from './Fork';



const SnipCard = ({snippet}) => {
    const router = useRouter();
    const { isLoading } = useAppSelector((state) => state.snippets);
    const { userData, jwtToken } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const hasUpvoted = snippet.upvotes?.some(v => v.entity === userData?._id);
    const hasDownvoted = snippet.downvotes?.some(v => v.entity === userData?._id);
    const hasBookmark = snippet.bookmarkedBy?.some(v => v.entity === userData?._id);
    const hasForked = snippet?.forks?.some(v => v.forkedBy.entity === userData?._id);


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
            toast.success(response.data.message);

            // 3. Optional: Final sync with backend data
            dispatch(bookmarkSnippetApiSuccess(response.data.snippet));
            
        } catch (err) {
            toast.error("Bookmark failed");
            // Note: Automatic rollback isn't needed since we'll refetch snippets later
        }
    };
    

    return (
        <Card key={snippet._id} className="w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200">
            <CardHeader>
            
            <div className='flex justify-between items-center'>
                <div className="flex items-center gap-2">
                    <Image
                        src={snippet.user?.avatar?.url || "/default_avatar.png"}
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
                    </Button>
                </div>
            </div>
            
            <div className='-mb-6 py-3'>
                <Link href={`/snippet/${snippet._id}`} className="text-2xl line-clamp-2 text-foreground 
                font-bold hover:underline hover:underline-primary hover:text-primary transition-colors duration-150">
                {snippet.title || 'Untitled Snippet'}
                </Link>
                
                {snippet?.isFork && <div className='flex items-center gap-x-2 mt-2'>
                    <GitFork size={12} /><span className='text-xs'>forked from</span>
                    <Link href={`/snippet/${snippet?.originalContent.entity}`} className='hover:text-[#A246FD]'><FileText size={18} /></Link>
                    <Link href={`/profile/${snippet?.originalAuthor.entity}`} className='hover:text-[#A246FD]'><UserPen size={18} /></Link>
                    
                </div>}
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
                    <Button variant={"outline"} onClick={()=>router.push(`/snippet/${snippet._id}#comment`)}> 
                    <MessageCircle/> 
                    <p>{snippet.commentNo || 0}</p>
                    </Button>
                </div>

                <div>
                    <Fork snippet={snippet} contentType="Snippet" hasForked={hasForked}/>
                </div>
            </div>

                <div>
                {/* <Button variant={"link"}> <CircleDollarSign/> </Button> */}
                <Tip 
                    walletAddress={snippet?.user?.walletAddress} 
                    snippetId={snippet._id} 
                    snippetTitle={snippet.title} 
                    receiverId={snippet.user?._id}
                    receiverType={snippet?.user?.role}
                />
                </div>
            </div>
            </CardContent>
        </Card>
    )
}

export default SnipCard