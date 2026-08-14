import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.tutorProfile.deleteMany()
  await prisma.practiceSession.deleteMany()
  await prisma.studentTopicPerformance.deleteMany()
  await prisma.subtopic.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.course.deleteMany()
  await prisma.student.deleteMany()

  // 1. Create Mock Student (The user)
  const student = await prisma.student.create({
    data: {
      rollNumber: '1903001',
      registrationNumber: '1903001',
      name: 'Tasnim',
      department: 'CSE',
      batch: '19'
    }
  })

  // 2. Create Course (CSE 320 - Operating Systems)
  const course = await prisma.course.create({
    data: {
      code: 'CSE320',
      title: 'Operating Systems',
      syllabusText: 'Detailed syllabus text here...',
      pastQuestionsText: 'Past questions text here...'
    }
  })

  // 3. Create Chapters, Topics, and Subtopics with realistic data
  const ch1 = await prisma.chapter.create({
    data: { courseId: course.id, name: 'Process Synchronization', orderIndex: 1 }
  })
  
  const ch2 = await prisma.chapter.create({
    data: { courseId: course.id, name: 'Memory Management', orderIndex: 2 }
  })

  const ch3 = await prisma.chapter.create({
    data: { courseId: course.id, name: 'File Systems', orderIndex: 3 }
  })

  // --- Chapter 1 Topics ---
  const t1 = await prisma.topic.create({
    data: { chapterId: ch1.id, courseId: course.id, name: 'Deadlocks', examFrequency: 8 }
  })
  await prisma.subtopic.create({ data: { topicId: t1.id, name: 'Banker\'s Algorithm', importance: 'high', appearanceCount: 5, explanationText: 'Avoids deadlock by simulating resource allocation.' } })
  await prisma.subtopic.create({ data: { topicId: t1.id, name: 'Deadlock Detection', importance: 'medium', appearanceCount: 2, explanationText: 'Detects if a deadlock has occurred using wait-for graphs.' } })
  await prisma.subtopic.create({ data: { topicId: t1.id, name: 'Resource Allocation Graph', importance: 'low', appearanceCount: 1, explanationText: 'Visualizes resource assignment and requests.' } })

  const t2 = await prisma.topic.create({
    data: { chapterId: ch1.id, courseId: course.id, name: 'Semaphores & Mutex', examFrequency: 6 }
  })
  await prisma.subtopic.create({ data: { topicId: t2.id, name: 'Binary Semaphores', importance: 'medium', appearanceCount: 3, explanationText: 'Used for mutual exclusion.' } })
  await prisma.subtopic.create({ data: { topicId: t2.id, name: 'Counting Semaphores', importance: 'high', appearanceCount: 3, explanationText: 'Used for controlling access to a given number of resources.' } })

  // --- Chapter 2 Topics ---
  const t3 = await prisma.topic.create({
    data: { chapterId: ch2.id, courseId: course.id, name: 'Virtual Memory', examFrequency: 9 }
  })
  await prisma.subtopic.create({ data: { topicId: t3.id, name: 'Page Replacement Algorithms', importance: 'high', appearanceCount: 6, explanationText: 'Algorithms like LRU, FIFO, and Optimal for replacing pages in memory.' } })
  await prisma.subtopic.create({ data: { topicId: t3.id, name: 'Demand Paging', importance: 'medium', appearanceCount: 3, explanationText: 'Brings pages into memory only when they are requested.' } })

  const t4 = await prisma.topic.create({
    data: { chapterId: ch2.id, courseId: course.id, name: 'Paging & Segmentation', examFrequency: 5 }
  })
  await prisma.subtopic.create({ data: { topicId: t4.id, name: 'Page Tables', importance: 'medium', appearanceCount: 3, explanationText: 'Data structures used by the OS to map virtual addresses to physical addresses.' } })
  await prisma.subtopic.create({ data: { topicId: t4.id, name: 'TLB (Translation Lookaside Buffer)', importance: 'low', appearanceCount: 2, explanationText: 'Hardware cache for page tables to speed up translation.' } })

  // --- Chapter 3 Topics ---
  const t5 = await prisma.topic.create({
    data: { chapterId: ch3.id, courseId: course.id, name: 'Disk Scheduling', examFrequency: 7 }
  })
  await prisma.subtopic.create({ data: { topicId: t5.id, name: 'FCFS, SSTF, SCAN', importance: 'high', appearanceCount: 5, explanationText: 'Various algorithms to schedule disk I/O requests.' } })
  await prisma.subtopic.create({ data: { topicId: t5.id, name: 'C-SCAN, LOOK', importance: 'medium', appearanceCount: 2, explanationText: 'Variations of SCAN for more uniform wait times.' } })

  // 4. Create Student Performance (mix of strong and weak)
  await prisma.studentTopicPerformance.create({
    data: { studentId: student.id, topicId: t1.id, masteryPercent: 45 } // Weak: Deadlocks
  })
  await prisma.studentTopicPerformance.create({
    data: { studentId: student.id, topicId: t2.id, masteryPercent: 88 } // Strong: Semaphores
  })
  await prisma.studentTopicPerformance.create({
    data: { studentId: student.id, topicId: t3.id, masteryPercent: 30 } // Very Weak: Virtual Memory
  })
  await prisma.studentTopicPerformance.create({
    data: { studentId: student.id, topicId: t4.id, masteryPercent: 75 } // Good: Paging & Segmentation
  })
  await prisma.studentTopicPerformance.create({
    data: { studentId: student.id, topicId: t5.id, masteryPercent: 92 } // Strong: Disk Scheduling
  })

  // 5. Create Tutors
  const tutorStudent = await prisma.student.create({
    data: { rollNumber: '1803022', registrationNumber: '1803022', name: 'Farhan', department: 'CSE', batch: '18' }
  })
  const tutor = await prisma.tutorProfile.create({
    data: {
      studentId: tutorStudent.id,
      bio: 'Expert in OS and Networking. Happy to help out juniors!',
      topicsTags: JSON.stringify(['Deadlocks', 'Virtual Memory', 'Networking']),
      availabilitySlots: JSON.stringify(['Mon 4PM-5PM', 'Wed 6PM-7PM']),
      ratingAverage: 4.8,
      ratingCount: 24
    }
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
