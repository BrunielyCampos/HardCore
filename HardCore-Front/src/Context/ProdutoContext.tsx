import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

export type SecaoVitrine = 'Destaque' | 'Oferta' | 'Nenhuma';

export interface Produto {
  id: string;
  nome: string;
  sku: string;
  categoria: string;
  descricao: string;
  precoVenda: number;
  precoPromocional?: number;
  estoque: number;
  status: 'Publicado' | 'Rascunho' | 'Arquivado';
  imagemPrincipal: string;
  secaoVitrine: SecaoVitrine;
}

interface ProdutoContextData {
  produtos: Produto[];
  adicionarProduto: (produto: Produto) => void;
  atualizarProduto: (id: string, produtoAtualizado: Produto) => void;
  removerProduto: (id: string) => void;
}

const ProdutoContext = createContext<ProdutoContextData>({} as ProdutoContextData);

export function ProdutoProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const adicionarProduto = (produto: Produto) => {
    setProdutos((prev) => [...prev, produto]);
  };

  const atualizarProduto = (id: string, produtoAtualizado: Produto) => {
    setProdutos((prev) => prev.map((p) => (p.id === id ? produtoAtualizado : p)));
  };

  const removerProduto = (id: string) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProdutoContext.Provider value={{ produtos, adicionarProduto, atualizarProduto, removerProduto }}>
      {children}
    </ProdutoContext.Provider>
  );
}

export const useProdutos = () => useContext(ProdutoContext);