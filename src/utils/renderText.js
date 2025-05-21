import dynamic from 'next/dynamic';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.Prism),
  {
    ssr: false,
    loading: () => (
      <pre className="p-4 rounded-md overflow-x-auto bg-gray-800 text-gray-200">
        Loading code snippet...
      </pre>
    )
  }
);

export const renderText = (text, mentions) => {
  if (!text) return null;
  console.log(mentions)
  // Split by code blocks first
  const parts = text.split(/(`[^`]+`|\*[^*]+\*|%[^%]+%)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        // Handle code blocks
        if (part.startsWith('`') && part.endsWith('`')) {
          const codeContent = part.slice(1, -1);
          return (
            <SyntaxHighlighter
              key={index}
              language="javascript"
              style={atomDark}
              customStyle={{
                margin: '0.5em 0',
                padding: '1em',
                borderRadius: '0.3em',
                fontSize: '0.85em',
                width: '100%'
              }}
              wrapLines
            >
              {codeContent}
            </SyntaxHighlighter>
          );
        }
        
        // Handle links (wrapped in *)
        if (part.startsWith('*') && part.endsWith('*')) {
          const linkContent = part.slice(1, -1);
          return (
            <a 
              key={index} 
              href={linkContent} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              {linkContent}
            </a>
          );
        }
        
        // Handle mentions (wrapped in %)
        if (part.startsWith('%') && part.endsWith('%')) {
          const mentionContent = part.slice(1, -1);
          
          // First try to find in users array
          let mentionedUser = mentions.find(u => u.entity.userName === mentionContent.split("@")[1]);

          const userId = mentionedUser?.entity?._id || mentionedUser?.entity;
          const displayName = mentionedUser?.username || mentionContent;
          
          return (mentionedUser &&
            <Link 
              key={index}
              href={`/profile/${userId}`}
              className="text-primary hover:underline text-sm"
            >
              @{displayName}
            </Link>
          );
        }
        
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};