"use client"
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { renderText } from '@/utils/renderText';
import { Tip } from './Tip';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import api from '@/utils/axiosConfig';
import { toast } from 'sonner';
import { updateReplyVotes } from '@/lib/redux/slices/comments'; // Make sure this action exists

const Reply = ({ reply, commentId }) => {
  const dispatch = useAppDispatch();
  const { jwtToken, userData } = useAppSelector((state) => state.auth);
  const upvotes = Array.isArray(reply.upvotes) ? 
    reply.upvotes.filter(v => v && (typeof v === 'object')) : 
    [];
  const downvotes = Array.isArray(reply.downvotes) ? 
    reply.downvotes.filter(v => v && (typeof v === 'object')) : 
    [];

  const hasUpvoted = upvotes.some(v => 
    (v.entity?._id || v.entity) === userData?._id
  );
  const hasDownvoted = downvotes.some(v => 
    (v.entity?._id || v.entity) === userData?._id
  );



  const handleUpvote = async () => {
    console.log("reply: ", reply || "error");

    try {
      // Optimistic update
      dispatch(updateReplyVotes({
        commentId,
        replyId: reply._id,
        upvotes: hasUpvoted 
          ? reply.upvotes.filter(v => (v?.entity || v?.entity._id) !== userData._id)
          : [...reply.upvotes, { entity: userData._id, model: userData.role === "developer" ? "User" : "Company" }],
        downvotes: reply.downvotes.filter(v => (v?.entity || v?.entity._id) !== userData._id)
      }));

      // API call
      const response = await api.post(`/upvote-reply/${commentId}/${reply._id}`, {}, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      console.log("response.data.reply: ", response.data.reply);
      // Update with actual data
      dispatch(updateReplyVotes({
        commentId,
        replyId: response.data.reply._id,
        upvotes: response.data.reply.upvotes,
        downvotes: response.data.reply.downvotes
      }));
      
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to upvote reply');
        // Revert optimistic update on error
        dispatch(updateReplyVotes({
            commentId,
            replyId: reply._id,
            upvotes: reply.upvotes,
            downvotes: reply.downvotes
        }));
    }
  };

  const handleDownvote = async () => {
    try {
      // Optimistic update
      dispatch(updateReplyVotes({
        commentId,
        replyId: reply._id,
        upvotes: reply.upvotes.filter(v => (v.entity || v.entity._id) !== userData._id),
        downvotes: hasDownvoted
          ? reply.downvotes.filter(v => (v.entity || v.entity._id) !== userData._id)
          : [...reply.downvotes, { entity: userData._id, model: userData.role === "developer" ? "User" : "Company" }]
      }));

      // API call
      const response = await api.post(`/downvote-reply/${commentId}/${reply._id}`, {}, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      console.log("response.data.reply downvote: ", response.data.reply);

      // Update with actual data
      dispatch(updateReplyVotes({
        commentId,
        replyId: response.data.reply._id,
        upvotes: response.data.reply.upvotes,
        downvotes: response.data.reply.downvotes
      }));
      
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to downvote reply');
        // Revert optimistic update on error
        dispatch(updateReplyVotes({
            commentId,
            replyId: reply._id,
            upvotes: reply.upvotes,
            downvotes: reply.downvotes
        }));
    }
  };

  return (
    <Card className="hover:bg-background hover:border-gray-600 my-4">
      <CardHeader>
        <Link href={`/profile/${reply.author?.entity?._id}`} className='flex items-start gap-x-2 my-2 mb-5'>
          <div>
            <Image
              src={reply.author?.entity?.avatar?.url || "/logo2.svg"}
              alt="Avatar"
              width={20}
              height={20}
              className='w-8 h-8 rounded-full object-cover aspect-square'
            />
          </div>
          <div className="grid -mt-0.5 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{reply?.author?.entity?.name}</span>
            <span className="truncate text-xs text-muted-foreground">@{reply?.author?.entity?.userName}</span>
          </div>
        </Link>
        <CardTitle>{renderText(reply.text, reply.mentions)}</CardTitle>
        <div className='flex gap-x-2 items-center justify-between pt-3'>
          <div className='flex gap-x-2 items-center'>
            <Button 
              variant={"outline"} 
              size={'sm'}
              onClick={handleUpvote}
              disabled={!jwtToken}
              className={hasUpvoted ? "border-green-500!" : ""}
            > 
              <ArrowBigUp className={hasUpvoted ? "fill-green-500 text-green-500" : ""}/> 
              <p className={hasUpvoted ? "text-green-500" : ""}>{reply.upvotes?.length || 0}</p>
            </Button>
            <Button 
              variant={"outline"} 
              size={'sm'}
              onClick={handleDownvote}
              disabled={!jwtToken}
              className={hasDownvoted ? "border-red-500!" : ""}
            > 
              <ArrowBigDown className={hasDownvoted ? "fill-red-500 text-red-500" : ""}/> 
              <p className={hasDownvoted ? "text-red-500" : ""}>{reply.downvotes?.length || 0}</p>
            </Button>
          </div>
          <Tip walletAddress={reply.author?.entity?.walletAddress} />
        </div>
      </CardHeader>
    </Card>
  );
};

export default Reply;