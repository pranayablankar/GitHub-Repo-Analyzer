import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { repoData } = body

    // In a real implementation, this would call the Gemini API
    // using the API key: AIzaSyCAac-RIdALUZmXIwu-LDi3-S4rGMboJqw

    // For demo purposes, we'll return a mock summary
    const repoName = repoData.name
    const stars = repoData.stargazers_count
    const forks = repoData.forks_count
    const issues = repoData.open_issues_count

    const summary = `${repoName} is an active repository with ${stars.toLocaleString()} stars and ${forks.toLocaleString()} forks. It has ${issues} open issues. Based on the analysis, this repository appears to be well-maintained with an active community. The code quality seems good, with a healthy ratio of merged pull requests to open issues. The project would benefit from additional documentation and addressing the backlog of open issues to improve overall health.`

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error generating AI summary:", error)
    return NextResponse.json({ error: "Failed to generate AI summary" }, { status: 500 })
  }
}

