"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Book, Plug, FileText, Shield, GraduationCap, ClipboardList } from "lucide-react"
import DocsEditor from "@/components/appComponents/DocsEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/utils/axiosConfig"
import { useAppSelector } from "@/lib/redux/hooks"
import { toast } from "sonner"

const templates = [
  {
    id: "readme",
    title: "README",
    description: "Project overview and getting started",
    icon: Book,
    content: `
      <h1>Project Name</h1>
      <p>A brief description of your project and what it does.</p>

      <h2>Features</h2>
      <ul>
        <li>Feature 1: Description</li>
        <li>Feature 2: Description</li>
        <li>Feature 3: Description</li>
      </ul>

      <h2>Installation</h2>
      <pre><code class="language-bash">npm install your-package</code></pre>

      <h2>Quick Start</h2>
      <pre><code class="language-javascript">import { YourLibrary } from 'your-package'

      const instance = new YourLibrary()
      instance.doSomething()</code></pre>

      <h2>Contributing</h2>
      <p>We welcome contributions! Please read our contributing guidelines.</p>
    `
  },
  {
    id: "api-docs",
    title: "API Docs",
    description: "REST, GraphQL, or gRPC documentation",
    icon: Plug,
    content: `
      <h1>API Documentation</h1>
      <p>Complete API reference for developers.</p>

      <h2>Authentication</h2>
      <p>Include your API key in the request header:</p>
      <pre><code class="language-bash">Authorization: Bearer YOUR_API_KEY</code></pre>

      <h2>Endpoints</h2>

      <h3>GET /users</h3>
      <p>Retrieve a list of users.</p>
      <pre><code class="language-javascript">fetch('/api/users')
        .then(response => response.json())
        .then(users => console.log(users))</code></pre>

      <h3>POST /users</h3>
      <p>Create a new user.</p>
      <pre><code class="language-javascript">fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com'
        })
      })</code></pre>

      <h2>Error Codes</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>400</td>
            <td>Bad Request</td>
          </tr>
          <tr>
            <td>401</td>
            <td>Unauthorized</td>
          </tr>
          <tr>
            <td>404</td>
            <td>Not Found</td>
          </tr>
        </tbody>
      </table>
    `
  },
  {
    id: "user-guide",
    title: "User Guide",
    description: "Step-by-step instructions for users",
    icon: FileText,
    content: `
      <h1>User Guide</h1>
      <p>Step-by-step instructions to help users get the most out of your product.</p>

      <h2>Getting Started</h2>
      <ol>
        <li>Create an account</li>
        <li>Verify your email</li>
        <li>Set up your profile</li>
        <li>Connect your first integration</li>
      </ol>

      <h2>Basic Usage</h2>
      <h3>Creating Your First Project</h3>
      <p>Navigate to the projects page and click "New Project". Fill in the required information and click "Create".</p>

      <h3>Managing Settings</h3>
      <p>Access settings from the user menu in the top-right corner. Here you can configure preferences, notifications, and account details.</p>

      <h2>Troubleshooting</h2>
      <h3>Common Issues</h3>
      <ul>
        <li><strong>Login problems:</strong> Reset your password or check your email verification</li>
        <li><strong>Upload failures:</strong> Check file size limits and supported formats</li>
        <li><strong>Performance issues:</strong> Clear your browser cache</li>
      </ul>
    `
  },
  {
    id: "tutorial",
    title: "Tutorial",
    description: "Educational content and examples",
    icon: GraduationCap,
    content: `
      <h1>Interactive Tutorial</h1>
      <p>Learn by doing with this hands-on tutorial.</p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Basic programming knowledge</li>
        <li>Node.js installed</li>
        <li>Text editor of your choice</li>
      </ul>

      <h2>Step 1: Setup</h2>
      <pre><code class="language-bash">git clone https://github.com/your-repo/tutorial.git
      cd tutorial
      npm install</code></pre>

      <h2>Step 2: Basic Configuration</h2>
      <p>Create a configuration file:</p>
      <pre><code class="language-javascript">// config.js
      export default {
        apiKey: process.env.API_KEY,
        environment: 'development'
      }</code></pre>

      <h2>Step 3: Build Your First Feature</h2>
      <pre><code class="language-javascript">// main.js
      import config from './config.js'

      async function fetchData() {
        const response = await fetch('/api/data', {
          headers: {
            'Authorization': \`Bearer \${config.apiKey}\`
          }
        })
        return response.json()
      }</code></pre>

      <h2>Next Steps</h2>
      <p>Now that you've built the basics, explore advanced features like caching, error handling, and performance optimization.</p>
    `
  },
  {
    id: "specification",
    title: "Specification",
    description: "Technical specifications and architecture",
    icon: ClipboardList,
    content: `
      <h1>Technical Specification</h1>
      <p>Detailed technical documentation for developers and architects.</p>

      <h2>Architecture Overview</h2>
      <p>The system follows a microservices architecture with the following components:</p>
      <ul>
        <li><strong>API Gateway:</strong> Routes requests to appropriate services</li>
        <li><strong>User Service:</strong> Handles authentication and user management</li>
        <li><strong>Data Service:</strong> Manages core business logic</li>
        <li><strong>Storage Service:</strong> Handles file uploads and storage</li>
      </ul>

      <h2>Data Models</h2>
      <h3>User Model</h3>
      <pre><code class="language-javascript">{
        id: "uuid",
        email: "string",
        name: "string",
        createdAt: "timestamp",
        updatedAt: "timestamp"
      }</code></pre>

      <h2>API Specifications</h2>
      <h3>Request/Response Format</h3>
      <p>All API responses follow this format:</p>
      <pre><code class="language-javascript">{
        success: true,
        data: { /* response data */ },
        message: "Optional message"
      }</code></pre>

      <h2>Performance Requirements</h2>
      <ul>
        <li>API response time: &lt; 200ms</li>
        <li>Uptime: 99.9%</li>
        <li>Concurrent users: 10,000+</li>
      </ul>
    `
  },
  {
    id: "security",
    title: "Security",
    description: "Security policies and best practices",
    icon: Shield,
    content: `
      <h1>Security Documentation</h1>
      <p>Security policies, procedures, and best practices.</p>

      <h2>Authentication & Authorization</h2>
      <h3>JWT Tokens</h3>
      <p>We use JSON Web Tokens for authentication. Tokens expire after 24 hours and include:</p>
      <ul>
        <li>User ID</li>
        <li>Roles and permissions</li>
        <li>Issued and expiration timestamps</li>
      </ul>

      <h2>Data Protection</h2>
      <h3>Encryption</h3>
      <ul>
        <li>Data at rest: AES-256 encryption</li>
        <li>Data in transit: TLS 1.3</li>
        <li>Passwords: bcrypt hashing</li>
      </ul>

      <h2>Security Best Practices</h2>
      <h3>For Developers</h3>
      <ul>
        <li>Never commit secrets to version control</li>
        <li>Use parameterized queries to prevent SQL injection</li>
        <li>Validate all user input</li>
        <li>Implement rate limiting</li>
      </ul>

      <h3>For Users</h3>
      <ul>
        <li>Use strong, unique passwords</li>
        <li>Enable two-factor authentication</li>
        <li>Regularly review account activity</li>
        <li>Report suspicious activity immediately</li>
      </ul>

      <h2>Compliance</h2>
      <p>Our security practices comply with:</p>
      <ul>
        <li>GDPR</li>
        <li>SOC 2</li>
        <li>ISO 27001</li>
      </ul>
    `
  },
]

