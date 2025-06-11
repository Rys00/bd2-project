import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Imię musi mieć minium 2 znaki" }),
    email: z.string().email({ message: "Nieprawidłowy adres e-mail" }),
    password: z
      .string()
      .min(8, { message: "Hasło musi mieć minimum 8 znaków" })
      .regex(/[0-9]/, { message: "Hasło musi mieć co najmniej 1 cyfra" })
      .regex(/[a-z]/, {
        message: "Hasło musi mieć co najmniej jedną małą literę",
      })
      .regex(/[A-Z]/, {
        message: "Hasło musi mieć co najmniej jedna dużą literę",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
