import {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useProdutos } from './ProdutoContext';

export interface ProdutoCarrinho {
  id: string | number;
  itemCarrinhoId?: number;
  nome: string;
  imagem: string;
  precoString: string;
  precoNumero: number;
  quantidade: number;
}

interface CarrinhoBackendDTO {
  id: number;
  idCliente: number;
}

interface ItemCarrinhoBackendDTO {
  id: number;
  idCarrinho: number;
  idProduto: number;
  quantidade: number;
}

interface CarrinhoContextType {
  itens: ProdutoCarrinho[];
  carrinhoId: number | null;
  carregando: boolean;
  quantidadeCarrinho: number;
  valorTotal: number;
  adicionarAoCarrinho: (
    produto: Omit<ProdutoCarrinho, 'quantidade' | 'precoNumero'>
  ) => Promise<void>;
  alterarQuantidade: (id: string | number, delta: number) => Promise<void>;
  removerDoCarrinho: (id: string | number) => Promise<void>;
  limparCarrinho: () => Promise<void>;
  recarregarCarrinho: () => Promise<void>;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

const API_PEDIDOS = '/api/pedidos';

const formatarPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const { token, usuario } = useAuth();
  const { produtos } = useProdutos();

  const [carrinhoId, setCarrinhoId] = useState<number | null>(null);
  const [itens, setItens] = useState<ProdutoCarrinho[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);

  const authHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [token]);

  const obterOuCriarCarrinho = useCallback(async (): Promise<number | null> => {
    if (!token || !usuario?.usuarioId) return null;

    const resBusca = await fetch(
      `${API_PEDIDOS}/carrinho/cliente/${usuario.usuarioId}`,
      { headers: authHeaders() }
    );

    if (resBusca.ok) {
      const data: CarrinhoBackendDTO = await resBusca.json();
      setCarrinhoId(data.id);
      return data.id;
    }

    const resCriar = await fetch(`${API_PEDIDOS}/carrinho/criar`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ idCliente: usuario.usuarioId }),
    });

    if (resCriar.ok) {
      const criado: CarrinhoBackendDTO = await resCriar.json();
      setCarrinhoId(criado.id);
      return criado.id;
    }

    return null;
  }, [token, usuario, authHeaders]);

  const recarregarCarrinho = useCallback(async () => {
    if (!token || !usuario?.usuarioId) {
      setItens([]);
      setCarrinhoId(null);
      return;
    }

    setCarregando(true);
    try {
      const id = carrinhoId ?? (await obterOuCriarCarrinho());
      if (!id) return;

      const resItens = await fetch(
        `${API_PEDIDOS}/itens-carrinho/carrinho/${id}`,
        { headers: authHeaders() }
      );

      if (!resItens.ok) return;

      const listaBack: ItemCarrinhoBackendDTO[] = await resItens.json();

      const mapeados: ProdutoCarrinho[] = listaBack.map((item) => {
        const prod = produtos.find((p) => Number(p.id) === item.idProduto);
        const precoNumero = prod ? prod.precoPromocional ?? prod.precoVenda : 0;

        return {
          id: String(item.idProduto),
          itemCarrinhoId: item.id,
          nome: prod?.nome ?? `Produto #${item.idProduto}`,
          imagem:
            prod?.imagemPrincipal ??
            'https://placehold.co/400x400/1c1c1f/ffffff?text=HardCore',
          precoString: formatarPreco(precoNumero),
          precoNumero,
          quantidade: item.quantidade,
        };
      });

      setItens(mapeados);
    } catch (error) {
      console.error('Erro ao carregar carrinho do back-end:', error);
    } finally {
      setCarregando(false);
    }
  }, [token, usuario, carrinhoId, obterOuCriarCarrinho, authHeaders, produtos]);

  useEffect(() => {
    recarregarCarrinho();
  }, [recarregarCarrinho]);

  const adicionarAoCarrinho = useCallback(
    async (produto: Omit<ProdutoCarrinho, 'quantidade' | 'precoNumero'>) => {
      if (!token || !usuario?.usuarioId) return;

      const id = carrinhoId ?? (await obterOuCriarCarrinho());
      if (!id) return;

      const res = await fetch(`${API_PEDIDOS}/itens-carrinho/adicionar`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          idCarrinho: id,
          idProduto: Number(produto.id),
          quantidade: 1,
        }),
      });

      if (res.ok) {
        await recarregarCarrinho();
      }
    },
    [token, usuario, carrinhoId, obterOuCriarCarrinho, authHeaders, recarregarCarrinho]
  );

  const alterarQuantidade = useCallback(
    async (id: string | number, delta: number) => {
      const itemAtual = itens.find((i) => String(i.id) === String(id));
      if (!itemAtual || !carrinhoId) return;

      const novaQuantidade = Math.max(1, itemAtual.quantidade + delta);
      if (novaQuantidade === itemAtual.quantidade) return;

      if (itemAtual.itemCarrinhoId) {
        await fetch(`${API_PEDIDOS}/itens-carrinho/${itemAtual.itemCarrinhoId}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });
      }

      await fetch(`${API_PEDIDOS}/itens-carrinho/adicionar`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          idCarrinho: carrinhoId,
          idProduto: Number(itemAtual.id),
          quantidade: novaQuantidade,
        }),
      });

      await recarregarCarrinho();
    },
    [itens, carrinhoId, authHeaders, recarregarCarrinho]
  );

  const removerDoCarrinho = useCallback(
    async (id: string | number) => {
      const itemAtual = itens.find((i) => String(i.id) === String(id));
      if (!itemAtual?.itemCarrinhoId) return;

      const res = await fetch(
        `${API_PEDIDOS}/itens-carrinho/${itemAtual.itemCarrinhoId}`,
        {
          method: 'DELETE',
          headers: authHeaders(),
        }
      );

      if (res.ok) {
        setItens((prev) => prev.filter((item) => String(item.id) !== String(id)));
      }
    },
    [itens, authHeaders]
  );

  const limparCarrinho = useCallback(async () => {
    await Promise.all(
      itens
        .filter((i) => i.itemCarrinhoId)
        .map((i) =>
          fetch(`${API_PEDIDOS}/itens-carrinho/${i.itemCarrinhoId}`, {
            method: 'DELETE',
            headers: authHeaders(),
          })
        )
    );
    setItens([]);
  }, [itens, authHeaders]);

  const quantidadeCarrinho = useMemo(
    () => itens.reduce((acc, item) => acc + item.quantidade, 0),
    [itens]
  );

  const valorTotal = useMemo(
    () => itens.reduce((acc, item) => acc + item.precoNumero * item.quantidade, 0),
    [itens]
  );

  const value = useMemo(
    () => ({
      itens,
      carrinhoId,
      carregando,
      quantidadeCarrinho,
      valorTotal,
      adicionarAoCarrinho,
      alterarQuantidade,
      removerDoCarrinho,
      limparCarrinho,
      recarregarCarrinho,
    }),
    [
      itens,
      carrinhoId,
      carregando,
      quantidadeCarrinho,
      valorTotal,
      adicionarAoCarrinho,
      alterarQuantidade,
      removerDoCarrinho,
      limparCarrinho,
      recarregarCarrinho,
    ]
  );

  return (
    <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
}