import { Geist } from "next/font/google";
import Header from "@/components/appComponents/Header";
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
        <main className="font-[var(--font-geist)] w-full">
          {children}
        </main>
    </>
  );
}
