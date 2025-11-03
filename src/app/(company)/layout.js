import { Geist } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CompanyProfilePrompt } from "@/components/appComponents/CompanyProfilePrompt";
import CompanyHeader from "@/components/appComponents/CompanyHeader";
import { CompanyAppSidebar } from "@/components/appComponents/CompanySidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import RouteProtector from "./RouteProtector";


const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});


export default function CompanyLayout({ children }) {

  return (
    <>
      <RouteProtector>
        <CompanyProfilePrompt />
        <CompanyHeader/>
        <SidebarProvider>
          <CompanyAppSidebar className="mt-18"/>
          <Toaster />
          <main className="font-[var(--font-geist)] w-full">
            <SidebarTrigger size={30}/>
            {children}
          </main> 
        </SidebarProvider>
      </RouteProtector>
    </>
  );
}
