import Link from "next/link";
import { getTenantBySlug } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) notFound();

  const services = await prisma.service.findMany({
    where: { tenantId: tenant.id, active: true },
    orderBy: { category: "asc" },
  });

  const barbers = await prisma.barber.findMany({
    where: { tenantId: tenant.id, active: true },
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      <header
        className="border-b"
        style={{ borderColor: `${tenant.primaryColor}33` }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: tenant.primaryColor }}
              >
                {tenant.name[0]}
              </div>
            )}
            <span className="text-xl font-bold text-white">{tenant.name}</span>
          </div>
          <Link
            href={`/${slug}/agendar`}
            className="text-white px-5 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            Agendar Horário
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {tenant.address && (
          <div className="text-center mb-12">
            <p className="text-zinc-400">{tenant.address}</p>
            {tenant.phone && <p className="text-zinc-400">{tenant.phone}</p>}
          </div>
        )}

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Nossos Serviços</h2>
          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-zinc-400 mt-1">{service.description}</p>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">{service.duration} min</p>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: tenant.primaryColor }}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(service.price)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {barbers.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Nossos Barbeiros</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-zinc-700 mx-auto mb-4 flex items-center justify-center text-2xl">
                    {barber.photo ? (
                      <img src={barber.photo} alt={barber.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      "💈"
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{barber.name}</h3>
                  {barber.bio && <p className="text-sm text-zinc-400 mt-1">{barber.bio}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <Link
            href={`/${slug}/agendar`}
            className="text-white px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 inline-block"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            Agende seu Horário
          </Link>
        </div>
      </main>
    </div>
  );
}
