import { Geist } from "next/font/google";
import Header from "@/components/appComponents/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AccountSidebar } from "@/components/appComponents/AccountSidebar";
import "../globals.css";


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
