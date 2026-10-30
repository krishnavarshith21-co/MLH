# VERYNTH — Intelligent Software Evolution

> **Upgrade With Confidence.**

VERYNTH is an AI-powered dependency migration and verification platform that transforms risky dependency upgrades into explainable, test-backed migrations with developer-controlled approval.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![AI Model](https://img.shields.io/badge/AI-Qwen2.5--Coder--7B-teal.svg)
![Track](https://img.shields.io/badge/track-Open--Source%20AI-gold.svg)

---

## 🎯 Problem

Modern applications depend on external libraries that regularly release breaking updates. Upgrading dependencies can break existing software because functions may be removed, renamed, or changed. Developers are forced to manually:

1. Identify outdated dependencies
2. Read release notes and migration documentation
3. Locate incompatible code
4. Rewrite affected functions
5. Run tests and investigate errors
6. Repeat until the application works

This process is **time-consuming, expensive, and error-prone**.

## 💡 Solution

VERYNTH automates the dependency migration workflow:

**Detect → Analyze → Migrate → Verify → Review**

- **Dependency Intelligence** — Scans project files to identify outdated dependencies and breaking changes
- **Compatibility Analysis** — Uses Python AST to locate affected code patterns
- **AI Migration Engine** — Qwen2.5-Coder generates focused migration patches with explanations
- **Automated Verification** — Runs tests in isolated environments to validate changes
- **Human-Controlled Approval** — Developers review, approve, or reject every change

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│         React + TypeScript + Vite + Tailwind         │
│    React Three Fiber · Monaco Editor · Motion        │
├─────────────────────────────────────────────────────┤
│                   REST API                           │
├─────────────────────────────────────────────────────┤
│                    Backend                           │
│              Python + FastAPI + SQLite                │
│   AST Analyzer · Dep Scanner · Verification Runner   │
├─────────────────────────────────────────────────────┤
│                   AI Engine                          │
│     Qwen2.5-Coder-7B-Instruct via Ollama             │
└─────────────────────────────────────────────────────┘
```

## 🤖 AI Model

- **Model**: [Qwen2.5-Coder-7B-Instruct](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct)
- **License**: Apache 2.0
- **Runtime**: Ollama (local inference)
- **Purpose**: Code analysis, migration patch generation, test failure analysis, correction suggestions

The model genuinely performs code migration tasks — no hardcoded responses.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.10+
- [Ollama](https://ollama.ai/) with Qwen2.5-Coder model
- uv (Python package manager, recommended) or pip

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/verynth.git
cd verynth
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start the AI Model

```bash
# Install Ollama: https://ollama.ai/download
ollama pull qwen2.5-coder:7b-instruct
ollama serve  # If not already running
```

### 4. Start the Backend

```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
python run.py
# Backend runs on http://localhost:8000
```

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 6. Run the Demo

1. Open http://localhost:5173
2. Sign up for an account
3. Navigate to Projects → Import the sample project
4. Analyze dependencies — pandas 1.5.3 will be flagged
5. Select pandas for migration to 2.x
6. Generate AI migration patch (Qwen2.5-Coder rewrites DataFrame.append → pd.concat)
7. Run verification (pytest executes in sandbox)
8. Review results and approve/reject the patch

## 📁 Project Structure

```
verynth/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # UI components, 3D viz, layouts
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API client
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Zustand state
│   │   └── types/         # TypeScript types
│   └── package.json
├── backend/               # Python + FastAPI
│   ├── app/
│   │   ├── auth/          # JWT authentication
│   │   ├── projects/      # Project management
│   │   ├── analysis/      # Dep scanner + AST analyzer
│   │   ├── migrations/    # AI migration + patch generation
│   │   └── verification/  # Sandboxed test runner
│   └── requirements.txt
├── sample-project/        # Demo project with pandas 1.x code
│   ├── src/               # Source files using DataFrame.append()
│   ├── tests/             # Test suite (12 tests)
│   └── requirements.txt
├── .env.example
├── LICENSE                # MIT
└── README.md
```

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Sample Project Tests (Pre-migration)

```bash
cd sample-project
pip install pandas==1.5.3 numpy==1.24.0 pytest==7.4.0
pytest tests/ -v
# All 12 tests should pass with pandas 1.5.3
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_HOST` | `0.0.0.0` | Backend server host |
| `BACKEND_PORT` | `8000` | Backend server port |
| `DATABASE_URL` | `sqlite:///./verynth.db` | Database connection string |
| `JWT_SECRET_KEY` | — | Secret key for JWT tokens (change in production) |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama API endpoint |
| `OLLAMA_MODEL` | `qwen2.5-coder:7b-instruct` | AI model identifier |
| `SAMPLE_PROJECT_PATH` | `../sample-project` | Path to demo project |
| `MAX_UPLOAD_SIZE_MB` | `50` | Maximum upload size |
| `VERIFICATION_TIMEOUT_SECONDS` | `60` | Test execution timeout |
| `MAX_AI_CORRECTION_ATTEMPTS` | `3` | Max AI retry attempts |

## 🏆 Hackathon

- **Event**: SMRU Hack Day Hyderabad 2026
- **Track**: Best Open-Source / Open-Weight AI Product
- **Problem Statement**: #19 — Dependency Upgrade and Migration Assistant

## ⚠️ Limitations

- **Language Support**: Currently supports Python projects only
- **Dependency Analysis**: Focused on pandas 1.x → 2.x migration patterns for the demo
- **AST Analysis**: Detects common DataFrame.append() patterns; complex metaprogramming may not be detected
- **Verification**: Test execution requires the demo sample project; arbitrary repository execution is restricted for security
- **AI Quality**: Migration patch quality depends on model inference; not all edge cases are covered
- **Authentication**: Local JWT-based auth for the hackathon; not production-hardened

## 📄 License

This project is licensed under the [MIT License](LICENSE).

The AI model (Qwen2.5-Coder-7B-Instruct) is licensed under [Apache 2.0](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct).
