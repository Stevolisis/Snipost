"use client"
import React, { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MultiSelect } from '@/components/appComponents/MultiSelect'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { updateUserData } from '@/lib/redux/slices/auth'
import api from '@/utils/axiosConfig'
import { toast } from "sonner"

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


const page = () => {
  const dispatch = useAppDispatch();
  const { userData, jwtToken } = useAppSelector((state) => state.auth)
  const [formValues, setFormValues] = useState({
    name: '',
    userName: '',
    email: '',
    position: '',
    about: '',
    twitterLink: '',
    githubLink: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [tags, setTags] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isTags, setIsTags] = useState(false);

  // Load user data
  useEffect(() => {
    if (userData) {
      setFormValues({
        name: userData.name || '',
        userName: userData.userName || '',
        email: userData.email || '',
        position: userData.position || '',
        about: userData.about || '',
        twitterLink:  userData.socialLinks && userData?.socialLinks[0]?.link,
        githubLink:  userData.socialLinks && userData?.socialLinks[1]?.link,
      });

    }
  }, [userData])

  useEffect(()=>{
    if(jwtToken){
      const fetchUser = async()=>{
        try{
          const response = await api.get("/me",{
            headers:{
              Authorization:`Bearer ${jwtToken}`
            }
          });
          console.log("Fetched user data:", response.data.user.followedTags);
          setTags(response.data.user.followedTags);
          dispatch(updateUserData(response.data.user));
        }catch(err){
        }
      };

      fetchUser();
    }
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target)
    
    // Append all fields
    formData.append('name', formValues.name)
    formData.append('userName', formValues.userName)
    formData.append('email', formValues.email)
    formData.append('position', formValues.position)
    formData.append('about', formValues.about)
    formData.append('socialLinks', JSON.stringify([
      {platform:"Twitter", link:formValues.twitterLink},
      {platform:"Github",  link:formValues.githubLink},
    ]))
    
    // Append tags as JSON array
    if (tags.length > 0) {
      // Handle tags - SIMPLE AND CLEAN
      let tagsToSend = [];
      
      // Case 1: Already correct format (array of strings)
      if (Array.isArray(tags) && tags.every(tag => typeof tag === 'string')) {
        tagsToSend = tags;
      } 
      // Case 2: Needs conversion (array of objects)
      else if (Array.isArray(tags) && tags.every(tag => tag?.value)) {
        tagsToSend = tags.map(tag => tag.value);
      }
      // Case 3: Invalid format - send empty array
      else {
        tagsToSend = [];
      }

      // Always append as JSON string
      formData.append('followedTags', JSON.stringify(tagsToSend));

    }else{
      formData.append('followedTags', JSON.stringify([]))
    }

    // // Append file if selected
    // if (avatarFile) {
    //   formData.append('avatar', avatarFile)
    // }

    try {
      const response = await api.put('/complete-user-profile',formData,{
        headers:{
          Authorization: `Bearer ${jwtToken}`
        }
      });

      const data = response.data;
      toast("Success", {
        description: response.data.message,
      })
      dispatch(updateUserData(data.user));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      // if (err.response?.status === 401) {
      //   // Handle unauthorized err
      //   dispatch(disconnectWallet());
      //   disconnect();
      //   toast("Uh oh! Something went wrong.", {
      //     description: "Connect your wallet"
      //   });
      //   return
      // }
      toast("Uh oh! Something went wrong.", {
        description: err?.response?.data?.message || err.message,
      })
    }
  }
console.log("jjj", tags);

  return (
    <div className='w-full flex justify-center items-center'>
      <form 
        className='w-[93%] md:w-[50%] flex flex-col gap-y-5 md:gap-y-8'
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Avatar</Label>
          <Input 
            type="file" 
            name="avatar"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Name</Label>
          <Input 
            type="text" 
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="John Doe" 
            required
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">UserName</Label>
          <Input 
            type="text" 
            name="userName"
            value={formValues.userName}
            onChange={handleChange}
            placeholder="JohnDev" 
            required
          />
        </div>
        
        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Email</Label>
          <Input 
            type="email" 
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="john@gmail.com" 
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Position</Label>
          <Input 
            type="text" 
            name="position"
            value={formValues.position}
            onChange={handleChange}
            placeholder="Software Engineer" 
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Github Link</Label>
          <Input 
            type="text" 
            name="githubLink"
            value={formValues.githubLink}
            onChange={handleChange}
            placeholder="Software Engineer" 
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Twitter/X Link</Label>
          <Input 
            type="text" 
            name="twitterLink"
            value={formValues.twitterLink}
            onChange={handleChange}
            placeholder="Software Engineer" 
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">About</Label>
          <Textarea
            name="about"
            value={formValues.about}
            onChange={handleChange}
            placeholder="I'm a full stack developer for over 9 years ..."
            className="h-48"
          />
        </div>

        <div className='flex flex-col gap-y-3'>
          <Label className="text-sm md:text-base">Followed Tags</Label>
          <div className="">
            {(tags.length > 0 && !isTags) ? 
              <MultiSelect
                options={allTags}
                onValueChange={setTags}
                defaultValue={tags}
                placeholder="Select Tag"
                variant="inverted"
                animation={2}
                maxCount={3}
              /> : 
              ( !isTags && 
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsTags(true)}
                >
                  Select tags you will like to follow
                </Button>
              )
            }
            {
              isTags && 
              <MultiSelect
                options={allTags}
                onValueChange={setTags}
                defaultValue={tags}
                placeholder="Select Tag"
                variant="inverted"
                animation={2}
                maxCount={3}
              />
            }
          </div>
        </div>

        <Button type="submit">{isLoading ? "processing..." : "Complete profile"}</Button>
      </form>
    </div>
  )
}

export default page