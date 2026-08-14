import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // We only allow updating these specific fields for now
    const { syllabusText, pastQuestionsText } = body;

    const updateData: any = {};
    if (syllabusText !== undefined) updateData.syllabusText = syllabusText;
    if (pastQuestionsText !== undefined) updateData.pastQuestionsText = pastQuestionsText;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided to update" }, { status: 400 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ course: updatedCourse }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating course materials:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
