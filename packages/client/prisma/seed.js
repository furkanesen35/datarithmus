import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "furkanesen35@gmail.com";
  const password = await bcrypt.hash("Thereisspoon35.", 10); // Password: admin123
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password,
      isSuperuser: true,
      createdAt: new Date(),
    },
  });
  console.log("Superuser created: furkanesen35@gmail.com");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());