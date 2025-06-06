"use client"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CodeLanguage } from '@/components/appComponents/CodeLanguage'
import { codeLanguages } from '@/components/appComponents/CodeEditor/getExtensions'
import { MultiSelect } from '@/components/appComponents/MultiSelect'
import api from '@/utils/axiosConfig'
import { useAppSelector } from '@/lib/redux/hooks'
import { toast } from "sonner"
import { Users, X, CreditCard, Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton'
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

const CodeEditor = dynamic(() => import('@/components/appComponents/CodeEditor/index'), {
  ssr: false,
  loading: () => <div className="p-4 rounded-md bg-muted animate-pulse">Loading editor...</div>
})

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

export default function EditSnippetPage() {
  const { snippetId } = useParams()
  const router = useRouter()
  const { jwtToken, userData } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [snippet, setSnippet] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    codeBlocks: [{ name: '', language: 'javascript', content: '' }],
    type: 'public'
  })
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitErrorMessage, setLimitErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        const response = await api.get(`/get-snippet/${snippetId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        })
        
        const snippetData = response.data.snippet
        setSnippet(snippetData)
        
        setFormData({
          title: snippetData.title,
          description: snippetData.description,
          tags: snippetData.tags,
          codeBlocks: snippetData.codeBlocks,
          type: snippetData.type
        })
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load snippet');
      } finally {
        setIsLoading(false)
      }
    }

    if (snippetId && jwtToken) loadSnippet()
  }, [snippetId, jwtToken, router])

  const handleUpdate = async () => {
    try {
      formData.folder = userData.folders[0]._id;
      await toast.promise(
        await api.patch(`/edit-snippet/${snippetId}`, formData, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        }),
        {
          loading: 'Updating snippet...',
          success: () => {
            return 'Snippet updated successfully!'
          },
          error: (err) => err.response?.data?.message || 'Failed to update snippet'
        }
      )
    } catch (err) {
        console.log(err)
        if (err.response?.data?.message?.includes('LimitExceeded')) {
          setLimitErrorMessage(err.response.data.message);
          setShowLimitModal(true);
          return;
        }
      toast.error(`Failed to update snippet: ${err?.response?.data?.message || err.message}}`);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen px-5 md:px-40">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }


  
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
    <div className="flex justify-center">
      <Card className="px-6 bg-transparent w-[97%] md:w-[80%]">
        {/* Your existing editor UI */}
        <Input 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Title" 
        />
        
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Description"
          className="h-32 mt-4"
        />
        
        <MultiSelect
            options={allTags}
            onValueChange={(tags) => setFormData({...formData, tags})}
            defaultValue={formData.tags}
            placeholder="Select Tag"
            variant="inverted"
            animation={2}
            maxCount={3}
        />
        
        {formData.codeBlocks.map((block, index) => (
          <Card key={index} className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <Input
                value={block.name}
                onChange={(e) => {
                  const newBlocks = [...formData.codeBlocks]
                  newBlocks[index].name = e.target.value
                  setFormData({...formData, codeBlocks: newBlocks})
                }}
                placeholder="File name"
                className="flex-1"
              />
              <div className="flex gap-2 ml-4">
                <CodeLanguage
                  languages={codeLanguages}
                  value={block.language}
                  onChange={(value) => {
                    const newBlocks = [...formData.codeBlocks]
                    newBlocks[index].language = value
                    setFormData({...formData, codeBlocks: newBlocks})
                  }}
                />
                {formData.codeBlocks.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newBlocks = formData.codeBlocks.filter((_, i) => i !== index)
                      setFormData({...formData, codeBlocks: newBlocks})
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={block.content}
                onChange={(value) => {
                  const newBlocks = [...formData.codeBlocks]
                  newBlocks[index].content = value
                  setFormData({...formData, codeBlocks: newBlocks})
                }}
                language={block.language}
              />
            </CardContent>
          </Card>
        ))}
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => {
              setFormData({
                ...formData,
                codeBlocks: [...formData.codeBlocks, { name: '', language: 'javascript', content: '' }]
              })
            }}
          >
            Add Code Block
          </Button>
          <Button onClick={handleUpdate}>
            Update Snippet
          </Button>
        </div>
      </Card>

      {/* Render appropriate modal based on device type */}
      {isMobile ? <MobileLimitDrawer /> : <DesktopLimitDialog />}
    </div>
  )
}