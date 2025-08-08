// packages/client/prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'furkanesen35@gmail.com';
  const password = await bcrypt.hash('Thereisspoon35.', 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password,
      username: 'furkanesen', // Required field
      isSuperuser: true,
      createdAt: new Date(),
    },
  });
  console.log('Superuser created: furkanesen35@gmail.com');

  // Create a sample feedback form
  const existingForm = await prisma.feedbackForm.findFirst({
    where: { title: 'Course Experience Feedback' }
  });
  
  if (!existingForm) {
    await prisma.feedbackForm.create({
      data: {
        title: 'Course Experience Feedback',
        questions: {
          create: [
            { question: 'How would you rate the overall course quality?' },
            { question: 'How satisfied are you with the instructor\'s teaching?' },
            { question: 'How well did the course meet your learning objectives?' },
            { question: 'How would you rate the course materials and resources?' },
            { question: 'How likely are you to recommend this course to others?' }
          ]
        }
      }
    });
    console.log('Sample feedback form created');
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
