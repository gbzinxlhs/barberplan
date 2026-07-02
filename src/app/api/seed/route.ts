import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { Pool } = await import("pg");

    const url = process.env.DATABASE_URL || "";
    const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

    // test connection
    const testResult = await pool.query("SELECT 1 as connected");
    const testOk = testResult.rows[0].connected;

    // check if tenant exists
    const existing = await pool.query("SELECT id, name, slug FROM public.\"Tenant\" WHERE slug = $1", ["brooklyn"]);
    if (existing.rows.length > 0) {
      await pool.end();
      return NextResponse.json({ message: "Tenant 'brooklyn' já existe.", db_ok: testOk === 1 });
    }

    // create tenant
    const tenant = await pool.query(
      `INSERT INTO public."Tenant" (id, name, slug, subdomain, "primaryColor", phone, whatsapp, address, instagram, "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING id, name`,
      ["Brooklyn Barbearia Fortaleza", "brooklyn", "brooklyn", "#22c55e", "(85) 3122-0659", "+5585982138203", "Rua Canuto de Aguiar, 1428 - Meireles, Fortaleza - CE", "@brooklynfortaleza"]
    );
    const tenantId = tenant.rows[0].id;

    // create barbers
    const barberData = [
      ["João", "Especialista em cortes clássicos"],
      ["Carlos", "Mestre em barboterapia"],
      ["Pedro", "Especialista em degradê e cortes modernos"],
    ];
    for (const [name, bio] of barberData) {
      await pool.query(
        `INSERT INTO public."Barber" (id, name, bio, active, "tenantId", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, true, $3, NOW(), NOW())`,
        [name, bio, tenantId]
      );
    }

    // create services
    const serviceData: [string, number, number, string][] = [
      ["Corte Degradê", 45, 40, "corte"],
      ["Corte Tesoura", 50, 45, "corte"],
      ["Barba Completa", 30, 20, "barba"],
      ["Barboterapia", 55, 40, "barba"],
      ["Corte + Barba", 65, 60, "combos"],
      ["Corte + Sobrancelha", 65, 60, "combos"],
      ["Corte + Barboterapia", 90, 90, "combos"],
      ["Corte + Barba + Sobrancelha", 95, 90, "combos"],
      ["Selagem", 60, 45, "cabelo"],
      ["Hidratação", 100, 90, "cabelo"],
      ["Limpeza de Pele", 50, 30, "pele"],
      ["Depilação Nasal", 15, 15, "depilacao"],
    ];
    for (const [name, price, duration, category] of serviceData) {
      await pool.query(
        `INSERT INTO public."Service" (id, name, price, duration, category, active, "tenantId", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, true, $5, NOW(), NOW())`,
        [name, price, duration, category, tenantId]
      );
    }

    // create working hours
    for (const dow of [1, 2, 3, 4, 5, 6]) {
      await pool.query(
        `INSERT INTO public."WorkingHour" (id, "dayOfWeek", "startTime", "endTime", "isWorkingDay", "tenantId")
         VALUES (gen_random_uuid()::text, $1, $2, $3, true, $4)`,
        [dow, "09:00", "19:00", tenantId]
      );
    }

    await pool.end();

    return NextResponse.json({ message: "Tenant criado com sucesso!", db_ok: testOk === 1 });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || "Erro desconhecido",
      code: error?.code,
    }, { status: 500 });
  }
}
