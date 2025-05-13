"use client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Code2, PenTool, Trophy, Zap, Users, BarChart2, Gift } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  const developerSolutions = [
    {
      icon: <Code2 className="w-6 h-6 text-primary" />,
      title: "Create & Share",
      description: "Built-in code editor and snap editors for public/private snippets and visual explainers"
    },
    {
      icon: <PenTool className="w-6 h-6 text-primary" />,
      title: "Discover & Learn",
      description: "Find relevant code snippets and visual explainers from top Solana developers"
    },
    {
      icon: <Trophy className="w-6 h-6 text-primary" />,
      title: "Compete & Earn",
      description: "Join sponsored code battles to win SOL while improving your skills"
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Get Rewarded",
      description: "Earn SOL tips for sharing valuable content and building your reputation"
    }
  ]

  const companySolutions = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Talent Discovery",
      description: "Host code battles to identify top Solana developers"
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-primary" />,
      title: "Developer Marketing",
      description: "Promote tools and challenges through our social ecosystem"
    },
    {
      icon: <Gift className="w-6 h-6 text-primary" />,
      title: "Sponsorship Visibility",
      description: "Launch sponsored challenges and feature code content"
    }
  ]

  const pricingTiers = [
    {
      name: "Free Tier",
      price: "$0",
      features: [
        "3 snippets/post",
        "3 folders | 1 artboard/snap",
        "720p PNG exports",
        "20 shapes/design",
        "Limited templates"
      ]
    },
    {
      name: "Pro Tier",
      price: "$12.99/month",
      features: [
        "7 snippets/post",
        "20 folders | 5 artboards/snap",
        "4K/PDF exports",
        "Premium templates",
        "Unlimited shapes/design",
        "Custom branding"
      ]
    },
    {
      name: "Enterprise",
      price: "$70+/month",
      features: [
        "Unlimited everything",
        "Sponsored battles/ads",
        "Priority support",
        "Advanced analytics"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-primary">SNIPOST</span>
          </h1>
          <p className="text-2xl md:text-3xl font-medium mb-6">
            The first SocialFi ecosystem built exclusively for Solana developers
          </p>
          <p className="text-xl text-muted-foreground mb-8">
            Learn. Share. Engage. Earn.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/feed/snippets">
                <Zap className="w-4 h-4" />
                Start Earning SOL
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/feed/snippets">
                <Code2 className="w-4 h-4" />
                Explore Snippets
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Problems Facing Solana Developers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <Card className="p-4">
                <CardDescription>Hard to learn Web3 Development (lack of materials, visual explainers)</CardDescription>
              </Card>
              <Card className="p-4">
                <CardDescription>No centralized learning hub for Solana-specific content</CardDescription>
              </Card>
              <Card className="p-4">
                <CardDescription>Struggle to share technical content effectively</CardDescription>
              </Card>
              <Card className="p-4">
                <CardDescription>No recognition or rewards for sharing knowledge</CardDescription>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Solutions */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">For Developers</h2>
          <p className="text-lg text-muted-foreground">
            Build your reputation while earning rewards
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {developerSolutions.map((solution, index) => (
            <Card key={`dev-${index}`} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {solution.icon}
                  </div>
                  <CardTitle>{solution.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{solution.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Company Solutions */}
      <section className="bg-muted/20 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">For Web3 Companies</h2>
            <p className="text-lg text-muted-foreground">
              Engage with the Solana developer community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companySolutions.map((solution, index) => (
              <Card key={`comp-${index}`} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {solution.icon}
                    </div>
                    <CardTitle>{solution.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{solution.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Monetization & Pricing</h2>
          <p className="text-lg text-muted-foreground">
            Multiple ways to participate and grow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card key={`tier-${index}`} className={
              tier.name === "Pro Tier" 
                ? "border-2 border-primary shadow-lg" 
                : ""
            }>
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="text-3xl font-bold">{tier.price}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={`feat-${index}-${i}`} className="flex items-start">
                      <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant={
                  tier.name === "Pro Tier" ? "default" : "outline"
                }>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Revenue Streams</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">1. Subscriptions</div>
              <div className="p-3 bg-muted rounded-lg">2. Sponsored Code Battles</div>
              <div className="p-3 bg-muted rounded-lg">3. Ads</div>
              <div className="p-3 bg-muted rounded-lg">4. Tipping</div>
            </div>
          </Card>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Solana Developer Ecosystem?</h2>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/feed/snippets">
              <Zap className="w-5 h-5" />
              Start Building Your Reputation Today
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}