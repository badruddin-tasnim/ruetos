import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { code: 'asc' }
    });
    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { code, title, syllabusText = "", pastQuestionsText = "" } = await req.json();

    if (!code || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCourse = await prisma.course.create({
      data: {
        code,
        title,
        syllabusText,
        pastQuestionsText,
      }
    });

    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating course:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A course with this code already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
