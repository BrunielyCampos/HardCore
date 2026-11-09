import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

// Define como é o produto dentro do carrinho
export interface ProdutoCarrinho {
  id: string | number;
  nome: string;
  imagem: string;
  precoString: string;
  precoNumero: number;
  quantidade: number;
}

interface CarrinhoContextType {
  itens: ProdutoCarrinho[];
  quantidadeCarrinho: number;
  valorTotal: number;
  adicionarAoCarrinho: (produto: Omit<ProdutoCarrinho, 'quantidade' | 'precoNumero'>) => void;
  alterarQuantidade: (id: string | number, delta: number) => void;
  removerDoCarrinho: (id: string | number) => void;
  limparCarrinho: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

// Função para converter "R$ 1.199,99" em 1199.99 (número real para cálculo)
const converterPreco = (precoStr: string) => {
  const limpo = precoStr.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(limpo) || 0;
};

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ProdutoCarrinho[]>([]);

  const adicionarAoCarrinho = (produto: Omit<ProdutoCarrinho, 'quantidade' | 'precoNumero'>) => {
    setItens((prev) => {
      const itemExistente = prev.find((item) => item.id === produto.id);
      
      if (itemExistente) {
        // Se já tem no carrinho, soma +1 na quantidade
        return prev.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      
      // Se não tem, adiciona com quantidade 1 e preço numérico calculado
      return [...prev, { ...produto, quantidade: 1, precoNumero: converterPreco(produto.precoString) }];
    });
  };

  const alterarQuantidade = (id: string | number, delta: number) => {
    setItens((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const novaQuantidade = Math.max(1, item.quantidade + delta); // Nunca deixa ser menor que 1
          return { ...item, quantidade: novaQuantidade };
        }
        return item;
      })
    );
  };

  const removerDoCarrinho = (id: string | number) => {
    setItens((prev) => prev.filter((item) => item.id !== id));
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  // Cálculos automáticos para os cabeçalhos e resumo
  const quantidadeCarrinho = itens.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = itens.reduce((acc, item) => acc + (item.precoNumero * item.quantidade), 0);

  return (
    <CarrinhoContext.Provider 
      value={{ 
        itens, 
        quantidadeCarrinho, 
        valorTotal, 
        adicionarAoCarrinho, 
        alterarQuantidade, 
        removerDoCarrinho,
        limparCarrinho
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
}