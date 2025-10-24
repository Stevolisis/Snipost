"use client";

import SnipCard from "@/components/appComponents/SnipCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Zap, Code2, Users, Trophy, Eye, Building2, FileCode2, Network, Bell, Briefcase } from "lucide-react";
import api from "@/utils/axiosConfig";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";
import { loadSnippetsStart, loadSnippetsSuccess, snippetsFailure } from "@/lib/redux/slices/snippets";

export default function LandingPage() {
  const dispatch = useAppDispatch();
  const { snippets = [], isLoading, error } = useAppSelector((state) => state.snippets);

  useEffect(() => {
    const fetchTrendingSnippets = async () => {
      try {
        dispatch(loadSnippetsStart());
        const response = await api.get("/get-trending-snippets?timeRange=all&limit=10");
        const snippets = response.data.snippets || [];
        dispatch(loadSnippetsSuccess(snippets));
      } catch (err) {
        dispatch(snippetsFailure(err.message || "Failed to load snippets"));
      }
    };
    fetchTrendingSnippets();
  }, [dispatch]);


  const devFeatures = [
    {
      icon: <Code2 className="w-6 h-6 text-primary" />,
      title: "Post & Share Code Snippets",
      description: "Build, edit and share code snippets with built-in code snippet editors."
    },
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      title: "Turn Progress Into Proof",
      description:
        "Your posts become your public record showing your learning, consistency, and impact beyond any résumé.",
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Explain Visually",
      description:
        "With Snaps, turn complex ideas into visuals showing code in context, with flow, design, and clarity.",
    },
    {
      icon: <Trophy className="w-6 h-6 text-primary" />,
      title: "Earn Recognition & XP",
      description:
        "Each contribution earns XP and builds your developer identity verified by what you build, not what you claim.",
    },
  ];


  const companyFeatures = [
    {
      icon: <FileCode2 className="w-6 h-6 text-primary" />,
      title: "Document SDKs Seamlessly",
      description:
        "Drop feature updates, API examples, and tutorials without managing docs infrastructure straight from Snipost.",
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Engage Real Builders",
      description:
        "Your SDK posts reach active developers who can learn, integrate, or contribute. Turn your docs into a two-way conversation.",
    },
    {
      icon: <Building2 className="w-6 h-6 text-primary" />,
      title: "Discover Builders Through Proof",
      description:
        "Hire or collaborate based on public work not portfolios. See who’s already building with your tools.",
    },
  ];

  const ecosystem = [
    {
      icon: <Bell className="w-6 h-6 text-primary" />,
      title: "Follow Your Favourite SDKs",
      description:
        "Stay in sync with the tools you use. Get real-time code examples, feature drops, and updates from your favourite dev companies.",
    },
    {
      icon: <Network className="w-6 h-6 text-primary" />,
      title: "Learn From Real Progress",
      description:
        "Instead of staged tutorials, Snipost lets you see authentic, in-progress builds from developers and projects you admire.",
    },
    {
      icon: <Code2 className="w-6 h-6 text-primary" />,
      title: "Save & Remix Snippets",
      description:
        "Every snippet on Snipost can inspire yours fork, learn, or remix directly into your workflow.",
    },
  ];

  const faqs = [
    {
      question: "What is Snipost?",
      answer:
        "Snipost is a developer network built around proof of work. Developers post progress, companies share SDK updates, and everyone learns from real, working examples.",
    },
    {
      question: "How does proof of work help developers?",
      answer:
        "Instead of hiding behind commits, you post progress and context. Snipost turns your builds into visible proof that employers, peers, and companies can trust.",
    },
    {
      question: "What can companies do on Snipost?",
      answer:
        "Companies can share SDK docs, examples, and updates reaching real developers and seeing who’s actively building in their ecosystem.",
    },
    {
      question: "How does Snipost help Web2 devs get into Web3?",
      answer: "Snipost offers curated Solana snippets and beginner guides, so you can learn smart contracts, NFTs, or wallets without wading through outdated blogs. It's like a Web3 mentor in your pocket."
    },
    {
      question: "What's the snap editor, and why should I use it?",
      answer: "The snap editor lets you create visual explainers and infographics to explain your code concepts. Perfect for making complex Solana development topics easy to understand and share with the community."
    },
    {
      question: "What's the snip editor for?",
      answer: "The snip editor is where you write or paste your Solana code snippets with descriptions, tags, and notes. Document your code, share solutions, and build your developer reputation in the community."
    },
  ];

  

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container relative z-10 mx-auto px-6 py-24 md:py-36 flex flex-col items-center">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 bg-primary/10 rounded-full">
              <span className="text-xs sm:text-sm font-medium text-primary">The Proof-of-Work Network for Developers</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Build in Public. <span className="text-primary">Get Hired</span>.
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-10 max-w-4xl mx-auto">
              Snipost helps developers build public proof of work, while companies share SDK updates and discover the builders already using them.              
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 text-sm md:text-base md:h-11" asChild>
                <Link href="/feed/snippets">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  Start Building Proof
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-sm md:text-base md:h-11" asChild>
                <Link href="/snipdevs">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  See Developer Profiles
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero image/mockup */}
          <div className="mt-16 w-full max-w-4xl mx-auto relative">
            <div className=" bg-black/80 rounded-xl shadow-2xl overflow-hidden border border-muted">
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-background p-2">
                <Image
                  src="/snip_devs2.png"
                  alt="App Screenshot"
                  width={1000}
                  height={1000}
                  className='w-full h-full rounded-lg'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Features */}
      <section className="container mx-auto px-6 py-12 sm:py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Proof Speaks Louder Than Portfolios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your code, document your learning, and turn progress into proof. Let your builds speak for you.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {devFeatures.map((item, i) => (
            <Card
              key={i}
              className="bg-background/60 border border-zinc-800 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <CardHeader>
                <div className="mb-4 p-3 bg-primary/10 w-fit rounded-lg">{item.icon}</div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      
      {/* Snaps Section */}
