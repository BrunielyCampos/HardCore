import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ProdutoCarrinho } from './CarrinhoContext';

export type StatusEntrega = 'Confirmado' | 'Em rota' | 'Entregue';

export interface Pedido {
  id: string;
  itens: ProdutoCarrinho[];
  valorTotal: number;
  status: StatusEntrega;
  motorista?: string;
  veiculo?: string;
  dataCriacao: Date;
}

interface PedidoContextData {
  pedidos: Pedido[];
  criarPedido: (itens: ProdutoCarrinho[], valorTotal: number) => string;
  atualizarEntrega: (id: string, motorista: string, veiculo: string, status: StatusEntrega) => void;
  obterPedido: (id: string) => Pedido | undefined;
}

const PedidoContext = createContext<PedidoContextData>({} as PedidoContextData);

export function PedidoProvider({ children }: { children: ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const criarPedido = (itens: ProdutoCarrinho[], valorTotal: number) => {
    const idNum = Math.floor(Math.random() * 90000) + 10000;
    const novoPedido: Pedido = {
      id: `HC-${idNum}`,
      itens,
      valorTotal,
      status: 'Confirmado',
      dataCriacao: new Date()
    };
    setPedidos((prev) => [...prev, novoPedido]);
    return novoPedido.id;
  };

  const atualizarEntrega = (id: string, motorista: string, veiculo: string, status: StatusEntrega) => {
    setPedidos((prev) => prev.map(p => 
      p.id === id ? { ...p, motorista, veiculo, status } : p
    ));
  };

  const obterPedido = (id: string) => {
    return pedidos.find(p => p.id === id);
  };

  return (
    <PedidoContext.Provider value={{ pedidos, criarPedido, atualizarEntrega, obterPedido }}>
      {children}
    </PedidoContext.Provider>
  );
}

export const usePedidos = () => useContext(PedidoContext);