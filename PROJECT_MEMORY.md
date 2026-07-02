# BarberPlan — Memória do Projeto

## Identidade
- **O que é:** Micro SAAS de gestão para barbearias (agendamento online + admin)
- **Stack:** Next.js 16.2.9 (App Router + Turbopack) · Prisma 7.8 · PostgreSQL (Supabase) · Tailwind v4 · shadcn/ui
- **Deploy:** Vercel — `https://barberplan-nine.vercel.app`
- **Repositório:** local em `C:\Users\gabri\Downloads\paineis\barberplan`

---

## Arquitetura do Projeto

### Rotas (src/app/)
```
/                         → Landing page (pública, escura/clara alternada)
/[tenant]                 → Página pública da barbearia (SSR, dados do BD)
/[tenant]/agendar         → Booking flow (multi-step, client-side)
/admin                    → Dashboard (protegido — sem auth ainda)
/admin/agendamentos       → Lista de agendamentos com filtro de data
/admin/servicos           → CRUD de serviços
/admin/barbeiros          → CRUD de barbeiros
/admin/financeiro         → Relatórios financeiros
/admin/configuracoes      → Configurações da barbearia
/admin/cadastro           → Signup de novo tenant
/api/appointments         → GET (listar por tenant+data) / POST (criar)
/api/appointments/[id]    → PATCH (status) / DELETE
/api/tenants/[slug]       → GET (tenant + services + barbers)
```

### Middleware (src/middleware.ts)
- Rewrite de subdomínios para `/[subdomain]`
- Ignora `localhost` e `vercel.app` (não trata como tenant)
- Ignora rotas `/_next`, `/api`, `/admin`

### Banco (Prisma — schema.prisma)
```
Tenant ──→ User, Service, Barber, Customer, Appointment, Product, WorkingHour, Transaction
```
- `Tenant`: slug único, subdomain único, cor primária configurável
- `Appointment`: liga a Service, Barber, Customer via FK
- `Customer`: unique por `[phone, tenantId]`
- `WorkingHour`: unique por `[tenantId, dayOfWeek]`

### Infra
- **Prisma adapter:** `@prisma/adapter-pg` (connection string direta)
- **Singleton:** PrismaClient em `src/lib/prisma.ts` (globalThis pattern)
- **Ambiente:** `.env` com `DATABASE_URL` (password com `%3F` = `?` URL-encoded)

---

## Design System

### Cores
- **Background escuro:** `#09090b` (zinc-950)
- **Background claro:** `#ffffff` (white)
- **Primary:** `#22c55e` (emerald-500)
- **Superfícies:** `zinc-900` (card escuro), `zinc-50` (fundo claro admin)
- **Bordas:** `zinc-800` (escuro), `zinc-200` (claro)

### Tema (globals.css)
Variáveis CSS via `@theme inline` — `--color-background`, `--color-primary`, etc.
Usamos classes utilitárias do Tailwind (ex: `bg-zinc-950`, `text-zinc-900`) em vez de `bg-background/text-foreground` para ter controle explícito entre seções claras e escuras.

### Componentes de UI (shadcn/ui)
`src/components/ui/`: badge, button, card, input, label, select
- **Button:** `variant="outline"` / `variant="ghost"` / `variant="destructive"` + `size="sm"` / `size="icon"`
- **Card:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- **Select:** `<Select options={[...]} value={...} onChange={...} />`

### Ícones Decorativos (src/components/barber-icons.tsx)
8 SVGs inline com `fill="currentColor"`/`stroke="currentColor"`:
`BarberPole`, `BarberChair`, `ScissorsIcon`, `Comb`, `StraightRazor`, `Mustache`, `HairClipper`, `ShavingBrush`, `BadgePremium`, `Razor`

Usados como elementos decorativos com `opacity-[0.03]` a `opacity-[0.06]` espalhados pelas páginas.

### Utilitários (src/lib/utils.ts)
- `cn()` — clsx + tailwind-merge
- `formatCurrency(value)` — `R$ 1.234,56` (pt-BR, BRL)
- `formatDate(date)`, `formatTime(date)`

---

## Landing Page (src/app/page.tsx)

### Estrutura
1. **Header** — logo + "Acessar" + "Planos" (fundo branco)
2. **Hero** — escuro (zinc-950) com título + CTA + ilustração (ícones decorativos)
3. **Stats** — claro (white) com 3 cards (500+ barbearias, 10k+ agendamentos, 98% satisfação)
4. **Como Funciona** — escuro com 4 steps + mockup "Barbearia do Zé"
5. **Funcionalidades** — claro com grid 3x2 de features + ícones de barbearia
6. **Planos** — escuro com 3 plans (Starter R$49/R$499, Pro R$99/R$999, Enterprise R$199/R$1999)
7. **CTA Final** — claro
8. **Footer** — escuro

### Padrão de Seções
- Seções alternam entre `bg-zinc-950` (escuro) e `bg-white` (claro)
- Ícones decorativos em cada seção com `pointer-events-none`
- Botões CTA usam `bg-primary text-primary-foreground`
- Botões secundários usam `border border-zinc-700 text-zinc-300 hover:bg-zinc-800`

---

## Admin Panel

### Layout (src/app/admin/layout.tsx) — CRIADO NO REDESIGN
- Sidebar fixa `w-64` com fundo `zinc-950` e navegação vertical
- 6 itens: Dashboard, Agendamentos, Serviços, Barbeiros, Financeiro, Configurações
- Item ativo: `bg-primary/10 text-primary` + `ChevronRight`
- Header breadcrumb: "Brooklyn Barbearia Fortaleza / NomeDaPagina"
- Conteúdo: `ml-64` com padding `p-6`
- Decoração sutil: `BarberPole`, `Mustache` no canto da sidebar

### Páginas — Padrão de Design
- Todas usam `"use client"` com dados mock (exceção: cadastro faz POST real)
- Decoração: `BarberPole` + `Mustache` fixos com `opacity-[0.015]`
- Cabeçalho: título + subtítulo descritivo
- Cards: `bg-white rounded-xl border border-zinc-200 shadow-sm` com `hover:shadow-md hover:-translate-y-0.5`
- Botões: ícone + texto, tamanhos consistentes
- Tabelas: `bg-zinc-50` no header, `hover:bg-zinc-50` nas linhas

### Dashboard (src/app/admin/page.tsx)
- 4 SummaryCards: Calendar (blue), Clock (amber), CheckCircle2 (emerald), XCircle (red)
- `colorMap` resolve nome da cor para classes Tailwind (evita classes dinâmicas)
- Agenda de hoje: lista com hora, cliente, barbeiro, badge de status
- Skeleton loading (3 pulsando), estado vazio com ícone
- 4 Quick Links: Agendamentos, Serviços, Barbeiros, Financeiro

### Agendamentos (src/app/admin/agendamentos/page.tsx)
- Date picker com navegação `ChevronLeft`/`ChevronRight` e botão "Hoje"
- Barra de resumo: bolinhas coloridas com contagens
- Grid de appointments: horário (Clock), cliente (User + Phone), serviço (Scissors)
- Ações: Confirmar (emerald), Finalizar (emerald), Cancelar (red)
- Status badges: `bg-emerald-50 text-emerald-700` / `bg-amber-50` / `bg-red-50` / `bg-zinc-100`

### Serviços (src/app/admin/servicos/page.tsx)
- Tabela com scroll horizontal
- Categoria em badge `bg-zinc-100 rounded-full`
- Ativo/Inativo: botão toggle com badge verde/cinza + ícone Power
- Botão Editar com ícone Pencil
- Formulário inline (3 colunas: preço, duração, categoria select)

### Barbeiros (src/app/admin/barbeiros/page.tsx)
- Cards em grid `sm:grid-cols-2 lg:grid-cols-3`
- Avatar: iniciais do nome em círculo colorido (cores cíclicas)
- Bio truncada com `truncate`
- Ações: Editar (outline, full width), Ativar/Desativar (ghost, cor dinâmica)
- Card inativo: `opacity-50`

### Financeiro (src/app/admin/financeiro/page.tsx)
- 4 stats cards com indicador de crescimento (seta verde + percentual)
- Gráfico de barras horizontal (CSS puro, `style={{ width: '%' }}`) — serviços por faturamento
- Comissões por barbeiro com avatar inicial
- Transações recentes em tabela com badge de método
- `maxServiceTotal` usado para proporção das barras

### Configurações (src/app/admin/configuracoes/page.tsx)
- 3 cards: Informações, Horários, Comissão
- Ícones nos labels: Store, Phone, MapPin, Globe, Clock, Percent
- Inputs de horário com `focus:ring-2 focus:ring-zinc-900/10`
- Botão salvar com estado de sucesso: `bg-emerald-600` + `CheckCircle2`

### Cadastro (src/app/admin/cadastro/page.tsx) — NÃO USA O LAYOUT ADMIN
- Full-screen centrado, fundo `zinc-950`
- Card max-w-md com formulário de signup
- Slug formatado: `toLowerCase().replace(/[^a-z0-9-]/g, "")`
- POST para `/api/tenants` (rota que **não existe** — apenas GET em `[slug]`)
- Redireciona para `/admin?tenant={slug}`

---

## Fluxo de Agendamento (Público) — REDESIGNADO

### Página do Tenant `[tenant]/page.tsx` (SSR)
- Hero com branding: logo ou inicial, nome, endereço, links (tel, WhatsApp, Instagram)
- Serviços agrupados por categoria com badges de duração e preço destacado
- Equipe: cards com iniciais coloridas ou foto, bio
- Horários de funcionamento (lidos do `WorkingHour` no BD)
- Seção de localização/contato com ícones
- Footer com CTA "Agende seu Horário"
- Ícones decorativos de barbearia espalhados (`opacity-[0.06]`)
- Cor primária do tenant aplicada dinamicamente nos botões e destaques

### Página de Booking `[tenant]/agendar/page.tsx` (CSR)
- Multi-step: Serviço → Barbeiro → Data/Horário → Dados → Confirmação
- **Step 1:** Serviços com filtro por categoria (badges "Todos" + categorias) — cores dinâmicas
- **Step 2:** Barbeiros com avatar de iniciais, nome e bio
- **Step 3:** Calendário 14 dias + horários calculados dos `WorkingHours` do tenant (lidos via API)
  - Slots já agendados (não-cancelados) aparecem riscados e desabilitados (`bookedTimes`)
  - Fetch para `GET /api/appointments?tenant=&date=&barberId=`
- **Step 4:** Formulário nome/WhatsApp + resumo do agendamento (serviço, barbeiro, data, horário, valor)
- Spinner de loading com animação `animate-spin`
- Tela de sucesso com checkmark, resumo e botão "Novo Agendamento"
- Ícones decorativos (`BarberPole`, `Comb`) fixos no fundo

### API — `/api/tenants/[slug]` (modificada)
- Agora retorna também `workingHours` (WorkingHour[] ordenado por dayOfWeek)
- Usado pelo booking page para calcular horários disponíveis reais

### API — `GET /api/appointments` (modificada)
- Agora aceita `barberId` como query param para filtrar por barbeiro
- Filtra appointment com `status !== "cancelled"` para não mostrar slots cancelados como ocupados
- Usado pelo booking page para bloquear slots já preenchidos

---

## Pontos de Atenção / Issues Conhecidas

### 🚨 CRÍTICO
- **`/api/tenants` POST não existe** — a rota `[slug]` só implementa GET. A página de cadastro tenta POST em `/api/tenants` (sem slug), que retorna 404. Precisa criar `src/app/api/tenants/route.ts` com POST para criar tenant + usuário.
- **Login/auth não implementado** — next-auth instalado mas não configurado. Qualquer um acessa `/admin`.
- **Dados mock** — todas as páginas admin usam dados mock, não leem do banco (exceto agendamentos que faz fetch da API).

### 🟡 MÉDIO
- **Tenant slug hardcoded** — "brooklyn" está fixo nas URLs de fetch nos componentes admin.
- **Sem verificação de tenant no admin** — o layout assume "Brooklyn Barbearia Fortaleza" fixo.
- **`prisma.config.ts`** — existe na raiz mas não sabemos o conteúdo (gerado pelo Prisma 7).
- **Booking não valida conflito de horário real** — usa `status !== "cancelled"` para blocked slots, mas não considera buffer entre agendamentos.
- **Sem paginação na lista de serviços** — se houver muitos serviços, a página fica longa.

### 🟢 MELHORIAS FUTURAS
- Adicionar autenticação (next-auth com credentials provider)
- Criar rota `POST /api/tenants` para cadastro funcional
- Substituir dados mock por dados reais do banco nas páginas admin
- Pegar tenant slug dinamicamente (via header/middleware ou session)
- Adicionar loading states e error boundaries
- Adicionar confirmação visual nos CRUDs (toast/notificação)
- Responsividade mobile do admin (sidebar colapsável)
- Buffer entre agendamentos (ex: 15 min de folga)
- Página pública de confirmação/cancelamento para o cliente

---

## Comandos Úteis
```bash
npm run dev          # Desenvolvimento (localhost:3000)
npm run build        # Build de produção
npx prisma db push   # Sincronizar schema com banco
npx prisma generate  # Gerar Prisma Client
npx prisma studio    # UI do banco
vercel --prod --yes  # Deploy direto
```

## Arquivos Ignorados (não commitados)
- `.env` — contém DATABASE_URL (supabase)
- `node_modules/`, `.next/`
