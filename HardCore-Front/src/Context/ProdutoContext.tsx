import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type SecaoVitrine = 'Destaque' | 'Oferta' | 'Nenhuma';
export type ClassificacaoAvaliacao = 'Mais curtido' | 'Menos curtido' | null;

export interface Produto {
  id: string;
  nome: string;
  marca?: string;
  sku: string;
  categoria: string;
  descricao: string;
  precoVenda: number;
  precoPromocional?: number;
  estoque: number;
  status: 'Publicado' | 'Rascunho' | 'Arquivado';
  imagemPrincipal: string;
  secaoVitrine: SecaoVitrine;
  mediaAvaliacoes?: number;
  totalAvaliacoes?: number;
  classificacaoAvaliacao?: ClassificacaoAvaliacao;
}

interface ProdutoBackendDTO {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  preco: number;
  imagemPrincipal?: string | null;
  idPrateleira?: number | null;
  mediaAvaliacoes?: number | null;
  totalAvaliacoes?: number | null;
}

interface EstoqueBackendDTO {
  id: number;
  quantidadeProduto: number;
  produto_id: number;
}

interface ProdutoMetaLocal {
  sku?: string;
  descricao?: string;
  precoPromocional?: number;
  status?: 'Publicado' | 'Rascunho' | 'Arquivado';
  secaoVitrine?: SecaoVitrine;
}

interface ProdutoContextData {
  produtos: Produto[];
  carregando: boolean;
  recarregarProdutos: () => Promise<void>;
  adicionarProduto: (produto: Produto) => Promise<void>;
  atualizarProduto: (id: string, produtoAtualizado: Produto) => Promise<void>;
  removerProduto: (id: string) => Promise<void>;
}

const META_STORAGE_KEY = 'hardcore_produtos_meta';

function lerMetadados(): Record<string, ProdutoMetaLocal> {
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function salvarMetadados(id: string, meta: ProdutoMetaLocal) {
  const atual = lerMetadados();
  atual[id] = { ...atual[id], ...meta };
  localStorage.setItem(META_STORAGE_KEY, JSON.stringify(atual));
}

function removerMetadados(id: string) {
  const atual = lerMetadados();
  delete atual[id];
  localStorage.setItem(META_STORAGE_KEY, JSON.stringify(atual));
}

function obterClassificacaoAvaliacao(
  media: number,
  total: number
): ClassificacaoAvaliacao {
  if (total <= 0) return null;
  return media >= 3 ? 'Mais curtido' : 'Menos curtido';
}

const ProdutoContext = createContext<ProdutoContextData>({} as ProdutoContextData);

export function ProdutoProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  const authHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [token]);

  const recarregarProdutos = useCallback(async () => {
    setCarregando(true);
    try {
      const [resProdutos, resEstoque] = await Promise.all([
        fetch('/api/produtos/produtos/listar', { headers: authHeaders() }),
        fetch('/api/produtos/estoque/listar', { headers: authHeaders() }),
      ]);

      if (!resProdutos.ok) {
        console.error('Erro ao listar produtos:', resProdutos.status);
        return;
      }

      const listaBack: ProdutoBackendDTO[] = await resProdutos.json();
      const listaEstoque: EstoqueBackendDTO[] = resEstoque.ok ? await resEstoque.json() : [];

      const mapaEstoque = new Map<number, number>();
      listaEstoque.forEach((e) => mapaEstoque.set(e.produto_id, e.quantidadeProduto));

      const metas = lerMetadados();

      const combinados: Produto[] = listaBack.map((p) => {
        const idStr = String(p.id);
        const meta = metas[idStr] || {};
        const mediaAvaliacoes = Number(p.mediaAvaliacoes ?? 0);
        const totalAvaliacoes = Number(p.totalAvaliacoes ?? 0);

        return {
          id: idStr,
          nome: p.nome,
          marca: p.marca || 'HardCore',
          categoria: p.categoria || 'Geral',
          precoVenda: Number(p.preco),
          estoque: mapaEstoque.get(p.id) ?? 0,
          sku: meta.sku || `HC-${p.id}`,
          descricao: meta.descricao || '',
          precoPromocional: meta.precoPromocional,
          status: meta.status || 'Publicado',
          imagemPrincipal: p.imagemPrincipal || 'https://placehold.co/400x400/1c1c1f/ffffff?text=HardCore',
          secaoVitrine: meta.secaoVitrine || 'Oferta',
          mediaAvaliacoes,
          totalAvaliacoes,
          classificacaoAvaliacao: obterClassificacaoAvaliacao(mediaAvaliacoes, totalAvaliacoes),
        };
      });

      setProdutos(combinados);
    } catch (error) {
      console.error('Falha ao conectar com o microsserviço de produtos:', error);
    } finally {
      setCarregando(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    recarregarProdutos();
  }, [recarregarProdutos]);

  const adicionarProduto = async (produto: Produto) => {
    const res = await fetch('/api/produtos/produtos/cadastrar', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        nome: produto.nome,
        marca: produto.marca || 'HardCore',
        categoria: produto.categoria || 'Geral',
        preco: produto.precoVenda,
        imagemPrincipal: produto.imagemPrincipal,
        idPrateleira: null,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Erro ao cadastrar produto (verifique se está logado como GERENTE).');
    }

    const criado: ProdutoBackendDTO = await res.json();
    const idReal = String(criado.id);

    await fetch('/api/produtos/estoque/cadastrar', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        quantidadeProduto: Math.max(0, produto.estoque || 0),
        produto_id: criado.id,
      }),
    });

    salvarMetadados(idReal, {
      sku: produto.sku || `HC-${criado.id}`,
      descricao: produto.descricao,
      precoPromocional: produto.precoPromocional,
      status: produto.status,
      secaoVitrine: produto.secaoVitrine,
    });

    await recarregarProdutos();
  };

  const atualizarProduto = async (id: string, produtoAtualizado: Produto) => {
    const res = await fetch(`/api/produtos/produtos/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        nome: produtoAtualizado.nome,
        marca: produtoAtualizado.marca || 'HardCore',
        categoria: produtoAtualizado.categoria || 'Geral',
        preco: produtoAtualizado.precoVenda,
        imagemPrincipal: produtoAtualizado.imagemPrincipal,
        idPrateleira: null,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Erro ao atualizar produto.');
    }

    await fetch(`/api/produtos/estoque/${id}/quantidade`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(Math.max(0, produtoAtualizado.estoque)),
    });

    salvarMetadados(id, {
      sku: produtoAtualizado.sku,
      descricao: produtoAtualizado.descricao,
      precoPromocional: produtoAtualizado.precoPromocional,
      status: produtoAtualizado.status,
      secaoVitrine: produtoAtualizado.secaoVitrine,
    });

    await recarregarProdutos();
  };

  const removerProduto = async (id: string) => {
    const res = await fetch(`/api/produtos/produtos/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Erro ao remover produto.');
    }

    removerMetadados(id);
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProdutoContext.Provider
      value={{
        produtos,
        carregando,
        recarregarProdutos,
        adicionarProduto,
        atualizarProduto,
        removerProduto,
      }}
    >
      {children}
    </ProdutoContext.Provider>
  );
}

export const useProdutos = () => useContext(ProdutoContext);