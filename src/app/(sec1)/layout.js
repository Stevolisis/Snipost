import { Geist } from "next/font/google";
import "../globals.css";
import Header from "@/components/appComponents/Header";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appComponents/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import ReduxStateProvider from "@/lib/redux/ReduxStateProvider";
import WalletContextProvider from './../../components/appComponents/WalletContextProvider';
import { ProfilePrompt } from "@/components/appComponents/ProfilePrompt";
import { GoogleOAuthProvider } from "@react-oauth/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});


export default function Section1Layout({ children }) {
  return (
    <>
      <ProfilePrompt />
      <Header/>
      <SidebarProvider>
        <AppSidebar className="mt-18"/>
        <Toaster />
          <main className="font-[var(--font-geist)] w-full">
            <SidebarTrigger />
            {children}
          </main>

      </SidebarProvider>          
    </>
  );
}
