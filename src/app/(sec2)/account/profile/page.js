"use client"
import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div className='w-full flex justify-center items-center'>
        <form className='w-[50%] flex flex-col gap-y-8'>
            <div className='flex flex-col gap-y-3'>
                <Label>Avatar</Label>
                <Input type="file" placeholder="John Doe" />
            </div>

            <div className='flex flex-col gap-y-3'>
                <Label>Name</Label>
                <Input type="text" placeholder="John Doe" required/>
            </div>

            <div className='flex flex-col gap-y-3'>
                <Label>UserName</Label>
                <Input type="text" placeholder="JohnDev" required/>
            </div>
            
            <div className='flex flex-col gap-y-3'>
                <Label>Email</Label>
                <Input type="email" placeholder="john@gmail.com" />
            </div>

            <div className='flex flex-col gap-y-3'>
                <Label>Position</Label>
                <Input type="text" placeholder="Software Engineer" />
            </div>

            <div className='flex flex-col gap-y-3'>
                <Label>About</Label>
                <Textarea
                    placeholder="I',m a full stack developer for over 9 years ..."
                    className="h-48"
                />
            </div>

            <Button>Complete profile</Button>

        </form>
    </div>
  )
}

export default page