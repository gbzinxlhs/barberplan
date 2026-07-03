# BarberPlan — Memória do Projeto

## Estado Atual (última atualização: Jul 2026)

### Done
- **Cron job `/api/cron/appointments`** — auto-completa, auto-cancela no-show (30min), auto-cancela pending (15min), envia lembretes WhatsApp 1h antes (protegido por CRON_SECRET)
- **WhatsApp notifications** via Twilio (apenas plano Pro):
  - Confirmação pro cliente + aviso na barbearia ao criar agendamento
  - Notificação ao mudar status (confirmar/cancelar/finalizar)
  - Lembrete 1h antes (via cron)
  - Schema: `reminderSent` boolean no Appointment
- **Paginação nos agendamentos admin** — 20 por página, navegação Anterior/[1][2][3]/Próximo, ordenado do mais recente
- **Layout responsivo** — sidebars colapsam em mobile (hamburger + overlay), grids adaptativos, cards grouping nos agendamentos
- **JWT httpOnly cookie auth** (saas_token) — login/signup/logout com API routes, server-verified
- `requireOwner()` e `requireSuperAdmin()` guards para API routes
- Proteção JWT em todas API routes de admin (barbers, services, appointments, working-hours, tenants)
- Super Admin Panel com login JWT, listagem de tenants e delete com cascade transaction
- Working hours feature: default hours auto-criadas, editor per-day com toggle e time inputs
- Checkout/financeiro: create-payment cria tenant com slug automático, webhook lê JSON externalReference
- Financeiro page com dados reais (sem fake data), removida seção de comissão
- Landing page "Acessar" conditional no plano do usuário
- Página pública `/[tenant]` redesenhada estilo **Baker Street**:
  - Top bar (endereço + tel + redes), nav sticky, hero split 50/50 com foto default
  - Seções: serviços (cards por categoria), equipe, horários, contato, footer limpo
  - Foto hero: se barbearia tem logo → mostra logo, senão → foto Unsplash (Redd Francisco)
- "Clientes" removido da sidebar da barbearia (só super admin vê)

### In Progress
- (none)

### Blocked
- `POST /api/tenants` não existe — `/admin/cadastro` quebrado
- Twilio credentials não configuradas na Vercel — WhatsApp não dispara de fato

### Observações
- 10 barbearias no plano Starter rodam sem problemas no Supabase Free (limite 500MB, 2 conexões simultâneas)
- Para produção real com muitas barbearias, recomendar Supabase Pro (US$25/mês) para conexões ilimitadas

---

## Identidade
- **O que é:** Micro SAAS de gestão para barbearias (agendamento online + admin + multi-tenant)
- **Stack:** Next.js 16.2.9 (App Router + Turbopack) · Prisma 7.8 · PostgreSQL (Supabase) · Tailwind v4 · shadcn/ui
- **Deploy:** Vercel — `https://barberplan-nine.vercel.app`
- **Repositório:** `https://github.com/gbzinxlhs/barberplan.git`
- **Domínio:** Em `*.vercel.app` — middleware de subdomínio pronto para custom domain
- **Regra:** Toda alteração deve ser aprovada pelo usuário antes do deploy — sempre perguntar "Posso fazer o deploy?" antes de executar

---

## Arquitetura do Projeto

### Rotas (src/app/)
```
/                              → Landing page (Devskin-inspired, SaasUserProvider)
/[tenant]                      → Vitrine pública da barbearia (SSR, Figaro-style)
/[tenant]/agendar              → Booking flow (5-step: login→serviço→barbeiro→data/hora→confirmar)
/[tenant]/meus-agendamentos    → Histórico do cliente + cancelar + logout
/[tenant]/admin                → Dashboard da barbearia (tenant do URL)
/[tenant]/admin/agendamentos   → Agendamentos da barbearia
/[tenant]/admin/servicos       → CRUD de serviços
/[tenant]/admin/barbeiros      → CRUD de barbeiros
/[tenant]/admin/clientes       → Lista de SAAS users
/[tenant]/admin/financeiro     → Relatórios financeiros
/[tenant]/admin/configuracoes  → Configurações da barbearia
/admin                         → Redireciona para /{slug}/admin (do usuário logado)
/admin/agendamentos            → Redireciona para /{slug}/admin/agendamentos
/admin/cadastro                → Signup de novo tenant (quebra — POST em /api/tenents não existe)
/admin/setup                   → Setup pós-compra: nome, endereço, WhatsApp, Instagram
/checkout                      → Checkout com login inline + trial grátis ou Pix via Asaas
/api/appointments              → GET (listar por tenant+data+barberId) / POST (criar)
/api/appointments/[id]         → PATCH (status) / DELETE
/api/tenants/[slug]         → GET (tenant + services + barbers + workingHours) / PATCH (atualizar)
/api/tenants/check-slug     → GET (verifica disponibilidade de slug)
/api/services                  → GET (por tenant) / POST (criar)
/api/services/[id]             → PATCH / DELETE
/api/barbers                   → GET (por tenant) / POST (criar)
/api/barbers/[id]              → PATCH / DELETE
/api/customers/validate        → POST (login por name+phone)
/api/customers/[id]/appointments → GET (histórico do cliente)
/api/saas-users                → GET (by email, com tenant) / POST (criar/atualizar)
/api/saas-users/me             → GET (by email, com tenant — usado pelo refreshUser)
/api/saas-users/list           → GET (todos SAAS users com tenant — admin)
/api/saas-users/purchase       → POST (cria tenant se necessário, ativa plano)
/api/asaas/create-payment      → POST (cria Asaas customer + Pix payment)
/api/asaas/webhook             → POST (recebe confirmação de pagamento Asaas)
/api/seed                      → GET (popula tenant "brooklyn" com dados de exemplo)
/api/ping                      → GET (keep-alive para Supabase Free)
```

### Middleware (src/middleware.ts)
- Rewrite de subdomínios `[slug].seudominio.com` → `/[slug]`
- Ignora `/_next`, `/api`, `/admin`, `localhost`, `vercel.app`
- Precisa de custom domain para wildcard funcionar

### Banco (Prisma — schema.prisma)
```
Tenant ──→ SaasUser, Service, Barber, Customer, Appointment, WorkingHour
SaasUser ─→ Tenant (opcional)
```
- `Tenant`: slug único, dados da barbearia (name, address, phone, whatsapp, instagram)
- `SaasUser`: email único, name, surname, phone, plan, planExpiresAt, tenantId opcional
- `Appointment`: liga a Service, Barber, Customer, paymentMethod (PIX/DINHEIRO/CARTAO)
- `Customer`: unique por `[phone, tenantId]`, identificado por name+phone (login)
- `WorkingHour`: unique por `[tenantId, dayOfWeek]`

---

## Design System

### Cores
- **Background escuro:** `#09090b` (zinc-950)
- **Background claro:** `#ffffff` (white)
- **Primary:** `#22c55e` (emerald-500)
- **Superfícies:** `zinc-900` (card escuro), `zinc-50` (fundo claro admin)
- **Bordas:** `zinc-800` (escuro), `zinc-200` (claro)

### Tema (globals.css)
- Variáveis CSS via `@theme inline`
- Animações personalizadas: `animate-float`, `animate-sway`, `animate-spin-slow`, `animate-drift`, `animate-glow-pulse`

### Componentes de UI (shadcn/ui customizados)
- `Button`: outline usa `bg-white text-zinc-700` (corrigido — não `bg-background`)
- `Input`, `Label`, `Select`, `Badge`, `Card`

### Ícones Decorativos (src/components/barber-icons.tsx)
10 SVGs inline: `BarberPole`, `BarberChair`, `ScissorsIcon`, `Comb`, `StraightRazor`, `Mustache`, `HairClipper`, `ShavingBrush`, `BadgePremium`, `Razor`

### Utilitários (src/lib/utils.ts)
- `cn()`, `formatCurrency()`, `formatDate()`, `formatTime()`

---

## Páginas Públicas

### Landing Page (src/app/page.tsx) — Devskin-inspired
- Wrapped em `SaasUserProvider` + `HomeContent` (use client para FAQ)
- Seções alternam dark/light com badges de seção ("DESTAQUES", "ENTREGÁVEIS", etc.)
- Steps numerados (01-05), grid cards, FAQ accordion, planos com CTA para `/checkout`
- Botão "SaasLogin" no header (modal portal para criar/entrar)

### Vitrine `[tenant]/page.tsx` — Baker Street style
- Top bar com endereço + telefone + ícones sociais
- Nav sticky com logo, links (SERVIÇOS, HORÁRIOS, EQUIPE, LOCALIZAÇÃO) e CTA "AGENDAR HORÁRIO"
- Hero split 50/50: texto à esquerda "O estilo que você merece pertinho de você", foto/logo à direita
- Se serviços: cards por categoria com ícones temáticos (ScissorsIcon, Comb, BarberPole, etc.)
- Se barbeiros: cards com iniciais em círculo e nome
- Horários de funcionamento em tabela compacta (aberto/fechado com badge verde/cinza)
- Contato: grid 2 colunas com endereço, telefone, WhatsApp, Instagram
- Footer: logo + nome + redes + telefone + copyright
- Ícones decorativos flutuantes (BarberChair, BarberPole, Mustache, StraightRazor)
- **Hero image:** se `tenant.logo` existe → mostra logo; senão → foto Unsplash default (Redd Francisco)

### Booking `[tenant]/agendar/page.tsx`
- Step 0: login do cliente (nome + WhatsApp, salvo em localStorage como `customer_{tenantSlug}`)
- Step 1: serviço (filtro por categoria com badges)
- Step 2: barbeiro
- Step 3: calendário 14 dias + horários disponíveis (bloqueia slots ocupados via API)
- Step 4: confirmação com método de pagamento (Pix/Dinheiro/Cartão)
- Step 5: sucesso

### Meus Agendamentos `[tenant]/meus-agendamentos/page.tsx`
- Lista de agendamentos do cliente com status e ações (cancelar)
- Botão de logout

---

## Admin Panel

### Layout (src/app/admin/layout.tsx)
- Wrapped em `SaasUserProvider`
- Sidebar fixa `w-64` zinc-950 com navegação vertical
- 7 itens: Dashboard, Agendamentos, Serviços, Barbeiros, **Clientes**, Financeiro, Configurações
- Exibe nome do tenant + plano + botão "Sair" (logout do SaasUser)
- Breadcrumb no header com nome da barbearia dinâmico
- **Todas as páginas admin lêem tenant do `useSaasUser()` — sem "brooklyn" hardcoded**

### Dashboard (src/app/admin/page.tsx)
- Summary cards, agenda de hoje, quick links
- Lê appointments do tenant logado

### Agendamentos (src/app/admin/agendamentos/page.tsx)
- Todos agendamentos, todos status, ordem cronológica
- Ações: Confirmar, Finalizar, Cancelar

### Serviços (src/app/admin/servicos/page.tsx)
- CRUD completo: criar, editar, toggle ativo, **remover** (com confirmação)

### Barbeiros (src/app/admin/barbeiros/page.tsx)
- CRUD completo: criar, editar, toggle ativo

### Clientes (src/app/admin/clientes/page.tsx)
- Lista todos SAAS users com nome, email, telefone, plano, barbearia, expiração, cadastro
- Requer `GET /api/saas-users/list`

### Setup Pós-Compra (src/app/admin/setup/content.tsx)
- Formulário: nome da barbearia, **slug/URL personalizada**, endereço, telefone, WhatsApp, Instagram
- Validação de slug em tempo real (verifica disponibilidade via `/api/tenants/check-slug`)
- Ao salvar, exibe o link público da barbearia: `https://barberplan-nine.vercel.app/{slug}`
- Botão "Salvar e Continuar" → redireciona para serviços/barbeiros
- Requer `PATCH /api/tenants/[slug]`

---

## SAAS (Multi-tenant)

### Modelo SaasUser
- Cadastro: name, surname, email, phone
- Planos: `free`, `starter_trial`, `starter`, `pro`
- `planExpiresAt` controla validade
- `tenantId` opcional — vincula à barbearia criada

### Fluxo de Checkout (/checkout)
1. **Não logado:** mostra formulário de cadastro/login inline (POST `/api/saas-users`)
2. **Logado + Trial:** confirma → cria tenant + ativa 14 dias grátis → redireciona setup
3. **Logado + Pago:** solicita CPF/CNPJ → gera Pix via Asaas (já cria tenant) → mostra QR Code + botão "Configurar Barbearia"
4. Webhook Asaas confirma pagamento → ativa plano com plan+billing lidos do externalReference

### Asaas Integration (src/lib/asaas.ts)
- `createCustomer`, `findCustomerByEmail`, `updateCustomer`, `createPixPayment`, `getPayment`
- API v3, endpoint sandbox/production via env
- Cliente existente é atualizado com CPF se necessário
- `POST /api/asaas/create-payment` — gera QR Code Pix, cria tenant se necessário, retorna `tenantSlug`
- `POST /api/asaas/webhook` — recebe confirmação, parseia externalReference (JSON com userId/plan/billing), ativa plano com expiry correto

### Sessão
- **SAAS (admin):** JWT em httpOnly cookie `saas_token` — server-verified em toda API route
- **Super admin:** Bearer JWT em localStorage (`super_admin_token`)
- **Cliente (customer):** `customer_{tenantSlug}` no localStorage
- `SaasUserContext` + `useSaasUser()` hook (src/contexts/saas-user.tsx) — fetch user via `/api/auth/saas/me`
- API routes protegidas com `requireOwner(tenantId)` e `requireSuperAdmin()` (src/lib/api-auth.ts)

---

## Animações (globals.css)

```css
@keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
@keyframes sway       { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
@keyframes spin-slow  { to{transform:rotate(360deg)} }
@keyframes drift      { 0%,100%{transform:translate(0,0)} 25%{transform:translate(10px,-10px)} 50%{transform:translate(20px,0)} 75%{transform:translate(10px,10px)} }
@keyframes glow-pulse { 0%,100%{opacity:.3} 50%{opacity:.8} }
```

Aplicadas via `className="animate-float"` etc. nos ícones decorativos da vitrine.

---

## Configuração de Ambiente (Vercel)

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | Conexão Supabase (session pooler) |
| `ASAAS_API_KEY` | `$aact_hmlg_000M...` (sandbox) |
| `ASAAS_ENVIRONMENT` | `sandbox` |
| `SUPER_ADMIN_EMAIL` | Email do super admin (ex: `admin@barberplan.com`) |
| `SUPER_ADMIN_PASSWORD` | Senha do super admin (ex: `admin123`) |
| `JWT_SECRET` | Chave secreta JWT (trocar em produção) |
| `CRON_SECRET` | Chave secreta para `/api/cron/appointments` |
| `TWILIO_ACCOUNT_SID` | Conta Twilio (WhatsApp) — vazio = apenas log |
| `TWILIO_AUTH_TOKEN` | Token Twilio |
| `TWILIO_WHATSAPP_NUMBER` | Número WhatsApp Twilio |


---

## Super Admin Panel

### Rota
- `/super-admin` — Painel privado do super admin (dono da plataforma)
- `/super-admin/login` — Tela de login com JWT
- Futuramente mapeável para subdomínio `admin.barberplan.com` via middleware

### Autenticação
- **JWT-based** com `jsonwebtoken`
- Credenciais definidas em **env vars** (`SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`)
- Token armazenado em `localStorage` como `super_admin_token`
- Validade: 7 dias
- Contexto: `SuperAdminProvider` / `useSuperAdmin()` hook

### API Routes
| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/auth/super-admin/login` | POST | Login com email+senha, retorna JWT |
| `/api/auth/super-admin/me` | GET | Verifica token, retorna dados do admin |
| `/api/super-admin/tenants` | GET | Lista todos tenants com SAAS users (protegida) |

### Dashboard (src/app/super-admin/page.tsx)
- Cards de resumo: total barbearias, total SAAS users, planos ativos
- Tabela completa com:
  - Barbearia (nome + data de criação)
  - Subdomínio (link para vitrine)
  - Comprador (nome + iniciais)
  - Contato (email + telefone)
  - Plano (badge colorido: free/trial/starter/pro)
  - Data da compra
  - Data de expiração do plano
  - Status (ativo/expirado/grátis)

### Schema Changes (prisma/schema.prisma)
- `Tenant.domain` — String? @unique (para domínio customizado do cliente)
- `SaasUser.role` — String @default("user") (para identificar super_admin)

### Env Vars
| Variável | Descrição |
|----------|-----------|
| `SUPER_ADMIN_EMAIL` | Email do super admin |
| `SUPER_ADMIN_PASSWORD` | Senha do super admin |
| `JWT_SECRET` | Chave secreta para assinar JWT |

### Arquivos Criados
| Arquivo | Descrição |
|---------|-----------|
| `src/lib/auth.ts` | Utilitários JWT (sign, verify, getTokenFromHeader) |
| `src/contexts/super-admin.tsx` | Contexto React (login, logout, token management) |
| `src/app/api/auth/super-admin/login/route.ts` | API de login |
| `src/app/api/auth/super-admin/me/route.ts` | API de verificação de token |
| `src/app/api/super-admin/tenants/route.ts` | API de listagem de tenants |
| `src/app/super-admin/login/page.tsx` | Página de login |
| `src/app/super-admin/layout.tsx` | Layout com sidebar + proteção de rota |
| `src/app/super-admin/page.tsx` | Dashboard com tabela de clientes |

---

## Serviços Externos

| Serviço | URL | Uso |
|---------|-----|-----|
| **Supabase** | (via connection string) | Banco PostgreSQL Free |
| **Asaas Sandbox** | https://sandbox.asaas.com | Pagamentos Pix (testes) |
| **cron-job.org** | https://cron-job.org | Ping `/api/ping` a cada 10min (keep-alive) |
| **Vercel** | https://vercel.com/barb-plan/barberplan | Deploy e domínio |

---

## Pontos de Atenção

### 🚨 CRÍTICO
- **`/api/tenants` POST não existe** — a página `/admin/cadastro` tenta POST em `/api/tenants` (sem slug) que retorna 404. Precisa criar `src/app/api/tenants/route.ts`.
- **Sem proteção de admin** — qualquer um que acessar `/admin` vê dados. SaasUser login é apenas visual (localStorage), sem JWT/session real.
- **Asaas em sandbox** — Pix só funciona no sandbox. Para produção, trocar `ASAAS_ENVIRONMENT` para `production` e usar chave real.
- **Admin redirect anteriormente bugado:** `/admin/layout.tsx` redirecionava para `/` antes de verificar `/admin/setup` e `/admin/cadastro`. **FIX:** verificar setup/cadastro primeiro, aguardar `ready` state.
- **Webhook hardcodava plan="pro" e 1 ano de expiry:** `externalReference` agora é JSON `{userId, plan, billing}`, webhook lê plan e billing corretos.
- **create-payment não criava tenant:** agora cria tenant (slug automático) junto com o Pix, retorna `tenantSlug` para o checkout.

### 🟡 MÉDIO
- **`/admin/clients` lista TODOS os SAAS users sem restrição** — qualquer admin logado vê todos os clientes do sistema.
- **Prisma `createdAt` no SaasUser** — precisa verificar se o campo existe no schema (model tem `createdAt` e `updatedAt` com `@default(now())` e `@updatedAt`).
- **Booking não valida conflito de horário real** — usa `status !== "cancelled"` para blocked slots, mas não considera buffer entre agendamentos.

### 🟢 MELHORIAS FUTURAS
- Mapear `/super-admin` para subdomínio `admin.barberplan.com` no middleware (após configurar domínio customizado)
- Adicionar CRUD de tenants diretamente no super admin (criar/editar/excluir)
- Gráficos de receita total, conversão de trials, etc.
- Notificações de expiração de plano
- Autenticação real (JWT/cookies) para SAAS users e admin
- Criar rota `POST /api/tenants` para cadastro funcional
- `prisma db push` precisa rodar sempre que schema mudar no banco de produção
- Migrar de `vercel.app` para domínio próprio com wildcard DNS
- Adicionar paginação na lista de serviços e clientes
- Responsividade mobile do admin (sidebar colapsável)
- Buffer entre agendamentos (ex: 15 min de folga)
- Página pública de confirmação/cancelamento para o cliente
- Notificações via WhatsApp (lembrete de agendamento)

---

### Commit 8bd6fcc — "feat: pagination on admin appointments (20 per page)"
- GET /api/appointments agora suporta `page` e `pageSize`, retorna `total`, `totalPages`
- Admin agendamentos: 20 por página com navegação numerada
- Ordenação alterada para `startTime: "desc"` (mais recente primeiro)

### Commit 180d7a5 — "fix: responsive layout - collapsible sidebars, card grouping, grid fixes"
- Sidebar do admin (tenant + super admin) colapsa em mobile:
  - Botão hamburger no header, sidebar vira overlay com fundo escuro
  - Fecha ao clicar fora (backdrop) ou no X
  - `lg:ml-64` no main, `lg:translate-x-0` no aside
- Grids responsivos:
  - Serviços: `grid-cols-1 sm:grid-cols-3` (preço/duração/categoria)
  - Configurações: `grid-cols-1 sm:grid-cols-2` (telefone/WhatsApp)
  - Setup: `grid-cols-1 sm:grid-cols-2` (telefone/WhatsApp)
  - Checkout: `grid-cols-1 sm:grid-cols-2` (nome/sobrenome)
  - Landing page steps: `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5`
- Agendamentos admin: cada item vira card no mobile (borda, sombra, padding)
- Horários: inputs `w-24 sm:w-28`, day row `flex-wrap`
- Agendar: botões data `min-w-[56px] w-auto`, grade `grid-cols-3 sm:grid-cols-4 lg:grid-cols-5`

### Commit 62c4b02 — "feat: WhatsApp notifications only for Pro plan tenants"
- `sendWhatsAppIfPro()` — verifica se tenant tem SaasUser com `plan: "pro"` antes de enviar
- POST /api/appointments, PATCH /api/appointments/[id], cron: usam `sendWhatsAppIfPro`
- Planos free/starter: cron atualiza status mas não envia WhatsApp

### Commit 7ffdde9 — "feat: WhatsApp notifications on create/status-change/reminder via Twilio"
- `src/lib/whatsapp.ts` — envia via Twilio API REST (fetch), ou log quando não configurado
- `formatPhone()` — formata número para padrão internacional
- `formatDateTime()` — helper de data/hora
- POST /api/appointments: confirmação pro cliente + aviso pra barbearia
- PATCH /api/appointments/[id]: notifica cliente ao mudar status
- Cron: lembrete 1h antes (busca appointments com `reminderSent: false`)
- Schema: `Appointment.reminderSent` (Boolean, default false)

### Commit 51b2a37 — "feat: cron job for auto-updating appointment status"
- GET /api/cron/appointments (protegido por `Authorization: Bearer {CRON_SECRET}`)
- Regras:
  - `confirmed` + endTime passou → `completed`
  - `confirmed` + 30min sem check-in → `cancelled` (no-show)
  - `pending` + 15min passou → `cancelled`
- Configurar cron-job.org a cada 1 minuto

---

## Comandos Úteis
```bash
npm run dev                   # Desenvolvimento (localhost:3000)
npm run build                 # Build de produção
npx prisma db push            # Sincronizar schema com banco
npx prisma generate           # Gerar Prisma Client
npx prisma studio             # UI do banco
git add -A; git commit -m "..."; git push origin main
vercel deploy --prod          # Deploy na Vercel
vercel env add NOME prod      # Adicionar variável de ambiente
```

## Histórico de Commits / Linha do Tempo

### Commit 00c4624 — "feat: add Unsplash hero image as default, fallback to tenant logo"
- Hero da página pública agora mostra foto do Unsplash (Redd Francisco — cadeira + espelho) quando não há logo
- Se dono fizer upload do logo nas configs, substitui automaticamente
- Constante `HERO_DEFAULT_IMAGE` no topo do arquivo

### Commit 9cbddb4 — "feat: redesign tenant public page with Baker Street layout"
- Redesign completo da vitrine pública inspirado em bakerstreetbarbearia.com.br
- Top bar: endereço + telefone + Instagram/WhatsApp
- Nav sticky com links em MAIÚSCULO (SERVIÇOS, HORÁRIOS, EQUIPE, LOCALIZAÇÃO) + CTA "AGENDAR HORÁRIO"
- Hero split 50/50 com texto à esquerda e visual (logo ou placeholder) à direita
- Seções curtas separadas por bigode decorativo
- Serviços em cards por categoria com ícones SVG temáticos
- Barbeiros em cards com iniciais, horários em tabela compacta
- Footer limpo com logo, nome, redes e copyright
- Ícones decorativos flutuantes com animações CSS (float, sway, spin-slow, drift)

### Commit 645ee00 — "feat: super admin delete tenant with confirmation dialog"
- DELETE `/api/super-admin/tenants/[id]` com cascade transaction
- Confirmação visual (dialog) antes de deletar

### Commit 097000a — "feat: JWT httpOnly cookie auth for saas users, protected API routes"
- `src/lib/auth-saas.ts`: JWT sign/verify, cookie helpers
- `src/lib/api-auth.ts`: `requireOwner(tenantId)` e `requireSuperAdmin()` guards
- Routes: `/api/auth/saas/login`, `/signup`, `/logout`, `/me`
- `SaasUserProvider` agora busca user de `/api/auth/saas/me` (server-verified)
- `SaasLogin` component chama API de login/signup
- **Todas** API routes de admin protegidas com JWT + tenant ownership check (401/403)
- Logout do admin layout usa context `logout()` que chama API e limpa cookie

### Commit a9ec77e — "fix: remove clientes from barbershop sidebar, real data on financeiro, remove comissao"
- "Clientes" removido da sidebar da barbearia (só super admin)
- Financeiro com dados reais de appointments (sem nomes/valores falsos)
- Seção de comissão removida do financeiro

### Commit 9a44496 — "feat: working hours admin page, api, and auto-create on tenant creation"
- `src/lib/working-hours.ts` com `createDefaultWorkingHours(tenantId)`
- `GET/PUT /api/working-hours` (PUT protegido)
- Página `/[tenant]/admin/horarios` com toggle por dia + inputs de horário
- "Horários" adicionado à sidebar do admin
- Default hours (Seg-Sex 09-19, Sáb 09-17, Dom fechado) auto-criadas na criação do tenant
- `purchase/route.ts` e `create-payment/route.ts` chamam `createDefaultWorkingHours`

### Commit 9e5f6c0 (aproximado) — "fix: admin redirect order, auto-suggest slug on setup"
- Ordem de redirect: `/admin/setup` e `/admin/cadastro` verificados primeiro
- Setup auto-sugere slug do nome da barbearia; edições manuais desativam auto-suggest
- Setup salva slug no localStorage após PATCH

### Commit 5d8e3f2 (aproximado) — "feat: checkout creates tenant, webhook reads JSON externalReference"
- `create-payment` cria tenant (slug de name+surname), retorna `tenantSlug`
- `externalReference` mudou para JSON `{userId, plan, billing}`
- Webhook parseia externalReference, seta plan + expiry corretos (1 mês mensal, 1 ano anual)
- Checkout armazena tenantSlug no localStorage ao gerar Pix

### Commits iniciais — "feat: super admin panel, JWT login, tenant list"
- Rotas `/super-admin` e `/super-admin/login`
- JWT-based auth com `jsonwebtoken`
- API: login, me, list tenants
- Dashboard com cards de resumo + tabela completa
- Schema: `Tenant.domain`, `SaasUser.role`
- Arquivos: `src/lib/auth.ts`, `src/contexts/super-admin.tsx`

### Commits iniciais — Estrutura base do projeto
- Next.js 16 + App Router + Prisma + Supabase + Tailwind v4
- Landing page Devskin-inspired
- Booking flow 5 steps (login → serviço → barbeiro → data/hora → confirmar)
- Admin panel completo (dashboard, agendamentos, serviços, barbeiros, configurações)
- Checkout com trial grátis e Pix via Asaas
- Setup pós-compra com slug personalizado
- Meus agendamentos para cliente
- Middleware de subdomínio

---

## Arquivos Ignorados
- `.env` — contém DATABASE_URL (supabase)
- `node_modules/`, `.next/`
