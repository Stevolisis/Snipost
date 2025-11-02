"use client";
import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import api from "@/utils/axiosConfig";
import "@/components/appComponents/editor.css";
import { useParams } from "next/navigation";
import { formatPublishedDate } from "@/utils/formatPublishedDate";
import { toast } from "sonner";
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { TableKit } from '@tiptap/extension-table';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';

// Register languages
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import ruby from "highlight.js/lib/languages/ruby";
import php from "highlight.js/lib/languages/php";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import swift from "highlight.js/lib/languages/swift";
import kotlin from "highlight.js/lib/languages/kotlin";
import scala from "highlight.js/lib/languages/scala";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import shell from "highlight.js/lib/languages/shell";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import xml from "highlight.js/lib/languages/xml";
import scss from "highlight.js/lib/languages/scss";

const lowlight = createLowlight();
[
  ["html", html],
  ["css", css],
  ["javascript", js],
  ["typescript", ts],
  ["python", python],
  ["java", java],
  ["ruby", ruby],
  ["php", php],
  ["c", c],
  ["cpp", cpp],
  ["csharp", csharp],
  ["go", go],
  ["rust", rust],
  ["swift", swift],
  ["kotlin", kotlin],
  ["scala", scala],
  ["sql", sql],
  ["bash", bash],
  ["shell", shell],
  ["json", json],
  ["yaml", yaml],
  ["markdown", markdown],
  ["dockerfile", dockerfile],
  ["xml", xml],
  ["scss", scss],
].forEach(([lang, module]) => lowlight.register(lang, module));

const EachDocPage = () => {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const docSlug = params.docs_slug;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        history: {
          depth: 100,
        },
      }),
      HorizontalRule,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ 
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right']
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { 
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TableKit.configure({
        table: { 
          resizable: true,
          HTMLAttributes: {
            class: 'tiptap-table',
          },
        },
      }),
      CodeBlockLowlight.configure({ 
        lowlight,
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
    ],
    content: "",
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none p-6 focus:outline-none min-h-[500px] prose-headings:text-white prose-p:text-zinc-300 prose-ul:text-zinc-300 prose-ol:text-zinc-300 prose-strong:text-white prose-code:text-zinc-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:text-zinc-300 prose-li:text-zinc-300",
      },
    },
  });

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const { data } = await api.get(`get-documentation/${docSlug}`);
        setDoc(data.documentation);
        editor?.commands.setContent(data.documentation.content);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load documentation");
      }
    };
    if (docSlug) fetchDoc();
  }, [docSlug, editor]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Loading...
      </div>
    );

  if (!doc)
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Documentation not found.
      </div>
    );

  return (
    <div className="min-h-[600px]">
      <div className="border-b border-zinc-800 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{doc.title}</h1>
            <p className="text-zinc-400 mb-3">{doc.description}</p>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span className="capitalize bg-zinc-800 px-3 py-1 rounded-md">
                {doc.templateId}
              </span>
              <span>Published: {formatPublishedDate(doc.createdAt)}</span>
              <span>By: {doc?.company?.name || "comp name"}</span>
            </div>
          </div>
        </div>
      </div>
      <EditorContent editor={editor} className="h-full" />
    </div>
  );
};

export default EachDocPage;
