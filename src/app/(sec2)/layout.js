import { Inter } from "next/font/google";
import Header from "@/components/appComponents/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AccountSidebar } from "@/components/appComponents/AccountSidebar";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import ReduxStateProvider from "@/lib/redux/ReduxStateProvider";
import WalletContextProvider from "@/components/appComponents/WalletContextProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Snipost',
  description: 'Where web3 developers share, learn, build and earn with Snipost',
  openGraph: {
    title: 'Snipost',
    description: 'Where web3 developers share, learn, build and earn with Snipost',
    url: 'https://snipost.vercel.app',
    siteName: 'Example Blog',
    images: [
      {
        url: 'https://snipost.vercel.app/og-image.png',
        width: 600,
        height: 600,
        alt: 'Snipost - Web3 Developer Community',
      },
    ],
    siteName: "Snipost"
  },
  twitter: {
    card: 'snipost',
    title: 'Snipost',
    description: 'Where web3 developers share, learn, build and earn with Snipost',
    images: ['https://snipost.vercel.app/og-image.png',],
  },
  other: {
    'theme-color': '#E5FF4A',
    'msapplication-TileColor': '#E5FF4A',
  },
};


export default function Section2Layout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <WalletContextProvider>
          <ReduxStateProvider>
            <Header/>
            <SidebarProvider>
              <AccountSidebar className="mt-18"/>
              <Toaster />
                <main className="font-[var(--font-inter)] w-full">
                  <SidebarTrigger />
                  {children}
                </main>

            </SidebarProvider>          
          </ReduxStateProvider>          
        </WalletContextProvider>


      </body>
    </html>
  );
}
