import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowBigDown, ArrowBigUp, Bookmark, CircleDollarSign, MessageCircle } from 'lucide-react';
import React, { use } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

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


  return (
    <div className='px-5 flex flex-col md:flex-row gap-5'>
        
        <div className='flex-grow md:flex-[2]'>
            <Card key={snippet._id} className="w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
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
        </div>

        <div className='md:flex-[1] md:max-w-[400px] flex flex-col gap-y-3'>
            <Card key={snippet._id} className="w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
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
                <Card key={snippet._id} className="w-full bg-transparent hover:border-gray-600 transition-colors duration-200">
                    <CardHeader className="text-xl">Collaborators</CardHeader>
                    <Separator/>
                    <CardContent className="flex items-center flex-wrap gap-y-2">
                        {
                            [1,2,3,4,5].map((y) => (
                                <Link href=""  className='flex flex-col gap-2 -ml-2'>
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