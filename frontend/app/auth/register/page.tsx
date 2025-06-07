"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordInputInteractive } from "@/components/ui/password-input-interactive";

// Define validation schema using Zod
const formSchema = z
  .object({
    name: z.string().min(2, { message: "Imię musi mieć minium 2 znaki" }),
    surname: z
      .string()
      .min(2, { message: "Nazwisko musi mieć minium 2 znaki" }),
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

export default function RegisterPreview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Assuming an async registration function
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="flex min-h-[100vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm min-w-1/3">
        <CardHeader>
          <CardTitle className="text-2xl">Zarejestruj się</CardTitle>
          <CardDescription>
            Cześć! Uzupełnij poniższe informacje aby utworzyć nowe konto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name">Imię i Nazwisko</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Hasło</FormLabel>
                      <FormControl>
                        <PasswordInputInteractive
                          id="password"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Powtórz hasło
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Zarejestruj
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Masz już konto?{" "}
            <Link href="#" className="underline">
              Zaloguj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
