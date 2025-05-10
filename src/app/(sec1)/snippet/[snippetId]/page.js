"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowBigDown, ArrowBigUp, BookCopy, Bookmark, CircleDollarSign, MessageCircle } from 'lucide-react';
import React, { use, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { CodeLanguage } from '@/components/appComponents/CodeLanguage';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => {
    return mod.Prism;
  }),
  {
    ssr: false, // Disable server-side rendering
    loading: () => (
      <pre className=" p-4 rounded-md overflow-x-auto">
        Loading code snippet...
      </pre>
    )
  }
);
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import CommentBox from '@/components/appComponents/CommentBox';
import Comment from '@/components/appComponents/Comment';

const page = ({params}) => {
    const { snippetId } = use(params);
    const snippet = {
        _id: '681b9cf890519b09901389e3',
        user: {
            _id: '68161f63ad854930d22c03dd',
            name: 'snipdev_UvnY_1105',
            userName: 'snipdev_UvnY_1105',
            package: 'Free',
            description: "Welcome to PHP Dev, a dedicated space for sharing knowledge about PHP and its ecosystem (only PHP directly related). Help us find good articles and blogposts and provide links. Upvote or downvote, after reading, it's essential",
            avatar: {
                public_id: '68161f63ad854930d22c03dd',
                url: "https://res.cloudinary.com/dwhkilbqk/image/upload/v1746281699/pgwz11u19ofqjvzskbzm.png"
            }
        },
        collaborators: [],
        title: 'CommonJs Vs Es Js 2',
        description: 'CommonJs and Es in Nodejs  Es if(description && description.length > MAX_  return next(new ErrorHandler("Description contains profanity", 400));\n' +
        '        }',
        tags: [ 'JavaScript', 'Python', 'TypeScript', 'C++', 'Java' ],
        codeBlocks: [
                    {
                        "name": "german.js",
                        "language": "php",
                        "content": "if(description && description.length > MAX_CODE_DESCRIPTION_LENGTH) {\n            return next(new ErrorHandler(`Description exceeds ${MAX_CODE_DESCRIPTION_LENGTH} limit`, 400));\n        }\n        if (description && profanityFilter.isProfane(description)) {\n            return next(new ErrorHandler(\"Description contains profanity\", 400));\n        }",
                        "_id": "681b9cf890519b09901389e4"
                    },
                    {
                        "name": "germania.js",
                        "language": "JavaScript",
                        "content": "if(description && description.length > MAX_CODE_DESCRIPTION_LENGTH) {\n            return next(new ErrorHandler(`Description exceeds ${MAX_CODE_DESCRIPTION_LENGTH} limit`, 400));\n        }\n        if (description && profanityFilter.isProfane(description)) {\n            return next(new ErrorHandler(\"Description contains profanity\", 400));\n        }",
                        "_id": "681b9cf890519b09901389e5"
                    },
                    {
                        "name": "german.js",
                        "language": "JavaScript",
                        "content": "if(description && description.length > MAX_CODE_DESCRIPTION_LENGTH) {\n            return next(new ErrorHandler(`Description exceeds ${MAX_CODE_DESCRIPTION_LENGTH} limit`, 400));\n        }\n        if (description && profanityFilter.isProfane(description)) {\n            return next(new ErrorHandler(\"Description contains profanity\", 400));\n        }",
                        "_id": "681b9cf890519b09901389e6"
                    }
                ],
        folder: '681a8ee804258036305755ec',
        views: 0,
        commentNo: 0,
        isFeatured: false,
        type: 'public',
        forks: [],
        bookmarkedBy: [],
        createdAt: '2025-05-07T17:48:40.615Z',
        updatedAt: '2025-05-07T17:48:40.615Z',
        __v: 0,
        upvoteCount: 0,
        downvoteCount: 0,
        netVotes: 0,
        bookmarks: []
    };
    const dummyComments = [
        {
            "_id": "681b92b787b022abfaa41296",
            "contentRef": {  // Populated document
            "_id": "68179244e70ebcd15617e3fa",
            "title": "CommonJS vs ES Modules",
            "description": "Detailed comparison between module systems",
            "tags": ["javascript", "nodejs"],
            // Mongoose adds this virtual field during population:
            "__model": "Snippet" 
            },
            "author": {  // Fully replaced with user document
            "_id": "68161f63ad854930d22c03dd",
            "name": "CodeMaster",
            "userName": "@codemaster",
            "avatar": {
                "url": "https://example.com/avatars/codemaster.jpg",
                "public_id": "user-avatars/codemaster"
            },
            "__model": "User"
            },
            "text": "The event loop explanation was crystal clear!",
            "replies": [
            {
                "_id": "681b961f6e5d7ded5a218518",
                "author": {  // Populated user
                "_id": "68161f63ad854930d22c03de",
                "name": "DevNewbie",
                "userName": "@newbie",
                "__model": "User"
                },
                "text": "@codemaster This helped me fix my async/await issues!",
                "mentions": [  // Populated mentions
                {
                    "_id": "68161f63ad854930d22c03dd",
                    "userName": "@codemaster",
                    "__model": "User"
                }
                ],
                "upvotes": [  // Populated voters
                {
                    "_id": "68161f63ad854930d22c03df",
                    "userName": "@reactlover",
                    "__model": "User"
                }
                ],
                "createdAt": "2025-05-07T17:19:27.137Z"
            }
            ],
            "upvotes": [  // Populated voters
            {
                "_id": "68161f63ad854930d22c03de",
                "userName": "@newbie",
                "__model": "User"
            }
            ],
            "createdAt": "2025-05-07T17:04:55.829Z",
            "updatedAt": "2025-05-07T17:37:02.452Z",
            "__v": 0
        }
        ];
  const [copiedBlocks, setCopiedBlocks] = useState({});

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

  return (
    <div className='px-5 flex flex-col md:flex-row gap-5'>
        
        <div className='flex-grow md:flex-[2]'>
            <Card className="w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
                <CardHeader>
                        <div className='-mb-6 py-3'>
                            <Link href={`/snippet/${snippet._id}`} className="text-2xl  line-clamp-2 text-foreground 
                            font-bold hover:underline hover:underline-primary hover:text-primary transition-colors duration-150">
                                {snippet.title}
                            </Link>
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
                            <p>{snippet.upvoteCount}</p>
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
                            <p>{snippet.bookmarks.length}</p>
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
                {
                    snippet.codeBlocks.map((code,i)=>(
                        <Card key={i} className=" rounded-bl-sm rounded-br-sm">
                            <CardHeader className="flex justify-between items-center">
                                <div><h3 className=' hover:underline hover:text-primary transition-colors duration-150 cursor-pointer'>{code.name}</h3></div>

                                <div className='flex items-center gap-x-2'>
                                    <div className="hidden md:block">
                                        <CodeLanguage language={code.language.toLowerCase()}/>
                                    </div>
                                    <div>
                                        <Button variant={"outline"}>
                                            <BookCopy />
                                        </Button>
                                    </div>
                                    <div>
                                        <Button 
                                            variant="outline"
                                            onClick={() => handleCopy(code.content, code._id)} // Pass unique ID
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
                    ))
                }
            </div>
















            <Card className="my-6 w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
                <CardContent>
                    <div className='flex gap-x-2 items-center justify-between'>
                        <div className='flex gap-x-2 items-center'>
                        <div className='flex items-center gap-x-2 mr-3'>
                            <Button variant={"outline"} size={'sm'}> 
                            <ArrowBigUp/> 
                            <p>{snippet.upvoteCount}</p>
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
                            <p>{snippet.bookmarks.length}</p>
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
                    <CommentBox/>
                </CardContent>
            </Card>

            {
                dummyComments.map((comment, i)=>(<Comment key={i} comment={comment}/>))
            }

            <div>
                
            </div>


        </div>


































        <div className='md:flex-[1] md:max-w-[400px] flex flex-col gap-y-3'>
            <Card className="w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
              <CardHeader>
                    <div className="flex items-center gap-2">
                      <Image
                        src={snippet.user.avatar.url}
                        alt={snippet.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    <div>
                        <Link href={`/profile/${snippet.user._id}`} className="text-sm font-semibold text-foreground hover:underline">
                          <CardTitle className="text-sm text-gray-400 line-clamp-2 hover:underline">{snippet.user.name}</CardTitle>
                        </Link>

                        <CardDescription className="text-[11px] text-muted-foreground">
                          by @{snippet.user.userName}
                        </CardDescription>
                    </div>
                    </div>
              </CardHeader>

              <CardContent className="-mt-4">
                <div className='text-sm md:text-base'>
                    {snippet.user.description}
                </div>
                <div className='pt-4'>
                    <Button variant={"default"} className=" w-full">Follow</Button>
                </div>
              </CardContent>
            </Card>

            {
                snippet.collaborators.length === 0 &&
                <Card className="hidden sm:block w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
                    <CardHeader className="text-xl">Collaborators</CardHeader>
                    <Separator/>
                    <CardContent className="flex items-center flex-wrap gap-y-2 pt-6">
                        {
                            [1,2,3,4,5].map((i) => (
                                <Link href="/#" key={i} className='flex flex-col gap-2 -ml-2'>
                                    <Image 
                                        src={"/profile.png"}
                                        alt='collaborators'
                                        width={37}
                                        height={37}
                                        className='rounded-full min-h-[25px] aspect-square object-cover border-2 border-secondary'
                                    />
                                </Link>
                            ))
                        }
                    </CardContent>
                </Card>
            }
        </div>

    </div>
  )
}

export default page