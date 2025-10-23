"use client";
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import scala from 'highlight.js/lib/languages/scala';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import "./editor.css";
import api from '@/utils/axiosConfig';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/redux/hooks';
import { formatPublishedDate } from '@/utils/formatPublishedDate';
import { useParams } from 'next/navigation';

// Initialize syntax highlighter
const lowlight = createLowlight();
[
  ['html', html], ['css', css], ['javascript', js], ['typescript', ts],
  ['python', python], ['java', java], ['ruby', ruby], ['php', php],
  ['c', c], ['cpp', cpp], ['csharp', csharp], ['go', go], ['rust', rust],
  ['swift', swift], ['kotlin', kotlin], ['scala', scala], ['sql', sql],
  ['bash', bash], ['shell', shell], ['json', json], ['yaml', yaml],
  ['markdown', markdown], ['dockerfile', dockerfile], ['xml', xml], ['scss', scss]
].forEach(([lang, module]) => lowlight.register(lang, module));

const CompanyDocs = () => {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const dispatch = useAppDispatch();
  const params = useParams();
  const companyId = params.id; 
  console.log("Company ID from params:", companyId);

  // Initialize TipTap editor (read-only)
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
    editable: false, // Make it read-only
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-6 focus:outline-none min-h-[500px] prose-headings:text-white prose-p:text-zinc-300 prose-ul:text-zinc-300 prose-ol:text-zinc-300 prose-strong:text-white prose-code:text-zinc-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:text-zinc-300 prose-li:text-zinc-300',
      },
    },
  });

  // Fetch documentation from API
  useEffect(() => {
    const fetchComapnyDocumentations = async () => {
      try {
        const {data} = await api.get(`get-company-documentations/${companyId}`);
        console.log("Response data in CompanyDocsExamples:", data);
          setDocs(data.documentations);
          setSelectedDoc(data.documentations[0]);
          setLoading(false);
      } catch(err) {
        console.log(err)
        toast.error(err?.response?.data?.message || 'Failed to load documentations');
      }
    };

    fetchComapnyDocumentations();
  }, [dispatch, companyId]);

  // Update editor content when selected document changes
  useEffect(() => {
    if (editor && selectedDoc) {
      editor.commands.setContent(selectedDoc.content);
    }
  }, [editor, selectedDoc]);

  // Horizontal scroll functions
  const scrollLeft = () => {
    const container = document.getElementById('docs-scroll-container');
    if (container) {
      container.scrollLeft -= 300;
      setScrollPosition(container.scrollLeft - 300);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('docs-scroll-container');
    if (container) {
      container.scrollLeft += 300;
      setScrollPosition(container.scrollLeft + 300);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col space-y-6 box-contain">
      {/* Horizontal Scrolling Docs List */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Company Documentation</h2>
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-lg border border-zinc-800 hover:border-primary/50 hover:bg-zinc-800/30 transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-zinc-400" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-lg border border-zinc-800 hover:border-primary/50 hover:bg-zinc-800/30 transition-all"
            >
              <ChevronRight className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
        </div>

        <div
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 w-full md:w-[50vw]"
          style={{ scrollBehavior: 'smooth' }}
          id="docs-scroll-container"
        >
          {docs.map((doc) => (
            <button
              key={doc._id}
              onClick={() => setSelectedDoc(doc)}
              className={`flex-shrink-0 w-80 text-left p-4 cursor-pointer rounded-xl border transition-all duration-200 ${
                selectedDoc?._id === doc._id
                  ? "border-primary bg-primary/10 text-white"
                  : "border-zinc-800 hover:border-primary/50 hover:bg-zinc-800/30 text-zinc-300"
              }`}
            >
              <h3 className="font-semibold text-base mb-2 line-clamp-1">{doc.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded capitalize">
                  {doc.templateId}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatPublishedDate(doc.createdAt)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Documentation Content */}
      <div className="">
        <Card className="bg-transparent w-full border-zinc-800">
          <CardContent className="p-0">
            {/* Documentation Header */}
            {selectedDoc && (
              <div className="border-b border-zinc-800 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{selectedDoc.title}</h1>
                    <p className="text-zinc-400 mb-3">{selectedDoc.description}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <span className="capitalize bg-zinc-800 px-3 py-1 rounded-md">
                        {selectedDoc.templateId}
                      </span>
                      <span>Published: {formatPublishedDate(selectedDoc.createdAt)}</span>
                      <span>By: {selectedDoc?.company?.name || "comp name"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documentation Content with TipTap */}
            <div className="min-h-[600px]">
              {selectedDoc ? (
                <EditorContent 
                  editor={editor} 
                  className="h-full" 
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-zinc-400">
                  <p>Select a documentation from above to view its content.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CompanyDocs