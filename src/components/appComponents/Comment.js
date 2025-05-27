"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { renderText } from '@/utils/renderText'
import { ArrowBigDown, ArrowBigUp, MessageCircle, MoreVertical, Trash2, UserCheck, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Tip } from './Tip'
import { deleteComment, downvoteCommentOptimistic, updateCommentAfterVote, upvoteCommentOptimistic } from '@/lib/redux/slices/comments'
import api from '@/utils/axiosConfig'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { toast } from 'sonner'
import Reply from './Reply'
import ReplyBox from './ReplyBox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const Comment = ({comment}) => {
  const dispatch = useAppDispatch();
  const { jwtToken, userData } = useAppSelector((state) => state.auth);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hasUpvoted = comment.upvotes?.some(v => (v.entity || v.entity._id ) === userData?._id);
  const hasDownvoted = comment.downvotes?.some(v => (v.entity || v.entity._id ) === userData?._id);
  const targetUser = comment.author?.entity;
  const isFollowing = userData?.following?.some(
    follow => follow.entity === targetUser?._id
  );
  const isCommentOwner = userData?._id === targetUser?._id;
  const { snippet, isLoading } = useAppSelector((state) => state.snippets);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDelete = async () => {
    if (!isCommentOwner) return;
    
    try {
      await toast.promise(
          (async () => {
              const response = await api.delete(`/delete-comment/${comment._id}`,{
                headers: {
                  Authorization: `Bearer ${jwtToken}`
                }
              });
              return response.data;
          })(),
          {
              loading: 'deleting your comment...',
              success: (data) => {
                dispatch(deleteComment(comment._id));
                return data.message;
              },
              error: (err) => {
                return err.response?.data?.message || 'Failed to delete comment';
              }
          }
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleUpvote = async () => {
    try {
      // Optimistic update
      dispatch(upvoteCommentOptimistic({ 
        commentId: comment._id, 
        userId: userData._id 
      }));

      // API call
      const response = await api.post(`/upvote-comment/${comment._id}`, {}, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });

      // Update with actual data
      dispatch(updateCommentAfterVote(response.data.comment));
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to upvote');
      // Revert optimistic update on error
      dispatch(updateCommentAfterVote(comment));
    }
  };

  const handleDownvote = async () => {
    try {
      // Optimistic update
      dispatch(downvoteCommentOptimistic({ 
        commentId: comment._id, 
        userId: userData._id 
      }));

      // API call
      const response = await api.post(`/downvote-comment/${comment._id}`, {}, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });

      // Update with actual data
      dispatch(updateCommentAfterVote(response.data.comment));
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to downvote');
      // Revert optimistic update on error
      dispatch(updateCommentAfterVote(comment));
    }
  };


  const handleFollow = async () => {
    if (!jwtToken) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await toast.promise(
        (async()=>{

          const response = api.put('/follow-user', {
            followId: targetUser._id,
            role: userData.role
          }, {
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          });
          return (await response).data;

        })(),
        {
          loading: 'Following user...',
          success: async(data) => {
            await fetchUser();
            return data?.message || 'Followed successfully!';
          },
          error: (err) => {
            return err.response?.data?.message || 'Failed to follow user';
          }
        }
      );
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleUnfollow = async () => {
    if (!jwtToken) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await toast.promise(
       (async()=> {   
          const response = api.put('/unfollow-user', {
            followId: targetUser._id,
            role: targetUser.role
          }, {
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          });
          return response.data;
        })(),
        {
          loading: 'Unfollowing user...',
          success: async(data) => {
            await fetchUser();
            return data?.message || 'Unfollowed successfully!';
          },
          error: (err) => {
            return err.response?.data?.message || 'Failed to unfollow user';
          }
        }
      );
    } catch (err) {
      console.error('Unfollow error:', err);
    }
  };


  return (
    <div id={comment._id}>
      <Card className="bg-transparent hover:border-gray-600 hover:bg-card my-6 gap-0 relative">
        

        <CardHeader>
            <div className='flex items-start justify-between gap-x-2'>
              <Link href={`/profile/${comment.author?.entity?._id}`} className='flex items-start gap-x-2 my-2 mb-5'>
                <div>
                  <Image
                    src={comment.author?.entity?.avatar?.url || "/default_avatar.png"}
                    alt="Avatar"
                    width={20}
                    height={20}
                    className='w-8 h-8 rounded-full object-cover aspect-square'
                  />
                </div>
                <div className="grid -mt-0.5 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{comment?.author?.entity?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">@{comment?.author?.entity?.userName}</span>
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
                      
                        <>
                          {isCommentOwner && 
                            <div className="px-4 py-2">
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start text-red-500 hover:text-red-600"
                                onClick={handleDelete}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Comment
                              </Button>
                            </div>
                          }
                          {/* <div className="px-4 py-2">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-blue-500 hover:text-blue-600"
                              onClick={isFollowing ? handleUnfollow : handleFollow}
                            >
                              {isFollowing ? <UserX  className="mr-2 h-4 w-4"/> :<UserCheck className="mr-2 h-4 w-4" />}
                              {isFollowing ? "Unfollow user" : "Follow user"}
                            </Button>
                          </div> */}
                        </>
                      
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
                      
                        <>
                          {isCommentOwner && 
                            <DropdownMenuItem 
                              className="text-red-500 focus:text-red-600 focus:bg-red-50"
                              onClick={handleDelete}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          }
                          {/* <DropdownMenuItem 
                            className="text-blue-500 focus:text-blue-600 focus:bg-blue-50"
                            onClick={isFollowing ? handleUnfollow : handleFollow}
                          >
                            {isFollowing ? <UserX  className="mr-2 h-4 w-4"/> :<UserCheck className="mr-2 h-4 w-4" />}
                            {isFollowing ? "Unfollow user" : "Follow user"}
                          </DropdownMenuItem> */}
                        </>
                      
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

          <CardTitle className=' break-all'>{renderText(comment.text, comment.mentions)}</CardTitle>
            <div className='flex gap-x-2 items-center justify-between pt-3'>
              <div className='flex gap-x-2 items-center'>
                <div className='flex items-center gap-x-2'>
                  <Button 
                    variant={"outline"} 
                    size={'sm'}
                    onClick={handleUpvote}
                    disabled={!jwtToken}
                    className={`
                        gap-1
                        ${hasUpvoted ? "border-green-500!" : "border-green-500"}
                        hover:bg-accent/50
                    `}
                  > 
                    <ArrowBigUp
                      className={hasUpvoted ? "fill-green-500 text-green-500!" : "fill-transparent"} 
                    /> 
                    <p className={hasUpvoted ? "text-green-500" : ""}>{comment.upvotes.length}</p>
                  </Button>
                  
                  <Button 
                    variant={"outline"} 
                    size={'sm'}
                    onClick={handleDownvote}
                    disabled={!jwtToken}
                    className={`
                        gap-1
                        ${hasDownvoted ? "border-red-500!" : "border-red-500"}
                        hover:bg-accent/50
                    `}
                  > 
                    <ArrowBigDown
                      className={hasDownvoted ? "fill-red-500 text-red-500!" : "fill-transparent"} 
                    /> 
                    <p className={hasDownvoted ? "text-red-500" : ""}>{comment.downvotes.length}</p>
                  </Button>

                  <Button 
                    variant={"outline"}
                    onClick={() => setShowReplyBox(!showReplyBox)}
                  > 
                    <MessageCircle/> 
                    <p>{comment.replies.length}</p>
                  </Button>
                </div>
              </div>
              <div>
                <Tip walletAddress={comment?.author?.entity.walletAddress}/>
              </div>
            </div>
        </CardHeader>

        <CardContent className='mt-3'>
          {showReplyBox && <ReplyBox comment={comment} setShowReplyBox={setShowReplyBox}/>}

          {comment.replies.map((reply, i) => (
            <Reply
              key={i}
              reply={reply}
              commentId={comment._id}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default Comment