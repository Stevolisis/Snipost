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

export const renderText = (text, mentions = []) => {
  if (!text) return null;

  // Split by code blocks, links, and mentions
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
          const username = part.slice(1, -1);
          
          // Find the mentioned user in the mentions array
          const mentionedUser = mentions.find(m => {
            // Handle both direct user objects and mention references
            if (m.username) return m.username === username;
            if (m.entity?.userName) return m.entity.userName === username;
            return false;
          });

          const userId = mentionedUser?.entity?._id || mentionedUser?._id;
          const displayName = mentionedUser?.username || mentionedUser?.entity?.userName || username;
          
          return userId ? (
            <Link 
              key={index}
              href={`/profile/${userId}`}
              className="text-primary hover:underline text-sm"
            >
              @{displayName}
            </Link>
          ) : (
            <span key={index}>@{username}</span>
          );
        }
        
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};