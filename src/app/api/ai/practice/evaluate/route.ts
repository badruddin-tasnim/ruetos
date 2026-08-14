import { NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { question, correctAnswer, studentAnswer } = await req.json();
    
    if (!question || !correctAnswer || !studentAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const evaluation = await evaluateAnswer(question, correctAnswer, studentAnswer);
    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
