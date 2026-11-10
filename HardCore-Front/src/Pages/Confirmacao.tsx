import React, { useEffect } from 'react';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useCarrinho } from '../Context/CarrinhoContext';
import wolverineImg from '../assets/HomeAsset/image 4.png'; // Usando a imagem que você já tem no projeto

// Importação dos ícones do stepper
import iconIdentificacao from '../assets/InformacoesAsset/Identificacao.svg';
import iconPagamento from '../assets/InformacoesAsset/Pagamento.svg';
import iconConfirmacao from '../assets/InformacoesAsset/Confirmacao.svg';

export default function Confirmacao() {
  const { limparCarrinho } = useCarrinho();

  // Limpa o carrinho automaticamente assim que o usuário chega na tela de confirmação (compra finalizada)
  useEffect(() => {
    limparCarrinho();
  }, []);

  return (
    <div 
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Iosevka_Charon']"
      style={{ backgroundImage: 'linear-gradient(180deg, rgba(158, 158, 158, 0.3) 0%, rgba(7, 7, 7, 0.3) 100%)' }}
    >
      <HeaderSimples />

      <main className="mx-auto flex w-full max-w-[1509px] flex-col relative pb-20 pt-[140px]">
        
        {/* Barra de Progresso do Checkout (Stepper) */}
        <section 
          className="w-full h-[245px] flex justify-center items-center relative z-10"
          style={{ background: 'linear-gradient(135deg, #1C1C1C 0%, #3F0909 30%, #121212 100%)' }}
        >
          <div className="flex items-center justify-between w-full max-w-[1050px] relative">
            <div className="absolute top-[35px] left-[70px] w-[280px] h-[3px] bg-black z-0" />
            <div className="absolute top-[35px] left-[390px] w-[280px] h-[3px] bg-black z-0" />
            <div className="absolute top-[35px] left-[710px] w-[280px] h-[3px] bg-black z-0" />

            {/* Passo 1: Carrinho (Inativo) */}
            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="black"/>
                </svg>
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Carrinho</span>
            </div>

            {/* Passo 2: Identificação (Inativo) */}
            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <img src={iconIdentificacao} alt="Identificação" className="h-[34px] w-[34px] object-contain" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Identificação</span>
            </div>

            {/* Passo 3: Pagamento (Inativo) */}
            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <img src={iconPagamento} alt="Pagamento" className="h-[34px] w-[34px] object-contain" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Pagamento</span>
            </div>

            {/* Passo 4: Confirmação (ATIVO - Com Brilho e Vermelho) */}
            <div className="flex flex-col items-center gap-[15px] z-10 relative">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#FF0000] border-[4px] border-black shadow-[0_0_20px_rgba(255,0,0,0.8)] animate-pulse">
                <img src={iconConfirmacao} alt="Confirmação" className="h-[34px] w-[34px] object-contain invert brightness-0" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-bold text-[#FF5555]">Confirmação</span>
            </div>

          </div>
        </section>

        {/* Área Central: Acompanhamento da Entrega */}
        <section className="flex w-full justify-center px-[70px] mt-[60px]">
          <div className="w-full max-w-[1050px] p-[32px] bg-gradient-to-b from-[#0A0A0A] to-[#707070] rounded-[7px] border-[2px] border-[#2A0A0A] flex flex-col gap-[24px] shadow-2xl">
            
            {/* Título Principal */}
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-[4px]">
                <h1 className="text-white text-[42px] font-['Iosevka_Charon'] font-normal leading-none">Acompanhamento da entrega</h1>
                <span className="text-[#B3B3B3] text-[16px] font-['Iosevka_Charon'] font-normal">Simulação de rota — dados de exemplo</span>
              </div>
            </div>

            {/* Linha 1: Produto, Status e Previsão */}
            <div className="flex w-full gap-[16px]">
              
              {/* Produto */}
              <div className="flex-1 p-[16px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex items-center gap-[16px]">
                <img src={wolverineImg} alt="Produto" className="w-[96px] h-[96px] rounded-[8px] object-cover bg-white" />
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">PEDIDO #HC-20481</span>
                  <h2 className="text-white text-[24px] font-['Iosevka_Charon'] font-normal leading-tight">Jogo Marvel’s Wolverine, PS5</h2>
                  <span className="text-[#B3B3B3] text-[14px] font-['Iosevka_Charon'] font-normal">Quantidade: 1 unidade • Frete Expresso</span>
                </div>
              </div>

              {/* Status Atual */}
              <div className="w-[280px] p-[16px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex flex-col gap-[10px]">
                <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">STATUS ATUAL</span>
                <span className="text-white text-[28px] font-['Iosevka_Charon'] font-normal leading-none">Em rota de entrega</span>
                <span className="text-[#B3B3B3] text-[14px] font-['Iosevka_Charon'] font-normal">Motorista: Danilo A. • Veículo: VAN-204</span>
              </div>

              {/* Previsão */}
              <div className="w-[280px] p-[16px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex flex-col gap-[10px]">
                <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">PREVISÃO</span>
                <span className="text-white text-[28px] font-['Iosevka_Charon'] font-normal leading-none">Hoje, 18:30</span>
                <span className="text-[#B3B3B3] text-[14px] font-['Iosevka_Charon'] font-normal">Janela estimada: 18:00–19:00</span>
              </div>

            </div>

            {/* Linha 2: Endereço e Andamento */}
            <div className="flex w-full gap-[16px]">
              
              {/* Endereço de Destino */}
              <div className="flex-1 p-[20px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex flex-col gap-[12px]">
                <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">ENDEREÇO DE DESTINO</span>
                <div className="flex flex-col gap-[4px]">
                  <span className="text-white text-[24px] font-['Iosevka_Charon'] font-normal">Rua das Flores, 120</span>
                  <span className="text-[#B3B3B3] text-[15px] font-['Iosevka_Charon'] font-normal">Bairro Jardim das Acácias, Nova Cruz - RN</span>
                  <span className="text-[#B3B3B3] text-[15px] font-['Iosevka_Charon'] font-normal">CEP 59215-000 • Referência: Próximo ao Parque</span>
                </div>
              </div>

              {/* Andamento (Timeline) */}
              <div className="w-[360px] p-[20px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex flex-col gap-[12px]">
                <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">ANDAMENTO</span>
                
                <div className="flex flex-col gap-[10px]">
                  {/* Passo 1 - Timeline */}
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[24px] h-[24px] bg-[#FF4D00] rounded-full flex items-center justify-center">
                      <span className="text-white text-[12px] font-['Iosevka_Charon'] font-bold">1</span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-white text-[18px] font-['Iosevka_Charon'] font-normal">Pedido confirmado</span>
                      <span className="text-[#B3B3B3] text-[13px] font-['Iosevka_Charon'] font-normal">10:42 • Centro de distribuição</span>
                    </div>
                  </div>

                  {/* Passo 2 - Timeline */}
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[24px] h-[24px] bg-[#FF4D00] rounded-full flex items-center justify-center">
                      <span className="text-white text-[12px] font-['Iosevka_Charon'] font-bold">2</span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-white text-[18px] font-['Iosevka_Charon'] font-normal">Em rota de entrega</span>
                      <span className="text-[#B3B3B3] text-[13px] font-['Iosevka_Charon'] font-normal">14:10 • Saída do hub</span>
                    </div>
                  </div>

                  {/* Passo 3 - Timeline (Futuro) */}
                  <div className="flex items-center gap-[12px] opacity-50">
                    <div className="w-[24px] h-[24px] bg-[#2A0A0A] rounded-full flex items-center justify-center">
                      <span className="text-[#B3B3B3] text-[12px] font-['Iosevka_Charon'] font-bold">3</span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-[#B3B3B3] text-[18px] font-['Iosevka_Charon'] font-normal">Entrega final</span>
                      <span className="text-[#B3B3B3] text-[13px] font-['Iosevka_Charon'] font-normal">Hoje, 18:30</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}