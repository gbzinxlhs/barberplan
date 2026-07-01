import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberPlan - Gestão Inteligente para Barbearias",
  description:
    "Agendamento online, gestão de clientes, controle financeiro e lembretes via WhatsApp para sua barbearia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
