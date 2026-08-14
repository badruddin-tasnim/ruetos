# Build Prompt: macOS-Themed AI Learning Platform for RUET Students

## 1. ROLE

You are a senior full-stack product engineer and UI/UX designer. You specialize in building polished, animation-rich web applications with pixel-perfect attention to detail, and you have deep experience replicating native OS interfaces (specifically macOS) faithfully in the browser using web technologies. You also have strong experience integrating LLM APIs (Google Gemini) into product features in ways that feel genuinely intelligent rather than gimmicky.

You are building this project for a 3-hour hackathon called **"Build with AI @ RUET"**, hosted by Google Developer Groups at Rajshahi University of Engineering & Technology (RUET). Judging criteria: Innovation & Originality (20%), Technical Implementation (25%), Usefulness & Impact (20%), User Experience & Design (15%), Demo & Communication (20%). Prioritize a working, visually impressive, demo-ready prototype over completeness or production-grade robustness.

## 2. CONTEXT

RUET students currently manage their academic life across many disconnected channels: scattered PDFs for course materials, notices posted on a website/noticeboard, informal Facebook/WhatsApp groups for asking classmates questions, no central place to track assignment deadlines, and no structured way to prepare for exams beyond going through old question papers manually. There is no single platform that ties these together, and nothing uses AI to make studying smarter or more personalized.

## 3. PROBLEM STATEMENT

RUET students waste significant time and mental energy:
- Hunting for course materials and notices across multiple scattered sources.
- Preparing for exams without knowing which topics actually matter most (based on past exam patterns) or which topics they are personally weak in.
- Finding a knowledgeable senior/batchmate to explain a difficult topic, with no way to know in advance who explains well.
- Tracking assignment deadlines across courses with no unified view.

There is no single, intelligent, personalized system that solves these problems together.

## 4. SOLUTION OVERVIEW

Build **"RUET OS"** — a web application designed to look and feel exactly like the **macOS desktop**, where each core feature of the platform is presented as a native-feeling "app" that opens in its own draggable, closable window from a Dock. This is a deliberate design choice: it makes a fragmented set of academic tools feel like one cohesive, delightful, familiar "operating system for student life."

The AI differentiator is the **AI Exam Prep app**, which is the centerpiece feature. It does not just generate random practice questions — it builds a full loop:

```
Course Materials + Past Question Papers
        → Gemini identifies key topics & their exam frequency
        → Student takes an AI-generated practice test
        → Gemini evaluates answers and diagnoses specific weak concepts
        → System recommends a prioritized "what to study next" plan
        → Loop repeats, tracking improvement over time
```

The other apps (Class Routine, Course Resources, Study Buddy, Notices) are supporting features that complete the "operating system for student life" narrative. Study Buddy additionally includes a rating-based peer-tutoring leaderboard.

## 5. TARGET USER

A RUET undergraduate student, any department/batch, who wants one place to manage coursework and prepare for exams more efficiently, and who is comfortable with a familiar desktop-style interface (most students use laptops, many use macOS or are visually familiar with it).

## 6. CORE FEATURES ("Apps")

