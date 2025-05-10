import { basicSetup } from "codemirror";
import { StreamLanguage} from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { rust } from "@codemirror/lang-rust";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { wast } from "@codemirror/lang-wast";
import { sql } from "@codemirror/lang-sql";
import { php } from "@codemirror/lang-php";

import { lua } from "@codemirror/legacy-modes/mode/lua";
import { go } from "@codemirror/legacy-modes/mode/go";
import { dockerFile } from "@codemirror/legacy-modes/mode/dockerfile";
import { haskell } from "@codemirror/legacy-modes/mode/haskell";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { nginx } from "@codemirror/legacy-modes/mode/nginx";
import { pascal } from "@codemirror/legacy-modes/mode/pascal";
import { perl } from "@codemirror/legacy-modes/mode/perl";
import { powerShell } from "@codemirror/legacy-modes/mode/powershell";
import { r } from "@codemirror/legacy-modes/mode/r";
import { sass } from "@codemirror/legacy-modes/mode/sass";
// import { ILanguages } from "@/redux/slices/codeEditor";


export const getExtentions = (language) => {
  switch (language) {
    case "c":
      return [cpp()];
    case "c++":
      return [cpp()];
    case "c#":
      return [cpp()];
    case "coffeescript":
      return [javascript()];
    case "css":
      return [css()];
    case "html":
      return [html()];
    case "java":
      return [java()];
    case "javascript":
      return [javascript()];
    case "json":
      return [json()];
    case "jsx":
      return [javascript({ jsx: true, typescript: true })];
    case "markdown":
      return [markdown()];
    case "php":
      return [php()];
    case "python":
      return [python()];
    case "rust":
      return [rust()];
    case "scss":
      return [css()];
    case "sql":
      return [sql()];
    case "swift":
      return [cpp()];
    case "typescript":
      return [javascript({ typescript: true })];
    case "wast":
      return [wast()];
    case "xml":
      return [xml()];
    
    case "docker":
      return [basicSetup, StreamLanguage.define(dockerFile)];
    case "go":
      return [basicSetup, StreamLanguage.define(go)];
    case "haskell":
      return [basicSetup, StreamLanguage.define(haskell)];
    case "lua":
      return [basicSetup, StreamLanguage.define(lua)];
    case "nginx":
      return [basicSetup, StreamLanguage.define(nginx)];
    case "pascal":
      return [basicSetup, StreamLanguage.define(pascal)];
    case "perl":
      return [basicSetup, StreamLanguage.define(perl)];
    case "powershell":
      return [basicSetup, StreamLanguage.define(powerShell)];
    case "r":
      return [basicSetup, StreamLanguage.define(r)];
    case "ruby":
      return [basicSetup, StreamLanguage.define(ruby)];
    case "sass":
      return [basicSetup, StreamLanguage.define(sass)];
    case "yaml":
      return [basicSetup, StreamLanguage.define(yaml)];
      
    default:
      return [javascript()];
  }
};

export const codeLanguages = [
  { value: "c", label: "c" },
  { value: "c++", label: "c++" },
  { value: "c#", label: "c#" },
  { value: "coffeescript", label: "coffeescript" },
  { value: "css", label: "css" },
  { value: "html", label: "html" },
  { value: "java", label: "java" },
  { value: "javascript", label: "javascript" },
  { value: "json", label: "json" },
  { value: "jsx", label: "jsx" },
  { value: "markdown", label: "markdown" },
  { value: "php", label: "php" },
  { value: "python", label: "python" },
  { value: "rust", label: "rust" },
  { value: "scss", label: "scss" },
  { value: "sql", label: "sql" },
  { value: "swift", label: "swift" },
  { value: "typescript", label: "typescript" },
  { value: "wast", label: "wast" },
  { value: "xml", label: "xml" },
  { value: "docker", label: "docker" },
  { value: "go", label: "go" },
  { value: "haskell", label: "haskell" },
  { value: "lua", label: "lua" },
  { value: "nginx", label: "nginx" },
  { value: "pascal", label: "pascal" },
  { value: "perl", label: "perl" },
  { value: "powershell", label: "powershell" },
  { value: "r", label: "r" },
  { value: "ruby", label: "ruby" },
  { value: "sass", label: "sass" },
  { value: "yaml", label: "yaml" }
];