const CreateDocumentation = () => {
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [editorContent, setEditorContent] = useState(null)
  const [currentTemplateContent, setCurrentTemplateContent] = useState("");
  const { jwtToken } = useAppSelector((state) => state.auth);

  // Handle editor content changes
  const handleEditorChange = (content) => {
    setEditorContent(content)
    console.log('Current editor content:', content)
  }

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id)
    setCurrentTemplateContent(template.content)
    // Reset editor content when switching templates
    setEditorContent(null)
  }

  // Get the selected template data
  const getSelectedTemplate = () => {
    return templates.find(t => t.id === selectedTemplate)
  }

  // Submit the final documentation
  const handleSubmitDocumentation = async () => {
    const template = getSelectedTemplate()
    if (!selectedTemplate || !editorContent) {
      alert('Please select a template and add content')
      return
    }

    const documentationData = {
      templateId: template.id,
      title: title,
      content: editorContent?.html,
      wordCount: editorContent?.wordCount,
    }

    console.log('Submitting documentation:', documentationData)
    
    // Your API call here
    try {
      const {data} = await api.post('/create-documentation', documentationData,{
        headers:{
          Authorization: `Bearer ${jwtToken}`
        }
      });
      setTitle("");
      setSelectedTemplate(null);
      setEditorContent(null);
      setCurrentTemplateContent("");
      toast.success(data?.message||'Documentation created successfully');
    } catch (error) {
      console.error('Error submitting documentation:', error)
      toast.error('Error creating documentation')
    }
  }

  const selectedTemplateData = getSelectedTemplate()

  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      <div className="bg-muted/10 rounded-2xl p-6 md:p-10 border border-zinc-800 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white">
          Choose a Template
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const Icon = template.icon
            const active = selectedTemplate === template.id

            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`text-left rounded-xl border transition-all duration-200 cursor-pointer
                  ${
                    active
                      ? "border-primary bg-zinc-800/50"
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

      {/* Documentation Editor */}
      {selectedTemplate && (
        <div className="w-full">
          <Card className="bg-transparent w-full border-zinc-800">
            <CardContent className="p-6">
              <div className="mb-6">
                <Label>Title</Label>
                <Input
                  placeholder="Title e.g, Installation" 
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg mt-4"
                />
              </div>

              {/* Pass template content and callback to editor */}
              <DocsEditor 
                key={selectedTemplate} // This forces re-render when template changes
                onContentChange={handleEditorChange}
                initialContent={currentTemplateContent}
                templateName={selectedTemplateData?.title}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submit Section */}
      {selectedTemplate && (
        <div className="mt-6 p-6 bg-muted/10 rounded-lg border border-zinc-800">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-white">Ready to publish documentation?</h3>
              <p className="text-sm text-zinc-400">
                {editorContent ? `${editorContent.wordCount || 0} words written` : 'Start writing your documentation...'}
                {selectedTemplate && ` | Template: "${selectedTemplateData?.title}"`}
              </p>
            </div>
            <Button
              onClick={handleSubmitDocumentation}
              disabled={!selectedTemplate || !editorContent}
              className="bg-primary hover:bg-primary/90"
            >
              Publish Documentation
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateDocumentation