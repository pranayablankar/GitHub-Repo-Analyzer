"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Github, LineChart, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LandingPage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrl) return

    // Extract owner and repo from URL
    const urlPattern = /github\.com\/([^/]+)\/([^/]+)/
    const match = repoUrl.match(urlPattern)

    if (match) {
      const [, owner, repo] = match
      setIsLoading(true)
      window.location.href = `/dashboard/${owner}/${repo}`
    } else {
      alert("Please enter a valid GitHub repository URL")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Github className="h-8 w-8 text-emerald-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            GitVerse
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-950">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </motion.div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              GitHub Repository Analysis
            </h1>

            <p className="text-xl text-gray-400">
              Get instant insights into any GitHub repository with our AI-powered analytics. Understand contributor
              activity, issue resolution efficiency, and project health at a glance.
            </p>

            <form onSubmit={handleAnalyze} className="space-y-4 pt-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter GitHub repository URL (e.g., https://github.com/owner/repo)"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="bg-gray-900 border-gray-800 pl-10 pr-4 py-6 rounded-lg w-full text-gray-100"
                />
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 rounded-lg font-medium"
              >
                {isLoading ? (
                  "Analyzing Repository..."
                ) : (
                  <>
                    Analyze Repository <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-emerald-500" />
                  <span className="font-semibold">Repository Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                    Health Score: 87
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center">
                  <LineChart className="h-20 w-20 text-emerald-500 opacity-50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Stars</div>
                    <div className="text-2xl font-bold">12.4k</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Forks</div>
                    <div className="text-2xl font-bold">3.2k</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Issues</div>
                    <div className="text-2xl font-bold">245</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">PRs</div>
                    <div className="text-2xl font-bold">128</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-teal-500/20 rounded-full blur-2xl"></div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 space-y-12"
        >
          <h2 className="text-3xl font-bold text-center">Powerful Features for Repository Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Github className="h-10 w-10 text-emerald-500" />}
              title="GitHub Data Fetching"
              description="Fetch comprehensive repository data including stars, forks, issues, and contributor metrics."
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-emerald-500" />}
              title="AI-Powered Insights"
              description="Generate intelligent summaries and recommendations using Gemini API."
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-emerald-500" />}
              title="Interactive Visualizations"
              description="View repository metrics through beautiful, interactive charts and graphs."
            />
            <FeatureCard
              icon={<Download className="h-10 w-10 text-emerald-500" />}
              title="Exportable Reports"
              description="Download comprehensive PDF and CSV reports with all repository insights."
            />
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} GitVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

