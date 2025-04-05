"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ArrowLeft, Github, Star, GitFork, Eye, FileText, Users, AlertCircle, Download, Activity } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ContributorsChart,
  IssuesChart,
  PullRequestsChart,
  ActivityHeatmap,
  HealthScoreChart,
} from "@/components/charts"
import { generateAISummary } from "@/lib/gemini-api"
import { generatePDF } from "@/lib/pdf-generator"

export default function DashboardPage({ params }: { params: { owner: string; repo: string } }) {
    const { owner, repo } = params
  const [repoData, setRepoData] = useState<any>(null)
  const [contributors, setContributors] = useState<any[]>([])
  const [issues, setIssues] = useState<any[]>([])
  const [pullRequests, setPullRequests] = useState<any[]>([])
  const [aiSummary, setAiSummary] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [healthScore, setHealthScore] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        // Fetch repository data
        const repoResponse = await fetch(`/api/github/repo?owner=${owner}&repo=${repo}`)
        if (!repoResponse.ok) {
          throw new Error(`Failed to fetch repository data: ${repoResponse.status}`)
        }
        const repoData = await repoResponse.json()
        setRepoData(repoData)

        // Fetch contributors
        const contributorsResponse = await fetch(`/api/github/contributors?owner=${owner}&repo=${repo}`)
        if (!contributorsResponse.ok) {
          console.warn(`Failed to fetch contributors: ${contributorsResponse.status}`)
          setContributors([])
        } else {
          const contributorsData = await contributorsResponse.json()
          setContributors(contributorsData.slice(0, 10)) // Top 10 contributors
        }

        // Fetch issues
        const issuesResponse = await fetch(`/api/github/issues?owner=${owner}&repo=${repo}`)
        if (!issuesResponse.ok) {
          console.warn(`Failed to fetch issues: ${issuesResponse.status}`)
          setIssues([])
        } else {
          const issuesData = await issuesResponse.json()
          setIssues(issuesData)
        }

        // Fetch pull requests
        const prsResponse = await fetch(`/api/github/pull-requests?owner=${owner}&repo=${repo}`)
        if (!prsResponse.ok) {
          console.warn(`Failed to fetch pull requests: ${prsResponse.status}`)
          setPullRequests([])
        } else {
          const prsData = await prsResponse.json()
          setPullRequests(prsData)
        }

        // Calculate health score
        const score = calculateHealthScore(
          repoData,
          contributorsResponse.ok ? contributors : [],
          issuesResponse.ok ? issues : [],
          prsResponse.ok ? pullRequests : [],
        )
        setHealthScore(score)

        setLoading(false)

        // Generate AI summary
        const summaryData = {
          repoInfo: repoData,
          contributors: contributorsResponse.ok ? contributors.slice(0, 5) : [],
          issues: issuesResponse.ok ? issues.slice(0, 20) : [],
          pullRequests: prsResponse.ok ? pullRequests.slice(0, 20) : [],
        }

        try {
          const summary = await generateAISummary(summaryData)
          setAiSummary(summary)
        } catch (summaryError) {
          console.error("Error generating summary:", summaryError)
          setAiSummary("Unable to generate AI summary at this time. Please try again later.")
        } finally {
          setSummaryLoading(false)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
        setSummaryLoading(false)
        // Show error state
        alert(`Error: ${error instanceof Error ? error.message : "Failed to fetch repository data"}`)
      }
    }

    fetchRepoData()
  }, [owner, repo])

  const calculateHealthScore = (repo: any, contributors: any[], issues: any[], prs: any[]) => {
    // This is a simplified version of the health score calculation
    // In a real app, this would be more sophisticated

    // Star growth rate (max 25 points)
    const starScore = Math.min(repo.stargazers_count / 1000, 1) * 25

    // Contributor activity (max 25 points)
    const contributorScore = Math.min(contributors.length / 20, 1) * 25

    // Issue resolution (max 25 points)
    const closedIssues = issues.filter((issue: any) => issue.state === "closed").length
    const issueScore = closedIssues > 0 ? Math.min(closedIssues / issues.length, 1) * 25 : 0

    // PR activity (max 25 points)
    const mergedPRs = prs.filter((pr: any) => pr.merged_at).length
    const prScore = mergedPRs > 0 ? Math.min(mergedPRs / prs.length, 1) * 25 : 0

    return Math.round(starScore + contributorScore + issueScore + prScore)
  }

  const handleDownloadReport = () => {
    generatePDF({
      repoData,
      contributors,
      issues,
      pullRequests,
      aiSummary,
      healthScore,
    })
  }

  if (loading) {
    return <LoadingState owner={owner} repo={repo} />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-emerald-500" />
              <span className="font-semibold text-lg">
                {owner}/{repo}
              </span>
              <Badge variant="outline" className="ml-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Health Score: {healthScore}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2  text-black">
            <Button variant="outline" size="sm" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4  text-black" />
              Download Report
            </Button>
            <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer">
              <Button size="sm">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
            <TabsTrigger value="issues">Issues & PRs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Star className="h-5 w-5 text-yellow-500" />}
                title="Stars"
                value={repoData.stargazers_count.toLocaleString()}
                description="Total stargazers"
              />
              <StatCard
                icon={<GitFork className="h-5 w-5 text-blue-500" />}
                title="Forks"
                value={repoData.forks_count.toLocaleString()}
                description="Total forks"
              />
              <StatCard
                icon={<Eye className="h-5 w-5 text-purple-500" />}
                title="Watchers"
                value={repoData.subscribers_count.toLocaleString()}
                description="Repository watchers"
              />
              <StatCard
                icon={<AlertCircle className="h-5 w-5 text-red-500" />}
                title="Open Issues"
                value={repoData.open_issues_count.toLocaleString()}
                description="Active issues"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Repository Health</CardTitle>
                  <CardDescription>Overall health assessment based on activity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <HealthScoreChart score={healthScore} />
                    <div className="mt-6 w-full space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Star Growth</span>
                          <span className="text-sm text-emerald-500">Good</span>
                        </div>
                        <Progress value={75} className="h-2 bg-gray-800" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 ">
                          <span className="text-sm ">Contributor Activity</span>
                          <span className="text-sm text-emerald-500">Excellent</span>
                        </div>
                        <Progress value={90} className="h-2 bg-gray-800" indicatorClassName="bg-emerald-500" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Issue Resolution</span>
                          <span className="text-sm text-yellow-500">Average</span>
                        </div>
                        <Progress value={60} className="h-2 bg-gray-800" indicatorClassName="bg-yellow-500" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">PR Activity</span>
                          <span className="text-sm text-emerald-500">Good</span>
                        </div>
                        <Progress value={80} className="h-2 bg-gray-800" indicatorClassName="bg-emerald-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Repository Summary</CardTitle>
                  <CardDescription>AI-generated overview of the repository</CardDescription>
                </CardHeader>
                <CardContent>
                  {summaryLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <Skeleton className="h-4 w-3/4 bg-gray-800" />
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <Skeleton className="h-4 w-5/6 bg-gray-800" />
                    </div>
                  ) : (
                    <div className="text-black-300 space-y-4">
                      <p>{aiSummary || "No summary available."}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black-300">
              <Card>
                <CardHeader>
                  <CardTitle>Top Contributors</CardTitle>
                  <CardDescription>Most active repository contributors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContributorsChart data={contributors} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issue Trends</CardTitle>
                  <CardDescription>Open vs. closed issues over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <IssuesChart data={issues} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contributors" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contributor Activity</CardTitle>
                <CardDescription>Commit distribution among top contributors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ContributorsChart data={contributors} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>Most active contributors by commit count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contributors.map((contributor, index) => (
                    <div key={contributor.id} className="flex items-center gap-4">
                      <div className="font-mono text-gray-500 w-6 text-right">{index + 1}</div>
                      <img
                        src={contributor.avatar_url || "/placeholder.svg"}
                        alt={contributor.login}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{contributor.login}</div>
                        <div className="text-sm text-gray-500">{contributor.contributions} commits</div>
                      </div>
                      <a
                        href={contributor.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-500 hover:underline"
                      >
                        View Profile
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-8 text-white"> {/* Added text-black class here */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Issue Trends</CardTitle>
        <CardDescription>Open vs. closed issues over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 text-white ">
          <IssuesChart data={issues} />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Pull Request Activity</CardTitle>
        <CardDescription>PR merge frequency and time-to-merge</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 text-white">
          <PullRequestsChart data={pullRequests} />
        </div>
      </CardContent>
    </Card>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Recent Issues</CardTitle>
      <CardDescription>Latest open and closed issues</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {issues.slice(0, 5).map((issue) => (
          <div key={issue.id} className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg">
            <div
              className={`mt-1 h-4 w-4 rounded-full ${issue.state === "open" ? "bg-red-500" : "bg-emerald-500"}`}
            ></div>
            <div className="flex-1">
              <div className="font-medium">{issue.title}</div>
              <div className="text-sm text-gray-500 mt-1">
                #{issue.number} opened by {issue.user.login} •
                {new Date(issue.created_at).toLocaleDateString()}
              </div>
            </div>
            <Badge variant={issue.state === "open" ? "destructive" : "default"}>{issue.state}</Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</TabsContent>

          <TabsContent value="activity" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Activity Heatmap</CardTitle>
                <CardDescription>Commit activity over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ActivityHeatmap />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Star Growth</CardTitle>
                  <CardDescription>Star acquisition over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {/* Placeholder for star growth chart */}
                    <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
                      <Star className="h-16 w-16 text-yellow-500 opacity-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Predicted Activity</CardTitle>
                  <CardDescription>Forecasted repository activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {/* Placeholder for prediction chart */}
                    <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
                      <Activity className="h-16 w-16 text-emerald-500 opacity-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Repository Analysis</CardTitle>
                <CardDescription>Comprehensive insights powered by Gemini AI</CardDescription>
              </CardHeader>
              <CardContent>
                {summaryLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-5/6 bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-4/5 bg-gray-800" />
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-xl font-semibold text-emerald-400">Repository Overview</h3>
                        <p>{aiSummary || "No summary available."}</p>
                      </section>

                      <Separator />

                      <section>
                        <h3 className="text-xl font-semibold text-emerald-400">Key Contributors</h3>
                        <p>
                          The repository has {contributors.length} active contributors, with the top 5 contributors
                          responsible for approximately{" "}
                          {Math.round(
                            (contributors.slice(0, 5).reduce((acc, curr) => acc + curr.contributions, 0) /
                              contributors.reduce((acc, curr) => acc + curr.contributions, 0)) *
                              100,
                          )}
                          % of all commits.
                        </p>
                        <ul className="mt-2 space-y-1">
                          {contributors.slice(0, 5).map((contributor) => (
                            <li key={contributor.id}>
                              <span className="font-medium">{contributor.login}</span>: {contributor.contributions}{" "}
                              commits
                            </li>
                          ))}
                        </ul>
                      </section>

                      <Separator />

                      <section>
                        <h3 className="text-xl font-semibold text-emerald-400">Health Assessment</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold">{healthScore}/100</span>
                          <Badge
                            className={`${
                              healthScore >= 80
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                                : healthScore >= 60
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                                  : "bg-red-500/20 text-red-400 border-red-500/20"
                            }`}
                          >
                            {healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : "Needs Improvement"}
                          </Badge>
                        </div>
                        <p>
                          This repository shows{" "}
                          {healthScore >= 80
                            ? "excellent health with active development and a strong community."
                            : healthScore >= 60
                              ? "good overall health, though some metrics could be improved."
                              : "some concerning trends that should be addressed to improve repository health."}
                        </p>
                      </section>

                      <Separator />

                      <section>
                        <h3 className="text-xl font-semibold text-emerald-400">Improvement Suggestions</h3>
                        <ul className="mt-2 space-y-2">
                          {healthScore < 90 && (
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>
                                Consider improving documentation to attract more contributors and make onboarding
                                easier.
                              </span>
                            </li>
                          )}
                          {issues.filter((i) => i.state === "open").length > 10 && (
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>
                                Address the backlog of open issues to improve user satisfaction and project stability.
                              </span>
                            </li>
                          )}
                          {contributors.length < 5 && (
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>
                                Broaden the contributor base to ensure project sustainability and diverse perspectives.
                              </span>
                            </li>
                          )}
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span>
                            <span>
                              Implement automated testing to maintain code quality and reduce regression bugs.
                            </span>
                          </li>
                        </ul>
                      </section>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Predicted Growth</CardTitle>
                  <CardDescription>AI-powered forecast of repository metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-400">Predicted Stars (30 days)</div>
                      <div className="text-2xl font-bold text-white">+{Math.round(repoData.stargazers_count * 0.05)}</div>
                      <div className="text-sm text-emerald-500">+5% growth</div>
                    </div>

                    <div className="p-4 bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-400">Predicted PRs (30 days)</div>
                      <div className="text-2xl font-bold  text-white">{Math.round(pullRequests.length * 0.2)}</div>
                      <div className="text-sm text-emerald-500">Based on historical activity</div>
                    </div>

                    <div className="p-4 bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-400">Predicted Issues (30 days)</div>
                      <div className="text-2xl font-bold  text-white">{Math.round(issues.length * 0.15)}</div>
                      <div className="text-sm text-yellow-500">Moderate activity expected</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Repository Recommendations</CardTitle>
                  <CardDescription>AI-generated suggestions for improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-900 rounded-lg flex gap-4  text-white">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center  text-white">
                        <FileText className="h-5 w-5 text-emerald-500  text-white" />
                      </div>
                      <div>
                        <div className="font-medium  text-white">Improve Documentation</div>
                        <div className="text-sm text-gray-400 mt-1  ">
                          Comprehensive documentation helps new contributors and users understand the project better.
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-900 rounded-lg flex gap-4  text-white">
                      <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">Expand Contributor Base</div>
                        <div className="text-sm text-gray-400 mt-1">
                          Encourage more contributors to join the project for diverse perspectives and sustainability.
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-900 rounded-lg flex gap-4  text-white">
                      <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <div className="font-medium">Address Issue Backlog</div>
                        <div className="text-sm text-gray-400 mt-1">
                          Prioritize and resolve open issues to improve user satisfaction and project stability.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function LoadingState({ owner, repo }: { owner: string; repo: string }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-emerald-500" />
              <span className="font-semibold text-lg">
                {owner}/{repo}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <Activity className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Analyzing Repository</h2>
            <p className="text-gray-400">Fetching data and generating insights...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">{icon}</div>
          <div>
            <div className="text-sm text-gray-400">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

