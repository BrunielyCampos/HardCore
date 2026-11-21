export type EstadoEntrega = 'EM_ENTREGA' | 'ENTREGA_FEITA' | 'CANCELADA' | string;

export interface EntregaRequestDTO {
  idPedido: number;
  idEntregador: number;
  enderecoDestino: string;
}

export interface EntregaResponseDTO {
  id: number;
  idPedido: number;
  idEntregador: number;
  enderecoDestino: string;
  estadoEntrega: EstadoEntrega;
  confirmacaoCliente: boolean | null;
}

export interface EntregadorDTO {
  id: number;
  nome?: string;
  email: string;
  perfil: string;
}

const BASE_URL = '/api/entrega/entregas';

export function obterTokenLocal(): string {
  const tokenDireto =
    localStorage.getItem('token') ||
    localStorage.getItem('jwt') ||
    localStorage.getItem('authToken');

  if (tokenDireto) return tokenDireto;

  try {
    const usuarioRaw = localStorage.getItem('usuario') || localStorage.getItem('user');
    if (usuarioRaw) {
      const parsed = JSON.parse(usuarioRaw);
      if (parsed?.token) return parsed.token;
    }
  } catch {
    // Ignora erro de parse
  }

  return '';
}

export function obterIdUsuarioLocal(): number | null {
  try {
    const usuarioRaw = localStorage.getItem('usuario') || localStorage.getItem('user');
    if (usuarioRaw) {
      const parsed = JSON.parse(usuarioRaw);
      if (parsed?.id) return Number(parsed.id);
    }
  } catch {
    // Ignora erro de parse
  }
  return null;
}

function getHeaders(token?: string | null): HeadersInit {
  const jwt = token || obterTokenLocal();
  return {
    'Content-Type': 'application/json',
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  };
}

async function tratarErro(res: Response, mensagemPadrao: string): Promise<never> {
  let detalhe = '';
  try {
    const texto = await res.text();
    if (texto) detalhe = ` - ${texto}`;
  } catch {
    // Ignora erro ao ler corpo
  }
  throw new Error(`${mensagemPadrao} (${res.status})${detalhe}`);
}

export async function atribuirEntrega(
  dados: EntregaRequestDTO,
  token?: string | null
): Promise<EntregaResponseDTO> {
  const res = await fetch(`${BASE_URL}/atribuir`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(dados),
  });
  if (!res.ok) await tratarErro(res, 'Erro ao atribuir entrega');
  return res.json();
}

export async function buscarEntregaPorPedido(
  idPedido: number | string,
  token?: string | null
): Promise<EntregaResponseDTO | null> {
  const res = await fetch(`${BASE_URL}/pedido/${idPedido}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  if (res.status === 404) return null;
  if (!res.ok) await tratarErro(res, 'Erro ao buscar entrega do pedido');
  return res.json();
}

export async function buscarEntregasPorEntregador(
  idEntregador: number | string,
  token?: string | null
): Promise<EntregaResponseDTO[]> {
  const res = await fetch(`${BASE_URL}/entregador/${idEntregador}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  if (!res.ok) await tratarErro(res, 'Erro ao buscar entregas do entregador');
  return res.json();
}

export async function notificarEntregaEfetuada(
  idEntrega: number,
  token?: string | null
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${idEntrega}/notificar-efetuada`, {
    method: 'PATCH',
    headers: getHeaders(token),
  });
  if (!res.ok) await tratarErro(res, 'Erro ao notificar entrega efetuada');
}

export async function confirmarRecebimento(
  idEntrega: number,
  recebeu: boolean,
  token?: string | null
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/${idEntrega}/confirmar-recebimento?recebeu=${recebeu}`,
    {
      method: 'PATCH',
      headers: getHeaders(token),
    }
  );
  if (!res.ok) await tratarErro(res, 'Erro ao confirmar recebimento');
}

export async function cancelarEntrega(
  idEntrega: number,
  token?: string | null
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${idEntrega}/cancelar`, {
    method: 'PATCH',
    headers: getHeaders(token),
  });
  if (!res.ok) await tratarErro(res, 'Erro ao cancelar entrega');
}

export async function listarEntregadores(
  token?: string | null
): Promise<EntregadorDTO[]> {
  const res = await fetch('/api/usuarios/usuarios/entregadores', {
    method: 'GET',
    headers: getHeaders(token),
  });
  if (!res.ok) await tratarErro(res, 'Erro ao listar entregadores');
  return res.json();
}