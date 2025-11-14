"use client"
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getExtentions } from './getExtensions';
import { getThemes } from './getThemes';
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });
import { EditorView } from '@uiw/react-codemirror';
import { IBM_Plex_Mono } from "next/font/google";
const sourceCodePro = IBM_Plex_Mono({   weight: "400",
subsets: ["latin"] });

function CodeEditor({ value, onChange, language = "javascript" }) {
  const extensions = useMemo(() => getExtentions(language), [language]);
  const { theme } = useMemo(() => getThemes("dracula"), []);

  const fontTheme = useMemo(() => {
    return EditorView.theme({
      ".cm-editor, .cm-scroller, .cm-content, .cm-line, .cm-gutters": {
        fontFamily: `${sourceCodePro.style.fontFamily}, monospace !important`,
      },
    });
  }, []);

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      lang={language}
      theme={theme}
      extensions={[...extensions, fontTheme]}
      basicSetup={{
        foldGutter: false,
        allowMultipleSelections: false,
        highlightActiveLine: false,
      }}
      style={{
        outline: "none",
        fontSize: 14,
        width: "auto",
        height: "auto",
        minHeight: "300px",
        maxHeight: "300px",
        overflowY: "auto",
      }}
    />
  );
}

export default CodeEditor;