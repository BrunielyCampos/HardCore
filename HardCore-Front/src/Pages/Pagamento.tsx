import { Link, useNavigate } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useCarrinho } from '../Context/CarrinhoContext';
import { usePedidos } from '../Context/PedidoContext';

import iconIdentificacao from '../assets/InformacoesAsset/Identificacao.svg';
import iconPagamento from '../assets/InformacoesAsset/Pagamento.svg';
import iconConfirmacao from '../assets/InformacoesAsset/Confirmacao.svg';
import qrCodeImg from '../assets/PagamentoAsset/QRCODE.png';

export default function Pagamento() {
  const navigate = useNavigate();
  
  const { itens, valorTotal } = useCarrinho();
  const { criarPedido } = usePedidos();

  const handleSimularPagamento = () => {
    const idPedido = criarPedido(itens, valorTotal);
    navigate(`/confirmacao/${idPedido}`);
  };

  return (
    <div 
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Inter']"
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

            <div className="flex flex-col items-center gap-[15px] z-10 relative">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#FF0000] border-[4px] border-black shadow-[0_0_20px_rgba(255,0,0,0.8)] animate-pulse">
                <img src={iconPagamento} alt="Pagamento" className="h-[34px] w-[34px] object-contain invert brightness-0" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-bold text-[#FF5555]">Pagamento</span>
            </div>

            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <img src={iconConfirmacao} alt="Confirmação" className="h-[34px] w-[34px] object-contain" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Confirmação</span>
            </div>
          </div>
        </section>

        <section className="flex w-full justify-center px-[70px] mt-[60px]">
          <div className="flex flex-col items-center w-full max-w-[700px] bg-gradient-to-b from-[#252222] to-[#413F3F] rounded-[7px] py-[60px] px-[40px] shadow-xl">
            <div className="w-[350px] h-[350px] bg-[#D9D9D9] flex items-center justify-center rounded-[5px] p-4 shadow-lg">
              <img src={qrCodeImg} alt="QR Code PIX" className="w-full h-full object-contain" />
            </div>

            <div className="w-[350px] h-[63px] bg-[#3A3939] rounded-[6px] flex items-center justify-center mt-[15px] shadow-md px-4 overflow-hidden">
              <span className="text-white text-[22px] font-['Iosevka_Charon'] font-normal truncate w-full text-center">
                a33rtat156yhhahjutqr763534778624rfsafwyt
              </span>
            </div>

            <div className="flex w-full justify-between gap-[20px] mt-[50px]">
              <Link to="/identificacao" className="flex-1 h-[70px] bg-[#444444] border border-black rounded-[10px] flex items-center justify-center text-white text-[20px] font-['Inter'] font-bold hover:bg-[#333333] transition-transform active:scale-95 cursor-pointer">
                VOLTAR
              </Link>
              <button 
                onClick={handleSimularPagamento}
                disabled={itens.length === 0}
                className="flex-1 h-[70px] bg-[#FF0000] rounded-[10px] flex items-center justify-center text-white text-[20px] font-['Inter'] font-bold hover:bg-[#cc0000] transition-transform active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(255,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONTINUAR
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}