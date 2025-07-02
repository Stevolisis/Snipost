"use client"
import React from 'react'
import { ExternalLink, Sparkles, Code2, Zap, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SnapEditorAnnouncement = () => {
    const router = useRouter();

    return (
        <div className="p-3 sm:p-0 my-12 md:my-24">
            <Card className="w-full max-w-2xl mx-auto border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-accent/5">
                <CardHeader className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                    <Code2 className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Snap Editor
                    </CardTitle>
                    <Badge variant="secondary" className="ml-2 gap-1">
                        <Sparkles className="h-3 w-3" />
                        Beta
                    </Badge>
                    </div>
                    
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Experience our powerful new visual explainer creation tool - currently in development as a standalone preview!
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                        <h4 className="font-semibold text-foreground">Independent & Cutting-Edge</h4>
                        <p className="text-sm text-muted-foreground">
                            The Snap Editor runs as its own entity with separate hosting, allowing us to rapidly develop and test new features without affecting the main Snipost platform.
                        </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <Code2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                        <h4 className="font-semibold text-foreground">Enhanced Editing Experience</h4>
                        <p className="text-sm text-muted-foreground">
                            Built with intuitive editing capabilities designed to streamline your content creation workflow.
                        </p>
                        </div>
                    </div>
                    </div>

                    <div className="space-y-3">
                    <div className="bg-accent/20 border border-accent/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-semibold text-foreground">Beta Notice</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                        This is an early preview version. Some features may be incomplete or subject to change as we continue refining the experience. Your feedback helps us make it even better!
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                        <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-foreground">Desktop Recommended</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                        For the best experience, we recommend using a desktop or laptop. Some advanced features may have limitations on mobile devices.
                        </p>
                    </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button asChild className="flex-1 gap-2">
                        <Link href="https://snipost-snap-editor.vercel.app/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Try Snap Editor Beta
                        </Link>
                    </Button>
                    
                    <Button variant="outline" className="flex-1" onClick={()=> router.push("/account/support")}>
                        Share Feedback
                    </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                    Stay tuned for updates as we work toward full integration with Snipost! 🚀
                    </p>
                </CardContent>
                </Card>
        </div>
    )
}

export default SnapEditorAnnouncement