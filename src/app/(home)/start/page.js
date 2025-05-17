"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Code2, PenTool, Trophy, Zap, Users, BarChart2, Gift, ArrowRight, Check, Star, Database, Shield, Sparkles, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      icon: <Code2 className="w-5 h-5 md:w-8 md:h-8 text-primary" />,
      title: "Create & Share",
      description: "Build, edit and share code snippets with built-in syntax highlighting and collaborative tools."
    },
    {
      icon: <PenTool className="w-5 h-5 md:w-8 md:h-8 text-primary" />,
      title: "Visual Learning",
      description: "Create visual explainers with our snap editor to simplify complex Solana concepts."
    },
    {
      icon: <Trophy className="w-5 h-5 md:w-8 md:h-8 text-primary" />,
      title: "Code Battles",
      description: "Join competitive challenges, solve problems, and earn SOL while improving your skills."
    },
    {
      icon: <Zap className="w-5 h-5 md:w-8 md:h-8 text-primary" />,
      title: "SocialFi Rewards",
      description: "Earn SOL through tips, sponsorships, and recognition for your contributions."
    }
  ]

  const testimonials = [
    {
      quote: "Snipost has completely transformed how I share Solana code solutions with the community.",
      author: "Alex Wang",
      role: "Senior Blockchain Developer",
      image: "/user1.png"
    },
    {
      quote: "The visual explainers feature helped me understand complex Solana concepts much faster than text tutorials.",
      author: "Maya Johnson",
      role: "Frontend Developer",
      image: "/user2.jpg"
    },
    {
      quote: "Hosting code battles on Snipost helped us identify top talent for our DeFi project.",
      author: "Jamal Thomas",
      role: "Rust Developer",
      image: "/user3.jpg"
    }
  ]

  const stats = [
    { value: "5,000+", label: "Active Developers" },
    { value: "12,000+", label: "Code Snippets" },
    { value: "500+", label: "SOL Distributed" },
    { value: "95%", label: "Satisfaction Rate" }
  ]

  const faqs = [
    {
      question: "How do I earn SOL on Snipost?",
      answer: "You can earn SOL in multiple ways: receiving tips from the community for helpful snippets, winning sponsored code battles, creating popular visual explainers, and through our reputation-based reward system."
    },
    {
      question: "Is Snipost only for advanced Solana developers?",
      answer: "Not at all! Snipost welcomes developers of all skill levels. Beginners can learn from the community's snippets and visual explainers, while more experienced developers can share knowledge and participate in advanced challenges."
    },
    {
      question: "How do sponsored code battles work?",
      answer: "Companies sponsor challenges with specific requirements. Developers submit solutions, the community and sponsors vote on the best implementations, and winners receive SOL rewards. It's a great way to showcase your skills and earn while learning."
    },
    {
      question: "What makes Snipost different from GitHub gists or other code-sharing platforms?",
      answer: "Snipost is specifically built for Solana developers with integrated visual tools, a social ecosystem with direct SOL rewards, and focused learning resources. Our platform combines code sharing, visual learning, social interaction, and financial incentives in one ecosystem."
    }
  ]

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
              Code. Share. <span className="text-primary">Earn</span>.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              The first social ecosystem where Solana developers can share code, create visual explainers, and earn SOL rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 text-base md:text-lg md:h-13" asChild>
                <Link href="/feed/snippets">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  Start Earning Now
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-base md:text-lg md:h-13" asChild>
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

      {/* Feature Highlights */}
      <section className="container mx-auto px-6 py-24">
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
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Snipost Works</h2>
            <p className="text-lg text-muted-foreground">
              A simple process to start sharing and earning
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-primary/10 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6">
                  <span className="text-xl md:text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Create Content</h3>
                <p className="text-muted-foreground mb-4">
                  Build code snippets or visual explainers using our specialized editors
                </p>
              </div>
              
              <div className="relative">
                <div className="bg-primary/10 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6">
                  <span className="text-xl md:text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Share with Community</h3>
                <p className="text-muted-foreground mb-4">
                  Post your content to the feed where other developers can discover it
                </p>
              </div>
              
              <div>
                <div className="bg-primary/10 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-6">
                  <span className="text-xl md:text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Earn SOL Rewards</h3>
                <p className="text-muted-foreground mb-4">
                  Receive tips, win challenges, and build your reputation while earning
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-24">
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
      <section className="bg-muted/20 py-24">
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
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
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
            <Button size="lg" className="text-base md:text-lg sm:h-13" asChild>
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