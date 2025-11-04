// src/components/layout/CompanyHeader.jsx
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogIn, Wallet, LogOut, CircleUser, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { ProfileDropDown } from './ProfileDropDown'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDispatch } from 'react-redux'
import { authenticateStart, authenticateSuccess, authFailure, connectWalletStart, connectWalletSuccess, disconnectWallet } from '@/lib/redux/slices/auth'
import api from '@/utils/axiosConfig'
import bs58 from "bs58"
import { useAppSelector } from '@/lib/redux/hooks'
import Link from 'next/link'
import SearchComponent from './Search'
import { loadNotificationsFailure, loadNotificationsStart, loadNotificationsSuccess } from '@/lib/redux/slices/notifications'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner';
import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google'
import { useRouter, useSearchParams } from 'next/navigation'
import { CompanyProfileDropDown } from './CompanyProfileDropDown'


const CompanyHeader = () => {
  const { connect, connected, connecting, wallet, publicKey, disconnect } = useWallet()
  const dispatch = useDispatch();
  const router = useRouter();
  const { isConnected, walletAddress, jwtToken, userData } = useAppSelector((state) => state.auth)
  const { setVisible, visible } = useWalletModal();
  const [userInitiatedConnection, setUserInitiatedConnection] = useState(false);
  const [prevVisible, setPrevVisible] = useState(false);
  // const [profile, setprofile] = useState("Sign in with Google");
  const [profile2, setprofile2] = useState("Sign in with Github");
  const searchParams = useSearchParams();
  const code = searchParams.get("code"); 
  const called = useRef(false);
  const { profile } = useAppSelector((state) => state.profile);
  const isOwner = userData?._id === profile?._id;

  // const handleWalletClick = useCallback(async () => {
  //   try {
  //     dispatch(connectWalletStart());
  //     setVisible(true);
  //   } catch (err) {
  //     toast.error(`Connection failed: ${err.message}`);
  //     console.log("disconnecting due to error: ", err.message);
  //     dispatch(disconnectWallet());
  //     await disconnect();
  //   }
  // }, [setVisible, dispatch, disconnect])

  // const signInWithBackend = async () => {
  //   dispatch(authenticateStart());
  //   const loaderId = toast.loading("Signing in...");
  //   try{
  //     const timestamp = Date.now()
  //     const message = `signin-user:${timestamp}`
  //     const messageBytes = new TextEncoder().encode(message)
  //     const signature = await wallet.adapter.signMessage(messageBytes)
  //     const signatureBase58 = bs58.encode(signature)
      
  //     const response = await api.post("/user-sign-in",{
  //       publicKey: publicKey.toBase58(),
  //       signature: signatureBase58,
  //       message
  //     })
  //     dispatch(authenticateSuccess(response.data));
  //     toast.success("Signed in successfully", { id: loaderId });
  //   } catch(err) {
  //     console.log("disconnecting due to error2: ", err.message);
  //     toast.error(`Sign in failed: ${err?.response?.data?.message||err.message}`, { id: loaderId });
  //     dispatch(authFailure(err.message));
  //     await disconnect();
  //   }
  // }

  // const connectToSelectedWallet = useCallback(async() => {
  //   if (!userInitiatedConnection || !wallet) return
  //   console.log("Connecting to wallet:", wallet.adapter.name);
  //   try{
  //     await connect();
  //   }catch(err){
  //     dispatch(disconnectWallet());
  //     console.log("disconnecting due to error3: ", err.message);
  //     await disconnect();
  //   }finally {
  //     setUserInitiatedConnection(false) // Reset after attempt
  //   }
  // },[wallet, connect, disconnect, userInitiatedConnection])

  // Track when modal closes and user selected a wallet
  // useEffect(() => {
  //   if (prevVisible && !visible && wallet) {
  //     // Modal just closed and we have a wallet selected
  //     setUserInitiatedConnection(true);
  //   }
  //   setPrevVisible(visible);
  // }, [visible, wallet, prevVisible]);

  // Trigger connection when user selects wallet from modal
  // useEffect(() => {
  //   if (userInitiatedConnection && wallet && !connected) {
  //     connectToSelectedWallet();
  //   }
  // }, [userInitiatedConnection, wallet, connected, connectToSelectedWallet]);

  // Handle successful connection
  // useEffect(() => {
  //   if (publicKey && userInitiatedConnection) {
  //     dispatch(connectWalletSuccess({
  //       walletAddress: publicKey.toBase58()
  //     }))
  //     signInWithBackend();
  //   }
  // }, [publicKey, userInitiatedConnection]);
  
  
  // const getNotifications = async () => {
  //   try{
  //     dispatch(loadNotificationsStart())
  //     const response = await api.get("/get-notifications",{
  //       headers: {
  //         Authorization: `Bearer ${jwtToken}`
  //       }
  //     })
  //     dispatch(loadNotificationsSuccess(response.data));
  //   } catch(err) {
  //     dispatch(loadNotificationsFailure(err?.response?.data?.message || "Failed to load notifications"))
  //     console.error("Error loading notifications:", err);
  //   }
  // }

  // console.log(connected , walletAddress , jwtToken , userData , isConnected)
  // useEffect(() => {
  //   if (jwtToken) {
  //     getNotifications();
  //   }
  // }, []);
  // console.log("wjak: ", wallet?.adapter?.name, publicKey);

  // useEffect(() => {
  // if (code && !called.current) {
  //   called.current = true;

  //     // Exchange code for token  
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetch(`/api/github?code=${code}`);
  //         const data = await response.json();
  //         console.log("GitHub OAuth Data:", data);
  //       } catch (error) {
  //         console.error("Error fetching GitHub profile:", error);
  //       }
  //     };
  //     fetchData();
  //   } else {
  //     console.log(code+" - no code");
  //     setprofile2("Sign in with Github")
  //   }
  // }, [code]);

  

  // Google OAuth (commented out for now)
  // const handleSuccess = async (tokenResponse) => {
  //   console.log("Google OAuth Token:", tokenResponse);

  //   // You can exchange this token on backend for user info / JWT
  //   const res = await fetch("/api/google", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ access_token: tokenResponse.access_token }),
  //   });

  //   const data = await res.json();
  //   setprofile(data?.profile?.name || "Sign in with Google")
  //   console.log("Returned Data:", data);
  // };

  // const handleError = () => {
  //   console.log("Google Login Failed");
  // };

  // const login = useGoogleLogin({
  //   onSuccess: handleSuccess,
  //   onError: handleError,
  //   useOneTap: true, // 👉 One Tap enabled
  // });

  // const logout = () => {
  //   googleLogout();
  //   setprofile("Sign in with Google")
  //   console.log("Logged out");
  // }



  //Github Auth
  // const loginWithGitHub = () => {
  //   const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  //   const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
  //   const scope = [
  //     "read:user",       // Read user profile info (followers, company, bio, etc.)
  //     "user:email",      // Access public + private emails
  //     "repo",            // Full control of public + private repos (needed for private repo counts)
  //     // "gist",            // List/create/edit/delete gists
  //     // "workflow",        // Access/manage GitHub Actions workflows
  //     // "read:org",        // Read org memberships
  //     // "admin:org",       // Full org management (dangerous, usually not needed)
  //     // "admin:repo_hook", // Manage repo webhooks
  //     // "notifications",   // Read user’s notifications
  //     // "read:discussion", // Access discussions
  //     // "project",         // Manage projects
  //   ].join(" ");

  //   const githubAuthUrl =`https://github.com/login/oauth/authorize?` +
  //   new URLSearchParams({
  //     client_id: clientId,
  //     redirect_uri: redirectUri,
  //     scope,
  //   });

  //   window.location.href = githubAuthUrl;
  // }

  return (
    <>
      <header className="sticky top-0 z-[50] flex items-center justify-between px-3 md:px-9 py-4 bg-background border-b border-border shadow-sm">
        <Link href="/start">
          <div className="text-xl font-bold text-white flex gap-x-1 items-center">
            <Image
              src="/logo.svg"
              alt="Snipost Logo"
              width={30}
              height={30}
              className='sm:h-[30px]! sm:w-[30px]! h-[23px] w-[23px]'
            />
            <h2 className='text-xl sm:text-2xl text-primary'>Snipost</h2>
          </div>
        </Link>

        <SearchComponent />
        {/* <WalletMultiButtonDynamic> */}


        {userData?.role === "company" ? ((jwtToken && userData ) ? 
          <CompanyProfileDropDown>
            <Button variant="muted" className="gap-2 py-2! text-xs sm:text-sm border border-zinc-700" onClick={() => handleWalletClick()}>
              <Image
                src={userData?.avatar?.url || "/default_avatar.png"}
                alt="Profile"
                width={27}
                height={27}
                className='h-6 w-6 rounded-full object-cover aspect-square'
              />
              {userData?.name?.length > 8 ? `${userData.name.slice(0, 8)}...` : userData.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CompanyProfileDropDown>
          :
          <Button variant="default" className="gap-2 py-1! text-xs sm:text-base" onClick={() => router.push("/signin")}>
            <CircleUser className="h-7 w-7" />
            {connecting ? "Connecting..." : "Sign in"}
          </Button>) :
            <Button variant="muted" className="gap-2 py-2! text-xs sm:text-sm border border-zinc-700" onClick={() => router.push(`/profile/${userData?.userName}`)}>
              <Image
                src={userData?.avatar?.url || "/default_avatar.png"}
                alt="Profile"
                width={27}
                height={27}
                className='h-6 w-6 rounded-full object-cover aspect-square'
              />
              {userData?.name?.length > 8 ? `${userData?.name.slice(0, 8)}...` : userData?.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
        }  




        
        {/* </WalletMultiButtonDynamic> */}
        {/* <Button
          variant="default"
          className=" cursor-pointer gap-2 py-1 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={profile === "Sign in with Google" ? login : logout}
        >
          { profile === "Sign in with Google" ? 
            <LogIn className="h-4 w-4" /> : 
            <LogOut className="h-4 w-4" />
          }
          {profile}
        </Button> */}

        {/* <Button
          variant="default"
          className=" cursor-pointer gap-2 py-1 px-3 rounded-xl bg-black-600 hover:bg-black-700 text-white shadow-md"
          onClick={profile === "Sign in with Google" ? loginWithGitHub : ()=>alert("Logout")}
        >
          { profile === "Sign in with Google" ? 
            <LogIn className="h-4 w-4" /> : 
            <LogOut className="h-4 w-4" />
          }
          {profile}
        </Button> */}

      </header>
    </>
  )
}

export default CompanyHeader