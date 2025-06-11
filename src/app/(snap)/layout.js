import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/appComponents/Header";
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

export default function Section1Layout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>

        {/* <WalletContextProvider>
        <WalletProviderClient> */}

        <Wallet>
            <ReduxStateProvider>
              <ProfilePrompt />
              {/* <Header/> */}
                <Toaster />
                  <main className="font-[var(--font-inter)] w-full">
                    {children}
                  </main>
            </ReduxStateProvider>          
        </Wallet>



        {/* </WalletProviderClient>  
        </WalletContextProvider> */}
      </body>
    </html>
  );
}
