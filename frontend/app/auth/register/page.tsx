"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
import { signUpWithCredentials } from "@/lib/auth";
import { useAppDispatch } from "@/lib/store/hooks";
import { signUpSchema } from "@/lib/zod/auth";
import { makeRequest } from "@/utils/misc";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function RegisterPreview() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const session = useSession();

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      await makeRequest(
        signUpWithCredentials,
        [values, searchParams.get("callbackUrl") || undefined],
        dispatch
      );
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith("NEXT_REDIRECT")) await session.update();
      throw error;
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
            <Link href="/auth/login" className="underline">
              Zaloguj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
