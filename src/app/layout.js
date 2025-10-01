import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ReduxStateProvider from "@/lib/redux/ReduxStateProvider";
import WalletContextProvider from "@/components/appComponents/WalletContextProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// export const metadata = {
//   title: 'Snipost: Building in Public',
//   description: 'Where web3 developers share, learn, build and earn with Snipost',
//   openGraph: {
//     title: 'Snipost',
//     description: 'Where web3 developers share, learn, build and earn with Snipost',
//     url: 'https://snipost.vercel.app',
//     siteName: 'Snipost Blog',
//     images: [
//       {
//         url: 'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/4JmubmYDJnFtstwHbaZPev/0c3576832aae5b1a4d98c8c9f98863c3/Vercel_Home_OG.png',
//         width: 600,
//         height: 600,
//         alt: 'Snipost - Web3 Developer Community',
//       },
//     ],
//     siteName: "Snipost"
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Snipost',
//     description: 'Where web3 developers share, learn, build and earn with Snipost',
//     images: ['https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/4JmubmYDJnFtstwHbaZPev/0c3576832aae5b1a4d98c8c9f98863c3/Vercel_Home_OG.png',],
//   },
//   other: {
//     'theme-color': '#E5FF4A',
//     'msapplication-TileColor': '#E5FF4A',
//   },
// };


export default function Layout({ children }) {
  return (
    <html lang="en" className="dark">
        <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/4JmubmYDJnFtstwHbaZPev/0c3576832aae5b1a4d98c8c9f98863c3/Vercel_Home_OG.png" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Voteronics | Mechatronics Voting Portal</title>
        </head>
      <body className={`${geist.variable} antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <WalletContextProvider>
            <ReduxStateProvider>
                <Toaster />
                  <main className="font-[var(--font-geist)] w-full">
                    {children}
                  </main>
            </ReduxStateProvider>          
          </WalletContextProvider>          
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
