const BASE_URL = "https://hgnusnokkqfvasrkualk.supabase.co/functions/v1/api-nfse";

async function callApi(action: string, token: string, data: Record<string, any> = {}) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, ...data }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

export async function cadastrarEmpresa(data: {
  token: string;
  cnpj: string;
  inscricaoMunicipal: string;
  regimeTributario: string;
  serviceCode: string;
}) {
  return callApi("criar_empresa", data.token, {
    cnpj: data.cnpj.replace(/\D/g, ""),
    inscricao_municipal: data.inscricaoMunicipal,
    regime_tributario: data.regimeTributario,
    codigo_servico: data.serviceCode,
  });
}

export async function cadastrarCertificado(token: string, empresaId: string, certificadoBase64: string, senha: string) {
  return callApi("cadastrar_certificado", token, {
    empresa_id: empresaId,
    certificado: certificadoBase64,
    senha,
  });
}

export async function emitirNfse(data: {
  token: string;
  clienteNome: string;
  clienteDocumento: string;
  descricao: string;
  valor: number;
}) {
  return callApi("emitir_nfse", data.token, {
    valor: data.valor,
    cliente_nome: data.clienteNome,
    cliente_documento: data.clienteDocumento.replace(/\D/g, ""),
    descricao: data.descricao,
  });
}

export async function listarNfse(token: string) {
  return callApi("listar_notas", token);
}

export async function consultarNfse(token: string, notaId: string) {
  return callApi("consultar_nota", token, { nota_id: notaId });
}
