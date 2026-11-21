import { useState, useEffect } from 'react';
import HeaderAnimado from '../Componentes/HeaderAnimado/HeaderAnimado';
import CaixaProdutos from '../Componentes/CaixaProdutos/CaixaProdutos';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useProdutos } from '../Context/ProdutoContext';

import wolverineSplash from '../assets/HomeAsset/image 3.png';
import promo1 from '../assets/HomeAsset/1.png';
import promo2 from '../assets/HomeAsset/2.png';
import promo3 from '../assets/HomeAsset/3.png';
import promo4 from '../assets/HomeAsset/4.png';
import bannerHorizontal from '../assets/HomeAsset/RodapeAnuncio.png';
import carrossel1 from '../assets/HomeAsset/Carrossel1.jpg';
import carrossel2 from '../assets/HomeAsset/Carrossel2.png';
import carrossel3 from '../assets/HomeAsset/Carrossel3.png';

const imagensCarrossel = [carrossel1, carrossel2, carrossel3];
const ITENS_POR_PAGINA = 8;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const { produtos, carregando } = useProdutos();

  const produtosPublicados = produtos.filter((p) => p.status === 'Publicado');
  const produtosDestaque = produtosPublicados.filter((p) => p.secaoVitrine === 'Destaque').slice(0, 2);
  const todosOferta = produtosPublicados.filter((p) => p.secaoVitrine === 'Oferta');

  const totalPaginas = Math.max(1, Math.ceil(todosOferta.length / ITENS_POR_PAGINA));
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const produtosOferta = todosOferta.slice(inicio, inicio + ITENS_POR_PAGINA);

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(1);
    }
  }, [paginaAtual, totalPaginas]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === imagensCarrossel.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Inter']"
      style={{ backgroundImage: 'linear-gradient(180deg, rgba(158, 158, 158, 0.3) 0%, rgba(7, 7, 7, 0.3) 100%)' }}
    >
      <HeaderAnimado />

      <main className="flex w-full flex-col relative pb-20 pt-[120px] lg:pt-[130px]">
        <div className="w-full h-[1px] bg-black opacity-20 -mt-[1px]" />

        {/* Carrossel de ponta a ponta (100% da tela) */}
        <section className="w-full">
          <div className="w-full h-[380px] sm:h-[480px] lg:h-[580px] xl:h-[660px] bg-[#222] overflow-hidden relative shadow-lg">
            {imagensCarrossel.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Banner Carrossel ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            ))}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
              {imagensCarrossel.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 lg:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-white' : 'w-2.5 lg:w-3 bg-white/50'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Container centralizado para o restante da página */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-col px-4 sm:px-8 lg:px-12">
          {/* Em Destaque */}
          <section className="relative mt-20 lg:mt-28 flex w-full flex-col">
            <h2 className="mb-4 lg:mb-6 lg:ml-[18%] font-['Iosevka_Charon'] text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#ACACAC]">
              EM DESTAQUE
            </h2>

            <img
              src={wolverineSplash}
              alt="Wolverine Destaque"
              className="hidden lg:block absolute -left-4 xl:left-0 -top-8 xl:-top-12 z-10 h-[460px] xl:h-[580px] object-contain drop-shadow-[10px_10px_15px_rgba(0,0,0,0.3)] pointer-events-none"
            />

            <div
              className="w-full lg:w-[82%] lg:ml-auto min-h-[380px] lg:min-h-[460px] flex items-center overflow-hidden rounded-2xl lg:rounded-tr-[20px] lg:rounded-br-[20px] lg:rounded-tl-[53px]"
              style={{ background: 'linear-gradient(180deg, #DFDDD8 0%, #B17E07 100%)' }}
            >
              <div className="flex w-full flex-wrap lg:flex-nowrap items-center justify-center lg:justify-end gap-6 xl:gap-10 p-6 lg:py-8 lg:pl-[180px] xl:pl-[240px] lg:pr-10 xl:pr-16">
                {carregando ? (
                  <div className="w-full flex justify-center text-center text-white/80 italic font-['Iosevka_Charon'] text-lg lg:text-xl">
                    Carregando destaques...
                  </div>
                ) : produtosDestaque.length > 0 ? (
                  produtosDestaque.map((prod) => (
                    <CaixaProdutos
                      key={prod.id}
                      id={prod.id}
                      nota="5.0"
                      imagemProduto={prod.imagemPrincipal || 'https://placehold.co/200x200'}
                      nomeProduto={prod.nome}
                      preco={`R$ ${prod.precoVenda.toFixed(2).replace('.', ',')}`}
                      parcelamento={`No PIX ou 10x de R$ ${(prod.precoVenda / 10).toFixed(2).replace('.', ',')}`}
                    />
                  ))
                ) : (
                  <div className="w-full flex justify-center text-center text-white/70 italic font-['Iosevka_Charon'] text-lg lg:text-xl">
                    Nenhum produto em destaque no momento. Cadastre no Painel!
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Banners Promocionais */}
          <section className="mt-20 lg:mt-32 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7 w-full">
              <img src={promo1} alt="Monitores" className="w-full aspect-[290/406] rounded-[6px] shadow-[0px_7px_7px_rgba(0,0,0,0.25)] object-cover" />
              <img src={promo2} alt="Intel" className="w-full aspect-[290/406] rounded-[6px] shadow-[0_5px_7px_7px_rgba(0,0,0,0.25)] object-cover" />
              <img src={promo3} alt="AMD" className="w-full aspect-[290/406] rounded-[6px] shadow-[0_5px_7px_7px_rgba(0,0,0,0.25)] object-cover" />
              <img src={promo4} alt="Placas de Vídeo" className="w-full aspect-[290/406] rounded-[6px] shadow-[0_5px_5px_7px_rgba(0,0,0,0.25)] object-cover" />
            </div>
          </section>

          {/* Em Oferta (Prateleira com Paginação) */}
          <section className="mt-20 lg:mt-28 flex w-full flex-col">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-['Iosevka_Charon'] text-3xl lg:text-[40px] font-bold text-white">
                EM OFERTA
              </h2>
              {todosOferta.length > 0 && (
                <span className="font-['Inter'] text-sm text-white/60">
                  Página {paginaAtual} de {totalPaginas} ({todosOferta.length} itens)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {carregando ? (
                <span className="col-span-full text-white/60 text-[18px] italic font-['Iosevka_Charon']">
                  Carregando produtos da prateleira...
                </span>
              ) : produtosOferta.length > 0 ? (
                produtosOferta.map((prod) => (
                  <CaixaProdutos
                    key={prod.id}
                    id={prod.id}
                    nota="5.0"
                    imagemProduto={prod.imagemPrincipal || 'https://placehold.co/200x200'}
                    nomeProduto={prod.nome}
                    preco={`R$ ${prod.precoVenda.toFixed(2).replace('.', ',')}`}
                    parcelamento={`No PIX ou 10x de R$ ${(prod.precoVenda / 10).toFixed(2).replace('.', ',')}`}
                  />
                ))
              ) : (
                <span className="col-span-full text-white/50 text-[18px] italic font-['Iosevka_Charon']">
                  Sem ofertas no momento. Acesse o Gerenciador e publique novos produtos para preencher esta vitrine.
                </span>
              )}
            </div>

            {/* Controles de Paginação */}
            {totalPaginas > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="px-4 py-2 rounded-[6px] bg-[#202022] border border-[#414144] text-white text-sm font-semibold hover:bg-[#391719] hover:border-[#FF0000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  &lt; Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPaginaAtual(num)}
                    className={`w-10 h-10 rounded-[6px] text-sm font-bold transition-colors cursor-pointer ${
                      num === paginaAtual
                        ? 'bg-[#FF0000] text-white shadow-[0_0_12px_rgba(255,0,0,0.4)]'
                        : 'bg-[#202022] border border-[#414144] text-white/80 hover:bg-[#391719]'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="px-4 py-2 rounded-[6px] bg-[#202022] border border-[#414144] text-white text-sm font-semibold hover:bg-[#391719] hover:border-[#FF0000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Próxima 
                </button>
              </div>
            )}
          </section>

          {/* Banner Horizontal Rodapé */}
          <section className="mt-20 lg:mt-28 w-full">
            <img src={bannerHorizontal} alt="Oferta Especial" className="w-full rounded-[10px] object-cover" />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}