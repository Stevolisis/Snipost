"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Github, Code, Trophy, CircleDollarSign, DownloadIcon, BriefcaseBusiness } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas-pro';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import api from '@/utils/axiosConfig';
import { loadEarningsSuccess, loadProfileSuccess, loadTransactionsSuccess } from '@/lib/redux/slices/profile';
import { loadSnippetsStart, loadSnippetsSuccess, snippetsFailure } from '@/lib/redux/slices/snippets';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ProfileCard = () => {
  const cardRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const { jwtToken, userData } = useAppSelector((state) => state.auth)
  const { snippets } = useAppSelector((state) => state.snippets)
  const { profile, loading, error, transactions, earned } = useAppSelector((state) => state.profile)
  const dispatch = useAppDispatch();

   const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          // Skip elements that might cause color parsing issues
          return element.classList?.contains('gradient-border');
        },
        onclone: (clonedDoc) => {
          // Replace problematic Tailwind classes with inline styles
          const clonedCard = clonedDoc.querySelector('[data-card]');
          if (clonedCard) {
            // Apply inline styles to avoid Tailwind parsing issues
            clonedCard.style.backgroundColor = '#111827'; // gray-900
            clonedCard.style.color = '#ffffff';
          }
        }
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${profile?.userName}-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success("DevCard downloaded successfully!!")
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error('Error downloading card. Please try again.');
    }
  };

  const fetchSnippets = async () => {
    try {
      dispatch(loadSnippetsStart())
      const response = await api.get(`/get-user-snippets/${userData._id}?limit=10`)
      const snippets = response.data.snippets || []
      dispatch(loadSnippetsSuccess(snippets))
    } catch (err) {
      console.log(err)
      dispatch(snippetsFailure(err.message || 'Failed to load snippets'))
    }
  }

  const fetchEarningSummary = async () => {
    try {
      const response = await api.get(`/transactions/earnings`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      })
      dispatch(loadEarningsSuccess(response.data.transactions || []))
    } catch (err) {
      console.error('Failed to fetch earnings:', err)
      toast.error('Failed to load earnings summary')
    }
  }

  const fetchTransactions = async () => {    
    try {
      const response = await api.get('/get-transactions', {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })
      dispatch(loadTransactionsSuccess(response.data.transactions || []))
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      toast.error('Failed to load transaction history')
    }
  }

  const loadUser = async () => {
    try {
      const response = await api.get(`/me`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })
      
      const data = response.data.user
      dispatch(loadProfileSuccess(data))
      
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to load user');
    } 
  }

  useEffect(() => {
    if (jwtToken){
      loadUser();
      fetchEarningSummary();
      fetchSnippets();
      fetchTransactions();
    }
  }, []);
console.log(profile)
  return profile ? (
    <div className="flex items-center justify-center flex-col min-h-screen p-4">
      
      <div className={`relative w-80 ${isLandscape && "w-fit"} bg-transparent`} ref={cardRef} >
        {/* Animated holographic border */}
        <div className={`${isLandscape && "w-[555px]"} absolute inset-0 rounded-2xl p-0.5 bg-gradient-to-r from-cyan-500 via-[#A246FD] via-primary to-cyan-500 animate-pulse`}>
          <div className="w-full h-full bg-gray-900 rounded-2xl"></div>
        </div>
        
        {/* Main card content */}
        <div className={`relative ${isLandscape && "w-[550px] py-7"} bg-gray-900 rounded-2xl p-6 m-0.5`}>

          <div className={`${isLandscape && "flex items-center justify-between gap-x-3"}`}>
            <div className={`${isLandscape && 'w-full'}`}>
              {/* Header */}
              <div className="mb-6 flex items-center gap-x-1">
                <img 
                    src='/logo.png'
                    alt={profile.userName}
                    className="w-[18px] h-[18px] rounded-full object-cover"
                  />
                <h1 className="text-primary text-lg font-bold tracking-wider">SNIPOST</h1>
              </div>
              {/* Profile section */}
              <div className="flex items-start gap-4 mb-6">
                {/* Profile image with green border */}
                <div className="w-16 h-16 rounded-full border-2 border-lime-400 p-0.5 flex-shrink-0">
                  <img 
                    src={profile?.avatar?.url}
                    alt={profile.userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                
                {/* Profile info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-white text-2xl font-bold leading-tight mb-1 break-all">
                    {profile?.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">{profile?.userName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <BriefcaseBusiness className="w-4 h-4 text-gray-400"/>
                    <span className="text-gray-400 text-sm">{profile?.position}</span>
                  </div>
                </div>
              </div>
              
              {/* Top contributor badge */}
              <div className="mb-6">
                <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 border border-gray-700">
                  <div className="w-2 h-4 bg-primary"></div>
                  <span className="text-primary font-semibold text-sm">Top 3% Contributor</span>
                </div>
              </div>
            </div>
            

            <div className={`${isLandscape && "flex flex-col justify-center items-center"}`}>

              {/* Stats section */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Snaps */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <CircleDollarSign className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-orange-400 text-xl font-bold">{transactions.length}</div>
                  <div className="text-orange-400 text-xs">Transactions</div>
                </div>
                
                {/* Code Battle Winner */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold text-cyan-400">{earned.reduce((sum, tx) => sum + tx.amount, 0).toFixed(3)}</div>
                  <div className="text-cyan-400 text-xs leading-tight">SOL <br/> Earned</div>
                </div>

                            
                {/* Snippets Shared */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Code className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-xl font-bold text-purple-500">{snippets.length}</div>
                  <div className="text-purple-500 text-xs leading-tight">Snippets<br />Shared</div>
                </div>
              </div>
              
              {/* Tech tags */}
              <div className={`flex ${isLandscape && " justify-center "} flex-wrap gap-2`}>
                {
                  profile?.followedTags.slice(0,5)?.map((tag, i)=>(
                    <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700">
                      {tag}
                    </span>                
                  ))
                }
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-300 to-cyan-300 rounded-sm"></div>
                  SOLANA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center p-4 gap-x-4'>
        <div className='flex items-center gap-x-2'>
          <Switch
            id='type'
            checked={isLandscape}
            onCheckedChange={setIsLandscape}
          />
          <Label htmlFor="type" className=' cursor-pointer'>Landscape</Label>
        </div>
        <Button onClick={()=>downloadCard()} ><DownloadIcon/> Download</Button>
      </div>
    </div>
  ) : <div className="flex justify-center items-center h-screen px-5 md:px-40">
        <Skeleton className="w-full h-full" />
      </div>;
};

export default ProfileCard;