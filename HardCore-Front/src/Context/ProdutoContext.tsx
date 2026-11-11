import { createContext, useState, useContext, type ReactNode } from 'react';

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
}

interface ProdutoContextData {
  produtos: Produto[];
  adicionarProduto: (produto: Produto) => void;
  atualizarProduto: (id: string, produtoAtualizado: Produto) => void;
  removerProduto: (id: string) => void;
}

const ProdutoContext = createContext<ProdutoContextData>({} as ProdutoContextData);

export function ProdutoProvider({ children }: { children: ReactNode }) {
  // O estado começa VAZIO, como você pediu. Você vai cadastrar tudo!
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

export function useProdutos() {
  return useContext(ProdutoContext);
}