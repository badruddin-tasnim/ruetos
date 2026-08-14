import { NextResponse } from 'next/server';
import { getStudyPlan } from '@/lib/ai';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { studentId, daysRemaining, minutesAvailable } = await req.json();
    
    if (!studentId || !daysRemaining || !minutesAvailable) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch the student's performance data
    const performances = await prisma.studentTopicPerformance.findMany({
      where: { studentId: String(studentId) },
      include: { topic: true },
    });

    const performanceData = performances.map(p => ({
      topicName: p.topic.name,
      examFrequency: p.topic.examFrequency,
      masteryPercent: p.masteryPercent,
    }));

    const plan = await getStudyPlan(performanceData, daysRemaining, minutesAvailable);
    return NextResponse.json(plan);
  } catch (error: any) {
    console.error('Error generating study plan:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
