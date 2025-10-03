'use client';
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
  Link2, Quote, Code, Grid3x3, AlignLeft, AlignCenter, 
  AlignRight, Eye, FileDown, Plus, Minus, Trash2
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border-b border-gray-700 bg-gray-800 p-3 flex flex-wrap gap-2 sticky top-0 z-10">
      {/* Headings */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : ''}`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : ''}`}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      {/* Text Formatting */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('bold') ? 'bg-blue-600 text-white' : ''}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('italic') ? 'bg-blue-600 text-white' : ''}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      {/* Lists */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : ''}`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('orderedList') ? 'bg-blue-600 text-white' : ''}`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      {/* Link & Quote */}
      <div className="flex gap-1">
        <button
          onClick={addLink}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('link') ? 'bg-blue-600 text-white' : ''}`}
          title="Add Link"
        >
          <Link2 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('blockquote') ? 'bg-blue-600 text-white' : ''}`}
          title="Blockquote"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive('codeBlock') ? 'bg-blue-600 text-white' : ''}`}
          title="Code Block"
        >
          <Code size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      {/* Alignment */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white' : ''}`}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white' : ''}`}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded text-gray-300 hover:bg-gray-700 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white' : ''}`}
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      {/* Table Controls */}
      <div className="flex gap-1">
        <button
          onClick={insertTable}
          className="p-2 rounded text-gray-300 hover:bg-gray-700"
          title="Insert Table"
        >
          <Grid3x3 size={18} />
        </button>
        
        {editor.isActive('table') && (
          <>
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="p-2 rounded text-gray-300 hover:bg-gray-700"
              title="Add Column Before"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="p-2 rounded text-gray-300 hover:bg-gray-700"
              title="Delete Column"
            >
              <Minus size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="p-2 rounded text-gray-300 hover:bg-gray-700"
              title="Add Row Before"
            >
              <span className="text-xs font-bold">R+</span>
            </button>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="p-2 rounded text-gray-300 hover:bg-gray-700"
              title="Delete Row"
            >
              <span className="text-xs font-bold">R-</span>
            </button>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="p-2 rounded text-red-400 hover:bg-red-900"
              title="Delete Table"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function SnipostEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '<h1>Welcome to Snipost Editor</h1><p>Start documenting your Web3 project. Select text and use the toolbar above to format.</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-6 focus:outline-none min-h-full',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setMarkdown(html);
    },
  });

  const getMarkdown = () => {
    const html = editor?.getHTML() || '';
    return html;
  };

  const downloadMarkdown = () => {
    const md = getMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snipost-doc.md';
    a.click();
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Snipost Editor</h1>
          <p className="text-sm opacity-90">Web3 Documentation Platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            <Eye size={18} />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={downloadMarkdown}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            <FileDown size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      {!showPreview && <MenuBar editor={editor} />}

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-900">
        {showPreview ? (
          <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-200">HTML Output:</h2>
            <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-auto text-sm border border-gray-700">
              {getMarkdown()}
            </pre>
          </div>
        ) : (
          <EditorContent editor={editor} className="h-full bg-gray-900 text-gray-100" />
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 100%;
          color: #e5e7eb;
          background-color: #111827;
          padding: 2rem;
        }
        
        .ProseMirror:focus {
          outline: none;
        }
        
        .ProseMirror h1 {
          font-size: 2.5em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
          color: #f3f4f6;
        }
        
        .ProseMirror h2 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
          color: #f3f4f6;
        }
        
        .ProseMirror h3 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
          color: #f3f4f6;
        }
        
        .ProseMirror p {
          margin: 1em 0;
          line-height: 1.7;
          color: #d1d5db;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 2em;
          margin: 1em 0;
          color: #d1d5db;
        }
        
        .ProseMirror ul {
          list-style-type: disc;
        }
        
        .ProseMirror ol {
          list-style-type: decimal;
        }
        
        .ProseMirror li {
          margin: 0.5em 0;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1em;
          margin: 1em 0;
          color: #9ca3af;
          font-style: italic;
        }
        
        .ProseMirror code {
          background-color: #374151;
          color: #fbbf24;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        
        .ProseMirror pre {
          background-color: #1f2937;
          color: #e5e7eb;
          padding: 1.5em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5em 0;
          border: 1px solid #374151;
        }
        
        .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
          font-size: 0.875em;
          line-height: 1.6;
        }
        
        .ProseMirror a {
          color: #60a5fa;
          text-decoration: underline;
          cursor: pointer;
        }
        
        .ProseMirror a:hover {
          color: #93c5fd;
        }
        
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5em 0;
          background-color: #1f2937;
        }
        
        .ProseMirror td,
        .ProseMirror th {
          border: 1px solid #374151;
          padding: 0.75em;
          text-align: left;
          color: #d1d5db;
        }
        
        .ProseMirror th {
          background-color: #374151;
          font-weight: bold;
          color: #f3f4f6;
        }
        
        .ProseMirror tr:hover {
          background-color: #2d3748;
        }
        
        .ProseMirror .selectedCell {
          background-color: #3b82f6;
        }
        
        .ProseMirror strong {
          font-weight: bold;
          color: #f3f4f6;
        }
        
        .ProseMirror em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}