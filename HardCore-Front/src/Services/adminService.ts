export interface UsuarioAdminDTO {
  id: number;
  nome?: string;
  email: string;
  perfil: string;
  endereco?: string;
}

const BASE_URL = '/api/usuarios/admin';

function resolverToken(token?: string | null): string {
  const bruto = token ?? localStorage.getItem('hardcore_token') ?? '';
  return bruto.replace(/^Bearer\s+/i, '').trim();
}

function getHeaders(token?: string | null): HeadersInit {
  const jwt = resolverToken(token);
  return {
    'Content-Type': 'application/json',
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  };
}

async function tratarErro(res: Response, mensagemPadrao: string): Promise<never> {
  let detalhe = '';
  try {
    const texto = (await res.text()).trim();
    if (texto) detalhe = ` - ${texto}`;
  } catch {
    // ignora falha ao ler corpo vazio
  }
  throw new Error(`${mensagemPadrao} (${res.status})${detalhe}`);
}

export async function listarTodosUsuarios(token?: string | null): Promise<UsuarioAdminDTO[]> {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  if (!res.ok) await tratarErro(res, 'Erro ao listar usuários');
  return res.json();
}

export async function promoverParaGerente(
  id: number,
  token?: string | null
): Promise<UsuarioAdminDTO> {
  const res = await fetch(`${BASE_URL}/usuarios/${id}/promover-gerente`, {
    method: 'PATCH',
    headers: getHeaders(token),
  });
  if (!res.ok) await tratarErro(res, 'Erro ao promover usuário para gerente');
  return res.json();
}

export async function promoverParaEntregador(
  id: number,
  token?: string | null
): Promise<UsuarioAdminDTO> {
  const res = await fetch(`${BASE_URL}/usuarios/${id}/promover-entregador`, {
    method: 'PATCH',
    headers: getHeaders(token),
  });
  if (!res.ok) await tratarErro(res, 'Erro ao promover usuário para entregador');
  return res.json();
}