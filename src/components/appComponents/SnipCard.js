"use client"
import React from 'react'
import { ArrowBigDown, ArrowBigUp, Bookmark, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {
  upvoteSnippetSuccess,
  downvoteSnippetSuccess,
} from '@/lib/redux/slices/snippets';
import { Tip } from '@/components/appComponents/Tip';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';



const SnipCard = ({snippet}) => {
    const router = useRouter();
    const { isLoading } = useAppSelector((state) => state.snippets);
    const { userData } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    
  const handleUpVote = (id)=>{
    dispatch(upvoteSnippetSuccess({ 
      snippetId: id, 
      userId: userData._id,
    }));
  }

  const handleDownVote = (id)=>{
    dispatch(downvoteSnippetSuccess({
      snippetId: id,
      userId: userData._id, 
    }));
  }
  

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
                variant="outline" 
                size={'sm'}
                onClick={() => handleUpVote(snippet._id)}
                disabled={isLoading}
                > 
                <ArrowBigUp /> 
                <p>{snippet.upvoteCount}</p>
                </Button>
                
                <Button 
                variant="outline"
                size={'sm'}
                onClick={() => handleDownVote(snippet._id)}
                disabled={isLoading}
                > 
                <ArrowBigDown/> 
                <p>{snippet.downvoteCount}</p>
                </Button>
            </div>

            <div>
                <Button variant={"outline"} onClick={()=>router.push(`/snippet/${snippet._id}#comment`)}> 
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
  )
}

export default SnipCard