import React, { useState, useEffect } from 'react';
import HeaderAnimado from '../Componentes/HeaderAnimado/HeaderAnimado';
import CaixaProdutos from '../Componentes/CaixaProdutos/CaixaProdutos';
import Footer from '../Componentes/Footer/FooterPagamento'; // Importe o novo componente

import processadorImg from '../Componentes/CaixaProdutos/CaixaProdutosAssets/FotoProduto.png';

import wolverineImg from '../assets/HomeAsset/image 4.png';
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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

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

        <section className="relative mt-[130px] flex w-full flex-col px-[70px]">
          <h2 className="mb-6 ml-[268px] font-['Iosevka_Charon'] text-[49.60px] font-bold text-[#ACACAC]">
            EM DESTAQUE
          </h2>
          
          <img 
            src={wolverineSplash} 
            alt="Wolverine Destaque" 
            className="absolute left-[40px] top-[-50px] z-10 h-[650px] object-contain drop-shadow-[10px_10px_15px_rgba(0,0,0,0.3)] pointer-events-none" 
          />

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

        <section className="mt-[280px] px-[70px]">
          <div className="flex w-full justify-between gap-[30px]">
            <img src={promo1} alt="Monitores" className="h-[406px] w-[295px] rounded-[6px] shadow-[0px_7px_7px_rgba(0,0,0,0.25)] object-cover" />
            <img src={promo2} alt="Intel" className="h-[406px] w-[290px] rounded-[6px] shadow-[0_5px_7px_7px_rgba(0,0,0,0.25)] object-cover" />
            <img src={promo3} alt="AMD" className="h-[406px] w-[290px] rounded-[6px] shadow-[0_5px_7px_7px_rgba(0,0,0,0.25)] object-cover" />
            <img src={promo4} alt="Placas de Vídeo" className="h-[406px] w-[290px] rounded-[6px] shadow-[0_5px_5px_7px_rgba(0,0,0,0.25)] object-cover" />
          </div>
        </section>

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

        <section className="mt-[150px] px-[20px]">
          <img src={bannerHorizontal} alt="Oferta Especial" className="w-full rounded-[10px] object-cover" />
        </section>

      </main>

      <Footer />
    </div>
  );
}