import { Geist } from "next/font/google";
import "../globals.css";
import Header from "@/components/appComponents/Header";
import { Toaster } from "@/components/ui/sonner";
import { CompanyProfilePrompt } from "@/components/appComponents/CompanyProfilePrompt";


const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});


export default function CompanyLayout({ children }) {
  return (
    <>
      <CompanyProfilePrompt />
      <Header/>
        <Toaster />
          <main className="font-[var(--font-geist)] w-full">
            {children}
          </main>
    </>
  );
}
