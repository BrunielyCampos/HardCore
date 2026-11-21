import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ProdutoCarrinho } from './CarrinhoContext';
import { useAuth } from './AuthContext';

export type StatusEntrega = 'Confirmado' | 'Em rota' | 'Entregue' | 'Cancelado';

export interface Pedido {
  id: string;
  itens: ProdutoCarrinho[];
  valorTotal: number;
  status: StatusEntrega;
  estadoPagamento?: string;
  urlPagamento?: string;
  abacatePayCheckoutId?: string;
  motorista?: string;
  veiculo?: string;
  dataCriacao: Date;
}

interface PedidoBackendDTO {
  id: number;
  idCliente: number;
  valorCompra: number;
  dataCompra?: string;
  estado?: string;
  tipoPagamento?: string;
  estadoPagamento?: string;
  abacatePayCheckoutId?: string;
  urlPagamento?: string;
  idEntregador?: number | null;
}

interface PedidoContextData {
  pedidos: Pedido[];
  pedidoAtivo: Pedido | null;
  setPedidoAtivo: (pedido: Pedido | null) => void;
  criarPedido: (itens: ProdutoCarrinho[], valorTotal: number) => Promise<Pedido>;
  buscarPedidoBackend: (id: string) => Promise<Pedido | null>;
  atualizarEntrega: (id: string, motorista: string, veiculo: string, status: StatusEntrega) => void;
  obterPedido: (id: string) => Pedido | undefined;
}

const STORAGE_KEY = '@hardcore:pedido_ativo';

function mapearEstadoParaStatus(estado?: string): StatusEntrega {
  switch (estado) {
    case 'A_CAMINHO':
      return 'Em rota';
    case 'ENTREGUE':
      return 'Entregue';
    case 'COMPRA_CANCELADA':
      return 'Cancelado';
    default:
      return 'Confirmado';
  }
}

const PedidoContext = createContext<PedidoContextData>({} as PedidoContextData);

export function PedidoProvider({ children }: { children: ReactNode }) {
  const { token, usuario } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoAtivo, setPedidoAtivoState] = useState<Pedido | null>(() => {
    try {
      const salvo = sessionStorage.getItem(STORAGE_KEY);
      if (!salvo) return null;
      const parsed = JSON.parse(salvo);
      return {
        ...parsed,
        dataCriacao: parsed.dataCriacao ? new Date(parsed.dataCriacao) : new Date(),
      };
    } catch {
      return null;
    }
  });

  const setPedidoAtivo = useCallback((pedido: Pedido | null) => {
    setPedidoAtivoState(pedido);
    try {
      if (pedido) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pedido));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignora erro de storage
    }
  }, []);

  useEffect(() => {
    if (pedidoAtivo) {
      setPedidos((prev) => [pedidoAtivo, ...prev.filter((p) => p.id !== pedidoAtivo.id)]);
    }
  }, [pedidoAtivo]);

  const authHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [token]);

  const criarPedido = async (itens: ProdutoCarrinho[], valorTotal: number): Promise<Pedido> => {
    const idCliente = Number((usuario as any)?.id ?? (usuario as any)?.usuarioId);
    if (!idCliente || Number.isNaN(idCliente)) {
      throw new Error('Faça login antes de finalizar o pedido.');
    }

    const resPedido = await fetch('/api/pedidos/pedidos/criar', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        idCliente,
        valorCompra: Number(valorTotal.toFixed(2)),
        tipoPagamento: 'PIX',
      }),
    });

    if (!resPedido.ok) {
      const errText = await resPedido.text();
      throw new Error(errText || `Erro ao criar pedido (${resPedido.status}).`);
    }

    const pedidoCriado: PedidoBackendDTO = await resPedido.json();

    await Promise.all(
      itens.map((item) =>
        fetch('/api/pedidos/itens-pedido/salvar', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            idPedido: pedidoCriado.id,
            idProduto: Number(item.id),
            quantidade: item.quantidade,
            precoUnitario: Number(item.precoNumero.toFixed(2)),
          }),
        })
      )
    );

    const resCheckout = await fetch('/api/pedidos/pagamentos/checkout', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        pedidoId: pedidoCriado.id,
        itens: itens.map((item) => ({
          id: String(item.id),
          quantity: item.quantidade,
        })),
      }),
    });

    if (!resCheckout.ok) {
      const errCheckout = await resCheckout.text();
      throw new Error(errCheckout || 'Pedido criado, mas falhou ao gerar o Pix na AbacatePay.');
    }

    const dadosFinais: PedidoBackendDTO = await resCheckout.json();

    const novoPedido: Pedido = {
      id: String(dadosFinais.id),
      itens,
      valorTotal: dadosFinais.valorCompra ?? valorTotal,
      status: mapearEstadoParaStatus(dadosFinais.estado),
      estadoPagamento: dadosFinais.estadoPagamento,
      urlPagamento: dadosFinais.urlPagamento,
      abacatePayCheckoutId: dadosFinais.abacatePayCheckoutId,
      dataCriacao: dadosFinais.dataCompra ? new Date(dadosFinais.dataCompra) : new Date(),
    };

    setPedidoAtivo(novoPedido);
    setPedidos((prev) => [novoPedido, ...prev.filter((p) => p.id !== novoPedido.id)]);
    return novoPedido;
  };

  const buscarPedidoBackend = useCallback(
    async (id: string): Promise<Pedido | null> => {
      try {
        const res = await fetch(`/api/pedidos/pedidos/${id}`, {
          headers: authHeaders(),
        });
        if (!res.ok) return null;

        const dto: PedidoBackendDTO = await res.json();
        let atualizado: Pedido | null = null;

        setPedidos((prev) => {
          const existente = prev.find((p) => p.id === String(dto.id)) || pedidoAtivo;
          atualizado = {
            id: String(dto.id),
            itens: existente?.itens || [],
            valorTotal: dto.valorCompra,
            status: mapearEstadoParaStatus(dto.estado),
            estadoPagamento: dto.estadoPagamento,
            urlPagamento: dto.urlPagamento,
            abacatePayCheckoutId: dto.abacatePayCheckoutId,
            motorista: existente?.motorista,
            veiculo: existente?.veiculo,
            dataCriacao: dto.dataCompra ? new Date(dto.dataCompra) : new Date(),
          };
          return [atualizado, ...prev.filter((p) => p.id !== atualizado!.id)];
        });

        return atualizado;
      } catch (err) {
        console.error('Erro ao consultar pedido:', err);
        return null;
      }
    },
    [authHeaders, pedidoAtivo]
  );

  const atualizarEntrega = (id: string, motorista: string, veiculo: string, status: StatusEntrega) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, motorista, veiculo, status } : p))
    );
  };

  const obterPedido = (id: string) => {
    return pedidos.find((p) => p.id === id) || (pedidoAtivo?.id === id ? pedidoAtivo : undefined);
  };

  return (
    <PedidoContext.Provider
      value={{
        pedidos,
        pedidoAtivo,
        setPedidoAtivo,
        criarPedido,
        buscarPedidoBackend,
        atualizarEntrega,
        obterPedido,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
}

export const usePedidos = () => useContext(PedidoContext);