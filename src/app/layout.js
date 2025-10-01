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
//   description: 'Build and share in public, earn onchain reputation, find real world solutions',
//   openGraph: {
//     title: 'Snipost',
//     description: 'Build and share in public, earn onchain reputation, find real world solutions',
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
//     description: 'Build and share in public, earn onchain reputation, find real world solutions',
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
            {/* required basics */}
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="robots" content="index,follow" />

            {/* page title + description */}
            <title>Snipost — Web3 dev community</title>
            <meta name="description" content="Build and share in public, earn onchain reputation, find real world solutions" />

            {/* icons */}
            <link rel="icon" type="image/png" href="https://snipost.vercel.app/og-image.png" />
            <link rel="apple-touch-icon" href="https://snipost.vercel.app/og-image.png" />

            {/* canonical */}
            <link rel="canonical" href="https://snipost.vercel.app" />

            {/* Open Graph (complete set) */}
            <meta property="og:title" content="Snipost | Find and Share real world solutions using Code Snippets" />
            <meta property="og:description" content="Build and share in public, earn onchain reputation, find real world solutions" />
            <meta property="og:image" content="https://snipost.vercel.app/og-image.png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Snipost - Web3 Developer Community" />
            <meta property="og:url" content="https://snipost.vercel.app" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Snipost | Find and Share real world solutions using Code Snippets" />

            {/* Twitter card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Snipost | Find and Share real world solutions using Code Snippets" />
            <meta name="twitter:description" content="Build and share in public, earn onchain reputation, find real world solutions" />
            <meta name="twitter:image" content="https://snipost.vercel.app/og-image.png" />

            {/* theme */}
            <meta name="theme-color" content="#E5FF4A" />
            <meta name="msapplication-TileColor" content="#E5FF4A" />

            {/* Structured data for rich previews */}
            {/* <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                url:"https://snipost.vercel.app"
                name: "Snipost",
                description: "Build and share in public, earn onchain reputation, find real world solutions",
                }),
            }}
            /> */}
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
