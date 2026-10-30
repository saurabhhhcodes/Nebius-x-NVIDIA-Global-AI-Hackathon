# 🛡️ OpsCopilot — AI Agent Incident Platform for SRE & DevOps

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NVIDIA Nemotron](https://img.shields.io/badge/Model-NVIDIA%20Nemotron--3%20Ultra-76B900?logo=nvidia)](https://developer.nvidia.com)
[![Nebius Token Factory](https://img.shields.io/badge/AI%20Inference-Nebius%20Token%20Factory-indigo)](https://tokenfactory.nebius.com)
[![Tavily AI Search](https://img.shields.io/badge/Web%20Intelligence-Tavily%20AI%20Search-teal)](https://tavily.com)
[![Live Demo](https://img.shields.io/badge/Demo-opscopilot--sre.netlify.app-00C7B7?logo=netlify)](https://opscopilot-sre.netlify.app)
[![Demo Video](https://img.shields.io/badge/YouTube-Watch%20Demo-red?logo=youtube)](https://youtu.be/uls-A6zojfY)

> **OpsCopilot** is an autonomous AI agent platform designed for DevOps and Site Reliability Engineering (SRE) teams. It consumes raw, noisy server logs or stack traces, conducts multi-hop causal reasoning inspired by the **Hermes Agent orchestration pattern**, pulls real-time CVE and community issue intelligence via **Tavily AI Search**, accurately diagnoses root causes using **NVIDIA Nemotron models** served on **Nebius Token Factory**, validates remediation scripts inside a virtualized sandbox, and broadcasts Slack Block Kit & Microsoft Teams alerts.

- 🌐 **Live Hosted Demo**: [https://opscopilot-sre.netlify.app](https://opscopilot-sre.netlify.app)
- 🎬 **YouTube Walkthrough**: [https://youtu.be/uls-A6zojfY](https://youtu.be/uls-A6zojfY)

---

## 🚀 Key Features

- 🧠 **Hermes Agent Orchestration**: 5-phase reasoning pipeline (*Log Ingestion & Anomaly Extraction* ➔ *Tavily Web Intelligence & CVE Check* ➔ *Infrastructure Metric Correlation* ➔ *Causal Hypothesis Validation* ➔ *Remediation Synthesis & Safety Checks*).
- 🌐 **Tavily Real-Time Web Intelligence**: Real-time cross-referencing against live GitHub issues, official Kubernetes documentation, CVE databases, and vendor advisories (*Qualifies for Hackathon $3,000 "Best Use of Tavily" Prize*).
- ⚡ **NVIDIA Nemotron via Nebius Token Factory**: Fast, highly capable LLM inference on specialized Nemotron models with escalation capabilities (*Nemotron-3 Ultra* and *Nemotron-4 340B Instruct*).
- 🧪 **Isolated Sandbox Execution**: Evaluates AI-generated shell/kubectl scripts safely inside a virtual sandbox with command blocklists and AST safety checks (the backend host never executes AI code directly).
- 📊 **SRE Incident Dashboard**: Live visibility into Mean Time to Resolution (MTTR), active vs. resolved outages, severity distributions, and top affected microservices.
- 🔔 **Multi-Platform Alert Cards**: Instant generation of interactive **Slack Block Kit** and **Microsoft Teams Adaptive Card** webhook payloads with action triggers.
- 🔐 **Enterprise Security & Privacy**: PII and Bearer token auto-redaction, zero frontend API keys, bcrypt password hashing, and token bucket rate limiters.
- 📄 **1-Click Postmortem Generator**: Exports comprehensive, structured postmortem documentation in Markdown and JSON.

---

## 📐 System Architecture

```
                               ┌───────────────────────────────────────────────┐
                               │             OpsCopilot Web Frontend           │
                               │  (React + TypeScript + Tailwind + Lucide UI)  │
                               └──────────────────────┬────────────────────────┘
                                                      │ HTTPS / REST / SSE
                                                      ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       OpsCopilot Express Backend                                       │
│                                                                                                        │
│  ┌───────────────────────┐   ┌────────────────────────┐   ┌────────────────────────────────────────┐   │
│  │   Auth & Rate Limiter │   │   Incident Controller  │   │        Hermes Agent Orchestrator       │   │
│  │    (JWT + Bcrypt)     │   │      (CRUD & Stats)    │   │        (Multi-Hop Reasoning Loop)      │   │
│  └───────────────────────┘   └───────────┬────────────┘   └───────┬────────────────────┬───────────┘   │
│                                          │                        │                    │               │
│                                          ▼                        ▼                    ▼               │
│                               ┌─────────────────────┐   ┌──────────────────┐ ┌───────────────────────┐ │
│                               │  SQLite / DB Engine │   │ tavilyService.js │ │   nebiusService.js    │ │
│                               │ (WAL Mode + Schema) │   │ (Tavily AI API)  │ │(Nebius Token Factory) │ │
│                               └─────────────────────┘   └─────────┬────────┘ └───────────┬───────────┘ │
│                                                                   │                      │             │
│                               ┌─────────────────────┐             │                      │             │
│                               │  sandboxService.js  │◄────────────┴──────────────────────┘             │
│                               │  (Isolated Sandbox) │                                                  │
│                               └─────────────────────┘                                                  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                      │                                    │
                                                      ▼                                    ▼
                                         ┌─────────────────────────┐          ┌──────────────────────────┐
                                         │  Tavily AI Search Engine│          │   Nebius Token Factory   │
                                         │  (Live Web & CVE Search)│          │  (NVIDIA Nemotron Model) │
                                         └─────────────────────────┘          └──────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js (Express), SQLite (`better-sqlite3` with WAL mode) |
| **AI Provider** | **Nebius Token Factory API** (`nvidia/nemotron-3-ultra` & `nvidia/nemotron-4-340b-instruct`) |
| **Search Intelligence** | **Tavily AI Search API** (Live GitHub, K8s Docs, CVEs, Vendor Advisories) |
| **Auth** | JWT (JSON Web Tokens), Bcrypt password hashing, 1-Click Demo SRE login |
| **Security** | Input sanitization, Express Rate Limiter, Sandbox Isolation, CORS protection |                           │  (Isolated Sandbox) │                                                  │
│                               └─────────────────────┘                                                  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │    Nebius Token Factory     │
                                       │   (NVIDIA Nemotron Model)   │
                                       └─────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js (Express), SQLite (`better-sqlite3` with WAL mode) |
| **AI Provider** | **Nebius Token Factory API** (`nvidia/nemotron-3-ultra` & `nvidia/nemotron-4-340b-instruct`) |
| **Auth** | JWT (JSON Web Tokens), Bcrypt password hashing, 1-Click Demo SRE login |
| **Security** | Input sanitization, Express Rate Limiter, Sandbox Isolation, CORS protection |

---

## 📦 Project Structure

```
opscopilot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── IncidentForm.tsx          # 1-Click presets + terminal log submitter
│   │   │   ├── AgentActivityFeed.tsx     # Hermes step-by-step reasoning feed
│   │   │   ├── RootCausePanel.tsx        # Confidence gauge + causal breakdown
│   │   │   ├── FixSuggestionCard.tsx     # Script tabs + sandbox execution runner
│   │   │   ├── AlertMockCard.tsx         # Slack Block Kit & MS Teams cards
│   │   │   └── IncidentHistoryTable.tsx  # Filterable audit log
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx             # SRE MTTR telemetry and analytics
│   │   │   ├── NewIncident.tsx           # Incident submission & live streaming
│   │   │   ├── IncidentDetail.tsx        # Deep dive view & postmortem export
│   │   │   ├── History.tsx               # Complete incident audit trail
│   │   │   ├── Login.tsx                 # Auth & 1-click Demo SRE account
│   │   │   └── PrivacyNotice.tsx         # Compliance & security disclosure
│   │   ├── services/
│   │   │   └── api.ts                    # Backend API client (no frontend keys)
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.local                        # Frontend env (VITE_API_BASE_URL)
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── incidents.routes.js
│   │   │   └── agent.routes.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── incidentController.js
│   │   │   └── agentController.js
│   │   ├── services/
│   │   │   ├── nebiusService.js          # Nebius Token Factory / Nemotron API
│   │   │   ├── tavilyService.js          # Tavily AI Search (Live Web / CVE / GitHub)
│   │   │   ├── sandboxService.js         # Isolated sandbox execution engine
│   │   │   └── alertService.js           # Slack Block Kit & Teams generator
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── rateLimiter.js            # Quota protection rate limiters
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Incident.js
│   │   ├── config/
│   │   │   └── db.js
│   │   └── server.js
│   ├── .env.example                      # Template config (committed)
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── LICENSE                               # MIT License
└── README.md
```

---

## ⚡ Quick Start Guide (Local Development)

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- (Optional) Nebius Token Factory API Key & Tavily API Key

### 1. Clone the repository
```bash
git clone https://github.com/saurabhhhcodes/Nebius-x-NVIDIA-Global-AI-Hackathon.git opscopilot
cd opscopilot
```

### 2. Configure Backend Environment
```bash
cd backend
cp .env.example .env
```
Edit `.env` if you have Nebius & Tavily API keys:
```env
NEBIUS_API_KEY=your_actual_nebius_key_here
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1
NEBIUS_MODEL=nvidia/nemotron-3-ultra
TAVILY_API_KEY=your_tavily_api_key_here
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
```
*(Note: If `NEBIUS_API_KEY` or `TAVILY_API_KEY` are omitted, OpsCopilot automatically runs with its built-in intelligent diagnostic offline engine so you can test and judge every feature instantly!)*

### 3. Install & Start Backend
```bash
npm install
npm run dev
```
Backend will start on `http://localhost:5000`.

### 4. Install & Start Frontend
In a new terminal:
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## 🔒 Security & Safety Policy

1. **No Frontend API Keys**: All AI provider requests are made exclusively through `backend/src/services/nebiusService.js`.
2. **Sandbox Host Isolation**: AI-synthesized fix scripts are evaluated inside simulated or Nebius container sandboxes. The host server never executes AI shell commands directly.
3. **PII & Credential Scrubbing**: Log text is scrubbed for Bearer tokens, passwords, and private API keys before inference.
4. **Rate Limiting**: Auth and AI inference endpoints are rate-limited to avoid brute-force and API quota exhaustion.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