<section className="container mx-auto px-6 py-12 sm:py-12 text-center">
  <h2 className="text-3xl md:text-4xl font-bold mb-4">Explain Better with Snaps</h2>
  <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
    Some ideas can't be explained with just text. With Snaps, developers can create visual explainers for features, SDKs, and concepts — making their proof of work easy to understand and share.
  </p>

  <div 
    className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-border shadow-lg select-none"
    onContextMenu={(e) => e.preventDefault()}
    style={{ userSelect: 'none' }}
  >
    <video
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      className="w-full h-auto rounded-xl pointer-events-none"
      poster="/snipost_visual_snap.png"
      onContextMenu={(e) => e.preventDefault()}
    >
      <source 
        src="https://res.cloudinary.com/dbkcvkodl/video/upload/v1761265401/snipost_cuts_3_eyaog5.mp4" 
        type="video/mp4" 
      />
      Your browser does not support the video tag.
    </video>
  </div>
</section>


      {/* Company Features */}
      <section className="container mx-auto px-6 py-12 sm:py-12 bg-muted/10 rounded-xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            For Companies Document. Engage. Hire.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Snipost brings your SDKs, updates, and examples closer to developers and connects you directly to those building with them.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companyFeatures.map((item, i) => (
            <Card
              key={i}
              className="bg-background/60 border border-zinc-800 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <CardHeader>
                <div className="mb-4 p-3 bg-primary/10 w-fit rounded-lg">{item.icon}</div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="max-w-4xl mx-auto mt-24">
            {/* Company CTA */}
              <Card className="border-2 border-primary/50 bg-primary/5">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Next Developer?</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                    Join 20+ Web3 companies already using Snipost to discover talent, share documentation, and grow their developer ecosystem.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="gap-2 text-base" asChild>
                      <Link href="/signup">
                        <Briefcase className="w-5 h-5" />
                        Sign Up as a Company
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2" asChild>
                      <Link href="/#">
                        Schedule a Demo
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Get access to talent discovery tools, analytics, and sponsored challenge features
                  </p>
                </CardContent>
              </Card>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="container mx-auto px-6 py-12 sm:py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join a Living Developer Ecosystem</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          Follow your favourite SDKs, tools, and developers. Get real code updates, visual examples, and authentic builds all in one stream.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ecosystem.map((item, i) => (
            <Card
              key={i}
              className="bg-background/60 border border-zinc-800 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <CardHeader>
                <div className=" flex justify-center">
                  <div className="mb-4 p-3 bg-primary/10 w-fit rounded-lg">{item.icon}</div>
                </div>
                <CardTitle className="text-lg -mb-4">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-12 sm:py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-background/50 py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          <div>
            <h3 className="font-bold text-lg mb-3">Snipost</h3>
            <p className="text-muted-foreground">
              Where developers build public proof of work, and companies connect through real code and progress.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Developers</h4>
            <ul className="space-y-2">
              <li><Link href="/feed/snippets" className="hover:text-primary">Start Posting</Link></li>
              <li><Link href="/learn" className="hover:text-primary">Learn with Snaps</Link></li>
              <li><Link href="/explore" className="hover:text-primary">Explore Proofs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Companies</h4>
            <ul className="space-y-2">
              <li><Link href="/companies" className="hover:text-primary">Company Dashboard</Link></li>
              <li><Link href="/companies/docs" className="hover:text-primary">Post SDK Docs</Link></li>
              <li><Link href="/companies/hire" className="hover:text-primary">Hire Builders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Community</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary">About Snipost</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-muted-foreground text-sm mt-12">
          © {new Date().getFullYear()} Snipost. Built for developers, by developers.
        </div>
      </footer>
    </div>
  );
}
