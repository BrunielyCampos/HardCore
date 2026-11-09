import React, { useState, useEffect } from 'react';
import HeaderAnimado from '../Componentes/HeaderAnimado/HeaderAnimado';
import CaixaProdutos from '../Componentes/CaixaProdutos/CaixaProdutos';

import processadorImg from '../Componentes/CaixaProdutos/CaixaProdutosAssets/FotoProduto.png';

import wolverineImg from '../assets/HomeAsset/image 4.png'; // Capa do jogo (Caixa de Produto)
import wolverineSplash from '../assets/HomeAsset/image 3.png'; // Arte do Wolverine flutuando no destaque
import promo1 from '../assets/HomeAsset/1.png'; 
import promo2 from '../assets/HomeAsset/2.png'; 
import promo3 from '../assets/HomeAsset/3.png'; 
import promo4 from '../assets/HomeAsset/4.png'; 
import bannerHorizontal from '../assets/HomeAsset/RodapeAnuncio.png';
import pagamentoImg from '../assets/HomeAsset/Pagamento.png'; 

// Importação das imagens do Carrossel
import carrossel1 from '../assets/HomeAsset/Carrossel1.jpg';
import carrossel2 from '../assets/HomeAsset/Carrossel2.png';
import carrossel3 from '../assets/HomeAsset/Carrossel3.png';