### 6.1 Login Screen (macOS Lock Screen style)
- Full-bleed blurred wallpaper background (gaussian blur), centered translucent glass card.
- Circular avatar/profile icon with RUET logo.
- Two input fields: **Roll Number** and **Registration Number** (this is the student's login credential pair — no email/password).
- A subtle "Unlocking..." spinner/animation on submit, then a smooth transition (fade + scale) into the Desktop.
- For the prototype, authentication can be mocked (accept any roll/reg number combination, or validate against a small seeded student list in the database).

### 6.2 Desktop Shell
- **Menu bar** (top, fixed, translucent/frosted glass like macOS): RUET logo (acts as Apple logo) on the left, active app name next to it, right side shows a live clock, and the logged-in student's name/roll number.
- **Dock** (bottom, fixed, centered, translucent glass, rounded): icons for each app. Icons should "scale up" slightly on hover (macOS magnification effect) and "bounce" once when clicked to open.
- **Desktop background**: a tasteful wallpaper (gradient or abstract, optionally RUET-branded colors).
- **Windows**: every app opens inside a window component with:
  - Title bar containing traffic-light buttons (red = close, yellow = minimize, green = maximize) in the top-left, and the app name centered.
  - Draggable by the title bar.
  - Resizable (nice-to-have, not required for MVP).
  - Rounded corners, drop shadow, subtle open/close scale+fade animation.
  - Multiple windows can be open simultaneously, layered with correct z-index (clicking a window brings it to front).
- **Spotlight-style search** (triggered by a search icon in the menu bar, or Cmd/Ctrl+K): a centered overlay search bar. This can double as a shortcut into the AI Exam Prep "ask a question" feature.

### 6.3 AI Exam Prep App (primary feature — must be the most polished)

**Screen A — Course Dashboard**
Shows one hardcoded/seeded course (e.g., "CSE 320 — Operating Systems") with:
- Days remaining until exam.
- A per-topic progress bar list showing the student's current mastery % per topic (e.g., Process Management 82%, Deadlocks 46%), visually flagging weak topics (below a threshold, e.g., 60%) in red/orange.
- An "AI Recommendation" panel: a short list of topics to focus on next, and topics not worth further time, generated by Gemini based on performance + exam frequency data (see Section 8 for prompt logic).

**Screen B — Past Question Analysis**
- Student can paste/upload past exam question text.
- Gemini analyzes and returns a topic-frequency breakdown (which topics appeared most often in past exams), displayed as a simple bar chart or ranked list.

**Screen C — Practice Session**
- Student selects a weak topic (or clicks "Practice Deadlocks" from the dashboard).
- Gemini generates 3–5 practice questions grounded in the course material and, where available, the student's past mistakes on that topic.
- Student answers each question (free text or multiple choice — free text is more impressive for the AI evaluation demo).
- On submission, Gemini evaluates the answer and returns:
  - Correct/incorrect verdict.
  - Specific diagnostic feedback (not generic — e.g., "You understand deadlock detection but confused it with deadlock avoidance").
  - The specific weak sub-concept detected (e.g., "Banker's Algorithm").
- The student's `performanceByTopic` score updates based on session results.

**Screen D — "What Should I Study Now?" (killer feature, should be the demo centerpiece)**
- A single button: **"What should I study right now?"**
- Takes as input: days remaining, topic exam-frequency, current performance per topic, and (optionally) minutes available (student can input this).
- Gemini returns a prioritized, time-boxed study plan (e.g., "① File Systems — 25 min — Review Lecture 09; ② Deadlock Avoidance — 20 min — Practice 3 questions").
- Display in a clean, numbered, scannable list.

### 6.4 Study Buddy App (secondary feature)
- **Tutor directory**: list of student-tutors with name, batch/department, topics they can help with (tags), and their current rating.
- **Leaderboard view**: tutors ranked by rating (use a Bayesian/weighted average so a single 5-star review doesn't dominate — see Section 9).
- **Book a session**: student picks an available time slot from a tutor's listed availability; booking simply marks the slot as taken (no real calendar integration needed for MVP).
- **Rate after session**: 1–5 star rating + short text comment.
- **(Stretch) AI review summarization**: Gemini reads all reviews for a tutor and produces a short natural-language summary of common praise/criticism.
- **(Stretch) Bridge from AI Exam Prep**: on a weak-topic screen in AI Exam Prep, show a button "Find a peer tutor for this topic" that deep-links into Study Buddy filtered by that topic.

### 6.5 Class Routine App
- Simple weekly timetable grid (days as columns, time slots as rows) showing the student's seeded/mocked class schedule.

### 6.6 Course Mind Map App (replaces generic file-based resource management)

Instead of a flat file/folder browser, course content is presented as an **interactive, hierarchical mind map** that visually organizes an entire course from syllabus level down to individual exam-relevant subtopics. This is a deliberate rejection of "just another file manager" — the mind map itself is the differentiator, and it should be immediately impressive when opened.

**Hierarchy (4 levels, all collapsible/expandable):**

```
Course (e.g., CSE 320 — Operating Systems)
  └── Chapter (e.g., "Process Synchronization")
        └── Topic (e.g., "Deadlocks")
              └── Subtopic (e.g., "Banker's Algorithm")
                    → tagged with importance level
                    → linked resources (notes/slide references)
```

**How the hierarchy is generated:**
- Gemini takes the course syllabus text + course material text + past exam question text as input.
- It builds the Chapter → Topic → Subtopic tree directly from the syllabus structure (chapters/topics as officially defined), then, for every leaf-level subtopic, cross-references it against the past question text to determine how often that subtopic has been examined.
- Each leaf node gets tagged with an **importance level** derived from past-question frequency: `high` / `medium` / `low` (e.g., high = appeared in 3+ past papers, medium = 1–2, low = 0 but still in syllabus).

**Visual design of the mind map:**
- Central/root node = the course name, with Chapter nodes branching out from it (radial or left-to-right tree layout — radial is more visually striking for a demo).
- Topic nodes branch from their Chapter, Subtopic nodes branch from their Topic.
- **Color-coding by importance** on subtopic (leaf) nodes: red/orange = high importance (appears frequently in past exams — study first), yellow = medium, gray/blue = low importance (syllabus-only, rarely examined). This turns the mind map into an instant visual study-priority map, not just a navigation tool.
- Nodes are collapsible/expandable — clicking a Chapter node expands its Topics, clicking a Topic expands its Subtopics. Start with only Chapters visible (clean overview), let the student drill down.
- Clicking a leaf (Subtopic) node opens a small side panel or popover showing: a short AI-generated explanation of the subtopic, how many times it has appeared in past exams, and a direct "Practice this in AI Exam Prep" button (bridges directly into Section 6.3's practice flow — reuse the same topic/subtopic identifier so performance tracking stays connected).
- Smooth expand/collapse and pan/zoom animations; the map should feel alive, not like a static diagram.

**Implementation note:** use a graph/tree visualization library rather than building layout math by hand — recommended: **React Flow** (best for interactive draggable/expandable node graphs with custom node styling) or **D3.js** (more control, more setup time) as a fallback. React Flow is strongly preferred for hackathon time constraints since it handles pan/zoom/layout out of the box.

This single feature directly reinforces the "Study what matters most" product identity from the AI Exam Prep app — the mind map is essentially the AI Exam Prep's topic-frequency data made spatial and explorable, rather than shown as a flat progress-bar list. Both features should read from the same underlying `Topic`/`Subtopic` importance data so they never contradict each other.

### 6.7 Notices App
- A simple list/feed of RUET notices (title, date, short description, urgency tag). Can be seeded/mock data; optionally Gemini-summarized if real notice text is provided.

## 7. VISUAL DESIGN SYSTEM

- **Aesthetic reference**: macOS Sonoma/Sequoia — frosted glass (`backdrop-filter: blur()`), rounded corners (12–20px), soft shadows, SF Pro-like system font (use `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto` as a web-safe stack, or a close Google Font like "Inter" or "SF Pro Display" alternatives).
- **Color palette**: light, airy backgrounds with a vibrant accent color for RUET branding (suggest RUET's official green/blue if known, otherwise a clean blue accent similar to macOS system blue `#0A84FF`).
- **Motion**: all window open/close/minimize actions and dock hover/bounce interactions should be smoothly animated (CSS transitions or a lightweight animation library). Motion should feel snappy (150–300ms), never sluggish.
- **Icons**: use a consistent icon set (e.g., Lucide icons or simple emoji as placeholders) styled as rounded-square macOS-style app icons with gradient backgrounds.
- Fully responsive is NOT required for the hackathon MVP — optimize for desktop/laptop browser viewing since that's how it will be demoed, but keep it reasonably usable on a laptop screen at minimum 1280px width.

## 8. GEMINI API INTEGRATION DETAILS

Use the Gemini API (`@google/genai` SDK, model `gemini-2.5-flash` for speed/cost) with `responseMimeType: "application/json"` for all structured calls so responses can be parsed directly into UI state. Implement the following distinct AI calls as backend functions/endpoints:

1. **`extractTopics(courseMaterialText)`** — Given raw course material text, return a JSON list of 5–8 main topics with subtopics.
2. **`analyzeQuestionFrequency(topics, pastQuestionsText)`** — Given topics and past exam question text, return a JSON frequency count of how often each topic appeared.
3. **`generatePracticeQuestions(topic, courseMaterialText, pastMistakes[])`** — Generate 3–5 practice questions grounded in course material, targeted at a specific topic and the student's known weak sub-concepts, returned as JSON with question, correct answer, and explanation.
4. **`evaluateAnswer(question, correctAnswer, studentAnswer)`** — Evaluate a free-text student answer, returning JSON with a correct/incorrect verdict, specific diagnostic feedback, and the precise weak sub-concept detected (not generic — must reference the actual misunderstanding).
5. **`getStudyPlan({frequency, performanceByTopic, daysRemaining, minutesAvailable})`** — Combine exam frequency and current performance to produce a prioritized, time-boxed study plan as JSON.
6. **`generateCourseMindMap(syllabusText, courseMaterialText, pastQuestionsText)`** — Build the full Chapter → Topic → Subtopic hierarchy from the syllabus, and for every leaf Subtopic, cross-reference past exam question text to assign an `importance` level (`high` / `medium` / `low`) and an `appearanceCount`. Return JSON in this shape:
   ```json
   {
     "chapters": [
       {
         "name": "Process Synchronization",
         "topics": [
           {
             "name": "Deadlocks",
             "subtopics": [
               { "name": "Banker's Algorithm", "importance": "high", "appearanceCount": 4 }
             ]
           }
         ]
       }
     ]
   }
   ```
7. **`explainSubtopic(subtopicName, courseMaterialText)`** — Return a short (2-4 sentence) plain-language explanation of a single subtopic, grounded in the course material, for display in the mind map's node popover.
8. **(Stretch) `tagTutorTopics(bioText)`** — Extract structured topic tags from a tutor's free-text bio for Study Buddy search/matching.
9. **(Stretch) `summarizeReviews(reviewTexts[])`** — Summarize a tutor's reviews into a short natural-language summary.

All prompts sent to Gemini should explicitly instruct: "Return ONLY valid JSON in this exact shape: {...}" with a concrete example schema, to keep parsing reliable. Wrap all Gemini calls in try/catch with sensible fallback UI states (loading, error, retry) since this is a live demo and API latency/errors must not break the experience.

**Important:** the `Topic`/`Subtopic` importance data generated by call 6 must be the single source of truth shared between the Course Mind Map app (Section 6.6) and the AI Exam Prep app (Section 6.3) — do not generate this data twice or let the two features disagree on which topics are "important."

## 9. TECHNICAL ARCHITECTURE

```
┌─────────────────────────────┐
│   Frontend (React / Next.js)│
│  - macOS shell (Desktop,    │
│    Dock, Menu bar, Windows) │
│  - App components per       │
│    feature (6.1–6.7)        │
└───────────────┬─────────────┘
                │ REST/JSON
┌───────────────▼─────────────┐
│   Backend (Node.js/Express  │
│   or Next.js API routes)    │
│  - Auth (roll/reg lookup)   │
│  - CRUD for courses,        │
│    tutors, bookings, etc.   │
│  - Gemini API integration   │
│    (Section 8 functions)    │
└───────────────┬─────────────┘
                │
      ┌─────────┴─────────┐
      ▼                   ▼
┌───────────┐     ┌───────────────┐
│  Database │     │  Gemini API    │
│ (SQLite/  │     │ (Google GenAI  │
│ Firestore)│     │  SDK)          │
└───────────┘     └───────────────┘
```

**Recommended stack:**
- Frontend: React (Vite) or Next.js, plain CSS/Tailwind for styling (Tailwind recommended for speed), Framer Motion for window/dock animations (optional but recommended), **React Flow** for the interactive Course Mind Map (Section 6.6).
- Backend: Next.js API routes (simplest, keeps one codebase) or a lightweight Express server.
- Database: For hackathon speed, either SQLite (via Prisma) for a real relational DB, or Firebase Firestore if you prefer a hosted NoSQL option with zero setup. Either is acceptable — pick based on team familiarity, prioritize speed of setup.
- Deployment (optional, if time allows): Vercel (frontend+API routes) or Google Cloud Run (if containerizing).

## 10. DATABASE SCHEMA (minimal, adjust to chosen DB type)

```
Student
- id (PK)
- rollNumber
- registrationNumber
- name
- department
- batch

Course
- id (PK)
- code (e.g., "CSE320")
- title
- syllabusText
- pastQuestionsText

Chapter
- id (PK)
- courseId (FK -> Course)
- name
- orderIndex

Topic
- id (PK)
- chapterId (FK -> Chapter)
- courseId (FK -> Course)   -- denormalized for quick lookup, used by AI Exam Prep
- name
- examFrequency (int)       -- aggregated from child subtopics

Subtopic
- id (PK)
- topicId (FK -> Topic)
- name
- importance (enum: high / medium / low)
- appearanceCount (int)     -- how many past-exam questions matched this subtopic
- explanationText           -- cached AI-generated short explanation (avoid re-calling Gemini every open)

StudentTopicPerformance
- id (PK)
- studentId (FK -> Student)
- topicId (FK -> Topic)     -- performance tracked at Topic level; Subtopic detail comes from PracticeSession weak-concept tags
- masteryPercent (0-100)
- lastPracticedAt

PracticeSession
- id (PK)
- studentId (FK -> Student)
- topicId (FK -> Topic)
- questionsJson
- answersJson
- resultJson
- createdAt

TutorProfile
- id (PK)
- studentId (FK -> Student)
- bio
- topicsTags (array/JSON)
- availabilitySlots (array/JSON)
- ratingAverage
- ratingCount

Booking
- id (PK)
- tutorId (FK -> TutorProfile)
- studentId (FK -> Student)
- topic
- timeslot
- status (pending/confirmed/completed)

Review
- id (PK)
- bookingId (FK -> Booking)
- rating (1-5)
- comment
- createdAt
```

For the Study Buddy leaderboard, compute rank using a **Bayesian weighted average** rather than raw average, so a tutor with one 5-star review doesn't outrank a tutor with fifty 4.8-star reviews:

```
weightedRating = (v / (v + m)) * R + (m / (v + m)) * C
  where R = tutor's average rating
        v = tutor's number of ratings
        m = minimum ratings threshold (e.g., 5)
        C = mean rating across all tutors
```

## 11. SEED DATA REQUIRED FOR DEMO

To make the demo convincing without needing real file uploads mid-demo, pre-seed:
- One course: e.g., "CSE 320 — Operating Systems" with realistic syllabus text and 2–3 pages of realistic past exam questions (can be authored/paraphrased, not copied from a real copyrighted source).
- A full pre-generated Chapter → Topic → Subtopic mind map hierarchy for that course (3–4 chapters, 2–3 topics each, 2–4 subtopics each), with importance levels and appearance counts already assigned — so the mind map looks rich and populated the instant it's opened, without waiting on a live Gemini call during the demo. (The live `generateCourseMindMap` call can still be wired up and demonstrated separately, e.g., by regenerating for a second course on stage.)
- A student performance profile with a mix of strong and weak topics (so the dashboard visually demonstrates the weak-topic-flagging feature immediately).
- 4–6 mock tutor profiles with topic tags, availability slots, and pre-seeded reviews/ratings so the leaderboard looks populated on first load.
- A short list of mock notices and a mock weekly class routine.

## 12. NON-FUNCTIONAL REQUIREMENTS

- The app must run reliably live during a demo — prioritize graceful loading/error states over handling every edge case.
- Gemini API calls should show a loading indicator (e.g., a subtle spinner or skeleton state within the window) so latency doesn't look like a bug.
- Keep all animations performant (avoid layout thrash; use `transform`/`opacity` for animated properties).
- No production-grade security/auth is required — this is a prototype; roll/registration number login can be a simple lookup or even accept any input for demo purposes, clearly noted as such in code comments.

## 13. BUILD PRIORITY ORDER (given limited time)

1. macOS shell: login screen, desktop, dock, menu bar, draggable/closable windows (get this feeling right first — it's the visual hook).
2. AI Exam Prep app: dashboard (Screen A) and "What should I study now?" (Screen D) — this is the single most important feature to nail for the demo.
3. AI Exam Prep: Practice Session (Screen C) with answer evaluation — second most important, shows the adaptive loop.
4. Course Mind Map app: render the seeded Chapter → Topic → Subtopic tree with React Flow, color-coded by importance, with expand/collapse working — this is a strong secondary visual "wow" moment and should come before Study Buddy.
5. Study Buddy app: tutor list + leaderboard with seeded ratings (booking flow can be minimal/non-functional if time is short, as long as it visually works).
6. Class Routine, Notices apps — simple static/seeded views, lowest priority, add only if time remains.
7. Polish pass: animations, transitions, hover states, consistent icon styling. Include the mind-map node popover ("AI explanation" + "Practice this" button) here if time allows — nice-to-have, not essential to the core demo story.

## 14. DELIVERABLE

A working web application matching the above, runnable locally (and ideally deployed), with clean, organized code (component-per-app structure), that can be demoed live in under 2 minutes showing: login → desktop → opening AI Exam Prep → viewing weak topics → running a practice question → seeing AI feedback → clicking "What should I study now?" → opening the Course Mind Map to show the color-coded, expandable topic tree → briefly showing Study Buddy leaderboard.
