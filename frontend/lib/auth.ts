"use server";

import { signIn } from "@/auth";
import {
  badData,
  badDataFromZodError,
  unauthorized,
  verifyPassword,
} from "@/utils/misc";
import { CredentialsSignin } from "next-auth";
import { ZodError } from "zod";
import {
  createUserWithEmailNameAndPassword,
  getUserWithPasswordHashByEmail,
} from "./db/users.server-only";
import { signInSchema, signUpSchema } from "./zod/auth";

export async function signInWithCredentials(
  data: {
    email: string;
    password: string;
  },
  callbackUrl?: string
) {
  try {
    const { email, password } = await signInSchema.parseAsync(data);
    console.log(email, password);

    const user = await getUserWithPasswordHashByEmail(email);
    if (!user || !user.passwordHash)
      // || !user.emailVerified)
      return unauthorized();
    const result = await verifyPassword(
      password,
      Buffer.from(user.passwordHash.hash, "base64")
    );
    if (!result) return unauthorized();
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || "/dashboard",
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      if (error.type === "CredentialsSignin" && error.code === "credentials") {
        return unauthorized();
      }
    }
    if (error instanceof ZodError) return badDataFromZodError(error);
    throw error;
  }
}

export async function signUpWithCredentials(
  data: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  },
  callbackUrl?: string
) {
  try {
    const { email, name, password, confirmPassword } =
      await signUpSchema.parseAsync(data);
    if (password !== confirmPassword)
      return badData("Passwords did not match!");
    try {
      await createUserWithEmailNameAndPassword(email, name, password);
      await signInWithCredentials({ email, password }, callbackUrl);
      // redirect(`/auth/verify/${user.id}?callbackUrl${callbackUrl}`);
    } catch (error) {
      console.log(error);

      if ((error as Error).message.startsWith("NEXT_REDIRECT")) throw error;
      return badData("User with this email already exists!");
    }
  } catch (error) {
    if (error instanceof ZodError) return badDataFromZodError(error);
    throw error;
  }
}
