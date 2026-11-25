import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import { useAuth } from '../Context/AuthContext';

interface ProdutoCategoriaDTO {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  preco: number;
  imagemPrincipal?: string | null;
}

export default function Categoria() {
  const { categoria } = useParams<{ categoria: string }>();
  const categoriaDecodificada = categoria ? decodeURIComponent(categoria) : '';
  const { token } = useAuth();

  const [produtos, setProdutos] = useState<ProdutoCategoriaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!categoriaDecodificada) return;

    const buscar = async () => {
      setCarregando(true);
      setErro('');
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(
          `/api/produtos/produtos/categoria/${encodeURIComponent(categoriaDecodificada)}`,
          { headers }
        );

        if (!res.ok) {
          throw new Error(`Erro ao buscar categoria (${res.status})`);
        }

        const dados: ProdutoCategoriaDTO[] = await res.json();
        setProdutos(Array.isArray(dados) ? dados : []);
      } catch (e: any) {
        setErro(e.message || 'Não foi possível carregar os produtos desta categoria.');
        setProdutos([]);
      } finally {
        setCarregando(false);
      }
    };

    buscar();
  }, [categoriaDecodificada, token]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pt-[160px] pb-16 px-6">
      <HeaderSimples />

      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FF1F1F] font-semibold">
              Departamento
            </span>
            <h1 className="text-3xl font-bold mt-1">{categoriaDecodificada}</h1>
          </div>
          <Link
            to="/home"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            ← Voltar para a loja
          </Link>
        </div>

        {carregando ? (
          <p className="text-white/70">Carregando produtos...</p>
        ) : erro ? (
          <p className="text-red-400">{erro}</p>
        ) : produtos.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-[#151517] p-8 text-center">
            <p className="text-white/70">
              Nenhum produto encontrado na categoria <strong>{categoriaDecodificada}</strong>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <Link
                key={produto.id}
                to={`/produto/${produto.id}`}
                className="group rounded-lg border border-white/10 bg-[#151517] p-4 flex flex-col hover:border-[#FF1F1F] transition-colors"
              >
                <div className="h-[180px] w-full bg-[#1C1C1F] rounded flex items-center justify-center overflow-hidden mb-4">
                  <img
                    src={
                      produto.imagemPrincipal ||
                      'https://placehold.co/400x400/1c1c1f/ffffff?text=HardCore'
                    }
                    alt={produto.nome}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-xs text-white/50 uppercase">{produto.marca || 'HardCore'}</span>
                <h2 className="text-base font-semibold mt-1 line-clamp-2">{produto.nome}</h2>
                <span className="mt-auto pt-3 text-lg font-bold text-[#FF4444]">
                  {Number(produto.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}