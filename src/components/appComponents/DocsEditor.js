'use client';
import React, { useState, useEffect } from 'react';
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
  Pilcrow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AiOutlineInsertRowAbove, AiOutlineInsertRowBelow, AiOutlineInsertRowLeft, AiOutlineInsertRowRight } from "react-icons/ai";
import "./editor.css";
// Initialize syntax highlighter
const lowlight = createLowlight();
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('javascript', js);
lowlight.register('typescript', ts);
lowlight.register('python', python);

const MenuBar = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [showCodeLanguage, setShowCodeLanguage] = useState(false);

  if (!editor) return null;

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const setCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock({ language: codeLanguage }).run();
    setShowCodeLanguage(false);
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
          action: () => setShowCodeLanguage(!showCodeLanguage),
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
          action: () => setShowLinkInput(!showLinkInput),
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
    }
  ];

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'python', label: 'Python' },
    { value: 'plaintext', label: 'Plain Text' }
  ];

  return (
    <Card className="rounded-none border-b-0 sticky top-15 z-10">
      <CardContent className="p-3">
        <div className="flex flex-wrap gap-2 items-center">
          {menuGroups.map((group, groupIndex) => (
            <React.Fragment key={group.name}>
              {groupIndex > 0 && <Separator orientation="vertical" className="h-6" />}
              
              <div className="flex gap-1">
                {group.items.map((item) => (
                  <Button
                    key={item.title}
                    onClick={item.action}
                    variant={item.isActive ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    title={item.title}
                  >
                    <item.icon size={16} />
                  </Button>
                ))}
              </div>
            </React.Fragment>
          ))}

          {/* Table Controls */}
            <>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex gap-1">
                <Button
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Add Column Before"
                >
                  <AiOutlineInsertRowLeft size={14} />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2"
                  title="Add Column After"
                >
                  <AiOutlineInsertRowRight size={14} />
                </Button>

                <Button
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Add Row Before"
                >
                  <AiOutlineInsertRowAbove size={14} />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2"
                  title="Add Row After"
                >
                  <AiOutlineInsertRowBelow size={14} />
                </Button>

                <Button
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 border border-muted"
                  title="Delete Column"
                >
                  <AiOutlineInsertRowRight size={14} />
                  <Minus size={12} />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2"
                  title="Delete Row"
                >
                  <AiOutlineInsertRowBelow size={14} />
                  <Minus size={12} className="ml-1" />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive"
                  title="Delete Table"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </>

          {/* Link Input */}
          {showLinkInput && (
            <div className="flex gap-2 items-center ml-2">
              <Input
                type="text"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-48"
                onKeyPress={(e) => e.key === 'Enter' && setLink()}
                autoFocus
              />
              <Button onClick={setLink} size="sm">
                Add
              </Button>
              <Button 
                onClick={() => setShowLinkInput(false)} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Code Language Selector */}
          {showCodeLanguage && (
            <div className="flex gap-2 items-center ml-2">
              <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={setCodeBlock} size="sm">
                Insert
              </Button>
              <Button 
                onClick={() => setShowCodeLanguage(false)} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function DocsEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

    <p>The Company SDK simplifies the process of building and testing integrations with the Company API. Whether you’re setting up a sandbox project or creating production-ready tools, this guide walks you through all essential setup steps.</p>

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
    <p>If successful, you’ll see an output similar to:</p>
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
  });

  const getWordCount = () => {
    const text = editor?.getText() || '';
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (!isClient) {
    return (
      <div className="w-full h-screen flex flex-col">
        <Card className="rounded-none border-b-0">
          <CardHeader className="pb-3">
            <CardTitle>Snipost Editor</CardTitle>
          </CardHeader>
        </Card>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <Card className=" border-b-0 rounded-none">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Snipost Editor</CardTitle>
              <p className="text-sm text-muted-foreground">Web3 Documentation Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary"> {getWordCount()} words </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Editor */}

    <div className="sticky top-0 z-200 bg-background border-b">
      <MenuBar editor={editor} />
    </div>


      {/* Content Area */}
      <Card className="flex-1 rounded-none border-0">
        <CardContent className="p-0 h-full">
          <EditorContent editor={editor} className="h-full" />
        </CardContent>
      </Card>


    </div>
  );
}