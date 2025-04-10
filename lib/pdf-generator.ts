import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export async function generatePDF(data: any) {
  try {
    const { repoData, contributors, issues, pullRequests, aiSummary, healthScore } = data

    // Create a new PDF document
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(20)
    doc.text("GitVerse Repository Analysis", 105, 15, { align: "center" })

    // Add repository info
    doc.setFontSize(14)
    doc.text(`Repository: ${repoData.full_name}`, 14, 30)
    doc.setFontSize(12)
    doc.text(`Health Score: ${healthScore}/100`, 14, 40)

    // Add repository stats
    doc.setFontSize(14)
    doc.text("Repository Statistics", 14, 55)

    autoTable(doc, {
      startY: 60,
      head: [["Metric", "Value"]],
      body: [
        ["Stars", repoData.stargazers_count.toLocaleString()],
        ["Forks", repoData.forks_count.toLocaleString()],
        ["Watchers", repoData.subscribers_count.toLocaleString()],
        ["Open Issues", repoData.open_issues_count.toLocaleString()],
        ["Created", new Date(repoData.created_at).toLocaleDateString()],
        ["Last Updated", new Date(repoData.updated_at).toLocaleDateString()],
      ],
    })

    // Add AI summary
    doc.setFontSize(14)
    doc.text("AI-Generated Summary", 14, doc.lastAutoTable.finalY + 15)

    doc.setFontSize(10)
    const summaryLines = doc.splitTextToSize(aiSummary || "No summary available.", 180)
    doc.text(summaryLines, 14, doc.lastAutoTable.finalY + 25)

    // Add top contributors
    doc.setFontSize(14)
    doc.text("Top Contributors", 14, doc.lastAutoTable.finalY + 50)

    const contributorsData = contributors
      .slice(0, 10)
      .map((c: any, index: number) => [index + 1, c.login, c.contributions])

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 55,
      head: [["Rank", "Username", "Commits"]],
      body: contributorsData,
    })

    // Add issue statistics
    const openIssues = issues.filter((i: any) => i.state === "open").length
    const closedIssues = issues.filter((i: any) => i.state === "closed").length

    doc.setFontSize(14)
    doc.text("Issue Statistics", 14, doc.lastAutoTable.finalY + 15)

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Metric", "Value"]],
      body: [
        ["Open Issues", openIssues],
        ["Closed Issues", closedIssues],
        ["Total Issues", issues.length],
        ["Issue Resolution Rate", `${Math.round((closedIssues / issues.length) * 100)}%`],
      ],
    })

    // Add footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(
        `Generated by GitVerse on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" },
      )
    }

    // Save the PDF
    doc.save(`${repoData.name}-analysis.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Error generating PDF. Please try again.")
  }
}

