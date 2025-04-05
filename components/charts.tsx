"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// Health Score Chart
export function HealthScoreChart({ score }: { score: number }) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ]

  const COLORS = ["#10b981", "#1f2937"]

  return (
    <div className="relative h-48 w-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold">{score}</div>
        <div className="text-sm text-gray-400">Health Score</div>
      </div>
    </div>
  )
}

// Contributors Chart
export function ContributorsChart({ data }: { data: any[] }) {
  // Sort contributors by contributions
  const sortedData = [...data]
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 10)
    .map((contributor) => ({
      name: contributor.login,
      value: contributor.contributions,
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
        <XAxis type="number" stroke="#9ca3af" />
        <YAxis dataKey="name" type="category" width={100} stroke="#9ca3af" tick={{ fill: "#d1d5db" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.375rem" }}
          itemStyle={{ color: "#d1d5db" }}
          labelStyle={{ color: "#f9fafb", fontWeight: "bold" }}
        />
        <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Issues Chart
export function IssuesChart({ data }: { data: any[] }) {
  // Group issues by month
  const issuesByMonth: Record<string, { open: number; closed: number }> = {}

  data.forEach((issue) => {
    const date = new Date(issue.created_at)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

    if (!issuesByMonth[monthYear]) {
      issuesByMonth[monthYear] = { open: 0, closed: 0 }
    }

    if (issue.state === "open") {
      issuesByMonth[monthYear].open++
    } else {
      issuesByMonth[monthYear].closed++
    }
  })

  const chartData = Object.entries(issuesByMonth).map(([month, counts]) => ({
    month,
    open: counts.open,
    closed: counts.closed,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="month" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.375rem" }}
          itemStyle={{ color: "#d1d5db" }}
          labelStyle={{ color: "#f9fafb", fontWeight: "bold" }}
        />
        <Legend />
        <Line type="monotone" dataKey="open" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Pull Requests Chart
export function PullRequestsChart({ data }: { data: any[] }) {
  // Group PRs by month
  const prsByMonth: Record<string, { opened: number; merged: number }> = {}

  data.forEach((pr) => {
    const date = new Date(pr.created_at)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

    if (!prsByMonth[monthYear]) {
      prsByMonth[monthYear] = { opened: 0, merged: 0 }
    }

    prsByMonth[monthYear].opened++

    if (pr.merged_at) {
      prsByMonth[monthYear].merged++
    }
  })

  const chartData = Object.entries(prsByMonth).map(([month, counts]) => ({
    month,
    opened: counts.opened,
    merged: counts.merged,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="month" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.375rem" }}
          itemStyle={{ color: "#d1d5db" }}
          labelStyle={{ color: "#f9fafb", fontWeight: "bold" }}
        />
        <Legend />
        <Bar dataKey="opened" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="merged" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Activity Heatmap
export function ActivityHeatmap() {
  // Generate sample data for the heatmap
  const generateHeatmapData = () => {
    const days = 52 * 7 // 52 weeks
    const data = []

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))

      // Random activity level (0-4)
      const value = Math.floor(Math.random() * 5)

      data.push({
        date: date.toISOString().split("T")[0],
        value,
      })
    }

    return data
  }

  const heatmapData = generateHeatmapData()

  // Group data by week
  const weekData = []
  for (let i = 0; i < 52; i++) {
    const week = heatmapData.slice(i * 7, (i + 1) * 7)
    weekData.push(week)
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-1" style={{ minWidth: "1000px" }}>
        {weekData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`h-3 w-3 rounded-sm ${
                  day.value === 0
                    ? "bg-gray-800"
                    : day.value === 1
                      ? "bg-emerald-900"
                      : day.value === 2
                        ? "bg-emerald-700"
                        : day.value === 3
                          ? "bg-emerald-600"
                          : "bg-emerald-500"
                }`}
                title={`${day.date}: ${day.value} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 justify-end">
        <span className="text-xs text-gray-400">Less</span>
        <div className="h-3 w-3 rounded-sm bg-gray-800" />
        <div className="h-3 w-3 rounded-sm bg-emerald-900" />
        <div className="h-3 w-3 rounded-sm bg-emerald-700" />
        <div className="h-3 w-3 rounded-sm bg-emerald-600" />
        <div className="h-3 w-3 rounded-sm bg-emerald-500" />
        <span className="text-xs text-gray-400">More</span>
      </div>
    </div>
  )
}

