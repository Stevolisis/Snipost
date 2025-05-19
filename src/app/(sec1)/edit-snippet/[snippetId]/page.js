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
import { Loader2, X } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const CodeEditor = dynamic(() => import('@/components/appComponents/CodeEditor/index'), {
  ssr: false,
  loading: () => <div className="p-4 rounded-md bg-muted animate-pulse">Loading editor...</div>
})

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
        toast.error('Failed to load snippet')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (snippetId && jwtToken) loadSnippet()
  }, [snippetId, jwtToken, router])

  const handleUpdate = async () => {
    try {
        formData.folder = userData.folders[0]._id;
      await api.patch(`/edit-snippet/${snippetId}`, formData, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })
      toast.success('Snippet updated successfully!')
    } catch (error) {
        console.log(error)
      toast.error(`Failed to update snippet: ${error?.response?.data?.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen px-5 md:px-40">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

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
    </div>
  )
}