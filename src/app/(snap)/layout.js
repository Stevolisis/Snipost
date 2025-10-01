import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/appComponents/Header";
import { AppSidebar } from "@/components/appComponents/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import ReduxStateProvider from "@/lib/redux/ReduxStateProvider";
import WalletContextProvider from './../../components/appComponents/WalletContextProvider';
import { ProfilePrompt } from "@/components/appComponents/ProfilePrompt";


export default function Section1Layout({ children }) {
  return (
    <>
      <ProfilePrompt />
      <Toaster />
        <main className="font-[var(--font-geist)] w-full">
          {children}
        </main>
    </>

  );
}
