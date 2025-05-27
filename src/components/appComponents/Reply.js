"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowBigDown, ArrowBigUp, MoreVertical, Trash2 } from 'lucide-react';
import { renderText } from '@/utils/renderText';
import { Tip } from './Tip';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import api from '@/utils/axiosConfig';
import { toast } from 'sonner';
import { deleteReply, updateReplyVotes } from '@/lib/redux/slices/comments'; // Make sure this action exists
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Reply = ({ reply, commentId }) => {
  const dispatch = useAppDispatch();
  const { jwtToken, userData } = useAppSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const isReplyOwner = userData?._id === reply.author?.entity?._id;
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleDelete = async () => {
    if (!isReplyOwner) return;
    
    try {
      await toast.promise(
          (async () => {
              const response = await api.delete(`/delete-reply/${commentId}/${reply._id}`,{
                headers: {
                  Authorization: `Bearer ${jwtToken}`
                }
              });
              return response.data;
          })(),
          {
              loading: 'deleting your comment...',
              success: (data) => {
                dispatch(deleteReply({ commentId,replyId: reply._id}));
                return data.message;
              },
              error: (err) => {
                return err.response?.data?.message || 'Failed to delete comment';
              }
          }
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <Card id={reply._id} className="hover:bg-background hover:border-gray-600 my-4">


      <CardHeader>
        <div className='flex items-start justify-between gap-x-2'>
          <Link href={`/profile/${reply.author?.entity?._id}`} className='flex items-start justify-between gap-x-2 my-2 mb-5'>
            <div>
              <Image
                src={reply.author?.entity?.avatar?.url || "/default_avatar.png"}
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

          <div className="">
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Comment Actions</DrawerTitle>
                  </DrawerHeader>
                  {isReplyOwner && <div className="p-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-600"
                      onClick={handleDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Comment
                    </Button>
                  </div>}
                </DrawerContent>
              </Drawer>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isReplyOwner && <DropdownMenuItem 
                    className="text-red-500 focus:text-red-600 focus:bg-red-50"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>




        <CardTitle className='break-all'>{renderText(reply.text, reply.mentions)}</CardTitle>
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