import { getToken } from "next-auth/jwt";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, raw: true });
  if (!token) {
    return new Response("Unauthorized!", { status: 401 });
  }
  return new Response(token, { status: 200 });
}
