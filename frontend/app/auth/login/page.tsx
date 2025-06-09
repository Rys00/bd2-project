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
import { signInWithCredentials } from "@/lib/auth";
import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { signInSchema } from "@/lib/zod/auth";
import { makeRequest } from "@/utils/misc";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPreview() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const session = useSession();

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      await makeRequest(signInWithCredentials, [
        values,
        searchParams.get("callbackUrl") || undefined,
      ]);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith("PWB_ERROR")) {
        if (message.split(";")[1] === "401")
          dispatch(
            addSnackbar({
              message: "Nieprawidłowe dane logowania!",
              type: "error",
            })
          );
        else dispatch(addSnackbar({ message, type: "error" }));
        return;
      }
      if (message.startsWith("NEXT_REDIRECT")) await session.update();
      throw error;
    }
  }

  return (
    <div className="flex flex-col min-h-[80vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm min-w-1/3">
        <CardHeader>
          <CardTitle className="text-2xl">Zaloguj się</CardTitle>
          <CardDescription>
            Wpisz swój adres email oraz hasło aby się zalogować.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Hasło</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Zaloguj się
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Nie masz konta?{" "}
            <Link href="/auth/register" className="underline">
              Zarejestruj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