const imagensCarrossel = [carrossel1, carrossel2, carrossel3];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Efeito para trocar o slide do carrossel automaticamente a cada 5 segundos (5000ms)
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

      <main className="mx-auto flex w-full max-w-[1509px] flex-col relative pb-20">
        
        <div className="w-full h-[1px] bg-black opacity-20 -mt-[1px]" />

        {/* Banner Principal do Carrossel (1481x804 com transição automática) */}
       <section className="mt-20 w-full flex justify-center">
          <div className="w-[1481px] h-[804px] bg-[#222] rounded-md overflow-hidden relative shadow-lg">
            {imagensCarrossel.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`Banner Carrossel ${index + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            ))}

            {/* Indicadores (bolinhas) do carrossel na parte inferior */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
              {imagensCarrossel.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-white' : 'w-3 bg-white/50'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Seção: EM DESTAQUE */}
        <section className="relative mt-[130px] flex w-full flex-col px-[70px]">
          <h2 className="mb-6 ml-[268px] font-['Iosevka_Charon'] text-[49.60px] font-bold text-[#ACACAC]">
            EM DESTAQUE
          </h2>
          
          {/* Arte do Wolverine Sobrepondo */}
          <img 
            src={wolverineSplash} 
            alt="Wolverine Destaque" 
            className="absolute left-[40px] top-[-50px] z-10 h-[650px] object-contain drop-shadow-[10px_10px_15px_rgba(0,0,0,0.3)] pointer-events-none" 
          />

          {/* Fundo Dourado Arredondado */}
          <div 
            className="ml-[268px] flex h-[503px] w-[1104px] overflow-hidden rounded-tr-[20px] rounded-br-[20px] rounded-tl-[53px]" 
            style={{ background: 'linear-gradient(180deg, #DFDDD8 0%, #B17E07 100%)' }}
          >
            <div className="flex w-full items-center justify-end gap-[40px] px-[80px]">
              
              <CaixaProdutos 
                nota="5.0"
                imagemProduto={wolverineImg}
                nomeProduto="Jogo Marvel’s Wolwerine, PS5"
                preco="R$ 300,00"
                parcelamento="No PIX ou 10x de R$ 30,00"
              />
              
              <CaixaProdutos 
                nota="5.0"
                imagemProduto={processadorImg}
                nomeProduto="Processador AMD Ryzen 7 5700X 3.4GHz (4.6GHz Turbo), 8-Cores 16-Threads, AM4, Sem Cooler"
                preco="R$ 1.199,99"
                parcelamento="No PIX ou 12x de R$ 117,65"
              />

            </div>
          </div>
        </section>

        {/* 4 Banners Promocionais Verticais */}
        <section className="mt-[280px] px-[70px]">
          <div className="flex w-full justify-between gap-[30px]">
            <img src={promo1} alt="Monitores" className="h-[406px] w-[295px] rounded-[6px] shadow-[0px_7px_7px_rgba(0,0,0,0.25)] object-cover" />
            <img src={promo2} alt="Intel" className="h-[406px] w-[290px] rounded-[6px] shadow-[0_5px_7px_7px_rgba(0,0,0,0.25)] object-cover" />
            <img src={promo3} alt="AMD" className="h-[406px] w-[290px] rounded-[6px] shadow-[0_5px_7px_7px_rgba(0,0,0,0.25)] object-cover" />
            <img src={promo4} alt="Placas de Vídeo" className="h-[406px] w-[290px] rounded-[6px] shadow-[0_5px_5px_7px_rgba(0,0,0,0.25)] object-cover" />
          </div>
        </section>

        {/* Seção: EM OFERTA */}
        <section className="mt-[150px] flex w-full flex-col px-[70px]">
          <h2 className="mb-[20px] ml-[10px] font-['Iosevka_Charon'] text-[40.22px] font-bold text-white">
            EM OFERTA
          </h2>

          <div className="grid grid-cols-4 gap-y-[20px] gap-x-[30px] w-[1364px]">
            {[...Array(8)].map((_, i) => (
              <CaixaProdutos 
                key={i}
                nota="5.0"
                imagemProduto={processadorImg}
                nomeProduto="Processador AMD Ryzen 7 5700X 3.4GHz (4.6GHz Turbo), 8-Cores 16-Threads, AM4, Sem Cooler"
                preco="R$ 1.199,99"
                parcelamento="No PIX ou 12x de R$ 117,65"
              />
            ))}
          </div>
        </section>

        {/* Banner Horizontal Gigante */}
        <section className="mt-[150px] px-[20px]">
          <img src={bannerHorizontal} alt="Oferta Especial" className="w-full rounded-[10px] object-cover" />
        </section>

      </main>

      {/* Footer preenchendo 100% da largura da tela */}
      <footer 
        className="w-full relative mt-[80px]" 
        style={{ background: 'linear-gradient(180deg, #222020 14%, #160202 100%)' }}
      >
        <div className="mx-auto relative h-[424px] w-full max-w-[1509px]">
          
         <div className="absolute left-[70px] top-[52px]">
            <h3 className="mb-[15px] font-['Inter'] text-[19.41px] font-semibold text-white">
              Formas de Pagamento
            </h3>
            <img src={pagamentoImg} alt="Bandeiras de Pagamento" className="h-[94px] w-[668px] object-contain" />
          </div>

          <div className="absolute left-[36px] top-[211px] h-[2px] w-[1419px] bg-[#0A0A0A]" />

          <div className="absolute top-[250px] left-[70px] flex w-[1350px] justify-between text-white font-['Inter']">
            
            <div className="flex flex-col gap-3">
              <h4 className="mb-1 text-[18px] font-bold">Institucional</h4>
              <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Sobre a HardCore</a>
              <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Política de Privacidade</a>
              <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Termos e Condições</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="mb-1 text-[18px] font-bold">Ajuda e Suporte</h4>
              <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Central de Atendimento</a>
              <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Trocas e Devoluções</a>
              <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Prazos e Entregas</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="mb-1 text-[18px] font-bold">Atendimento</h4>
              <span className="text-[15px] text-[#ACACAC]">Seg. a Sex. das 08h às 18h</span>
              <span className="text-[15px] text-[#ACACAC]">suporte@hardcore.com.br</span>
              <span className="text-[15px] text-[#ACACAC]">WhatsApp: (84) 99999-9999</span>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="mb-1 text-[18px] font-bold">Segurança</h4>
              <div className="flex gap-4">
                 <div className="flex h-[45px] w-[45px] items-center justify-center rounded bg-white/10 text-[10px] text-[#ACACAC]">SSL</div>
                 <div className="flex h-[45px] w-[45px] items-center justify-center rounded bg-white/10 text-[10px] text-[#ACACAC]">Safe</div>
              </div>
            </div>

          </div>

          <div className="absolute bottom-[10px] w-full text-center font-['Inter'] text-[13px] text-[#666666]">
            © 2026 HardCore. Todos os direitos reservados. Nova Cruz - RN.
          </div>

        </div>
      </footer>
    </div>
  );
}