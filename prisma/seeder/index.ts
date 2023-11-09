import { PrismaClient } from "@prisma/client";

const md5 = require("md5");

async function main() {
  const prisma = new PrismaClient();

  try {
    await prisma.user.upsert({
      where: { email: "admin@gmail.com" },
      update: {},
      create: {
        name: "Admin PUPR",
        password: md5(process.env.ADMIN_PASSWORD),
        email: "admin@gmail.com"
      }
    });
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => console.log("Seeding success!"))
  .catch(async (e) => {
    console.log(e);
    process.exit(1);
  });
