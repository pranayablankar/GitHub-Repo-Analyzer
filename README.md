# GitHub-Repo-Analyzer
gitverse , is a tool that provides smart, real-time insights into any GitHub repository
# 🚀 Dev Insights: GitHub Repo Analyzer

**Dev Insights** is a smart web application that provides real-time visual insights into any public GitHub repository. Built during a hackathon using modern full-stack technologies, it helps developers, open-source contributors, and project managers understand repository health, activity trends, and contribution analytics — all in one place.

---

## 🔍 Features

- ⭐ **Stars, Forks & Watchers Count**
- 🔄 **Pull Request Analytics** (Open & Merged)
- 🏷️ **Issues Overview** (Open & Closed)
- 🔥 **Top Contributors** ranked by commits
- 📊 **PR Frequency** & 📈 **Issue Trends**
- ⏳ **Average Issue Resolution Time**
- 📥 **Downloadable Reports** in PDF / CSV
- 🔐 **User Authentication** & **Private Repo Access** *(Optional)*
- ⚡ **Performance Boost** with Redis / MongoDB Caching

---

## 🧠 AI-Powered Summarization

Using natural language processing, Dev Insights provides a short summary of key repository activity and health based on the fetched GitHub data — perfect for quick decision-making or team reporting.

---

## 💻 Tech Stack

| Tech | Usage |
|------|-------|
| **Next.js** | Full-stack React Framework |
| **Node.js + Express** | Backend APIs & Server |
| **GitHub REST API** | Data Fetching |
| **Chart.js / Recharts** | Dynamic Data Visualization |
| **Redis / MongoDB** | Caching & Temporary Storage |
| **SVR Model (Scikit-learn)** | Repo Health Prediction |
| **Puppeteer / jsPDF** | PDF & CSV Report Generation |

---

## 🧑‍💻 Team Contributions

- 🔹 **Frontend & API Integration** – *Sujal Rajapure* & *Aditya Ingole*
- 🔹 **Data Visualization** – *Pranay Ablankar*
- 🔹 **Repo Health Checker (SVR Model)** – *Sujal Rajapure* & *Pranay Ablankar*
- 🔹 **UI/UX Design & Wireframing** – *Vinay Dharmik* & *Sujal Rajapure*

---

## 📸 Screenshots
demo ->https://githubanalyzer-iota.vercel.app/
![Dashboard](./screenshots/dashboard.png)
![Charts](./screenshots/charts.png)
![PDF Report](./screenshots/pdf-report.png)

---

## 🚀 Run Locally

1. **Clone the repo**
```bash
git clone https://github.com/your-username/GitHub-Repo-Analyzer.git
cd GitHub-Repo-Analyzer
