import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
if (!process.env.SUPER_ADMIN_EMAIL) {
  throw new Error("SUPER_ADMIN_EMAIL environment variable is required");
}
if (!process.env.SUPER_ADMIN_PASSWORD) {
  throw new Error("SUPER_ADMIN_PASSWORD environment variable is required");
}

const JWT_SECRET = process.env.JWT_SECRET;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

export function getSuperAdminCredentials() {
  return { email: SUPER_ADMIN_EMAIL, password: SUPER_ADMIN_PASSWORD };
}

export function signToken(payload: { email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string; role: string };
  } catch {
    return null;
  }
}

export function getTokenFromHeader(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}
