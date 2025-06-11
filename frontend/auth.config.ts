import { NextAuthConfig } from "next-auth";
import { Provider } from "next-auth/providers";

const providers: Provider[] = [];

export const authConfig = {
  providers: providers,
} satisfies NextAuthConfig;
