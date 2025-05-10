"use client"
import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div className='w-full flex justify-center items-center'>
        <form className='w-[93%] md:w-[50%] flex flex-col gap-y-5 md:gap-y-8'>
            <div className='flex flex-col gap-y-3'>
                <Label className="text-sm md:text-base">Avatar</Label>
                <Input className="" type="file" placeholder="John Doe" />
            </div>

            <div className='flex flex-col gap-y-3'>
                <Label className="text-sm md:text-base">Name</Label>
                <Input className="" type="text" placeholder="John Doe" required/>
            </div>

            <div className='flex flex-col gap-y-3'>
                <Label className="text-sm md:text-base">UserName</Label>
                <Input className="" type="text" placeholder="JohnDev" required/>
            </div>
            
            <div className='flex flex-col gap-y-3'>
                <Label className="text-sm md:text-base">Email</Label>
                <Input className="" type="email" placeholder="john@gmail.com" />
            </div>

            <div className='flex flex-col gap-y-3'>
                <Label className="text-sm md:text-base">Position</Label>
                <Input className="" type="text" placeholder="Software Engineer" />
            </div>

            <div className='flex flex-col gap-y-3'>
                <Label className="text-sm md:text-base">About</Label>
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