import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '../ui/button';
import { AtSign, Code, Link } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"
import { renderTextWithCode } from '@/utils/rendertextwithcode';
import api from '@/utils/axiosConfig';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'sonner';
import { addCommentSuccess, commentsFailure, loadCommentsStart } from '@/lib/redux/slices/comments';


const CommentBox = () => {
    const [comment, setComment] = useState("");
    const { userData, jwtToken, disconnect } = useAppSelector((state) => state.auth)
    const { snippet } = useAppSelector((state) => state.snippets);
    const dispatch = useAppDispatch();

    const handleComment = async () => {
    if (comment === "") {
        toast.error("Comment cannot be empty");
        return;
    }

    try {
        const commentData = {
        contentId: snippet._id,
        contentType: snippet.codeBlocks ? "Snippet" : "Snap",
        text: comment,
        mentions: [{
            entity: snippet.user.entity._id,
            model: snippet.user.model
        }]
        };

        await toast.promise(
        (async () => {
            dispatch(loadCommentsStart());
            const response = await api.post("/create-comment", commentData, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
            });
            
            dispatch(addCommentSuccess(response.data.comment));
            return response.data;
        })(),
        {
            loading: 'Posting your comment...',
            success: (data) => data.message || 'Comment posted successfully!',
            error: (err) => {
            // Handle 401 specifically
            if (err.response?.status === 401) {
                dispatch(disconnectWallet()); // Clear auth state
                disconnect(); // Wallet disconnect logic
                return 'Session expired. Please reconnect your wallet.';
            }
            
            dispatch(commentsFailure());
            return err.response?.data?.message || 'Failed to post comment';
            }
        }
        );
        
    } catch (err) {
        console.error('Comment error:', err);
        // The toast.promise will have already handled the error display
    }
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
                    <Button onClick={()=>handleComment()}>Comment</Button>
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