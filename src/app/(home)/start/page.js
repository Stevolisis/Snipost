"use client"
import SnipCard from "@/components/appComponents/SnipCard"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { loadSnippetsStart, loadSnippetsSuccess, snippetsFailure } from "@/lib/redux/slices/snippets"
import api from "@/utils/axiosConfig"
import { Code2, PenTool, Trophy, Zap, Users, BarChart2, Gift, ArrowRight, Check, Star, Database, Shield, Sparkles, User, Folder } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import Marquee from "react-fast-marquee"
const { motion } = require("framer-motion");

export default function LandingPage() {
  const dispatch = useAppDispatch();
  const { snippets = [], isLoading, error } = useAppSelector((state) => state.snippets);

  useEffect(() => {
    const fetchTrendingSnippets = async () => {
      try {
        dispatch(loadSnippetsStart());
        const response = await api.get('/get-trending-snippets?timeRange=month&limit=10');
        const snippets = response.data.snippets || [];
        dispatch(loadSnippetsSuccess(snippets));
      } catch (err) {
        dispatch(snippetsFailure(err.message || 'Failed to load snippets'));
      }
    };

    fetchTrendingSnippets();
  }, []);

const snaps = [
  {
    image: "/artboard3.png",
    title: "Anatomy of a Solana Program",
    description: "Key components in a Rust-based Solana smart contract"
  },
  {
    image: "/artboard2.png",
    title: "Secure Wallet Login Flow",
    description: "How users sign in with their crypto wallet."
  },
  {
    image: "/artboard4.png",
    title: "Initialize a Solana Account using Anchor",
    description: "Learn how to define and create a custom on-chain account in Solana using Anchor's #[derive(Accounts)] pattern. This snippet shows how account initialization, rent payment, and memory allocation are handled"
  },
  {
    image: "/artboard5.png",
    title: "Transfer Tokens on Solana vs Ethereum",
    description: "A side-by-side code comparison showing how to send native tokens (SOL and ETH) using @solana/web3.js and ethers.js. Solana uses lamports and system programs; Ethereum uses gwei and gas."
  },
  {
    image: "/artboard6.png",
    title: "Setting things up for Turbine3",
    description: "Follow these steps to set up a local Solana dev environment."
  },
];

  const features = [
    {
      icon: <Code2 className="w-5 h-5 md:w-8 md:h-8 text-primary" />,
      title: "Post & Share Snippets",
      description: "Build, edit and share code snippets with built-in syntax highlighting and collaborative tools."
    },
    {
      icon: <Folder className="w-6 h-6 text-primary" />,
      title: "Organized Snips & Snaps",
      description: "Find and share trusted Solana code snippets and snaps, tagged and upvoted by the community, so you skip the Discord chaos."
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Snap Editor",
      description: "Create visual explainers with our snap editor to simplify complex Solana concepts."
    },
    {
      icon: <Trophy className="w-6 h-6 text-primary" />,
      title: "Sponsored Challenges",
      description: "Tackle bounties from Web3 companies, earn SOL, and flex your skills on the leaderboard."
    },
    // {
    //   icon: <Users className="w-6 h-6 text-primary" />,
    //   title: "Web3 Community",
    //   description: "Join Solana devs to share code, get feedback, and build your on-chain reputation."
    // }
  ];

  const testimonials = [
    {
      quote: "Snipost’s organized snippets saved me hours of digging through Turbine3’s Discord for working Solana code.",
      author: "Priya Sharma",
      role: "Solana Developer",
      image: "/user1.png"
    },
    {
      quote: "As a Web2 dev, Snipost’s resources made Solana feel approachable, no more outdated tutorials!",
      author: "Liam Chen",
      role: "Frontend Developer",
      image: "/user2.jpg"
    },
    {
      quote: "Documenting my hackathon project with the snap editor helped me stand out and get featured!",
      author: "Tunde Okoye",
      role: "Hackathon Winner",
      image: "/user3.jpg"
    }
  ];



  const stats = [
    { value: "6,000+", label: "Active Developers" },
    { value: "15,000+", label: "Code Snippets" },
    { value: "1,000+", label: "SOL Earned" },
    { value: "92%", label: "Community Trust" }
  ];

  const faqs = [
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
    {
      question: "How do sponsored challenges work?",
      answer: "Web3 companies post bounties on Snipost with real-world problems. You submit your solutions, and the sponsoring company evaluates entries to select winners who earn SOL rewards and climb the leaderboard."
    },
    {
      question: "Why not just use Discord or GitHub for Solana code?",
      answer: "Discord's a mess - snippets get lost or don't work. GitHub's great but not built for quick Solana learning or community rewards. Snipost's tailored for Solana devs with tags, upvotes, and SOL incentives."
    }
  ];

  const pricingTiers = [
    {
      name: "Explorer",
      price: "Free",
      description: "Perfect for beginners looking to learn Solana development",
      features: [
        "3 snippets/post monthly",
        "Basic snippet editor features",
        "Community feed access",
        "1 folder organization",
        "Limited visual explainers"
      ],
      cta: "Get Started",
      highlight: false
    },
    {
      name: "Builder",
      price: "$12.99",
      period: "/month",
      description: "For serious developers building their reputation",
      features: [
        "Unlimited snippets & posts",
        "Advanced code editor",
        "Priority in community feed",
        "10 custom folders",
        "Full visual explainer access",
        "Participation in all code battles"
      ],
      cta: "Upgrade to Builder",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For companies engaging with the Solana community",
      features: [
        "Sponsored challenges",
        "Talent recruitment tools",
        "Custom branding options",
        "Analytics dashboard",
        "API access",
        "Priority support"
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container relative z-10 mx-auto px-6 py-24 md:py-36 flex flex-col items-center">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">The SocialFi Platform for Solana Developers</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Build. Share. <span className="text-primary">Win</span>.
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-10 max-w-4xl mx-auto">
              I’m a Solana dev like you, fed up with scattered resources and Discord chaos. Snipost’s your hub to find trusted code snippets, document your work, and earn SOL in the Web3 community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 text-sm md:text-base md:h-11" asChild>
                <Link href="/feed/snippets">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  Jump In Now
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-sm md:text-base md:h-11" asChild>
                <Link href="/feed/snippets">
                  <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Explore Snippets
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Hero image/mockup */}
          <div className="mt-16 w-full max-w-4xl mx-auto relative">
            <div className=" bg-black/80 rounded-xl shadow-2xl overflow-hidden border border-muted">
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-background p-2">
                <Image
                  src="/snipost2.png"
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

      {/* Pain Points Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            The Web3 Dev Struggle Is Real
          </h2>
          <p className="text-lg text-muted-foreground">
            I’ve been there losing hours to bad tutorials and buried code. Here’s what we’re fixing.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-background/80 border-destructive/20">
            <CardHeader>
              <CardTitle>Without Snipost</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-red-500" /> Scattered Solana resources - outdated blogs, broken Discord snippets.</li>
                <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-red-500" /> No clear use cases for some solana projects - wasting time guessing.</li>
                <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-red-500" /> Your killer feature? Lost because you didn't document it properly.</li>
                <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-red-500" /> Hesitant to share code, scared of harsh feedback or no response.</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-background/80 border-green-500/20">
            <CardHeader>
              <CardTitle>With Snipost</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-green-500" /> Curated, upvoted Solana snippets - Web2 devs learn fast, experienced devs find what works.</li>
                <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-green-500" /> Clear integration guides for hackathons - nail @Solana projects.</li>
                <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-green-500" /> Snip editor to document your code & Snap editor for visual explainers - never forget a win.</li>
                <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-green-500" /> Safe space to share code, get constructive feedback, and shine on the leaderboard.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything You Need to Succeed in Web3</h2>
          <p className="text-lg text-muted-foreground">
            Our comprehensive platform helps you learn, share, and monetize your Solana development skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={`feature-${index}`} className="border bg-background/50 hover:shadow-lg transition-all hover:border-primary/50">
              <CardHeader className="pb-2">
                <div className="mb-4 p-3 rounded-lg inline-block bg-primary/10 w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
 <section className="container px-6 py-18 m-auto mt-12 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How Snipost Levels You Up
          </h2>
          <p className="text-lg text-muted-foreground">
            From learning to earning, here's the flow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <div className="bg-[#E5FF4A]/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <span className="text-xl md:text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Learn & Explore</h3>
            <p className="text-muted-foreground">
              Web2 devs dive into Solana with curated snippets and guides. Experienced devs find organized code, no Discord mess.
            </p>
          </div>
          <div>
            <div className="bg-[#E5FF4A]/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <span className="text-xl md:text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Document & Share</h3>
            <p className="text-muted-foreground">
              Use the snip editor to save your code snippets and the snap editor to create visual explainers, then share for community feedback.
            </p>
          </div>
          <div>
            <div className="bg-[#E5FF4A]/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <span className="text-xl md:text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Earn & Shine</h3>
            <p className="text-muted-foreground">
              Win SOL in sponsored challenges, climb the leaderboard, get tipped, and get featured as a top Solana dev.
            </p>
          </div>
        </div>
      </section>























{/* Snaps Marquee Section */}
{snippets.length > 0 && 
  <section className="relative overflow-hidden py-12 bg-background">
    <div className="max-w-3xl mx-auto text-center my-7 mb-9">
      <h2 className="text-3xl md:text-4xl font-bold">Snips (Snippets)</h2>
    </div>
    <div className="relative w-full">
      <div className="flex w-[200%] animate-[scroll_70s_linear_infinite] space-x-6 px-6">
        {[...snippets, ...snippets].map((snip, i) => (
          <SnipCard snippet={snip} fix={true} key={i}/>
        ))}
      </div>
    </div>
  </section>
}









{/* Snaps Marquee Section */}
<section className="relative overflow-hidden py-12 bg-background">
  <div className="max-w-3xl mx-auto text-center mb-7">
    <h2 className="text-3xl md:text-4xl font-bold">Snaps (Visual Explainers)</h2>
  </div>
  <div className="flex w-full">
      <Marquee speed={100} pauseOnHover={true}>
        {[...snaps, ...snaps].map((snap, i) => (
          <Card key={i}  className="mx-3 w-[380px] sm:w-[500px] flex-shrink-0  border border-border bg-muted/10">
            <CardContent className="p-4 flex flex-col h-full">
              <Image
                src={snap.image}
                alt={snap.title}
                width={500}
                height={180}
                className="rounded-md mb-3 object-cover"
              />
              <h3 className="text-base font-semibold mb-1">{snap.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {snap.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </Marquee>
        {/* <motion.div className="flex w-[200%] space-x-6 px-6 " 
      initial={{ x: 0, opacity: 0 }} 
      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} 
      animate={{ x: "-100%", opacity: 1, }} 
    >
      {[...snaps, ...snaps].map((snap, i) => (
          <Card key={i}  className="w-[500px]  flex-shrink-0  border border-border bg-muted/10">
            <CardContent className="p-4 flex flex-col h-full">
              <Image
                src={snap.image}
                alt={snap.title}
                width={500}
                height={180}
                className="rounded-md mb-3 object-cover"
              />
              <h3 className="text-base font-semibold mb-1">{snap.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {snap.description}
              </p>
            </CardContent>
          </Card>
      ))}
    </motion.div> */}

  </div>
</section>









      {/* Testimonials */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What the Community Says</h2>
          <p className="text-lg text-muted-foreground">
            Hear from developers already using Snipost
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={`testimonial-${index}`} className="bg-background/50">
              <CardContent className="pt-6">
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="inline-block w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="mb-6 italic text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="rounded-full overflow-hidden mr-4">
                    <Image 
                      src={testimonial.image} 
                      width={32} 
                      height={32} 
                      alt={testimonial.author} 
                      className="bg-muted rounded-full min-h-[25px] aspect-square object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>








      {/* Pricing Section */}
      {/* <section className="bg-muted/20 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Choose Your Path</h2>
            <p className="text-lg text-muted-foreground">
              Flexible options for developers at every stage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={`tier-${index}`} 
                className={`flex flex-col ${tier.highlight ? 'border-2 border-primary shadow-lg relative' : ''}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="flex items-end mt-2">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground ml-1">{tier.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={`feat-${index}-${i}`} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    className="w-full" 
                    variant={tier.highlight ? "default" : "outline"}
                    size="lg"
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="container m-auto px-6 py-18 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about SnipPost
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={`faq-${index}`} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-lg py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-1 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t border-border bg-muted/10 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-medium text-muted-foreground">Trusted by Solana developers worldwide</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-muted-foreground" />
              <span className="text-muted-foreground">SOL Security Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6 text-muted-foreground" />
              <span className="text-muted-foreground">Solana Foundation</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-muted-foreground" />
              <span className="text-muted-foreground">5K+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
              <span className="text-muted-foreground">Web3 Summit Winner</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary/10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Web3 Journey?</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Join thousands of Solana developers already building their reputation and earning rewards.
            </p>
            <Button size="lg" className="text-sm md:text-base sm:h-11" asChild>
              <Link href="/feed/snippets">
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4">SNIPOST</h3>
              <p className="text-muted-foreground max-w-xs">
                 Snipost combines a snippet-sharing hub with gamified rewards. Developers create/public/private code snippets and visual explainers, while earning SOL through tips, battles, and reputation-building. Web3 companies leverage the platform to sponsor challenges, discover talent, and promote tools.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Code Battles</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Enterprise</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Tutorials</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Support</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} Snipost. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Discord</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}