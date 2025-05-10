"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { renderTextWithCode } from '@/utils/rendertextwithcode';
import { ArrowBigDown, ArrowBigUp, Bookmark, CircleDollarSign, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import CommentBox from './CommentBox';

const Comment = ({comment}) => {
  return (
    <div>
      <Card className=" bg-transparent hover:border-gray-600 hover:bg-card">
        <CardHeader>
            <Link href="#" className='flex gap-x-2 my-2'>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image
                  src="/logo2.svg"
                  alt="Avatar"
                  width={20}
                  height={20}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Steven Joseph</span>
                <span className="truncate text-xs">Pro Coder</span>
              </div>
            </Link>
          <CardTitle>{comment.text}</CardTitle>
          <CardDescription>{comment.text}</CardDescription>
          <div className='flex gap-x-2 items-center justify-between pt-3'>
            <div className='flex gap-x-2 items-center'>
              <div className='flex items-center gap-x-2'>
                <Button variant={"outline"} size={'sm'}> 
                  <ArrowBigUp/> 
                  <p>12</p>
                </Button>
                
                <Button variant={"outline"} size={'sm'}> 
                  <ArrowBigDown/> 
                </Button>
              </div>

              <div>
                <Button variant={"outline"}> 
                  <MessageCircle/> 
                </Button>
              </div>

            </div>

            <div>
              <Button variant={"link"}> <CircleDollarSign/> </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>

          {
            comment.replies.map((reply,i)=>(
              <>
                <Card className=" hover:bg-background hover:border-gray-600 mb-4" key={i}>
                  <CardHeader>
                      <Link href="#" className='flex gap-x-2 my-2'>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                          <Image
                            src="/logo2.svg"
                            alt="Avatar"
                            width={20}
                            height={20}
                          />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">Steven Joseph</span>
                          <span className="truncate text-xs">Pro Coder</span>
                        </div>
                      </Link>
                    <CardTitle>{comment.text}</CardTitle>
                    <CardDescription>{comment.text}</CardDescription>
                    <div className='flex gap-x-2 items-center justify-between pt-3'>
                      <div className='flex gap-x-2 items-center'>
                        <div className='flex items-center gap-x-2'>
                          <Button variant={"outline"} size={'sm'}> 
                            <ArrowBigUp/> 
                            <p>12</p>
                          </Button>
                          
                          <Button variant={"outline"} size={'sm'}> 
                            <ArrowBigDown/> 
                          </Button>
                        </div>

                        <div>
                          <Button variant={"outline"}> 
                            <MessageCircle/> 
                          </Button>
                        </div>

                      </div>

                      <div>
                        <Button variant={"link"}> <CircleDollarSign/> </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <CommentBox/>
              </>
            ))
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default Comment