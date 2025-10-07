import { Geist } from "next/font/google";
import "../globals.css";
import Header from "@/components/appComponents/Header";
import { Toaster } from "@/components/ui/sonner";
import { ProfilePrompt } from "@/components/appComponents/ProfilePrompt";


const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});


export default function CompanyLayout({ children }) {
  return (
    <>
      <ProfilePrompt />
      <Header/>
        <Toaster />
          <main className="font-[var(--font-geist)] w-full">
            {children}
          </main>
    </>
  );
}
