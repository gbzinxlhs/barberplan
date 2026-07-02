# Preços BarberPlan

## Mercado de SaaS para Barbearia (Brasil, 2026)

| Concorrente | Básico | Intermediário | Premium |
|---|---|---|---|
| AgendPro | R$29 | R$79 | R$189 |
| BarberCode | R$72 | R$90 | R$126 |
| HubBarber | R$58 | R$80 | R$130 |
| Calendarius | R$30 | R$80 | R$150 |
| BarberPro | R$40 | R$64 | R$104-237 |

**Internacional (USD):** SQUIRE $30-250 | SHIFT $29-79 | Barber-OS $29-89 | Twizzlo $29.99

**Público médio** (1.000+ seguidores) paga entre **R$60-130/mês** (fonte: BarbUp).

---

## Custos de Infraestrutura (multi-tenant)

| Item | Custo/mês |
|---|---|
| Vercel Pro | ~R$110 ($20) |
| Supabase Pro | ~R$140 ($25) |
| Domínios (.com.br) | ~R$4/domínio |
| **Total fixo** (todos clientes) | **~R$250/mês** |
| Custo marginal Starter | ~R$0 |
| Custo marginal Pro | ~R$4 (domínio) |

---

## Planos Recomendados

### 🟢 Starter — R$49/mês

- Subdomínio `sua-barbearia.barberplan.vercel.app`
- Agendamento online com 5 etapas (serviço > barbeiro > data > pagamento > confirmação)
- Painel admin completo (dashboard, agendamentos, serviços, barbeiros, financeiro)
- Métodos de pagamento: Pix, Dinheiro, Cartão
- Histórico do cliente + login por nome/WhatsApp
- Cancelamento pelo cliente
- 1 barbearia, até 3 barbeiros

### 🔵 Pro — R$97/mês

- Domínio próprio (`sua-barbearia.com.br`)
- Layout único personalizado (cores, fontes, identidade visual da barbearia)
- **2 atualizações/mês no layout** (ajustes de design)
- Barbeiros ilimitados
- Relatórios financeiros avançados
- Suporte prioritário

---

## Lógica Financeira

**Break-even:** 5 clientes Starter (5 × R$49 = R$245) cobrem a infraestrutura.

**Margem Pro:** R$97 - R$4 (domínio) - ~R$60 (2h de design/ desenvolvedor) = **~R$33 de margem líquida** por cliente.

**Margem Starter:** R$49 - R$0 = **R$49 de margem líquida** por cliente.

## Próximos Passos

1. Decidir entre **mensalidade fixa** (recomendado) vs **taxa por agendamento**
2. Oferecer **teste grátis de 14 dias** (padrão do mercado)
3. Desconto de **10-20% no plano anual**
4. Adicionar plano **Enterprise (R$149+)** para franquias multi-unidades depois
