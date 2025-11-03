"use client";
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { Megaphone, Calendar, Building2, ChevronDown, ChevronUp } from 'lucide-react'
import "@/components/appComponents/editor.css";
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/utils/axiosConfig';
import { useAppSelector } from '@/lib/redux/hooks';

// Initialize syntax highlighter
const lowlight = createLowlight();
[['html', html], ['css', css], ['javascript', js], ['typescript', ts]].forEach(([lang, module]) => lowlight.register(lang, module));


const CompanyDocsUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUpdate, setExpandedUpdate] = useState(null);
  const params = useParams();
  const companySlug = params.username; 
  const { profile } = useAppSelector((state) => state.profile)

  // Fetch updates from API
  useEffect(() => {
    const fetchComapnyUpdates = async () => {
      try {
        const {data} = await api.get(`get-company-updates/${profile?._id}`);
        console.log("Response data in CompanyDocsExamples:", data);
          setUpdates(data.updates || []);
          setLoading(false);
      } catch(err) {
        console.log(err);
        setLoading(false);
        toast.error(err?.response?.data?.message || 'Failed to load updates');
      }
    };

    fetchComapnyUpdates();
  }, [companySlug]);


  const UpdateCard = ({ update }) => {
    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        CodeBlockLowlight.configure({ 
          lowlight,
          HTMLAttributes: {
            class: 'code-block',
          },
        }),
      ],
      content: '',
      editable: false,
      editorProps: {
        attributes: {
          class: 'prose prose-invert max-w-none p-4 focus:outline-none prose-headings:text-white prose-p:text-zinc-300 prose-ul:text-zinc-300 prose-ol:text-zinc-300 prose-strong:text-white prose-code:text-zinc-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:text-zinc-300 prose-li:text-zinc-300 prose-h2:text-lg prose-h3:text-base',
        },
      },
    });

    useEffect(() => {
      if (editor && update.content) {
        editor.commands.setContent(update.content);
      }
    }, [editor, update.content]);

    const isExpanded = expandedUpdate === update._id;

    return (
      <Card className="bg-transparent border-zinc-800 hover:border-zinc-700 transition-colors">
        <CardContent className="p-0">
          {/* Update Header */}
          <button
            onClick={() => setExpandedUpdate(isExpanded ? null : update._id)}
            className="w-full cursor-pointer text-left p-6 hover:bg-zinc-800/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Megaphone className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{update.title}</h3>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-zinc-400 ml-11">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" />
                    <span>{update.company.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span>{update.wordCount} words</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                )}
              </div>
            </div>
          </button>

          {/* Update Content */}
          {isExpanded && (
            <div className="border-t border-zinc-800">
              <EditorContent 
                editor={editor} 
                className="max-h-96 overflow-y-auto" 
                id="custom-scroll"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Megaphone className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Updates & Changelog</h1>
          <p className="text-zinc-400 mt-1">
            Stay informed about the latest changes and improvements
          </p>
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {updates.length > 0 ? (
          updates.map((update) => (
            <UpdateCard key={update._id} update={update} />
          ))
        ) : (
          <Card className="bg-transparent border-zinc-800">
            <CardContent className="p-8 text-center">
              <Megaphone className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No updates yet</h3>
              <p className="text-zinc-400">
                This company hasn't published any updates yet. Check back later for news and announcements.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats */}
      {updates.length > 0 && (
        <Card className="bg-transparent border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>Total updates: {updates.length}</span>
              <span>Latest update: {new Date(updates[0]?.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyDocsUpdates;