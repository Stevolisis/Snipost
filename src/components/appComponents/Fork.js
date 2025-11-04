"use client"
import React, { useState } from 'react'
import { GitFork, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/redux/hooks'
import api from '@/utils/axiosConfig'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { trackFork } from '@/lib/analytics'

export const Fork = ({ snippet, contentType, hasForked }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { jwtToken } = useAppSelector((state) => state.auth)
  const forkCount = snippet.forks?.length || 0

  const handleFork = async () => {
    setIsLoading(true)
    try {
      const response = await api.post(
        `/fork-content/${contentType}/${snippet._id}/${snippet.slug}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        }
      )
      
      toast.success('Content forked successfully!');
      trackFork(snippet.title);
      router.push(`/edit-snippet/${response.data.fork._id}`)
    } catch (error) {
      toast.error('Failed to fork content')
      console.error('Fork error:', error)
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  const handleViewForks = () => {
    router.push(`/snippet/${snippet._id}/forks`)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`hover:bg-[#A246FD]/10 border hover:text-[#A246FD] hover:border-[#A246FD]! 
              ${hasForked && "border-[#A246FD]!"}`}
          >
            <GitFork className={`h-4 w-4 ${hasForked ? "text-[#A246FD]" : ""}`} />
            <span className={`ml-1 ${hasForked ? "text-[#A246FD]" : ""}`}>
              {forkCount}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem 
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          >
            <GitFork className="mr-2 h-4 w-4" />
            <span>Fork this snipost</span>
          </DropdownMenuItem>
          {forkCount > 0 && (
            <DropdownMenuItem 
              onClick={handleViewForks}
              className="cursor-pointer"
            >
              <ChevronRight className="mr-2 h-4 w-4" />
              <span>View Forks</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex justify-center">
              <GitFork className="h-12 w-12 text-[#A246FD]" />
            </div>
            <DialogTitle className="text-center">Fork this {contentType}</DialogTitle>
            <DialogDescription className="text-center">
              You're about to create your own copy of this {contentType.toLowerCase()}. 
              The original author will be credited.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Your fork will start as an exact copy that you can modify.
            </p>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleFork}
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#A246FD] hover:bg-[#A246FD]/90 text-gray-900"
            >
              {isLoading ? 'Forking...' : 'Create Fork'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}