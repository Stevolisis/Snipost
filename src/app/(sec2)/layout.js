import { Geist } from "next/font/google";
import Header from "@/components/appComponents/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AccountSidebar } from "@/components/appComponents/AccountSidebar";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import ReduxStateProvider from "@/lib/redux/ReduxStateProvider";
import WalletContextProvider from "@/components/appComponents/WalletContextProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";


const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export default function Section2Layout({ children }) {
  return (         
    <>
      <Header/>
      <SidebarProvider>
        <AccountSidebar className="mt-18"/>
          <main className="font-[var(--font-geist)] w-full">
            <SidebarTrigger />
            {children}
          </main>

      </SidebarProvider> 
    </>
  );
}
