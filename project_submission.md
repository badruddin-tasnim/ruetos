# Project Name
**RUET OS**

# Tagline
A stunning, macOS-inspired web operating system that unifies university life and supercharges student learning with AI.

# Project Description
### The problem you are solving
University students constantly juggle scattered resources: disjointed notice boards, unstructured class routines, rigid curriculums, and a lack of personalized feedback during exam preparation. This fragmented experience leads to inefficiency and stress.

### Your solution
RUET OS transforms the student portal experience into a unified, gamified "Operating System". It centralizes academic life into beautiful, windowed applications (Notices, Class Routine, Mind Maps) while integrating a powerful AI engine to provide deeply personalized exam preparation and study scheduling.

### How it works
Users "boot up" the OS in their browser and navigate a sleek, window-based environment using a dock. They can visually map their courses in the **Mind Map** app, stay updated via the **Notices** and **Class Routine** apps, and dive into the **AI Exam Prep** app. The OS tracks their performance across different topics and visually displays their mastery levels.

### How AI/Gemini is used
Gemini acts as an intelligent academic tutor seamlessly integrated into the OS. Instead of acting as a generic chatbot, Gemini works behind the scenes to:
1. **Analyze Syllabus Context:** Process course materials and past exams to understand the specific rigor of a course.
2. **Generate Targeted Practice:** Dynamically create practice questions focused specifically on a student's known weak sub-topics.
3. **Diagnostic Evaluation:** Grade student answers and identify precise conceptual misunderstandings.
4. **Time-Boxed Planning:** Generate highly optimized, minute-by-minute study plans based on the student's mastery levels and exam frequency.

# Built With
* **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion (for complex OS window/dock animations), Zustand (global state management), React Flow (for interactive mind maps).
* **Backend:** Next.js Route Handlers, Prisma ORM, SQLite.
* **AI & APIs:** Google Gemini API (`@google/genai` SDK), using Structured Outputs (JSON Schema) for deterministic AI responses.

# Gemini Usage
Gemini is the core engine that powers the personalized learning experience in RUET OS. We heavily rely on Gemini's **Structured Outputs (JSON Schema)** to ensure the AI returns deterministic, parseable data (arrays of questions, boolean correctness flags, and step-by-step arrays for study plans) that our React UI can render natively. 

Furthermore, we implemented a resilient fetching strategy using `gemini-3.6-flash` as our primary model, with automatic exponential backoff and rotation to `gemini-3.5-flash` to handle high-demand (`503`) traffic gracefully. Gemini is crucial to the solution because it replaces static question banks with a dynamic, adaptive tutor that actually understands the student's past mistakes.

# Live Demo
[Insert Your Deployed URL Here — e.g., https://ruetos.vercel.app]
