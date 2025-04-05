import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const owner = searchParams.get("owner")
  const repo = searchParams.get("repo")

  if (!owner || !repo) {
    return NextResponse.json({ error: "Owner and repo parameters are required" }, { status: 400 })
  }

  try {
    // GitHub API request
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          error: `GitHub API error: ${response.status}`,
          message: errorData.message || "Unknown error",
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching contributors data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch contributors data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

