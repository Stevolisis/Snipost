import { Geist } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CompanyProfilePrompt } from "@/components/appComponents/CompanyProfilePrompt";
import CompanyHeader from "@/components/appComponents/CompanyHeader";


const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});


export default function CompanyLayout({ children }) {
  return (
    <>
      <CompanyProfilePrompt />
      <CompanyHeader/>
        <Toaster />
        <main className="font-[var(--font-geist)] w-full">
          {children}
        </main> 
    </>
  );
}
