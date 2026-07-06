import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

function getSecret(): Buffer {
  if (!process.env.CERTIFICATE_SECRET) {
    throw new Error("CERTIFICATE_SECRET environment variable is required");
  }
  return crypto.createHash("sha256").update(process.env.CERTIFICATE_SECRET).digest();
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = getSecret();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const key = getSecret();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
