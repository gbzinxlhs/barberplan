import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.tenant.findUnique({ where: { slug: "brooklyn" } });
  if (existing) {
    console.log("Tenant 'brooklyn' já existe.");
    return;
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: "Brooklyn Barbearia Fortaleza",
      slug: "brooklyn",
      subdomain: "brooklyn",
      primaryColor: "#22c55e",
      phone: "(85) 3122-0659",
      whatsapp: "+5585982138203",
      address: "Rua Canuto de Aguiar, 1428 - Meireles, Fortaleza - CE",
      instagram: "@brooklynfortaleza",
    },
  });

  const barbers = await Promise.all([
    prisma.barber.create({ data: { name: "João", bio: "Especialista em cortes clássicos", tenantId: tenant.id } }),
    prisma.barber.create({ data: { name: "Carlos", bio: "Mestre em barboterapia", tenantId: tenant.id } }),
    prisma.barber.create({ data: { name: "Pedro", bio: "Especialista em degradê e cortes modernos", tenantId: tenant.id } }),
  ]);

  const services = await Promise.all([
    prisma.service.create({ data: { name: "Corte Degradê", price: 45, duration: 40, category: "corte", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Corte Tesoura", price: 50, duration: 45, category: "corte", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Barba Completa", price: 30, duration: 20, category: "barba", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Barboterapia", price: 55, duration: 40, category: "barba", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Corte + Barba", price: 65, duration: 60, category: "combos", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Corte + Sobrancelha", price: 65, duration: 60, category: "combos", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Corte + Barboterapia", price: 90, duration: 90, category: "combos", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Corte + Barba + Sobrancelha", price: 95, duration: 90, category: "combos", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Selagem", price: 60, duration: 45, category: "cabelo", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Hidratação", price: 100, duration: 90, category: "cabelo", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Limpeza de Pele", price: 50, duration: 30, category: "pele", tenantId: tenant.id } }),
    prisma.service.create({ data: { name: "Depilação Nasal", price: 15, duration: 15, category: "depilacao", tenantId: tenant.id } }),
  ]);

  const hours = await Promise.all(
    [1, 2, 3, 4, 5, 6].map((dow) =>
      prisma.workingHour.create({
        data: { dayOfWeek: dow, startTime: "09:00", endTime: "19:00", isWorkingDay: true, tenantId: tenant.id },
      })
    )
  );

  console.log(`Tenant '${tenant.name}' criado com ${barbers.length} barbeiros, ${services.length} serviços e ${hours.length} dias de horário.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
