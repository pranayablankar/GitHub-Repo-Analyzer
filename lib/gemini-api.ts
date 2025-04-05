import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI("AIzaSyCAac-RIdALUZmXIwu-LDi3-S4rGMboJqw")

export async function generateAISummary(data: any): Promise<string> {
  try {
    // First try to generate a summary using the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Format repository data for the prompt
    const repoInfo = data.repoInfo
    const contributors = data.contributors
    const issues = data.issues
    const pullRequests = data.pullRequests

    // Calculate some metrics
    const openIssues = issues.filter((i: any) => i.state === "open").length
    const closedIssues = issues.filter((i: any) => i.state === "closed").length
    const mergedPRs = pullRequests.filter((pr: any) => pr.merged_at).length
    const openPRs = pullRequests.filter((pr: any) => !pr.merged_at && pr.state === "open").length

    // Create a prompt for Gemini
    const prompt = `
    Analyze this GitHub repository and provide a concise summary (max 250 words):
    
    Repository: ${repoInfo.full_name}
    Description: ${repoInfo.description || "No description provided"}
    
    Key Metrics:
    - Stars: ${repoInfo.stargazers_count}
    - Forks: ${repoInfo.forks_count}
    - Watchers: ${repoInfo.subscribers_count}
    - Open Issues: ${openIssues}
    - Closed Issues: ${closedIssues}
    - Open PRs: ${openPRs}
    - Merged PRs: ${mergedPRs}
    - Top Contributors: ${contributors
      .slice(0, 5)
      .map((c: any) => `${c.login} (${c.contributions} commits)`)
      .join(", ")}
    
    Please include:
    1. A brief overview of what the repository does
    2. Assessment of repository health based on activity metrics
    3. Observations about contributor activity
    4. 2-3 specific suggestions for improvement
    
    Format the response as a single paragraph without bullet points or sections.
    `

    try {
      // Generate the summary with a timeout
      const result = (await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini API request timed out")), 10000)),
      ])) as any

      const response = await result.response
      const text = response.text()

      return text
    } catch (apiError) {
      console.warn("Gemini API error, using fallback summary:", apiError)
      // If API call fails, fall back to generated summary
      return generateFallbackSummary(data)
    }
  } catch (error) {
    console.error("Error generating AI summary:", error)
    return generateFallbackSummary(data)
  }
}

// Generate a fallback summary based on repository data
function generateFallbackSummary(data: any): string {
  try {
    const { repoInfo, contributors, issues, pullRequests } = data

    // Calculate metrics
    const openIssues = issues.filter((i: any) => i.state === "open").length
    const closedIssues = issues.filter((i: any) => i.state === "closed").length
    const issueResolutionRate = issues.length > 0 ? Math.round((closedIssues / issues.length) * 100) : 0

    const mergedPRs = pullRequests.filter((pr: any) => pr.merged_at).length
    const openPRs = pullRequests.filter((pr: any) => !pr.merged_at && pr.state === "open").length
    const prMergeRate = pullRequests.length > 0 ? Math.round((mergedPRs / pullRequests.length) * 100) : 0

    const topContributors = contributors
      .slice(0, 3)
      .map((c) => c.login)
      .join(", ")

    // Determine activity level
    let activityLevel = "low"
    if (pullRequests.length > 20 || issues.length > 50) {
      activityLevel = "high"
    } else if (pullRequests.length > 10 || issues.length > 20) {
      activityLevel = "moderate"
    }

    // Determine health status
    let healthStatus = "needs improvement"
    if (issueResolutionRate > 70 && prMergeRate > 70) {
      healthStatus = "excellent"
    } else if (issueResolutionRate > 50 && prMergeRate > 50) {
      healthStatus = "good"
    }

    // Generate summary
    return `${repoInfo.full_name} is a repository with ${repoInfo.stargazers_count.toLocaleString()} stars and ${repoInfo.forks_count.toLocaleString()} forks. The repository shows ${activityLevel} activity with ${issues.length} total issues (${openIssues} open, ${closedIssues} closed) and ${pullRequests.length} pull requests. Key contributors include ${topContributors}. Based on metrics analysis, this repository appears to be in ${healthStatus} health with an issue resolution rate of ${issueResolutionRate}% and PR merge rate of ${prMergeRate}%. ${repoInfo.description ? `The repository is described as: "${repoInfo.description}"` : ""} Improvement areas could include ${openIssues > 10 ? "addressing the backlog of open issues" : "maintaining the current pace of development"}, ${contributors.length < 5 ? "expanding the contributor base" : "continuing to engage the active community"}, and ensuring documentation remains up-to-date.`
  } catch (error) {
    console.error("Error generating fallback summary:", error)
    return "Unable to generate a summary for this repository at this time. Please try again later."
  }
}

