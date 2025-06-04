import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/appComponents/Header";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appComponents/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import ReduxStateProvider from "@/lib/redux/ReduxStateProvider";
import WalletContextProvider from './../../components/appComponents/WalletContextProvider';
import { Wallet } from "@/components/appComponents/WalletProviderClient";
import { ProfilePrompt } from "@/components/appComponents/ProfilePrompt";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Snipost",
  description: "Learn, build, share and earn with Snipost",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function Section1Layout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>

        {/* <WalletContextProvider>
        <WalletProviderClient> */}

        <Wallet>
            <ReduxStateProvider>
              <ProfilePrompt />
              <Header/>
              <SidebarProvider>
                <AppSidebar className="mt-18"/>
                <Toaster />
                  <main className="font-[var(--font-inter)] w-full">
                    <SidebarTrigger />
                    {children}
                  </main>

              </SidebarProvider>          
            </ReduxStateProvider>          
        </Wallet>



        {/* </WalletProviderClient>  
        </WalletContextProvider> */}
      </body>
    </html>
  );
}
