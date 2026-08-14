import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const tutors = await prisma.tutorProfile.findMany({
      include: {
        student: true,
      }
    });

    // Bayesian Average calculation
    // formula: (R * v + C * m) / (v + m)
    // where:
    // R = average rating for the tutor
    // v = number of ratings for the tutor
    // m = minimum ratings required to be considered (e.g., 5)
    // C = the mean rating across all tutors (we'll assume 4.0 as base for simplicity)
    const m = 5;
    const C = 4.0;

    const rankedTutors = tutors.map(tutor => {
      const v = tutor.ratingCount;
      const R = tutor.ratingAverage;
      const bayesianScore = (R * v + C * m) / (v + m);
      return {
        ...tutor,
        bayesianScore,
        parsedTopics: JSON.parse(tutor.topicsTags || "[]"),
        parsedAvailability: JSON.parse(tutor.availabilitySlots || "[]"),
      };
    }).sort((a, b) => b.bayesianScore - a.bayesianScore);

    return NextResponse.json({ tutors: rankedTutors });
  } catch (error: any) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
