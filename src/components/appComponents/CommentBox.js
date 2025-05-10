import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '../ui/button';
import { AtSign, Code, Link } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"
import { renderTextWithCode } from '@/utils/rendertextwithcode';


const CommentBox = () => {
    const [comment, setComment] = useState("");


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