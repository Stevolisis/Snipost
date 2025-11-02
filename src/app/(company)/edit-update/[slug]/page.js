"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Megaphone, Bug, Sparkles, Save } from 'lucide-react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UpdateEditor from '@/components/appComponents/UpdateEditor';
import { Label } from '@/components/ui/label';
import api from '@/utils/axiosConfig';
import { useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';


const EditUpdate = () => {
  const params = useParams()
  const router = useRouter()
  const { slug } = params
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState(null);
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { jwtToken } = useAppSelector((state) => state.auth)

  // Fetch update data
  const fetchUpdate = async () => {
    if (!slug) return
    
    try {
      setLoading(true)
      const response = await api.get(`get-update/${slug}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      })
      
      const updateData = response.data.update
      if (updateData) {
        setTitle(updateData.title || "")
        
        // Initialize editor content with existing data
        if (updateData.content) {
          setEditorContent({
            html: updateData.content,
            wordCount: updateData.wordCount || 0
          })
        }
      }
    } catch (error) {
      console.error('Error fetching update:', error)
      toast.error('Failed to load update')
      router.push('/updates')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle editor content changes
  const handleEditorChange = (content) => {
    setEditorContent(content);
    console.log('Current editor content:', content);
  };

  // Update the existing update
  const handleUpdateUpdate = async () => {
    if (!title || !editorContent) {
      alert('Please add a title and content');
      return;
    }

    const updateData = {
      title,
      content: editorContent?.html,
      wordCount: editorContent?.wordCount || 0,
    };

    console.log('Updating update:', updateData);
    
    try {
      setUpdating(true)
      const {data} = await api.patch(`/edit-update/${slug}`, updateData,{
        headers:{
          Authorization: `Bearer ${jwtToken}`
        }
      });
      console.log('Update updated successfully:', data);
      toast.success(data?.message || 'Update updated successfully');
      router.push('/my-updates');
    } catch (error) {
      console.error('Error updating update:', error);
      toast.error(error.response?.data?.message || 'Error updating update');
    } finally {
      setUpdating(false)
    }
  };

  useEffect(() => {
    if (slug && jwtToken) {
      fetchUpdate()
    }
  }, [slug, jwtToken])

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="w-full min-h-screen flex flex-col">
      {/* Example Update Preview Skeleton */}
      <div className="bg-muted/10 rounded-2xl p-6 md:p-10 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
        
        <Skeleton className="h-5 w-48 mb-6" />

        {/* Update Card Preview Skeleton */}
        <div className="border-l-4 border-primary bg-secondary/30 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-2 ml-7">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="space-y-2 ml-7">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="w-full mt-5">
        <Card className="bg-transparent w-full border-zinc-800">
          <CardContent className="p-6">
            <div className="mb-6">
              <Skeleton className="h-4 w-16 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Section Skeleton */}
      <div className="mt-6 p-6 bg-muted/10 rounded-lg border border-zinc-800">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="w-full min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Example Update Preview */}
      <div className="bg-muted/10 rounded-2xl p-6 md:p-10 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Megaphone className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Edit Update & Changelog
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Update and modify your project changes, improvements, and bug fixes
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
          <p className="text-sm text-zinc-400">
            💡 <span className="text-white font-medium">Tip:</span> Keep your updates clear and concise. 
            Group related changes together and use bullet points for easy scanning.
          </p>
        </div>
      </div>

      {/* Your Update Form */}
      <div className="w-full mt-5">
        <Card className="bg-transparent w-full border-zinc-800">
          <CardContent className="p-6">
            <div className="mb-6">
              <Label>Title</Label>
              <Input
                placeholder="Title e.g., v2.4.0 - Major Update" 
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg mt-3"
              />
            </div>
            
            {/* Pass the callback function to UpdateEditor with initial content */}
            <UpdateEditor 
              onContentChange={handleEditorChange} 
              initialContent={editorContent?.html}
            />
          </CardContent>
        </Card>
      </div>

      {/* Submit Section */}
      <div className="mt-6 p-6 bg-muted/10 rounded-lg border border-zinc-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-white">Ready to update?</h3>
            <p className="text-sm text-zinc-400">
              {editorContent ? `${editorContent.wordCount} words written` : 'Start writing your update...'}
            </p>
           {title ?  
            <p className="text-sm text-zinc-400"> {`Title: "${title}"`} </p> :
             <p className="text-sm text-red-400">  Fill Title Field</p>
           }
          </div>
          <Button 
            onClick={handleUpdateUpdate}
            disabled={!title || !editorContent || updating}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Save size={16} />
            {updating ? "Updating..." : "Update Update"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditUpdate;