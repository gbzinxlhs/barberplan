import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberPlan - Agendamento para Barbearias",
  description: "Sistema completo de agendamento e gestão para barbearias",
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
