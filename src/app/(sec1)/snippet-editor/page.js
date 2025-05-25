"use client"
import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CodeLanguage } from '@/components/appComponents/CodeLanguage';
import { codeLanguages } from '@/components/appComponents/CodeEditor/getExtensions';
const CodeEditor = dynamic(() => import('@/components/appComponents/CodeEditor/index'), {
  ssr: false,
  loading: () => (
    <pre className="p-4 rounded-md overflow-x-auto">
      Loading code editor...
    </pre>
  )
});
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Users, X } from 'lucide-react';
import { MultiSelect } from '@/components/appComponents/MultiSelect';
import api from '@/utils/axiosConfig';
import { useAppSelector } from '@/lib/redux/hooks';
import { toast } from "sonner"



const allTags = [
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'solana', label: 'Solana' },
  { value: 'web3', label: 'Web3' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'smartcontracts', label: 'Smart Contracts' },
  { value: 'onchain', label: 'On-chain' },
  { value: 'anchor', label: 'Anchor' },
  { value: 'metaplex', label: 'Metaplex' },
  { value: 'spl-tokens', label: 'SPL Tokens' },
  { value: 'solana-cli', label: 'Solana CLI' },
  { value: 'rpc', label: 'RPC' },
  { value: 'depin', label: 'DePIN' },
  { value: 'defi', label: 'DeFi' },
  { value: 'nfts', label: 'NFTs' },
  { value: 'solana-pay', label: 'Solana Pay' },
  { value: 'programs', label: 'Programs' },
  { value: 'validators', label: 'Validators' },
  { value: 'l1blockchain', label: 'L1 Blockchain' },
  { value: 'ledger', label: 'Ledger' },
  { value: 'web3auth', label: 'Web3Auth' },
  { value: 'arweave', label: 'Arweave' },
  { value: 'rust', label: 'Rust' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'vscode', label: 'VS Code' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'solidity', label: 'Solidity' },
  { value: 'hardhat', label: 'Hardhat' },
  { value: 'foundry', label: 'Foundry' },
  { value: 'wasm', label: 'WASM' },
  { value: 'cli-tools', label: 'CLI Tools' },
  { value: 'json-rpc', label: 'JSON-RPC' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'unit-testing', label: 'Unit Testing' },
  { value: 'devnet', label: 'Devnet' },
  { value: 'mainnet-beta', label: 'Mainnet Beta' },
  { value: 'sdk', label: 'SDK' },
  { value: 'borsh', label: 'Borsh' },
  { value: 'buildtools', label: 'Build Tools' },
  { value: 'snipost', label: 'Snipost' },
  { value: 'snap2earn', label: 'Snap2Earn' },
  { value: 'upvotetoearn', label: 'Upvote to Earn' },
  { value: 'codegems', label: 'CodeGems' },
  { value: 'snips', label: 'Snips' },
  { value: 'buildinpublic', label: 'Build in Public' },
  { value: 'showyourwork', label: 'Show Your Work' },
  { value: 'devprofile', label: 'Dev Profile' },
  { value: 'reputation', label: 'Reputation' },
  { value: 'devrewards', label: 'Dev Rewards' },
  { value: 'snippetdrop', label: 'Snippet Drop' },
  { value: 'socialcoding', label: 'Social Coding' },
  { value: 'dailydev', label: 'Daily Dev' },
  { value: 'followdevs', label: 'Follow Devs' },
  { value: 'devcommunity', label: 'Dev Community' },
  { value: 'snippetfeed', label: 'Snippet Feed' },
  { value: 'sharecode', label: 'Share Code' },
  { value: 'opensource', label: 'Open Source' },
  { value: 'codewars', label: 'Codewars' },
  { value: 'techstack', label: 'Tech Stack' },
];

const SnippetEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [codeBlocks, setCodeBlocks] = useState([
    { name: "", language: "javascript", content: "" }
  ]);
  const [folder, setFolder] = useState("");
  const [type, setType] = useState("public");
  const { jwtToken, userData } = useAppSelector((state) => state.auth)

  const handleAddCodeBlock = () => {
    setCodeBlocks([...codeBlocks, { name: "", language: "javascript", content: "" }]);
  };

  const handleRemoveCodeBlock = (index) => {
    if (codeBlocks.length > 1) {
      const newCodeBlocks = [...codeBlocks];
      newCodeBlocks.splice(index, 1);
      setCodeBlocks(newCodeBlocks);
    }
  };

  const handleCodeBlockChange = (index, field, value) => {
    const newCodeBlocks = [...codeBlocks];
    newCodeBlocks[index][field] = value;
    setCodeBlocks(newCodeBlocks);
  };
// const yu=`// Simple Task Manager App (Free Tier Limit Example)

