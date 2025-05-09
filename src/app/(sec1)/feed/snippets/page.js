import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';


const page = () => {
    const snippets = [
  {
    _id: '681b9cf890519b09901389e3',
    user: {
      _id: '68161f63ad854930d22c03dd',
      name: 'snipdev_UvnY_1105',
      userName: 'snipdev_UvnY_1105',
      package: 'Free',
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
  },
  {
    _id: '6817938e9e46763d8a2ff499',
    user: {
      _id: '68161f63ad854930d22c03dd',
      name: 'snipdev_UvnY_1105',
      userName: 'snipdev_UvnY_1105',
      package: 'Free',
      avatar: {
        public_id: '68161f63ad854930d22c03dd',
        url: "https://res.cloudinary.com/dwhkilbqk/image/upload/v1746281699/pgwz11u19ofqjvzskbzm.png"
      }
    },
    collaborators: [],
    title: 'CommonJs Vs Es Js',
    description: 'CommonJs and Es in Nodejs  Es if(description && description.length > MAX_  return next(new ErrorHandler("Description contains profanity", 400));\n' +
      '        }',
    tags: [ 'JavaScript', 'Python', 'TypeScript', 'C++', 'Java' ],
    codeBlocks: [
                {
                    "name": "german.js",
                    "language": "c",
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
    folder: '68161f63ad854930d22c03de',
    views: 0,
    commentNo: 0,
    isFeatured: false,
    type: 'public',
    forks: [],
    createdAt: '2025-05-04T16:19:26.142Z',
    updatedAt: '2025-05-04T16:42:25.560Z',
    __v: 2,
    upvoteCount: 0,
    downvoteCount: 0,
    netVotes: 0,
    bookmarks: []
  },
    {
    _id: '6817938e9e46763d8a2ff492',
    user: {
      _id: '68161f63ad854930d22c03dd',
      name: 'snipdev_UvnY_1105',
      userName: 'snipdev_UvnY_1105',
      package: 'Free',
      avatar: {
        public_id: '68161f63ad854930d22c03dd',
        url: "https://res.cloudinary.com/dwhkilbqk/image/upload/v1746281699/pgwz11u19ofqjvzskbzm.png"
      }
    },
    collaborators: [],
    title: 'CommonJs Vs Es Js 3',
    description: 'CommonJs and Es in Nodejs  Es if(description && description.length > MAX_  return next(new ErrorHandler("Description contains profanity", 400));\n' +
      '        }',
    tags: [ 'JavaScript', 'Python', 'TypeScript', 'C++', 'Java' ],
    codeBlocks: [
                {
                    "name": "german.js",
                    "language": "rust",
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
    folder: '68161f63ad854930d22c03de',
    views: 0,
    commentNo: 0,
    isFeatured: false,
    type: 'public',
    forks: [],
    createdAt: '2025-05-04T16:19:26.142Z',
    updatedAt: '2025-05-04T16:42:25.560Z',
    __v: 2,
    upvoteCount: 0,
    downvoteCount: 0,
    netVotes: 0,
    bookmarks: []
  },
    {
    _id: '6817938e9e46463d8a2ff499',
    user: {
      _id: '68161f63ad854930d22c03dd',
      name: 'snipdev_UvnY_1105',
      userName: 'snipdev_UvnY_1105',
      package: 'Free',
      avatar: {
        public_id: '68161f63ad854930d22c03dd',
        url: "https://res.cloudinary.com/dwhkilbqk/image/upload/v1746281699/pgwz11u19ofqjvzskbzm.png"
      }
    },
    collaborators: [],
    title: 'CommonJs Vs Es Js 5',
    description: 'CommonJs and Es in Nodejs  Es if(description && description.length > MAX_  return next(new ErrorHandler("Description contains profanity", 400));\n' +
      '        }',
    tags: [ 'JavaScript', 'Python', 'TypeScript', 'C++', 'Java' ],
    codeBlocks: [
                {
                    "name": "german.js",
                    "language": "JavaScript",
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
    folder: '68161f63ad854930d22c03de',
    views: 0,
    commentNo: 0,
    isFeatured: false,
    type: 'public',
    forks: [],
    createdAt: '2025-05-04T16:19:26.142Z',
    updatedAt: '2025-05-04T16:42:25.560Z',
    __v: 2,
    upvoteCount: 0,
    downvoteCount: 0,
    netVotes: 0,
    bookmarks: []
  }
]


return (
    <div className="w-full px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        
        {snippets.map((snippet) => (
          <Card key={snippet._id} className="w-full">
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
                        {/* <CardDescription className="text-[11px] text-muted-foreground">
                          by @{snippet.user.userName}
                        </CardDescription> */}
                    </div>
                    </div>
                    
                    <div className='-mb-6 py-3'>
                        <Link href={`/profile/${snippet._id}`} className="text-2xl  line-clamp-2 text-foreground 
                        font-bold hover:underline hover:underline-primary hover:text-primary transition-colors duration-150">
                            {snippet.title}
                        </Link>
                    </div>
              </CardHeader>


              <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{snippet.description}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                      {snippet.tags.map((tag, index) => (
                      <Button variant="outline" size={"sm"} className='text-xs text-muted-foreground'>#{tag}</Button>
                      ))}
                  </div>

                  <div className='pt-4'>
                      <SyntaxHighlighter
                          language={snippet.codeBlocks[0].language.toLowerCase()}
                          style={atomDark}
                          customStyle={{
                              margin: 0,
                              padding: '0.75rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              background: '#1e1e1e',
                              maxHeight: '350px',
                              overflowX: 'scroll'
                          }}
                          showLineNumbers={true}
                      >
                          {snippet.codeBlocks[0].content.substring(0, 400) + (snippet.codeBlocks[0].content.length > 400 ? '...' : '')}
                      </SyntaxHighlighter>
                  </div>

                  <div>

                  </div>

              </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default page