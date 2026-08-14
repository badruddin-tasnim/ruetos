import { NextResponse } from 'next/server';
import { generatePracticeQuestions } from '@/lib/ai';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { topicName, weakSubtopics, courseId } = await req.json();
    
    if (!topicName) {
      return NextResponse.json({ error: 'Missing topicName' }, { status: 400 });
    }

    let courseContext = undefined;
    if (courseId) {
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (course) {
        courseContext = {
          syllabus: course.syllabusText,
          pastQuestions: course.pastQuestionsText
        };
      }
    }

    const questions = await generatePracticeQuestions(topicName, weakSubtopics || [], courseContext);
    return NextResponse.json(questions);
  } catch (error: any) {
    console.error('Error generating practice questions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
