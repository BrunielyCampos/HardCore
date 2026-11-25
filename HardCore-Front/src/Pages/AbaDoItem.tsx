import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useCarrinho } from '../Context/CarrinhoContext';
import { useProdutos } from '../Context/ProdutoContext';
import { useAuth } from '../Context/AuthContext';

import bannerAnuncio from '../assets/HomeAsset/RodapeAnuncio.png';

interface AvaliacaoDTO {
  id: number;
  avaliacao: number;
  campoComentario?: string;
  produto_id: number;
  autorId?: number;
  autorTipo?: string;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? '#FFC107' : '#555555'}
    className="w-4 h-4"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function AbaDoItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isComprando, setIsComprando] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoDTO[]>([]);
  const { adicionarAoCarrinho } = useCarrinho();
  const { produtos, carregando } = useProdutos();
  const { isAuthenticated, usuario, token } = useAuth();

  const produto = produtos.find((p) => p.id === id);

  useEffect(() => {
    if (!id) return;

    const carregarAvaliacoes = async () => {
      try {
        const res = await fetch(`/api/produtos/avaliacoes/produtos/${id}/avaliacoes`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data: AvaliacaoDTO[] = await res.json();
          setAvaliacoes(data);
        }
      } catch (err) {
        console.error('Erro ao carregar avaliações do produto:', err);
      }
    };

    carregarAvaliacoes();
  }, [id, token]);

  if (carregando) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-black font-['Inter'] text-white">
        <HeaderSimples />
        <main className="flex flex-1 items-center justify-center pt-[140px]">
          <p className="text-xl italic text-white/70">Carregando produto...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-black font-['Inter'] text-white">
        <HeaderSimples />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 pt-[140px]">
          <p className="text-2xl font-bold">Produto não encontrado.</p>
          <Link to="/" className="rounded-[6px] bg-[#FF0000] px-6 py-3 font-bold text-white hover:bg-[#cc0000]">
            Voltar para a loja
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const mediaAvaliacoes = produto.mediaAvaliacoes ?? 0;
  const totalAvaliacoes = produto.totalAvaliacoes ?? 0;
  const estrelasPreenchidas = Math.round(mediaAvaliacoes);

  const precoFormatado = produto.precoVenda.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const topicosDescricao = produto.descricao
    ? produto.descricao.split(/\n|;/).map((s) => s.trim()).filter(Boolean)
    : [`Marca: ${produto.marca || 'HardCore'}`, `Categoria: ${produto.categoria}`, `SKU: ${produto.sku}`];

  const handleComprarAgora = async () => {
    if (!isAuthenticated || !usuario) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    await adicionarAoCarrinho({
      id: produto.id,
      nome: produto.nome,
      imagem: produto.imagemPrincipal,
      precoString: precoFormatado,
    });
    navigate('/carrinho');
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Inter']"
      style={{ backgroundImage: 'linear-gradient(180deg, rgba(158, 158, 158, 0.3) 0%, rgba(7, 7, 7, 0.3) 100%)' }}
    >
      <HeaderSimples />

      <main className="mx-auto flex w-full max-w-[1509px] flex-col relative pb-20 pt-[180px]">
        <div className="flex w-full gap-[25px] justify-center px-[40px]">
          <div
            className="flex h-[600px] w-[650px] items-center justify-center rounded-[6px] p-8"
            style={{ background: 'linear-gradient(180deg, #232020 0%, #464545 100%)' }}
          >
            <img
              src={produto.imagemPrincipal || 'https://placehold.co/420x420'}
              alt={produto.nome}
              className="w-[420px] h-[420px] object-contain drop-shadow-2xl"
            />
          </div>

          <div
            className="flex h-[600px] w-[450px] flex-col rounded-[6px] p-[30px] relative"
            style={{ background: 'linear-gradient(180deg, #232020 0%, #464545 100%)' }}
          >
            <h1 className="text-[22px] font-bold text-white leading-[1.2] mb-3">
              {produto.nome}
            </h1>
            <p className="text-[#FF0000] text-[16px] font-bold mb-4">
              Vendido por: Hardcore • {produto.marca || 'Original'}
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-2">
                {produto.secaoVitrine === 'Destaque' && (
                  <div className="flex h-[22px] w-fit items-center justify-center rounded-[52px] bg-[#FF0000] px-3">
                    <span className="text-[11px] font-bold text-white">EM DESTAQUE</span>
                  </div>
                )}
                <span className="text-[12px] text-white/70">
                  {produto.estoque > 0 ? `${produto.estoque} un. em estoque` : 'Produto esgotado'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <StarIcon key={num} filled={num <= estrelasPreenchidas} />
                  ))}
                </div>
                <span className="text-[13px] font-semibold text-white">
                  {mediaAvaliacoes.toFixed(1)}
                </span>
                <span className="text-[12px] text-white/60">
                  ({totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
                </span>
                <span className="text-[14px] text-white font-normal ml-1">
                  • {produto.categoria}
                </span>
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-[#00C016] text-[36px] font-bold leading-none">
                  R$ {precoFormatado}
                </span>
              </div>
              <span className="text-[10px] font-light text-white">
                à vista no boleto ou PIX, ou em até 10x de R$ {(produto.precoVenda / 10).toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="flex flex-col gap-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              <span className="text-[14px] font-semibold text-white mb-1">Sobre o produto:</span>
              <ul className="list-disc pl-4 flex flex-col gap-2">
                {topicosDescricao.map((item, index) => (
                  <li key={index} className="text-[13px] font-semibold text-white/90 leading-tight">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 w-full">
              <button
                onMouseDown={() => setIsComprando(true)}
                onMouseUp={() => setIsComprando(false)}
                onMouseLeave={() => setIsComprando(false)}
                onClick={handleComprarAgora}
                disabled={produto.estoque === 0}
                className={`
                  w-full h-[60px] rounded-[7px] bg-[#FF0000] text-white font-bold text-[20px]
                  transition-all duration-200 ease-in-out cursor-pointer
                  hover:bg-[#cc0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isComprando ? 'scale-[0.98] bg-[#aa0000]' : 'scale-100'}
                `}
              >
                {produto.estoque === 0 ? 'ESGOTADO' : 'COMPRAR AGORA'}
              </button>
            </div>
          </div>
        </div>

        {/* Avaliações dos Clientes */}
        <section className="mx-auto mt-12 w-full max-w-[1125px] px-[40px]">
          <div className="rounded-[8px] border border-[#2A0A0A] bg-[#181818] p-6">
            <div className="mb-4 flex items-center justify-between border-b border-[#2A0A0A] pb-3">
              <h2 className="font-['Iosevka_Charon'] text-[22px] font-bold text-white">
                AVALIAÇÕES DE CLIENTES
              </h2>
              <span className="text-[13px] text-white/60">
                Média {mediaAvaliacoes.toFixed(1)} / 5.0 ({totalAvaliacoes})
              </span>
            </div>

            {avaliacoes.length === 0 ? (
              <p className="text-[14px] italic text-white/60">
                Este produto ainda não possui avaliações.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {avaliacoes.map((av) => (
                  <div
                    key={av.id}
                    className="flex flex-col gap-1.5 rounded-[6px] border border-[#2A0A0A] bg-[#222222] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <StarIcon key={num} filled={num <= av.avaliacao} />
                        ))}
                        <span className="ml-2 text-[13px] font-bold text-white">
                          {av.avaliacao}.0
                        </span>
                      </div>
                      {av.autorId && (
                        <span className="text-[12px] text-white/50">
                          Cliente #{av.autorId}
                        </span>
                      )}
                    </div>
                    {av.campoComentario && (
                      <p className="text-[14px] text-white/85">{av.campoComentario}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-[40px] px-[40px] flex justify-center">
          <img src={bannerAnuncio} alt="Anúncio" className="w-[1125px] rounded-[10px] object-cover" />
        </section>
      </main>

      <Footer />
    </div>
  );
}