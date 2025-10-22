'use client';
import React, { useState, useEffect, useReducer } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { createLowlight } from 'lowlight';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading3,
  Quote, 
  Underline as UnderlineIcon,
  Highlighter, 
  Strikethrough,
  Pilcrow,
  Save,
  Crown,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import "./editor.css";

// Initialize syntax highlighter with ALL languages
const lowlight = createLowlight();

// CONFIGURABLE VARIABLES - You can change these as needed
const maxWordTreshold = 60; // Your original 60 word limit
const warningWordThreshold = 50; // Show crown at 50 words

const MenuBar = ({ editor, maxWordsReached }) => {
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  // Force re-render when editor state changes
  useEffect(() => {
    if (!editor) return;

    const update = () => {
      forceUpdate();
    };

    editor.on('transaction', update);
    editor.on('selectionUpdate', update);
    editor.on('update', update);

    return () => {
      editor.off('transaction', update);
      editor.off('selectionUpdate', update);
      editor.off('update', update);
    };
  }, [editor]);

  if (!editor) return null;

  const handleButtonAction = (action) => {
    if (!maxWordsReached) {
      action();
    }
  };

  const menuGroups = [
    {
      name: 'Headings',
      items: [
        { 
          icon: Heading3, 
          action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: editor.isActive('heading', { level: 3 }),
          title: 'Heading 3'
        },
        { 
          icon: Pilcrow, 
          action: () => editor.chain().focus().setParagraph().run(),
          isActive: editor.isActive('paragraph'),
          title: 'Paragraph'
        },
      ]
    },
    {
      name: 'Formatting',
      items: [
        { 
          icon: Bold, 
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive('bold'),
          title: 'Bold'
        },
        { 
          icon: Italic, 
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive('italic'),
          title: 'Italic'
        },
        { 
          icon: UnderlineIcon, 
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: editor.isActive('underline'),
          title: 'Underline'
        },
        { 
          icon: Strikethrough, 
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: editor.isActive('strike'),
          title: 'Strikethrough'
        },
        { 
          icon: Highlighter, 
          action: () => editor.chain().focus().toggleHighlight().run(),
          isActive: editor.isActive('highlight'),
          title: 'Highlight'
        }
      ]
    },
    {
      name: 'Lists & Blocks',
      items: [
        { 
          icon: List, 
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive('bulletList'),
          title: 'Bullet List'
        },
        { 
          icon: ListOrdered, 
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive('orderedList'),
          title: 'Ordered List'
        },
        { 
          icon: Quote, 
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive('blockquote'),
          title: 'Blockquote'
        },
      ]
    },
    {
      name: 'History',
      items: [
        { 
          icon: Undo, 
          action: () => editor.chain().focus().undo().run(),
          isActive: false,
          title: 'Undo',
          disabled: !editor.can().undo()
        },
        { 
          icon: Redo, 
          action: () => editor.chain().focus().redo().run(),
          isActive: false,
          title: 'Redo',
          disabled: !editor.can().redo()
        },
      ]
    },
  ];

  return (
    <Card className="rounded-none border-b-0 sticky top-0 z-40 bg-background">
      <CardContent className="p-3">
        <div className="flex flex-wrap gap-2 items-center">
          {menuGroups.map((group, groupIndex) => (
            <React.Fragment key={group.name}>
              {groupIndex > 0 && <Separator orientation="vertical" className="h-6" />}
              
              <div className="flex gap-1">
                {group.items.map((item) => (
                  <Button
                    key={item.title}
                    onClick={() => handleButtonAction(item.action)}
                    variant={item.isActive ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    title={maxWordsReached ? `Word limit reached (${maxWordTreshold} words)` : item.title}
                    disabled={maxWordsReached || item.disabled}
                  >
                    <item.icon size={16} />
                  </Button>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function UpdateEditor({ onContentChange, initialContent }) {
  const [isClient, setIsClient] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [maxWordsReached, setMaxWordsReached] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateWordCount = (text) => {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3],
        },
        history: {
          depth: 100,
        },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
    ],
    content: initialContent || `    
        <h3>✨ New Features:</h3>
        <ul>
        <li>Added developer search by GitHub, X, Discord, and LinkedIn profiles</li>
        <li>Real-time collaboration with cursor tracking</li>
        <li>AI-powered code suggestions and auto-completion</li>
        <li>Dark mode improvements with custom themes</li>
        </ul>

        <h3>🐛 Bug Fixes:</h3>
        <ul>
        <li>Fixed syntax highlighting for Rust and Go</li>
        <li>Resolved WebSocket reconnection issues</li>
        <li>Improved mobile responsiveness</li>
        </ul>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-6 focus:outline-none min-h-[400px] overflow-y-auto',
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const currentWordCount = calculateWordCount(text);
      
      // Update word count
      setWordCount(currentWordCount);
      
      // Handle both reaching and going below the limit
      if (currentWordCount >= maxWordTreshold) {
        if (!maxWordsReached) {
          setMaxWordsReached(true);
          setShowLimitWarning(true);
          setTimeout(() => setShowLimitWarning(false), 3000);
        }
      } else {
        // If we go below the threshold, remove the limit
        if (maxWordsReached) {
          setMaxWordsReached(false);
        }
      }

      // Send content to parent component
      if (onContentChange) {
        const content = {
          html: editor.getHTML(),
          json: editor.getJSON(),
          text: editor.getText(),
          wordCount: currentWordCount
        };
        onContentChange(content);
      }
    },
  });

  // Handle keyboard shortcuts - FIXED: Always allow undo/redo
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event) => {
      // ALWAYS allow undo/redo regardless of word limit
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        if (event.shiftKey) {
          // Ctrl+Shift+Z for redo
          if (editor.can().redo()) {
            event.preventDefault();
            editor.chain().focus().redo().run();
            return;
          }
        } else {
          // Ctrl+Z for undo
          if (editor.can().undo()) {
            event.preventDefault();
            editor.chain().focus().undo().run();
            return;
          }
        }
      }

      // Prevent typing when limit is reached (but allow navigation and undo/redo)
      if (maxWordsReached && 
          !event.ctrlKey && !event.metaKey && 
          event.key.length === 1 && // Single character keys
          !event.altKey) {
        event.preventDefault();
        return;
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('keydown', handleKeyDown);

    return () => {
      editorElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, maxWordsReached]);

  // Handle paste events
  useEffect(() => {
    if (!editor) return;

    const handlePaste = (event) => {
      const pastedText = event.clipboardData?.getData('text/plain') || '';
      const pastedWords = calculateWordCount(pastedText);
      
      if (maxWordsReached || wordCount + pastedWords > maxWordTreshold) {
        event.preventDefault();
        setShowLimitWarning(true);
        setTimeout(() => setShowLimitWarning(false), 3000);
        return false;
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('paste', handlePaste, true);

    return () => {
      editorElement.removeEventListener('paste', handlePaste, true);
    };
  }, [editor, maxWordsReached, wordCount]);

  // Set editor to non-editable when limit reached (but allow undo/redo through keyboard)
  useEffect(() => {
    if (editor) {
      if (maxWordsReached) {
        // Only disable editing through the editor's own API
        // This still allows keyboard shortcuts to work
        editor.setOptions({ editable: false });
      } else {
        editor.setOptions({ editable: true });
      }
    }
  }, [editor, maxWordsReached]);

  const showCrown = wordCount >= warningWordThreshold;

  if (!isClient) {
    return (
      <div className="w-full flex flex-col">
        <Card className="rounded-none border-b-0">
          <CardHeader className="pb-3">
            <CardTitle>Update Editor</CardTitle>
          </CardHeader>
        </Card>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-auto flex flex-col">
      {/* Header */}
      <Card className="border-b-0 rounded-none sticky top-0 z-30 bg-background">
        <CardHeader className="">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Update Editor</CardTitle>
              <p className="text-sm text-muted-foreground">Write your project updates</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge 
                variant={maxWordsReached ? "destructive" : wordCount >= warningWordThreshold ? "default" : "secondary"}
                className="flex items-center gap-2"
              >
                {wordCount} / {maxWordTreshold} words
                {showCrown && <Crown size={14} className="text-yellow-400" />}
                {maxWordsReached && <span className="ml-1">(Max Reached)</span>}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Warning Toast */}
      {showLimitWarning && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Card className="bg-destructive text-destructive-foreground border-destructive">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Crown size={16} />
                <span className="font-medium">Word limit reached! Maximum {maxWordTreshold} words allowed.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Editor Menu */}
      <div className="sticky top-[73px] z-40 bg-background border-b">
        <MenuBar editor={editor} wordCount={wordCount} maxWordsReached={maxWordsReached} />
      </div>

      {/* Editor Content - REMOVED pointer-events-none */}
      <Card className="flex-1 rounded-none border-0 flex flex-col relative" style={{ height: '500px' }}>
        <CardContent className="p-0 flex-1 h-full overflow-hidden">
          <div className="h-full overflow-y-auto">
            <EditorContent 
              editor={editor} 
              className="h-full" 
            />
          </div>
          {maxWordsReached && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="text-center p-4 bg-background border rounded-lg shadow-lg">
                <Crown size={48} className="text-yellow-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-2">Word Limit Reached!</h3>
                <p className="text-muted-foreground">You've reached the maximum of {maxWordTreshold} words.</p>
                <p className="text-sm text-muted-foreground mt-1">Use <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Z</kbd> to undo and continue editing.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}