// class Task {
//   constructor(title, description = "") {
//     this.id = Date.now();
//     this.title = title;
//     this.description = description;
//     this.completed = false;
//     this.createdAt = new Date();
//   }
// }

// class TaskManager {
//   constructor() {
//     this.tasks = [];
//   }

//   addTask(title, description) {
//     if (!title) throw new Error("Task must have a title");
//     const task = new Task(title, description);
//     this.tasks.push(task);
//     return task;
//   }

//   getTasks() {
//     return this.tasks;
//   }

//   toggleTaskCompletion(id) {
//     const task = this.tasks.find((t) => t.id === id);
//     if (!task) throw new Error("Task not found");
//     task.completed = !task.completed;
//     return task;
//   }

//   deleteTask(id) {
//     const index = this.tasks.findIndex((t) => t.id === id);
//     if (index === -1) throw new Error("Task not found");
//     this.tasks.splice(index, 1);
//   }

//   searchTasks(query) {
//     return this.tasks.filter(
//       (task) =>
//         task.title.toLowerCase().includes(query.toLowerCase()) ||
//         task.description.toLowerCase().includes(query.toLowerCase())
//     );
//   }

//   getCompletedTasks() {
//     return this.tasks.filter((task) => task.completed);
//   }

//   getPendingTasks() {
//     return this.tasks.filter((task) => !task.completed);
//   }

//   editTask(id, newTitle, newDescription) {
//     const task = this.tasks.find((t) => t.id === id);
//     if (!task) throw new Error("Task not found");
//     if (newTitle) task.title = newTitle;
//     if (newDescription) task.description = newDescription;
//     return task;
//   }

//   printTasks() {
//     this.tasks.forEach((t) =>
//       console.log(
//         '''t.completed ' "[x]" : "[ ]"} ''t.title' - ''t.description' (''t.id')'
//       )
//     );
//   }
// }

// // Sample usage
// const manager = new TaskManager();
// manager.addTask("Buy groceries", "Milk, eggs, and bread");
// manager.addTask("Read a book", "Finish the last chapter");
// manager.toggleTaskCompletion(manager.getTasks()[0].id);
// manager.printTasks();
// `;
// console.log("yu: ", yu.length)
  const handlePublish = async() => {
    setIsLoading(true);
    const snippetData = {
      title,
      description,
      folder: userData.folders[0]._id,
      tags,
      codeBlocks,
      type
    };
    try{
      const response = await api.post("/create-snippet",snippetData,{
        headers:{
          Authorization: `Bearer ${jwtToken}`
        }
      });
      toast("Success", {
        description: response.data.message,
      })
      setIsLoading(false);
    }catch(err){
      setIsLoading(false);
      if (err.response?.status === 401) {
        // Handle unauthorized error
        dispatch(disconnectWallet());
        disconnect();
        toast("Uh oh! Something went wrong.", {
          description: "Connect your wallet"
        });
        return
      }
      toast("Uh oh! Something went wrong.", {
        description: err.response?.data?.message || 'Failed to publish snippet',
      })
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="px-6 bg-transparent w-[97%] md:w-[80%]">
        <div className="">
          <Input 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="">
          <Textarea 
            placeholder="Description" 
            className="h-50" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="">
            <MultiSelect
                options={allTags}
                onValueChange={setTags}
                defaultValue={tags}
                placeholder="Select Tag"
                variant="inverted"
                animation={2}
                maxCount={3}
            />
        </div>

        <div className="">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Visibility Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Visibility</SelectLabel>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* <Select value={folder} onValueChange={setFolder} className="w-full mt-6">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Folder</SelectLabel>
                <SelectItem value="681a8ee804258036305755ec">My Folder</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select> */}
          
        </div>

        {codeBlocks.map((block, index) => (
          <Card key={index} className="">
            <CardHeader className="flex justify-between items-center flex-wrap">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="file name e.g index.ts"
                  value={block.name}
                  onChange={(e) => handleCodeBlockChange(index, 'name', e.target.value)}
                />
              </div>

              <div className='flex items-center gap-x-2 ml-4'>
                <div className="">
                  <CodeLanguage
                    languages={codeLanguages}
                    value={block.language}
                    onChange={(value) => handleCodeBlockChange(index, 'language', value)}
                  />
                </div>
                {codeBlocks.length > 1 && (
                  <button
                    onClick={() => handleRemoveCodeBlock(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className='pt-4'>
                <CodeEditor
                  value={block.content}
                  onChange={(value) => handleCodeBlockChange(index, 'content', value)}
                  language={block.language}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className='flex justify-between items-center my-6'>
          <Button variant="outline" onClick={handleAddCodeBlock}>
            Add Snippet
          </Button>
          <Button onClick={()=>handlePublish()}>{isLoading ? "Publishing..." : "publish"}</Button>
        </div>
      </Card>
    </div>
  )
}

export default SnippetEditor