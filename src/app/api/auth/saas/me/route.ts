import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-saas";

export async function GET() {
  const auth = await getAuthUser();

  if (!auth) {
    return NextResponse.json({ user: null, tenant: null });
  }

  return NextResponse.json(auth);
}
