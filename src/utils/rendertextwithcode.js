import dynamic from 'next/dynamic';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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

export const renderTextWithCode = (text) => {
  if (!text) return null;
  
  const parts = text.split(/(`[^`]+`)/g);
  
  return (
    <>
      {parts.map((part, index) => {
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
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};