import { prisma } from "./lib/prisma.js";

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", JSON.stringify(users, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });