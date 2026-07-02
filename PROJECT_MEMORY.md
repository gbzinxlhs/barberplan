# BarberPlan — Memória do Projeto

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
/admin                         → Dashboard admin (lê tenant do usuário logado)
/admin/agendamentos            → Todos agendamentos, ordem cronológica, sem filtro de data
/admin/servicos                → CRUD de serviços com toggle ativo + remover
/admin/barbeiros               → CRUD de barbeiros com toggle ativo
/admin/clientes                → Lista de todos SAAS users cadastrados
/admin/financeiro              → Relatórios financeiros (mock)
/admin/configuracoes           → Configurações da barbearia
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

### Vitrine `[tenant]/page.tsx` — Figaro Barbearia style
- Hero escuro "Os melhores serviços em barbearia" com logos SVG animados
- Serviços em cards de categoria com ícones (Scissors,User,Sparkles etc.)
- Cards de barbeiros com iniciais em círculo
- Horários de funcionamento e seção de contato com ícones
- CustomerStatus component (mostra login do cliente no header)

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
3. **Logado + Pago:** solicita CPF/CNPJ → gera Pix via Asaas → mostra QR Code
4. Webhook Asaas confirma pagamento → ativa plano

### Asaas Integration (src/lib/asaas.ts)
- `createCustomer`, `findCustomerByEmail`, `updateCustomer`, `createPixPayment`, `getPayment`
- API v3, endpoint sandbox/production via env
- Cliente existente é atualizado com CPF se necessário
- `POST /api/asaas/create-payment` — gera QR Code Pix
- `POST /api/asaas/webhook` — recebe confirmação, ativa plano

### Sessão
- **SAAS:** `saas_user` + `saas_tenant` no localStorage
- **Cliente (customer):** `customer_{tenantSlug}` no localStorage
- `SaasUserContext` + `useSaasUser()` hook (src/contexts/saas-user.tsx)

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

## Arquivos Ignorados
- `.env` — contém DATABASE_URL (supabase)
- `node_modules/`, `.next/`
