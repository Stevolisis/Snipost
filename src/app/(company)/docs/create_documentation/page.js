"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Book, Plug, FileText, Shield, GraduationCap, ClipboardList } from "lucide-react"
import DocsEditor from "@/components/appComponents/DocsEditor"

const templates = [
  {
    id: "readme",
    title: "README",
    description: "Project overview and getting started",
    icon: Book,
  },
  {
    id: "api-docs",
    title: "API Docs",
    description: "REST, GraphQL, or gRPC documentation",
    icon: Plug,
  },
  {
    id: "user-guide",
    title: "User Guide",
    description: "Step-by-step instructions for users",
    icon: FileText,
  },
  {
    id: "tutorial",
    title: "Tutorial",
    description: "Educational content and examples",
    icon: GraduationCap,
  },
  {
    id: "specification",
    title: "Specification",
    description: "Technical specifications and architecture",
    icon: ClipboardList,
  },
  {
    id: "security",
    title: "Security",
    description: "Security policies and best practices",
    icon: Shield,
  },
]

const CreateDocumentation = () => {
  const [selected, setSelected] = useState(null)

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-muted/10 rounded-2xl p-6 md:p-10 border border-zinc-800 mb-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white">
          Choose a Template
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const Icon = template.icon
            const active = selected === template.id

            return (
              <button
                key={template.id}
                onClick={() => setSelected(template.id)}
                className={`text-left rounded-xl border transition-all duration-200
                  ${
                    active
                      ? "border-yellow-400 bg-zinc-800/50"
                      : "border-zinc-800 hover:border-primary hover:bg-zinc-800/30"
                  }`}
              >
                <Card className="bg-transparent border-0 h-[120px] flex items-center">
                  <CardContent className="flex items-start space-x-3 p-4">
                    <div className="p-2 rounded-md bg-zinc-800">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-white">
                        {template.title}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {template.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>
      </div>

      <DocsEditor />
    </div>
  )
}

export default CreateDocumentation
