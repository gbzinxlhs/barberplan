import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-sm font-bold text-slate-900">
              B
            </div>
            <span className="text-xl font-bold text-white">BarberPlan</span>
          </div>
          <Link
            href="/admin"
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Acessar Painel
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Gestão inteligente para sua{" "}
            <span className="text-amber-500">barbearia</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Agendamento online, gestão de clientes, controle financeiro e lembretes
            automáticos via WhatsApp. Tudo que sua barbearia precisa em um só lugar.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/admin"
              className="bg-amber-500 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
            >
              Começar Agora
            </Link>
            <Link
              href="#funcionalidades"
              className="border border-slate-600 text-slate-300 px-8 py-3 rounded-lg font-semibold hover:border-slate-500 transition-colors"
            >
              Ver Funcionalidades
            </Link>
          </div>
        </section>

        <section id="funcionalidades" className="py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Tudo que sua barbearia precisa
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Agendamento Online",
                desc: "Clientes agendam direto pelo site. Escolhem barbeiro, serviço e horário.",
                icon: "📅",
              },
              {
                title: "Painel Administrativo",
                desc: "Controle total de agenda, barbeiros, serviços e clientes.",
                icon: "📊",
              },
              {
                title: "Lembretes via WhatsApp",
                desc: "Confirmação automática e lembrete antes do horário agendado.",
                icon: "💬",
              },
              {
                title: "Gestão Financeira",
                desc: "Relatórios de faturamento, comissões e despesas da barbearia.",
                icon: "💰",
              },
              {
                title: "Múltiplas Unidades",
                desc: "Gerencie várias barbearias em um único painel central.",
                icon: "🏢",
              },
              {
                title: "Catálogo de Serviços",
                desc: "Tabela de preços atualizada com duração de cada serviço.",
                icon: "✂️",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-colors"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 text-center border-t border-slate-700/50">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para digitalizar sua barbearia?
          </h2>
          <p className="text-slate-300 mb-8">
            Cadastre-se gratuitamente e comece a receber agendamentos online.
          </p>
          <Link
            href="/admin"
            className="bg-amber-500 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors inline-block"
          >
            Criar Conta Gratuita
          </Link>
        </section>
      </main>

      <footer className="border-t border-slate-700/50 py-8 text-center text-sm text-slate-500">
        <p>&copy; 2026 BarberPlan. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
