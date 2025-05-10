import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '../ui/button';
import { AtSign, Code, Link } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => {
    return mod.Prism;
  }),
  {
    ssr: false,
    loading: () => (
      <pre className=" p-4 rounded-md overflow-x-auto">
        Loading code snippet...
      </pre>
    )
  }
);

import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import dynamic from 'next/dynamic';


const CommentBox = () => {
    const [comment, setComment] = useState("");

     const renderTextWithCode = (text) => {
        // Split text into parts that are either code or normal text
        const parts = text.split(/(`[^`]+`)/g);
        
        return parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                // Extract code content (remove backticks)
                const codeContent = part.slice(1, -1);
                return (
                    <SyntaxHighlighter
                        key={index}
                        language="javascript" 
                        style={atomDark}
                        customStyle={{
                            margin: '0.5em 0',
                            padding: '1em',
                            borderRadius: '0.3em',
                            fontSize: '0.85em',
                            display: 'inline-block',
                            width: '100%'
                        }}
                        wrapLines
                    >
                        {codeContent}
                    </SyntaxHighlighter>
                );
            }
            // Return normal text
            return <span key={index}>{part}</span>;
        });
    };

  return (
    <div>
        <Tabs defaultValue="write" className="">
            <div className="flex justify-between items-center w-full">
                <TabsList>
                        <TabsTrigger className="cursor-pointer" value="write">Write</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="preview">Preview</TabsTrigger>
                </TabsList>

                
                <div className='flex items-center gap-x-2'>
                    <Button variant='outline'><Code/> </Button>
                    <Button variant='outline'><AtSign/> </Button>
                    <Button variant='outline'><Link/> </Button>
                </div>
            </div>



            <TabsContent value="write" className="mt-2">
                <div>
                    <Textarea
                        placeholder="Comment here ..."
                        className="h-32"
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                    />
                </div>
                <div className='flex justify-between mt-4'>
                    <div className='text-sm text-muted-foreground'>To insert code, do this `code`</div>
                    <Button>Comment</Button>
                </div>
            </TabsContent>


            <TabsContent value="preview">
                <div>
                    <p>{renderTextWithCode(comment)}</p>
                </div>
            </TabsContent>
        </Tabs>

    </div>
  )
}

export default CommentBox;