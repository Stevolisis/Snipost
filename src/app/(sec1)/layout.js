import { Poppins } from "next/font/google";
import "../globals.css";
import Header from "@/components/appComponents/Header";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appComponents/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import ReduxStateProvider from "@/lib/redux/ReduxStateProvider";
import WalletContextProvider from './../../components/appComponents/WalletContextProvider';
import { ProfilePrompt } from "@/components/appComponents/ProfilePrompt";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ['100', '200', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
});

export const metadata = {
  title: 'Snipost',
  description: 'Where web3 developers share, learn, build and earn with Snipost',
  openGraph: {
    title: 'Snipost',
    description: 'Where web3 developers share, learn, build and earn with Snipost',
    url: 'https://snipost.vercel.app',
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
      <body className={`${poppins.variable} antialiased`}>

        <WalletContextProvider>
            <ReduxStateProvider>
              <ProfilePrompt />
              <Header/>
              <SidebarProvider>
                <AppSidebar className="mt-18"/>
                <Toaster />
                  <main className="font-[var(--font-poppins)] w-full">
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
