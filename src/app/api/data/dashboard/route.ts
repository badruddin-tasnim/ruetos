import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentRoll = searchParams.get('roll') || '';

    const courseId = searchParams.get('courseId');

    let student = await prisma.student.findUnique({
      where: { rollNumber: studentRoll },
      include: {
        performances: {
          where: courseId ? { topic: { courseId: courseId } } : undefined,
          include: {
            topic: {
              include: {
                chapter: true,
                subtopics: true,
                course: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      // Fallback to the showcase seeded student for demonstration
      student = await prisma.student.findUnique({
        where: { rollNumber: '1903001' },
        include: {
          performances: {
            where: courseId ? { topic: { courseId: courseId } } : undefined,
            include: {
              topic: {
                include: {
                  chapter: true,
                  subtopics: true,
                  course: true
                }
              }
            }
          }
        }
      });
      
      if (!student) {
        return NextResponse.json({ error: 'Student not found and showcase data missing' }, { status: 404 });
      }
    }

    return NextResponse.json({ student });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
