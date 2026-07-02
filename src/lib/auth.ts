import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-admin-secret-change-in-production";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "admin@barberplan.com";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "admin123";

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
