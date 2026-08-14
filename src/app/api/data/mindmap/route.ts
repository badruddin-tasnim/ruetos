import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    let whereClause = {};
    if (courseId) {
      whereClause = { id: courseId };
    } else {
      whereClause = { code: 'CSE320' }; // fallback
    }

    const course = await prisma.course.findFirst({
      where: whereClause,
      include: {
        chapters: {
          include: {
            topics: {
              include: {
                subtopics: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error: any) {
    console.error('Error fetching mindmap data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
