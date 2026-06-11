# StudySprout AI 🌱

StudySprout AI is an AI-powered study assistant designed to help students turn lecture PDFs into structured study guides, question banks, quizzes, weak-topic feedback, and plant-based learning progress.

This project is currently in development as a full-stack learning project using React, FastAPI, PostgreSQL, and AI/NLP tools.

---

## Project Overview

Many students read lecture slides or PDFs passively without knowing what to focus on, what questions to practice, or whether they truly understood the lesson.

StudySprout AI aims to solve this by converting uploaded lecture PDFs into an active study experience.

The system will allow students to:

* Upload lecture PDFs
* Extract text from PDFs
* Generate AI-powered study guidelines
* Generate exam-style questions and answers
* Practice questions in quiz mode
* Check answers based on meaning, not exact wording
* Identify weak topics
* Track learning progress
* Grow a digital plant based on verified study progress

---

## Main Idea

Instead of only summarizing a PDF, StudySprout AI helps students study actively.

Basic workflow:

```text
Upload PDF
   ↓
Extract PDF text
   ↓
Generate study guideline
   ↓
Generate question bank
   ↓
Student attempts quiz
   ↓
Check answers semantically
   ↓
Detect weak topics
   ↓
Update dashboard and plant progress
```

---

## Current Project Status

This project is in the early development stage.

Currently completed:

* Project folder structure created
* React + Vite frontend setup
* FastAPI backend setup
* Python virtual environment configured
* Basic backend API running
* CORS configured for frontend-backend connection
* Initial project design direction planned

Next development steps:

* Create backend route files
* Add PostgreSQL database connection
* Create database models
* Implement user authentication
* Add PDF upload endpoint
* Add PDF text extraction
* Add AI study guide generation
* Add question generation
* Add quiz and semantic answer checking

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts
* Lucide React

### Backend

* FastAPI
* Python
* Uvicorn
* SQLAlchemy
* PostgreSQL
* JWT Authentication

### AI / NLP Planned

* Groq API / ChatGroq
* LangChain
* PyMuPDF
* sentence-transformers
* all-MiniLM-L6-v2

### Tools

* Git
* GitHub
* VS Code / Antigravity
* Postman
* FastAPI Swagger UI

---

## Design System

StudySprout AI uses a calm and student-friendly visual style.

### Theme

* Sage green
* Cream background
* Soft cards
* Rounded corners
* Plant growth progress theme
* Minimal dashboard layout

### Main Colors

```text
Sage:        #7A9E87
Sage Light:  #B8D4C0
Sage Pale:   #E8F2EB
Sage Dark:   #4A7558
Cream:       #F5F2EB
Text:        #2C3A2E
Muted Text:  #6B7E6E
Amber:       #C8934A
```

### Fonts

* Caveat for logo and display headings
* DM Sans for body text

---

## Planned Features

### 1. User Authentication

Students will be able to register and log in securely.

Planned features:

* Register account
* Login account
* JWT authentication
* Protected dashboard
* User-specific study materials

---

### 2. PDF Upload

Students will be able to upload lecture PDFs.

Planned features:

* Upload PDF files
* Extract text from uploaded PDFs
* Store uploaded material details
* Preview extracted text
* Connect materials to logged-in users

---

### 3. AI Study Guideline Generator

After uploading a PDF, the system will generate a study guide.

The study guide may include:

* PDF overview
* Key topics
* Suggested study order
* Important definitions
* Exam-focused areas
* Revision tips

---

### 4. AI Question Bank Generator

The system will generate questions from the uploaded PDF.

Question types may include:

* Multiple-choice questions
* Short-answer questions
* Explain-type questions
* True/false questions
* Scenario-based questions

Each question will include:

* Topic
* Question type
* Difficulty level
* Question
* Correct answer
* Explanation

---

### 5. Study Mode

Study Mode will allow students to revise with answers visible.

Students can view:

* Question
* Answer
* Explanation
* Topic
* Difficulty level

---

### 6. Quiz Mode

Quiz Mode will allow students to practice without seeing answers first.

Planned features:

* Attempt generated questions
* Submit answers
* Calculate quiz score
* View correct answers
* Save quiz history
* Update weak topics

---

### 7. Semantic Answer Checking

StudySprout AI will check answers based on meaning instead of exact wording.

Example:

```text
Expected Answer:
Normalization reduces data redundancy and improves data integrity.

Student Answer:
It removes duplicate data and keeps the database consistent.

Result:
Correct
```

Planned logic:

```text
Similarity score >= 0.75  → Correct
Similarity score >= 0.50  → Partially Correct
Similarity score < 0.50   → Needs Revision
```

---

### 8. Weak Topic Detection

The system will identify weak topics based on quiz results.

Example:

```text
Weak Topics:
- Database Normalization
- SQL Views
- Recursion
```

This helps students revise more effectively.

---

### 9. Progress Dashboard

The dashboard will show:

* Total PDFs uploaded
* Total questions generated
* Recent quiz scores
* Weak topics
* Quiz history
* Study progress
* Plant progress

---

### 10. Plant Growth Progress

StudySprout AI includes a plant-growth system to motivate students.

Example progress actions:

| Student Action     | Plant Progress          |
| ------------------ | ----------------------- |
| Upload first PDF   | Seed planted            |
| Generate questions | Plant receives sunlight |
| Complete quiz      | Plant receives water    |
| Score above 70%    | New leaf grows          |
| Revise weak topic  | Plant health improves   |
| Study consistently | Flower unlocks          |

---

##
