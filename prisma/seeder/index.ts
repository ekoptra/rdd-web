import prisma from "../../utils/db";
const md5 = require("md5");

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin PUPR",
      password: md5(process.env.ADMIN_PASSWORD),
      email: "admin@gmail.com"
    }
  });
}

main()
  .then(async () => console.log("Seeding success!"))
  .catch(async (e) => {
    console.log(e);
    process.exit(1);
  });
