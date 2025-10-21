'use client';
import React, { useState, useEffect, useReducer } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { TableKit } from '@tiptap/extension-table';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
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
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Link2, 
  Quote, 
  Code, 
  Grid3x3, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,  
  Underline as UnderlineIcon,
  Minus, 
  Highlighter, 
  Strikethrough,
  Trash2,
  Pilcrow,
  Save,
  X,
  Crown,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AiOutlineInsertRowAbove, AiOutlineInsertRowBelow, AiOutlineInsertRowLeft, AiOutlineInsertRowRight } from "react-icons/ai";
import "./editor.css";

// Initialize syntax highlighter with ALL languages
const lowlight = createLowlight();

// Register all languages
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('javascript', js);
lowlight.register('typescript', ts);
lowlight.register('python', python);
lowlight.register('java', java);
lowlight.register('ruby', ruby);
lowlight.register('php', php);
lowlight.register('c', c);
lowlight.register('cpp', cpp);
lowlight.register('csharp', csharp);
lowlight.register('go', go);
lowlight.register('rust', rust);
lowlight.register('swift', swift);
lowlight.register('kotlin', kotlin);
lowlight.register('scala', scala);
lowlight.register('sql', sql);
lowlight.register('bash', bash);
lowlight.register('shell', shell);
lowlight.register('json', json);
lowlight.register('yaml', yaml);
lowlight.register('markdown', markdown);
lowlight.register('dockerfile', dockerfile);
lowlight.register('xml', xml);
lowlight.register('scss', scss);

