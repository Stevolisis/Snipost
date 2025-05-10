"use client"
import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CodeLanguage } from '@/components/appComponents/CodeLanguage';
import { codeLanguages } from '@/components/appComponents/CodeEditor/getExtensions';
const CodeEditor = dynamic(() => import('@/components/appComponents/CodeEditor/index'), {
  ssr: false,
  loading: () => (
    <pre className="p-4 rounded-md overflow-x-auto">
      Loading code editor...
    </pre>
  )
});
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const SnippetEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [codeBlocks, setCodeBlocks] = useState([
    { name: "", language: "javascript", content: "" }
  ]);
  const [folder, setFolder] = useState("");
  const [type, setType] = useState("public");

  const handleAddCodeBlock = () => {
    setCodeBlocks([...codeBlocks, { name: "", language: "javascript", content: "" }]);
  };

  const handleRemoveCodeBlock = (index) => {
    if (codeBlocks.length > 1) {
      const newCodeBlocks = [...codeBlocks];
      newCodeBlocks.splice(index, 1);
      setCodeBlocks(newCodeBlocks);
    }
  };

  const handleCodeBlockChange = (index, field, value) => {
    const newCodeBlocks = [...codeBlocks];
    newCodeBlocks[index][field] = value;
    setCodeBlocks(newCodeBlocks);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePublish = () => {
    const snippetData = {
      title,
      description,
      tags,
      codeBlocks,
      folder,
      type
    };

    console.log("Publishing snippet:", snippetData);
    // Here you would typically send this data to your backend API
    // Example: await api.post('/snippets', snippetData);
  };

  return (
    <div className="flex justify-center">
      <Card className="px-6 bg-transparent w-[97%] md:w-[80%]">
        <div className="my-4">
          <Input 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="my-4">
          <Textarea 
            placeholder="Description" 
            className="h-32" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="my-4">
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add tags (JavaScript, Python, etc.)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <div key={tag} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <span>{tag}</span>
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Visibility Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Visibility</SelectLabel>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={folder} onValueChange={setFolder} className="w-full mt-6">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Folder</SelectLabel>
                <SelectItem value="681a8ee804258036305755ec">My Folder</SelectItem>
                {/* Add more folders as needed */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {codeBlocks.map((block, index) => (
          <Card key={index} className="rounded-bl-sm rounded-br-sm mb-4">
            <CardHeader className="flex justify-between items-center">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="file name e.g index.ts"
                  value={block.name}
                  onChange={(e) => handleCodeBlockChange(index, 'name', e.target.value)}
                />
              </div>

              <div className='flex items-center gap-x-2 ml-4'>
                <div className="hidden md:block">
                  <CodeLanguage
                    languages={codeLanguages}
                    value={block.language}
                    onChange={(value) => handleCodeBlockChange(index, 'language', value)}
                  />
                </div>
                {codeBlocks.length > 1 && (
                  <button
                    onClick={() => handleRemoveCodeBlock(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className='pt-4'>
                <CodeEditor
                  value={block.content}
                  onChange={(value) => handleCodeBlockChange(index, 'content', value)}
                  language={block.language}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className='flex justify-between items-center my-6'>
          <Button variant="outline" onClick={handleAddCodeBlock}>
            Add Snippet
          </Button>
          <Button onClick={handlePublish}>Publish</Button>
        </div>
      </Card>
    </div>
  )
}

export default SnippetEditor