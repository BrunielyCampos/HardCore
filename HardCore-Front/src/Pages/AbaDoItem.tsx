import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useCarrinho } from '../Context/CarrinhoContext'; 

import processadorImg from '../Componentes/CaixaProdutos/CaixaProdutosAssets/FotoProduto.png';
import bannerAnuncio from '../assets/HomeAsset/RodapeAnuncio.png'; 

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFC107" className="w-4 h-4">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
);

export default function AbaDoItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isComprando, setIsComprando] = useState(false);
  const { adicionarAoCarrinho } = useCarrinho(); 

  const produto = {
    nome: "Processador AMD Ryzen 7 5700X 3.4GHz (4.6GHz Turbo), 8-Cores 16-Threads, AM4, Sem Cooler, 100-100000926WOF",
    imagem: processadorImg,
    vendedor: "Hardcore",
    maisVendido: true,
    avaliacoes: 229,
    nota: 5,
    preco: "1.199,99", // Mantido como string, igual você cadastrou
    descontoPix: "15%",
    descontoGeral: "31% OFF",
    sobre: [
      "Especificações Técnicas: Arquitetura Zen 3 com clock de até 4.5GHz boost, otimizado para jogos e criação de conteúdo;",
      "Compatibilidade: Desempenho de threads simples e múltiplos em sistemas com tecnologia de 7nm;",
      "Performance e Benchmarks: Ideal para jogos imersivos e tarefas exigentes, com eficiência energética aprimorada;",
      "Recursos Avançados: Não possui vídeo integrado, possibilitando uso de placa de vídeo dedicada;"
    ]
  };

  const handleComprarAgora = () => {
    // Adiciona o produto ao carrinho usando os dados reais do objeto
    adicionarAoCarrinho({
      id: id || 'produto-padrao',
      nome: produto.nome,
      imagem: produto.imagem,
      precoString: produto.preco
    });
    
    // Redireciona o usuário para a página de carrinho
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
            className="flex h-[600px] w-[650px] items-center justify-center rounded-[6px]"
            style={{ background: 'linear-gradient(180deg, #232020 0%, #464545 100%)' }}
          >
            <img 
              src={produto.imagem} 
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
              Vendido por: {produto.vendedor}
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {produto.maisVendido && (
                <div className="flex h-[22px] w-fit items-center justify-center rounded-[52px] bg-[#FF0000] px-3">
                  <span className="text-[11px] font-bold text-white">MAIS VENDIDO</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(produto.nota)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <span className="text-[14px] text-white font-normal ml-1">
                  {produto.avaliacoes} avaliações
                </span>
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-[#00C016] text-[36px] font-bold leading-none">
                  R$ {produto.preco}
                </span>
                <div className="flex h-[20px] items-center justify-center rounded-[52px] bg-[#FF0000] px-3 mb-1">
                  <span className="text-[10px] font-black text-white">{produto.descontoGeral}</span>
                </div>
              </div>
              <span className="text-[10px] font-light text-white">
                à vista com {produto.descontoPix} de desconto no boleto ou pix
              </span>
            </div>

            <div className="flex flex-col gap-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              <span className="text-[14px] font-semibold text-white mb-1">Sobre o produto:</span>
              <ul className="list-disc pl-4 flex flex-col gap-2">
                {produto.sobre.map((item, index) => (
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
                onClick={handleComprarAgora} // <-- Função que adiciona ao carrinho e redireciona
                className={`
                  w-full h-[60px] rounded-[7px] bg-[#FF0000] text-white font-bold text-[20px] 
                  transition-all duration-200 ease-in-out
                  hover:bg-[#cc0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]
                  ${isComprando ? 'scale-[0.98] bg-[#aa0000]' : 'scale-100'}
                `}
              >
                COMPRAR AGORA
              </button>
            </div>

          </div>
        </div>

        <section className="mt-[40px] px-[40px] flex justify-center">
          <img src={bannerAnuncio} alt="Anúncio" className="w-[1125px] rounded-[10px] object-cover" />
        </section>

      </main>

      <Footer />
    </div>
  );
}