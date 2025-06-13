"use server";

import { auth } from "@/auth";
import { encode } from "next-auth/jwt";

export async function invokeTransferWithJSON<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Func extends (...args: any[]) => Promise<any>
>(func: Func, data: string) {
  const args = JSON.parse(data) as Parameters<Func>;
  return JSON.stringify(await func(...args));
}

export async function invokeMakeBackendRequest(
  endpoint: string,
  method: "GET" | "POST" | "DEL" | "PUT" | "PATCH",
  requestDataJSON?: string
) {
  const jwt = await generateJwt();

  const config = {
    method,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${jwt}`,
    },
    body: requestDataJSON,
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}`,
      config
    );
    return { status: res.status, data: await res.json() };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateJwt() {
  const session = await auth();
  return await encode({
    secret: process.env.AUTH_SECRET || "",
    salt: "authjs.session-token",
    token: session?.user,
    maxAge: 30,
  });
}
