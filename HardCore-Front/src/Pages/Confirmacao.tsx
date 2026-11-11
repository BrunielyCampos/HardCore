import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useCarrinho } from '../Context/CarrinhoContext';
import { usePedidos } from '../Context/PedidoContext';

import iconIdentificacao from '../assets/InformacoesAsset/Identificacao.svg';
import iconPagamento from '../assets/InformacoesAsset/Pagamento.svg';
import iconConfirmacao from '../assets/InformacoesAsset/Confirmacao.svg';

export default function Confirmacao() {
  const { id } = useParams();
  const { limparCarrinho } = useCarrinho();
  const { obterPedido } = usePedidos();
  
  const pedido = obterPedido(id || '');

  useEffect(() => {
    limparCarrinho();
  }, []);

  if (!pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-['Iosevka_Charon']">
        <h2 className="text-2xl">Pedido não encontrado.</h2>
        <Link to="/" className="ml-4 text-[#FF0000] underline">Voltar à loja</Link>
      </div>
    );
  }

  const step1Ativo = true;
  const step2Ativo = pedido.status === 'Em rota' || pedido.status === 'Entregue';
  const step3Ativo = pedido.status === 'Entregue';
  const itemPrincipal = pedido.itens[0];

  return (
    <div 
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Iosevka_Charon']"
      style={{ backgroundImage: 'linear-gradient(180deg, rgba(158, 158, 158, 0.3) 0%, rgba(7, 7, 7, 0.3) 100%)' }}
    >
      <HeaderSimples />

      <main className="mx-auto flex w-full max-w-[1509px] flex-col relative pb-20 pt-[140px]">
        <section 
          className="w-full h-[245px] flex justify-center items-center relative z-10"
          style={{ background: 'linear-gradient(135deg, #1C1C1C 0%, #3F0909 30%, #121212 100%)' }}
        >
          <div className="flex items-center justify-between w-full max-w-[1050px] relative">
            <div className="absolute top-[35px] left-[70px] w-[280px] h-[3px] bg-black z-0" />
            <div className="absolute top-[35px] left-[390px] w-[280px] h-[3px] bg-black z-0" />
            <div className="absolute top-[35px] left-[710px] w-[280px] h-[3px] bg-black z-0" />

            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="black"/>
                </svg>
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Carrinho</span>
            </div>

            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <img src={iconIdentificacao} alt="Identificação" className="h-[34px] w-[34px] object-contain" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Identificação</span>
            </div>

            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <img src={iconPagamento} alt="Pagamento" className="h-[34px] w-[34px] object-contain" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Pagamento</span>
            </div>

            <div className="flex flex-col items-center gap-[15px] z-10 relative">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#FF0000] border-[4px] border-black shadow-[0_0_20px_rgba(255,0,0,0.8)] animate-pulse">
                <img src={iconConfirmacao} alt="Confirmação" className="h-[34px] w-[34px] object-contain invert brightness-0" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-bold text-[#FF5555]">Confirmação</span>
            </div>
          </div>
        </section>

        <section className="flex w-full justify-center px-[70px] mt-[60px]">
          <div className="w-full max-w-[1050px] p-[32px] bg-gradient-to-b from-[#0A0A0A] to-[#707070] rounded-[7px] border-[2px] border-[#2A0A0A] flex flex-col gap-[24px] shadow-2xl">
            
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-[4px]">
                <h1 className="text-white text-[42px] font-['Iosevka_Charon'] font-normal leading-none">Acompanhamento da entrega</h1>
                <span className="text-[#B3B3B3] text-[16px] font-['Iosevka_Charon'] font-normal">Acompanhe seu pedido em tempo real</span>
              </div>
              <Link to="/" className="h-[51px] px-[24px] flex items-center justify-center bg-[#444444] rounded-[5px] text-white text-[13px] font-bold tracking-wide hover:bg-[#555] transition-colors shadow-lg cursor-pointer">
                VOLTAR PARA A LOJA
              </Link>
            </div>

            <div className="flex w-full gap-[16px]">
              <div className="flex-1 p-[16px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex items-center gap-[16px]">
                <img src={itemPrincipal?.imagem || "https://placehold.co/96x96"} alt="Produto" className="w-[96px] h-[96px] rounded-[8px] object-cover bg-white" />
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">PEDIDO #{pedido.id}</span>
                  <h2 className="text-white text-[24px] font-['Iosevka_Charon'] font-normal leading-tight line-clamp-1">{itemPrincipal?.nome || "Vários itens"}</h2>
                  <span className="text-[#B3B3B3] text-[14px] font-['Iosevka_Charon'] font-normal">{pedido.itens.length} item(ns) • R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <div className="w-[280px] p-[16px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex flex-col gap-[10px]">
                <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">STATUS ATUAL</span>
                <span className="text-white text-[28px] font-['Iosevka_Charon'] font-normal leading-none">
                  {pedido.status === 'Confirmado' ? 'Em separação' : pedido.status}
                </span>
                <span className="text-[#B3B3B3] text-[14px] font-['Iosevka_Charon'] font-normal">
                  {pedido.motorista ? `Motorista: ${pedido.motorista} • ${pedido.veiculo}` : 'Aguardando alocação no hub...'}
                </span>
              </div>

              <div className="w-[280px] p-[16px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex flex-col gap-[10px]">
                <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">PREVISÃO</span>
                <span className="text-white text-[28px] font-['Iosevka_Charon'] font-normal leading-none">Hoje, 18:30</span>
                <span className="text-[#B3B3B3] text-[14px] font-['Iosevka_Charon'] font-normal">Janela estimada: 18:00–19:00</span>
              </div>
            </div>

            <div className="flex w-full gap-[16px]">
              <div className="flex-1 p-[20px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex flex-col gap-[12px]">
                <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">ENDEREÇO DE DESTINO</span>
                <div className="flex flex-col gap-[4px]">
                  <span className="text-white text-[24px] font-['Iosevka_Charon'] font-normal">Endereço Municipal</span>
                  <span className="text-[#B3B3B3] text-[15px] font-['Iosevka_Charon'] font-normal">Nova Cruz - RN</span>
                  <span className="text-[#B3B3B3] text-[15px] font-['Iosevka_Charon'] font-normal">Preenchido no checkout</span>
                </div>
              </div>

              <div className="w-[360px] p-[20px] bg-[#141414] rounded-[12px] border border-[#2A0A0A] flex flex-col gap-[12px]">
                <span className="text-[#FFB26B] text-[12px] font-['Iosevka_Charon'] font-bold">ANDAMENTO</span>
                
                <div className="flex flex-col gap-[10px]">
                  <div className={`flex items-center gap-[12px] ${!step1Ativo && 'opacity-50'}`}>
                    <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${step1Ativo ? 'bg-[#FF4D00]' : 'bg-[#2A0A0A]'}`}>
                      <span className={`text-[12px] font-['Iosevka_Charon'] font-bold ${step1Ativo ? 'text-white' : 'text-[#B3B3B3]'}`}>1</span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span className={`text-[18px] font-['Iosevka_Charon'] font-normal ${step1Ativo ? 'text-white' : 'text-[#B3B3B3]'}`}>Pedido confirmado</span>
                      <span className="text-[#B3B3B3] text-[13px] font-['Iosevka_Charon'] font-normal">Centro de distribuição</span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-[12px] ${!step2Ativo && 'opacity-50'}`}>
                    <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${step2Ativo ? 'bg-[#FF4D00]' : 'bg-[#2A0A0A]'}`}>
                      <span className={`text-[12px] font-['Iosevka_Charon'] font-bold ${step2Ativo ? 'text-white' : 'text-[#B3B3B3]'}`}>2</span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span className={`text-[18px] font-['Iosevka_Charon'] font-normal ${step2Ativo ? 'text-white' : 'text-[#B3B3B3]'}`}>Em rota de entrega</span>
                      <span className="text-[#B3B3B3] text-[13px] font-['Iosevka_Charon'] font-normal">{step2Ativo ? 'Saiu do hub logístico' : 'Aguardando motorista'}</span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-[12px] ${!step3Ativo && 'opacity-50'}`}>
                    <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${step3Ativo ? 'bg-[#FF4D00]' : 'bg-[#2A0A0A]'}`}>
                      <span className={`text-[12px] font-['Iosevka_Charon'] font-bold ${step3Ativo ? 'text-white' : 'text-[#B3B3B3]'}`}>3</span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span className={`text-[18px] font-['Iosevka_Charon'] font-normal ${step3Ativo ? 'text-white' : 'text-[#B3B3B3]'}`}>Entrega finalizada</span>
                      <span className="text-[#B3B3B3] text-[13px] font-['Iosevka_Charon'] font-normal">Destino final</span>
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