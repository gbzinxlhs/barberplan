import { prisma } from "./prisma";

export async function getTenantByHost(host: string) {
  const subdomain = host.split(".")[0];
  if (subdomain === "localhost" || subdomain === "www" || subdomain === "app") {
    return null;
  }
  return prisma.tenant.findUnique({ where: { subdomain } });
}

export async function getTenantBySlug(slug: string) {
  return prisma.tenant.findUnique({ where: { slug } });
}
