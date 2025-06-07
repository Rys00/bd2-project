"use server";

import { prisma } from "@/prisma";
import { User } from "@prisma/client";

export async function getUserById(id: User["id"]): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}

export async function getUserByEmail(
  email: User["email"]
): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}
