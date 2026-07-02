import { NextResponse } from "next/server";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
  }

  return NextResponse.json({ user: payload });
}
