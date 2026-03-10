# ApplyMate

**Rate: Organized, Yours.**

ApplyMate is an AI-powered job application tracker using semantic similarity and FastAPI that helps users manage job applications, evaluate resume-job match percentages, and receive keyword-based feedback to improve application quality.

It combines full-stack web development with semantic similarity scoring to help users understand how closely their resume aligns with a job posting.

---

## Overview

ApplyMate was built to make the job application process more structured and data-driven. Instead of manually comparing a resume against each job description, users can upload both documents and receive an AI-assisted evaluation.

The platform helps users:

- track job applications in one place
- measure resume-job alignment
- identify missing keywords or weak areas
- manage related documents securely

---

## Features

### Application Tracker
Add and manage job applications with fields such as:

- company
- position
- location
- application status

### File Uploads
Upload and store important job application documents, including:

- resume
- job posting
- cover letter
- transcript

### Match Percentage Calculation
Calculate how well a resume aligns with a job posting using semantic similarity scoring.

### Keyword Feedback
Highlight missing or weak keywords by comparing resume content against the job posting.

### AI-Driven Analysis
Use sentence-transformers embeddings to evaluate semantic similarity beyond simple keyword overlap.

### Secure Storage
Store uploaded files through Supabase Storage.

### Full-Stack Web Application
Built with a modern full-stack architecture using Next.js, FastAPI, MongoDB, and Tailwind CSS.

---

ApplyMate processes resumes and job postings through an AI-powered matching pipeline.

```text
User Upload Resume / Job Posting
        │
        ▼
Next.js Frontend
        │
        ▼
FastAPI Backend
        │
        ├── Text preprocessing
        ├── Embedding generation
        │      (sentence-transformers/all-mpnet-base-v2)
        ├── Cosine similarity calculation
        └── Keyword gap analysis
                │
                ▼
MongoDB Storage
                │
                ▼
Match Score + Feedback returned to UI
```

The frontend handles the user workflow and dashboard experience, while the backend coordinates document processing, matching logic, and data persistence.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| Frontend     | [Next.js](https://nextjs.org/)                              |
| Styling      | [Tailwind CSS](https://tailwindcss.com/)                    |
| Backend      | [FastAPI](https://fastapi.tiangolo.com/)                    |
| Database     | [MongoDB](https://www.mongodb.com/)                         |
| File Storage | [Supabase](https://supabase.com/)                           |
| AI Model     | `sentence-transformers/all-mpnet-base-v2` (via HuggingFace) |

---

### API Design

The backend exposes RESTful APIs for application management and AI-based resume analysis.

## Example endpoints
```text
POST /upload/resume
POST /{application_id}/analyze-match
POST /{application_id}/keyword-feedback
GET  /applications/me
```

## Example request flow
```text
Resume + Job Posting
        │
        ▼
/analyze/match
        │
        ▼
Embedding generation
        │
        ▼
Cosine similarity scoring
        │
        ▼
Match percentage + keyword feedback
```

---

## AI Matching Logic

ApplyMate evaluates resume-job alignment using semantic similarity and keyword analysis.

Matching pipeline

**1. Extract text from the uploaded resume and job posting**

**2. Generate embeddings using sentence-transformers/all-mpnet-base-v2**

**3. Compute cosine similarity between the two embeddings**

**4. Generate a match percentage**

**5. Detect missing or weak keywords relative to the job description**

This approach allows the system to capture semantic similarity rather than relying only on exact keyword matches.

## Why this matters

Traditional keyword matching can miss strong alignment when similar concepts are phrased differently. ApplyMate improves this by comparing meaning at the embedding level.

Handles resume-job semantic similarity scoring using sentence-transformer embeddings.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hyewon6588/applymate.git
cd applymate
```

### 2. Backend Setup

```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 4. Environment Variables

Create `.env` files for both frontend and backend. Include variables like:

#### `.env` (FastAPI)

```env
MONGO_URI=your_mongodb_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_api_key
JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=your_jwt_algorithm
```

#### `.env.production` (Next.js)

```env
NEXT_PUBLIC_API_URL=api_production_url

# === environment ===
NEXT_PUBLIC_ENV=production
```

---

## 📦 Deployment

You can deploy:

- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Fly.io](https://fly.io/) or any Docker-compatible host
- **Database**: MongoDB Atlas
- **File Storage**: Supabase Storage

---

### Project Goal

The goal of ApplyMate is to turn job application management into a more organized and measurable process by combining backend APIs, document workflows, and AI-assisted analysis in a single product.
