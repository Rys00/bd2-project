import { prisma } from "@/prisma";
import { USERS_DATA } from "./users";

async function initData() {
  await Promise.all(
    (
      await USERS_DATA
    ).map(
      async (data) =>
        await prisma.user.upsert({
          where: { email: data.email },
          update: data,
          create: data,
        })
    )
  );
  console.log("SEED: Users upsert completed successfully");
}

initData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
