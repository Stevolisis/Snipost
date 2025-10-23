"use client"
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Megaphone, Bug, Sparkles, Shield, Zap, Save } from 'lucide-react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UpdateEditor from '@/components/appComponents/UpdateEditor';
import { Label } from '@/components/ui/label';
import api from '@/utils/axiosConfig';
import { useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'sonner';

const exampleUpdate = {
  version: "v2.4.0 - Major Update",
  date: "Oct 3, 2025",
  newFeatures: [
    "Added developer search by GitHub, X, Discord, and LinkedIn profiles",
    "Real-time collaboration with cursor tracking",
    "AI-powered code suggestions and auto-completion",
    "Dark mode improvements with custom themes"
  ],
  bugFixes: [
    "Fixed syntax highlighting for Rust and Go",
    "Resolved WebSocket reconnection issues",
    "Improved mobile responsiveness"
  ]
};

const CreateUpdate = () => {
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState(null);
  const { jwtToken } = useAppSelector((state) => state.auth)

  
  // Handle editor content changes
  const handleEditorChange = (content) => {
    setEditorContent(content);
    console.log('Current editor content:', content);
  };

  // Submit the final form
  const handleSubmitUpdate = async () => {
    if (!title || !editorContent) {
      alert('Please add a title and content');
      return;
    }

    const updateData = {
      title,
      content: editorContent?.html,
      wordCount: editorContent?.wordCount || 0,
    };

    console.log('Submitting update:', updateData);
    
    // Here you would make your API call
    try {
      const {data} = await api.post('/create-update', updateData,{
        headers:{
          Authorization: `Bearer ${jwtToken}`
        }
      });
      console.log('Update created successfully:', data);
      setTitle("");
      setEditorContent(null);
      // For now, just log to console
      toast.success(data?.message || 'Update created successfully');
    } catch (error) {
      console.error('Error submitting update:', error);
      toast.error('Error creating update');
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      {/* Example Update Preview */}
      <div className="bg-muted/10 rounded-2xl p-6 md:p-10 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Megaphone className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Create Update & Changelog
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Track all changes, improvements, and bug fixes to your project
            </p>
          </div>
        </div>
        <h3 className="text-base font-semibold mb-6 text-white flex items-center gap-2">
          <span className="text-zinc-400">Example:</span> How your update will look
        </h3>

        {/* Update Card Preview */}
        <div className="border-l-4 border-primary bg-secondary/30 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-xl font-bold text-primary">
              {exampleUpdate.version}
            </h4>
            <span className="text-sm text-zinc-400">{exampleUpdate.date}</span>
          </div>

          {/* New Features Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h5 className="font-semibold text-white">New Features:</h5>
            </div>
            <ul className="space-y-2 ml-7">
              {exampleUpdate.newFeatures.map((feature, index) => (
                <li key={index} className="text-sm text-zinc-300">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Bug Fixes Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bug className="h-5 w-5 text-green-400" />
              <h5 className="font-semibold text-white">Bug Fixes:</h5>
            </div>
            <ul className="space-y-2 ml-7">
              {exampleUpdate.bugFixes.map((fix, index) => (
                <li key={index} className="text-sm text-zinc-300">
                  • {fix}
                </li>
              ))}
            </ul>
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
            
            {/* Pass the callback function to UpdateEditor */}
            <UpdateEditor onContentChange={handleEditorChange} />
          </CardContent>
        </Card>
      </div>

      {/* Submit Section */}
      <div className="mt-6 p-6 bg-muted/10 rounded-lg border border-zinc-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-white">Ready to publish?</h3>
            <p className="text-sm text-zinc-400">
              {editorContent ? `${editorContent.wordCount} words written` : 'Start writing your update...'}
             
            </p>
           {title ?  
            <p className="text-sm text-zinc-400"> {`Title: "${title}"`} </p> :
             <p className="text-sm text-red-400">  Fill Title Field</p>
           }
          </div>
          <Button 
            onClick={handleSubmitUpdate}
            disabled={!title || !editorContent}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Save size={16} />
            Publish Update
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateUpdate;