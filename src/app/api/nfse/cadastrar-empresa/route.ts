import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";
import { cadastrarEmpresa, cadastrarCertificado } from "@/lib/gerando-nota-facil";
import { encrypt } from "@/lib/crypto";

export async function POST(request: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json();
  const { cnpj, inscricaoMunicipal, certificadoBase64, certificadoSenha, regimeTributario, serviceCode } = body;

  if (!cnpj || !inscricaoMunicipal || !certificadoBase64 || !certificadoSenha) {
    return NextResponse.json({ error: "Todos os campos fiscais são obrigatórios" }, { status: 400 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: auth.user.tenantId } });
  if (!tenant) return NextResponse.json({ error: "Tenant não encontrado" }, { status: 404 });

  try {
    // 1. Cadastrar empresa no GerandoNotaFacil (usa token dummy para criação)
    const tempToken = process.env.GNF_API_TOKEN || "";
    const empresaResult = await cadastrarEmpresa({
      token: tempToken,
      cnpj,
      inscricaoMunicipal,
      regimeTributario: regimeTributario || "simples_nacional",
      serviceCode: serviceCode || "17.02",
    });

    const empresaId = empresaResult?.data?.empresa_id || empresaResult?.empresa_id;
    const nfseToken = empresaResult?.data?.token || empresaResult?.token || tempToken;

    // 2. Cadastrar certificado A1
    if (empresaId && certificadoBase64 && certificadoSenha) {
      await cadastrarCertificado(nfseToken, empresaId, certificadoBase64, certificadoSenha);
    }

    // 3. Salvar dados no Tenant
    const updated = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        nfseEnabled: true,
        nfseCnpj: cnpj.replace(/\D/g, ""),
        nfseInscricaoMunicipal: inscricaoMunicipal,
        nfseCertificadoA1: encrypt(certificadoBase64),
        nfseCertificadoSenha: encrypt(certificadoSenha),
        nfseRegimeTributario: regimeTributario || "simples_nacional",
        nfseToken,
        nfseServiceCode: serviceCode || "17.02",
        nfseEmpresaId: empresaId,
      },
    });

    return NextResponse.json({ success: true, tenant: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao cadastrar empresa" }, { status: 500 });
  }
}
