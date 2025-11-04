"use client"
import React, { useState, useEffect } from 'react'
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
import { Users, X, CreditCard, Crown } from 'lucide-react';
import { MultiSelect } from '@/components/appComponents/MultiSelect';
import api from '@/utils/axiosConfig';
import { useAppSelector } from '@/lib/redux/hooks';
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import Link from 'next/link';
import { trackCodePublished } from '@/lib/analytics';

const allTags = [
  // Frameworks & Libraries
  { value: 'turbine3', label: 'Turbine 3' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },

  // Core Web3 & Blockchain
  { value: 'web3', label: 'Web3' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'smartcontracts', label: 'Smart Contracts' },
  { value: 'onchain', label: 'On-Chain' },
  { value: 'defi', label: 'DeFi' },
  { value: 'nfts', label: 'NFTs' },
  { value: 'l1blockchain', label: 'Layer 1' },
  { value: 'ledger', label: 'Ledger' },
  { value: 'web3auth', label: 'Web3Auth' },
  { value: 'arweave', label: 'Arweave' },
  { value: 'ipfs', label: 'IPFS' },
  { value: 'json-rpc', label: 'JSON-RPC' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'devnet', label: 'Devnet' },
  { value: 'mainnet-beta', label: 'Mainnet Beta' },

  // Solana Ecosystem
  { value: 'solana', label: 'Solana' },
  { value: 'anchor', label: 'Anchor' },
  { value: 'metaplex', label: 'Metaplex' },
  { value: 'spl-tokens', label: 'SPL Tokens' },
  { value: 'solana-cli', label: 'Solana CLI' },
  { value: 'solana-pay', label: 'Solana Pay' },
  { value: 'programs', label: 'Programs' },
  { value: 'validators', label: 'Validators' },
  { value: 'jup', label: 'Jupiter' },
  { value: 'borsh', label: 'Borsh' },
  

  // Ethereum Ecosystem
  { value: 'solidity', label: 'Solidity' },
  { value: 'hardhat', label: 'Hardhat' },
  { value: 'foundry', label: 'Foundry' },
  { value: 'etherjs', label: 'Ethers.js' },
  { value: 'web3js', label: 'Web3.js' },
  { value: 'sepolia', label: 'Sepolia' },

  // Development Languages
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'rust', label: 'Rust' },
  { value: 'wasm', label: 'WASM' },
  { value: 'move', label: 'Move' },

  // Development Tools
  { value: 'vscode', label: 'VS Code' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'cli-tools', label: 'CLI Tools' },
  { value: 'buildtools', label: 'Build Tools' },
  { value: 'sdk', label: 'SDK' },
  { value: 'unit-testing', label: 'Unit Testing' },
  { value: 'remix', label: 'Remix IDE' },


  // Web3 Services & Infrastructure
  { value: 'rpc', label: 'RPC' },
  { value: 'depin', label: 'DePIN' },
  { value: 'walletconnect', label: 'WalletConnect' },
  { value: 'chainlink', label: 'Chainlink' },
  { value: 'thegraph', label: 'The Graph' },

  // Community & Social
  { value: 'socialcoding', label: 'Social Coding' },
  { value: 'devcommunity', label: 'Dev Community' },
  { value: 'opensource', label: 'Open Source' },
  { value: 'buildinpublic', label: 'Build in Public' },
  { value: 'showyourwork', label: 'Show Your Work' },
  { value: 'dailydev', label: 'Daily Dev' },
  { value: 'followdevs', label: 'Follow Devs' },
  { value: 'hackerthon', label: 'Hackathon' },

  // Platform-Specific Features
  { value: 'snipost', label: 'Snipost' },
  { value: 'snap2earn', label: 'Snap2Earn' },
  { value: 'upvotetoearn', label: 'Upvote2Earn' },
  { value: 'codegems', label: 'Code Gems' },
  { value: 'snips', label: 'Snips' },
  { value: 'devprofile', label: 'Dev Profile' },
  { value: 'reputation', label: 'Reputation' },
  { value: 'devrewards', label: 'Dev Rewards' },
  { value: 'snippetdrop', label: 'Snippet Drop' },
  { value: 'snippetfeed', label: 'Snippet Feed' },
  { value: 'sharecode', label: 'Share Code' },

  // Advanced Concepts
  { value: 'zero-knowledge', label: 'Zero Knowledge' },
  { value: 'zkproofs', label: 'ZK Proofs' },
  { value: 'rollups', label: 'Rollups' },
  { value: 'daos', label: 'DAOs' },
  { value: 'governance', label: 'Governance' },
  { value: 'oracles', label: 'Oracles' },
  { value: 'staking', label: 'Staking' },
  { value: 'bridges', label: 'Bridges' },

  // Learning & Challenges
  { value: 'codewars', label: 'Codewars' },
  { value: 'techstack', label: 'Tech Stack' },
  { value: 'ctf', label: 'CTF' }
];
const CreateExamples = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [codeBlocks, setCodeBlocks] = useState([
    { name: "", language: "javascript", content: "" }
  ]);
  const [folder, setFolder] = useState("");
  const [type, setType] = useState("public");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitErrorMessage, setLimitErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { jwtToken, userData } = useAppSelector((state) => state.auth)

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  const handlePublish = async() => {
    const id = toast.loading("Publishing snippet...");
    setIsLoading(true);
    const snippetData = {
      title,
      description,
      folder: userData?.folders[0]._id,
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

      toast.success(response.data.message || "Snippet published!", { id });
      trackCodePublished(title, codeBlocks[0]?.language || 'unknown');
      setIsLoading(false);
      setTitle("");
      setDescription("");
      setTags([]);
      setCodeBlocks([{ name: "", language: "javascript", content: "" }]);
      setType("public");
    }catch(err){
      setIsLoading(false);
      
      // Check for LimitExceeded error
      if (err.response?.data?.message?.includes('LimitExceeded')) {
        setLimitErrorMessage(err.response.data.message);
        setShowLimitModal(true);
        return;
      }
      
      if (err.response?.status === 401) {
        // Handle unauthorized error
        dispatch(disconnectWallet());
        disconnect();
        toast("Uh oh! Something went wrong.", {
          description: "Connect your wallet",
          id: id,
        });
        return
      }
      toast.error(err.response?.data?.message || err.message, { id });
    }
  };

  const LimitExceededContent = () => (
    <>
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
        <Crown className="w-8 h-8 text-primary" />
      </div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Limit Reached</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {limitErrorMessage.replace('LimitExceeded - ', '')}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>Unlimited access</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            <span>Priority support</span>
          </div>
        </div>
      </div>
    </>
  );

  // Desktop Dialog
  const DesktopLimitDialog = () => (
    <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Upgrade Required</DialogTitle>
        </DialogHeader>
        <LimitExceededContent />
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setShowLimitModal(false)} className="w-full sm:w-auto">
            Maybe Later
          </Button>
          <Link href="/account/subscription" className="w-full sm:w-auto">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Upgrade Now
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Mobile Drawer
  const MobileLimitDrawer = () => (
    <Drawer open={showLimitModal} onOpenChange={setShowLimitModal}>
      <DrawerContent className="px-4">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Upgrade Required</DrawerTitle>
        </DrawerHeader>
        <div className="py-6">
          <LimitExceededContent />
        </div>
        <DrawerFooter className="gap-2 pb-8">
          <Link href="/account/subscription" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Upgrade Now
            </Button>
          </Link>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Maybe Later
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  return (
    <div className="w-full mt-5">
      <Card className="px-6 bg-transparent w-full">
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

        {codeBlocks.map((block, index) => (
          <Card key={index} className="">
            <CardHeader className="flex justify-between items-center flex-wrap">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="file name e.g index.ts"
                  value={block.name}
                  onChange={(e) => handleCodeBlockChange(index, 'name', e.target.value)}
                  className="sm:w-[60%]"
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

      {/* Render appropriate modal based on device type */}
      {isMobile ? <MobileLimitDrawer /> : <DesktopLimitDialog />}
    </div>
  )
}

export default CreateExamples