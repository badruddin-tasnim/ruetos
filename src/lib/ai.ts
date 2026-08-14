import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Primary model, fallback for 503 overload
const PRIMARY_MODEL = () => process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const FALLBACK_MODEL = 'gemini-3.5-flash';

// Retry with exponential backoff — handles 503 UNAVAILABLE from Google
async function generateWithRetry(
  params: Parameters<typeof ai.models.generateContent>[0],
  maxRetries = 3
): Promise<ReturnType<typeof ai.models.generateContent>> {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const model = attempt === 0 ? PRIMARY_MODEL() : FALLBACK_MODEL;
      return await ai.models.generateContent({ ...params, model });
    } catch (err: any) {
      lastError = err;
      const status = err?.status ?? err?.error?.code;
      // Retry only on 503 (overload) or 429 (rate limit)
      if (status !== 503 && status !== 429) throw err;
      const delayMs = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      console.warn(`Gemini ${status} on attempt ${attempt + 1}, retrying in ${Math.round(delayMs)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

export async function generatePracticeQuestions(topicName: string, weakSubtopics: string[], courseContext?: { syllabus?: string, pastQuestions?: string }) {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        correctAnswer: { type: Type.STRING },
        explanation: { type: Type.STRING },
      },
      required: ["question", "correctAnswer", "explanation"],
    },
  };

  let prompt = `Generate 3 practice questions for an undergraduate Computer Science course.
Topic: ${topicName}
Focus on these known weak areas for the student: ${weakSubtopics.join(", ") || "General concepts"}.`;

  if (courseContext?.syllabus) {
    prompt += `\n\nCourse Syllabus Context:\n${courseContext.syllabus}`;
  }
  if (courseContext?.pastQuestions) {
    prompt += `\n\nPast Exam Questions Reference (Match this difficulty and style):\n${courseContext.pastQuestions}`;
  }

  prompt += `\n\nReturn ONLY valid JSON matching the requested schema.`;

  const response = await generateWithRetry({
    model: PRIMARY_MODEL(),
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function evaluateAnswer(question: string, correctAnswer: string, studentAnswer: string) {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      isCorrect: { type: Type.BOOLEAN },
      feedback: { type: Type.STRING },
      weakSubconceptDetected: { type: Type.STRING, nullable: true },
    },
    required: ["isCorrect", "feedback"],
  };

  const response = await generateWithRetry({
    model: PRIMARY_MODEL(),
    contents: `Evaluate the student's answer to this computer science question.
Question: ${question}
Correct Answer (Reference): ${correctAnswer}
Student Answer: ${studentAnswer}

Provide a direct, diagnostic evaluation. If incorrect, identify the specific sub-concept they misunderstood. Return ONLY valid JSON matching the requested schema.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getStudyPlan(performanceData: any[], daysRemaining: number, minutesAvailable: number) {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        stepNumber: { type: Type.INTEGER },
        topic: { type: Type.STRING },
        action: { type: Type.STRING },
        durationMinutes: { type: Type.INTEGER },
      },
      required: ["stepNumber", "topic", "action", "durationMinutes"],
    },
  };

  const response = await generateWithRetry({
    model: PRIMARY_MODEL(),
    contents: `Generate a prioritized, time-boxed study plan for an undergraduate Computer Science student.
Days remaining until exam: ${daysRemaining}
Total time available today: ${minutesAvailable} minutes.

Here is the student's current performance data (Topic name, Exam Frequency (higher is more important), Mastery Percent):
${JSON.stringify(performanceData, null, 2)}

Prioritize high-frequency, low-mastery topics first. Ensure the total durationMinutes equals exactly ${minutesAvailable}.
Return ONLY valid JSON matching the requested schema.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  return JSON.parse(response.text || "[]");
}
