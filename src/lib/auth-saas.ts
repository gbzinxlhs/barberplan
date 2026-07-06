import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const JWT_SECRET = process.env.JWT_SECRET;

const COOKIE_NAME = "saas_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SaasTokenPayload {
  userId: string;
  email: string;
  tenantId: string | null;
  role: string;
}

export function signSaasToken(payload: SaasTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySaasToken(token: string): SaasTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SaasTokenPayload;
  } catch {
    return null;
  }
}

export async function getSaasTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

export function setSaasTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
}

export function clearSaasTokenCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAuthUser() {
  const token = await getSaasTokenFromCookies();
  if (!token) return null;

  const payload = verifySaasToken(token);
  if (!payload) return null;

  const user = await prisma.saasUser.findUnique({
    where: { id: payload.userId },
  });

  if (!user) return null;

  let tenant = null;
  if (user.tenantId) {
    tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      tenantId: user.tenantId,
      role: user.role,
    },
    tenant,
  };
}