const MenuBar = ({ editor, maxWordsReached }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
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

  const setLink = () => {
    if (linkUrl && !maxWordsReached) {
      const selectedText = editor.state.selection.empty ? linkText : editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );
      
      const finalText = selectedText || linkText || 'Link';
      
      editor.chain().focus().setLink({ href: linkUrl }).insertContent(finalText).run();
    }
    setLinkUrl('');
    setLinkText('');
    setShowLinkDialog(false);
  };

  const setCodeBlock = () => {
    if (!maxWordsReached) {
      editor.chain().focus().toggleCodeBlock({ language: codeLanguage }).run();
    }
    setShowCodeDialog(false);
  };

  const openLinkDialog = () => {
    if (maxWordsReached) return;
    
    // Get selected text for link
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );
    setLinkText(selectedText);
    setShowLinkDialog(true);
  };

  const removeLink = () => {
    if (!maxWordsReached) {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkDialog(false);
  };

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
          icon: Heading1, 
          action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: editor.isActive('heading', { level: 1 }),
          title: 'Heading 1'
        },
        { 
          icon: Heading2, 
          action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: editor.isActive('heading', { level: 2 }),
          title: 'Heading 2'
        },
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
        { 
          icon: Code, 
          action: () => setShowCodeDialog(true),
          isActive: editor.isActive('codeBlock'),
          title: 'Code Block'
        },
      ]
    },
    {
      name: 'Alignment',
      items: [
        { 
          icon: AlignLeft, 
          action: () => editor.chain().focus().setTextAlign('left').run(),
          isActive: editor.isActive({ textAlign: 'left' }),
          title: 'Align Left'
        },
        { 
          icon: AlignCenter, 
          action: () => editor.chain().focus().setTextAlign('center').run(),
          isActive: editor.isActive({ textAlign: 'center' }),
          title: 'Align Center'
        },
        { 
          icon: AlignRight, 
          action: () => editor.chain().focus().setTextAlign('right').run(),
          isActive: editor.isActive({ textAlign: 'right' }),
          title: 'Align Right'
        }
      ]
    },
    {
      name: 'Insert',
      items: [
        { 
          icon: Link2, 
          action: () => openLinkDialog(),
          isActive: editor.isActive('link'),
          title: 'Add Link'
        },
        { 
          icon: Grid3x3, 
          action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
          title: 'Insert Table'
        },
        { 
          icon: Minus, 
          action: () => editor.chain().focus().setHorizontalRule().run(),
          title: 'Horizontal Rule'
        }
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
          disabled: !editor.can().undo() || maxWordsReached
        },
        { 
          icon: Redo, 
          action: () => editor.chain().focus().redo().run(),
          isActive: false,
          title: 'Redo',
          disabled: !editor.can().redo() || maxWordsReached
        },
      ]
    },
  ];

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'php', label: 'PHP' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'scala', label: 'Scala' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'shell', label: 'Shell' },
    { value: 'dockerfile', label: 'Dockerfile' },
    { value: 'plaintext', label: 'Plain Text' }
  ];

  return (
    <>
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
                      title={maxWordsReached ? "Word limit reached (500 words)" : item.title}
                      disabled={maxWordsReached}
                    >
                      <item.icon size={16} />
                    </Button>
                  ))}
                </div>
              </React.Fragment>
            ))}

            {/* Table Controls - Only show when in a table */}
            {editor.isActive('table') && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex gap-1">
                  <Button
                    onClick={() => !maxWordsReached && editor.chain().focus().addColumnBefore().run()}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title={maxWordsReached ? "Word limit reached" : "Add Column Before"}
                    disabled={maxWordsReached}
                  >
                    <AiOutlineInsertRowLeft size={14} />
                  </Button>
                  <Button
                    onClick={() => !maxWordsReached && editor.chain().focus().addColumnAfter().run()}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    title={maxWordsReached ? "Word limit reached" : "Add Column After"}
                    disabled={maxWordsReached}
                  >
                    <AiOutlineInsertRowRight size={14} />
                  </Button>

                  <Button
                    onClick={() => !maxWordsReached && editor.chain().focus().addRowBefore().run()}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title={maxWordsReached ? "Word limit reached" : "Add Row Before"}
                    disabled={maxWordsReached}
                  >
                    <AiOutlineInsertRowAbove size={14} />
                  </Button>
                  <Button
                    onClick={() => !maxWordsReached && editor.chain().focus().addRowAfter().run()}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    title={maxWordsReached ? "Word limit reached" : "Add Row After"}
                    disabled={maxWordsReached}
                  >
                    <AiOutlineInsertRowBelow size={14} />
                  </Button>

                  <Button
                    onClick={() => !maxWordsReached && editor.chain().focus().deleteColumn().run()}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 border border-muted"
                    title={maxWordsReached ? "Word limit reached" : "Delete Column"}
                    disabled={maxWordsReached}
                  >
                    <AiOutlineInsertRowRight size={14} />
                    <Minus size={12} />
                  </Button>
                  <Button
                    onClick={() => !maxWordsReached && editor.chain().focus().deleteRow().run()}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    title={maxWordsReached ? "Word limit reached" : "Delete Row"}
                    disabled={maxWordsReached}
                  >
                    <AiOutlineInsertRowBelow size={14} />
                    <Minus size={12} className="ml-1" />
                  </Button>
                  <Button
                    onClick={() => !maxWordsReached && editor.chain().focus().deleteTable().run()}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive"
                    title={maxWordsReached ? "Word limit reached" : "Delete Table"}
                    disabled={maxWordsReached}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="sm:max-w-md z-50">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              {maxWordsReached 
                ? "Word limit reached (500 words). Cannot add more content."
                : "Add a link to your document. You can use selected text or enter custom link text."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link-text">Link Text</Label>
              <Input
                id="link-text"
                placeholder="Enter link text..."
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                disabled={maxWordsReached}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setLink()}
                disabled={maxWordsReached}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            {editor.isActive('link') && (
              <Button 
                onClick={removeLink} 
                variant="destructive"
                type="button"
                disabled={maxWordsReached}
              >
                Remove Link
              </Button>
            )}
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowLinkDialog(false)} 
                variant="outline" 
                type="button"
              >
                Cancel
              </Button>
              <Button onClick={setLink} type="button" disabled={maxWordsReached}>
                Insert Link
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Block Dialog */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="sm:max-w-md z-50">
          <DialogHeader>
            <DialogTitle>Insert Code Block</DialogTitle>
            <DialogDescription>
              {maxWordsReached
                ? "Word limit reached (500 words). Cannot add more content."
                : "Choose a programming language for syntax highlighting."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code-language">Language</Label>
              <Select value={codeLanguage} onValueChange={setCodeLanguage} disabled={maxWordsReached}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {maxWordsReached
                ? "Maximum word count reached. You cannot add more content."
                : "The code block will be inserted at your current cursor position."
              }
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowCodeDialog(false)} 
              variant="outline" 
              type="button"
            >
              Cancel
            </Button>
            <Button onClick={setCodeBlock} type="button" disabled={maxWordsReached}>
              Insert Code Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function DocsEditor() {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [maxWordsReached, setMaxWordsReached] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const maxWordTreshold = 500;

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
          levels: [1, 2, 3],
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
    content: `
    <h1>Local Development</h1>
    <p>Learn how to build and test programs using the <strong>Company SDK Framework</strong> on your local machine.</p>

    <p>The Company SDK simplifies the process of building and testing integrations with the Company API. Whether you're setting up a sandbox project or creating production-ready tools, this guide walks you through all essential setup steps.</p>

    <h2>Prerequisites</h2>
    <ul>
        <li>Node.js 18+</li>
        <li>npm or yarn</li>
        <li>Git</li>
        <li>A registered Company API Key</li>
    </ul>

    <p>You can verify your setup by running:</p>
    <pre><code class="language-bash">node -v
    npm -v</code></pre>

    <h2>Getting Started</h2>
    <p>This section outlines the basic steps to initialize and run your first local project.</p>

    <h3>1. Create a New Project</h3>
    <pre><code class="language-bash">npx company-cli init my-project</code></pre>

    <p>Move into your new project folder:</p>
    <pre><code class="language-bash">cd my-project</code></pre>

    <p>Your default structure will look like this:</p>
    <pre><code>my-project/
    ├── src/
    ├── package.json
    ├── .env
    └── README.md</code></pre>

    <h3>2. Install Dependencies</h3>
    <pre><code class="language-bash">npm install</code></pre>
    <p>This installs the Company SDK and all required packages to get started.</p>

    <h3>3. Build the Project</h3>
    <pre><code class="language-bash">npm run build</code></pre>
    <p>If successful, you'll see an output similar to:</p>
    <pre><code>Build complete. Ready for deployment.</code></pre>

    <h3>4. Test the Integration</h3>
    <p>You can run unit and integration tests locally:</p>
    <pre><code class="language-bash">npm test</code></pre>

    <p>Create a <code>.env</code> file and add your API key:</p>
    <pre><code>COMPANY_API_KEY=your_api_key_here</code></pre>

    <p>Then test a simple request:</p>
    <pre><code class="language-javascript">import { Company } from "company-sdk";
    import { css } from '@codemirror/lang-css';

    const client = new Company(process.env.COMPANY_API_KEY);
    client.users.getProfile().then(console.log);</code></pre>

    <h3>5. Deploy to Sandbox</h3>
    <p>When your integration works locally, deploy to the sandbox environment:</p>
    <pre><code class="language-bash">npx company-cli deploy --env sandbox</code></pre>

    <p>This uploads your current code to your sandbox workspace. You can preview requests, logs, and metrics in your <a href="https://dashboard.company.dev">Company Dashboard</a>.</p>

    <h3>6. Update and Redeploy</h3>
    <pre><code class="language-bash">npm run build
    npx company-cli deploy --env sandbox</code></pre>

    <h3>7. Clean Up</h3>
    <pre><code class="language-bash">npm run clean</code></pre>
    <p>This deletes compiled artifacts and resets the environment.</p>

    <h2>Project File Structure</h2>
    <pre><code>my-project/
    ├── src/
    │   ├── api/
    │   ├── utils/
    │   ├── index.js
    ├── tests/
    │   ├── integration.test.js
    │   ├── unit.test.js
    ├── .env
    ├── package.json
    ├── README.md
    └── company.config.json</code></pre>

    <h2>Next Steps</h2>
    <ul>
        <li>Review the <a href="https://docs.company.dev/sdk">Company SDK Reference</a></li>
        <li>Explore advanced guides like authentication flows and API hooks</li>
        <li>Connect your project to production once validated in the sandbox</li>
    </ul>

    <p><strong>Happy building!</strong></p>
    `,

    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-6 focus:outline-none min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const currentWordCount = calculateWordCount(text);
      
      // Update word count
      setWordCount(currentWordCount);
      
      // Handle both reaching and going below the limit
      if (currentWordCount >= 500) {
        if (!maxWordsReached) {
          setMaxWordsReached(true);
          setShowLimitWarning(true);
          setTimeout(() => setShowLimitWarning(false), 3000);
        }
      } else {
        // If we go below 500, remove the limit
        if (maxWordsReached) {
          setMaxWordsReached(false);
        }
      }
    },
  });

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

  // Set editor to non-editable when limit reached
  useEffect(() => {
    if (editor) {
      if (maxWordsReached) {
        editor.setOptions({ editable: false });
      } else {
        editor.setOptions({ editable: true });
      }
    }
  }, [editor, maxWordsReached]);

  const getWordCount = () => {
    return wordCount;
  };

  const showCrown = wordCount >= 400;

  // Function to get the content for API submission
  const getEditorContent = () => {
    if (!editor) return null;
    
    const htmlContent = editor.getHTML();
    const jsonContent = editor.getJSON();
    const textContent = editor.getText();
    
    return {
      html: htmlContent,
      json: jsonContent,
      text: textContent,
      wordCount: getWordCount()
    };
  };

  // Function to submit to API
  const handleSubmit = async () => {
    if (!editor) return;

    setIsSubmitting(true);
    setSubmitStatus('Submitting...');

    try {
      const content = getEditorContent();
      console.log(content)
      
      // Your API call here
    } catch (error) {
      console.error('Error submitting document:', error);
      setSubmitStatus('Error saving document');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-screen flex flex-col">
        <Card className="rounded-none border-b-0">
          <CardHeader className="pb-3">
            <CardTitle>Documentation Editor</CardTitle>
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
              <CardTitle>Documentation Editor</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <Badge 
                variant={maxWordsReached ? "destructive" : wordCount >= 400 ? "default" : "secondary"}
                className="flex items-center gap-2"
              >
                {wordCount}/{maxWordTreshold} words
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

      {/* Editor - MenuBar is now inside the main sticky container */}
      <div className="sticky top-[73px] z-40 bg-background border-b">
        <MenuBar editor={editor} wordCount={wordCount} maxWordsReached={maxWordsReached} />
      </div>

      {/* Content Area */}
      <Card className="flex-1 rounded-none border-0 flex flex-col relative">
        <CardContent className="p-0 flex-1">
          <EditorContent 
            editor={editor} 
            className="h-full" 
          />
          {maxWordsReached && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="text-center p-4 bg-background border rounded-lg shadow-lg">
                <Crown size={48} className="text-yellow-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-2">Word Limit Reached!</h3>
                <p className="text-muted-foreground">You've reached the maximum of {maxWordTreshold} words.</p>
                <p className="text-sm text-muted-foreground mt-1">No further editing is allowed.</p>
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Submit Button Section */}
        <div className="border-t p-4 bg-muted/20">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {submitStatus && (
                <Badge variant={submitStatus.includes('Error') ? "destructive" : "default"}>
                  {submitStatus}
                </Badge>
              )}
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !editor}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : 'Save Document'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}