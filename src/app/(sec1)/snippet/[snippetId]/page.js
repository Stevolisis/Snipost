"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowBigDown, ArrowBigUp, BookCopy, Bookmark, CircleDollarSign, MessageCircle } from 'lucide-react';
import React, { use, useEffect, useState } from 'react'
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
import { disconnectWallet } from '@/lib/redux/slices/auth';

const Page = ({params}) => {
  const { snippetId } = use(params);
  const [snippet, setSnippet] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedBlocks, setCopiedBlocks] = useState({});
  const { userData, jwtToken, disconnect } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchSnippetData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/get-snippet/${snippetId}`);
        setSnippet(response.data.snippet);
        setComments(response.data.comments || []);
      } catch (err) {
        if (err.response?.status === 401) {
          // Handle unauthorized error
          dispatch(disconnectWallet());
          disconnect();
          toast("Uh oh! Something went wrong.", {
            description: "Connect your wallet"
          })
        }
        setError(err.response?.data?.message || 'Failed to load snippet');
        console.error("Error fetching snippet:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippetData();
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
      <div className="w-full px-4 py-4">
        <p>Loading snippet...</p>
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

  if (!snippet) {
    return (
      <div className="w-full px-4 py-4">
        <p>Snippet not found</p>
      </div>
    );
  }

  return (
    <div className='px-5 flex flex-col md:flex-row gap-5'>
      <div className='flex-grow md:flex-[2]'>
        <Card className="w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
          <CardHeader>
            <div className='-mb-6 py-3'>
              <h1 className="text-2xl line-clamp-2 text-foreground font-bold">
                {snippet.title}
              </h1>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">{snippet.description}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {snippet.tags.map((tag, i) => (
                <Button variant="outline" size={"sm"} key={i} className='text-xs text-muted-foreground'>#{tag}</Button>
              ))}
            </div>

            <div className='flex gap-x-2 items-center justify-between pt-5'>
              <div className='flex gap-x-2 items-center'>
                <div className='flex items-center gap-x-2 mr-3'>
                  <Button variant={"outline"} size={'sm'}> 
                    <ArrowBigUp/> 
                    <p>{snippet.upvotes.length}</p>
                  </Button>
                  
                  <Button variant={"outline"} size={'sm'}> <ArrowBigDown/> </Button>
                </div>

                <div>
                  <Button variant={"outline"}> 
                    <MessageCircle/> 
                    <p>{snippet.commentNo}</p>
                  </Button>
                </div>

                <div>
                  <Button variant={"outline"}> 
                    <Bookmark/> 
                    <p>{snippet.bookmarks?.length || 0}</p>
                  </Button>
                </div>
              </div>

              <div>
                <Button variant={"link"}> <CircleDollarSign/> </Button>
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
                    <Button variant={"outline"}>
                      <BookCopy />
                    </Button>
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
                <div className='flex items-center gap-x-2 mr-3'>
                  <Button variant={"outline"} size={'sm'}> 
                    <ArrowBigUp/> 
                    <p>{snippet.upvotes.length}</p>
                  </Button>
                  
                  <Button variant={"outline"} size={'sm'}> <ArrowBigDown/> </Button>
                </div>

                <div>
                  <Button variant={"outline"}> 
                    <MessageCircle/> 
                    <p>{snippet.commentNo}</p>
                  </Button>
                </div>

                <div>
                  <Button variant={"outline"}> 
                    <Bookmark/> 
                    <p>{snippet.bookmarks?.length || 0}</p>
                  </Button>
                </div>
              </div>

              <div>
                <Button variant={"link"}> <CircleDollarSign/> </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent mb-12">
          <CardContent>
            <CommentBox snippetId={snippetId} />
          </CardContent>
        </Card>

        {comments.map((comment, i) => (
          <Comment key={i} comment={comment}/>
        ))}
      </div>

      <div className='md:flex-[1] md:max-w-[400px] flex flex-col gap-y-3'>
        <Card className="w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Image
                src={snippet.user?.entity?.avatar?.url || '/default-avatar.png'}
                alt={snippet.user?.entity?.name || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <Link href={`/profile/${snippet.user?.entity?._id}`} className="text-sm font-semibold text-foreground hover:underline">
                  <CardTitle className="text-sm text-gray-400 line-clamp-2 hover:underline">
                    {snippet.user?.entity?.name || 'Unknown User'}
                  </CardTitle>
                </Link>

                <CardDescription className="text-[11px] text-muted-foreground">
                  by @{snippet.user?.entity?.userName || 'unknown'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="-mt-4">
            <div className='text-sm md:text-base'>
              {snippet.user?.entity?.about || 'No description available'}
            </div>
            <div className='pt-4'>
              <Button variant={"default"} className="w-full">Follow</Button>
            </div>
          </CardContent>
        </Card>

        {snippet.collaborators?.length === 0 && (
          <Card className="hidden sm:block w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
            <CardHeader className="text-xl">Collaborators</CardHeader>
            <Separator/>
            <CardContent className="flex items-center flex-wrap gap-y-2 pt-6">
              {[1,2,3,4,5].map((i) => (
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
  )
}

export default Page;