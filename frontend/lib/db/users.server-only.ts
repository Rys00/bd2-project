import { prisma } from "@/prisma";
import { hashPassword } from "@/utils/misc";
import { User } from "@prisma/client";
import "server-only";

export async function getUserWithPasswordHashByEmail(email: User["email"]) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
    include: {
      passwordHash: true,
    },
  });
}

export async function createUserWithEmailNameAndPassword(
  email: User["email"],
  name: string,
  password: string
) {
  const hash = (await hashPassword(password)).toString("base64");
  console.log(hash);
  return await prisma.user.create({
    data: {
      name: name,
      email: email,
      passwordHash: {
        create: {
          hash: hash,
        },
      },
      is_superuser: false,
      is_active: true,
      is_cashier: true,
      is_staff: false,
      password: "",
    },
  });
}
