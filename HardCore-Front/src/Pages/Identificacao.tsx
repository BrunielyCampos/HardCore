import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';

// Importação dos ícones do stepper
import iconIdentificacao from '../assets/InformacoesAsset/Identificacao.svg';
import iconPagamento from '../assets/InformacoesAsset/Pagamento.svg';
import iconConfirmacao from '../assets/InformacoesAsset/Confirmacao.svg';

export default function Identificacao() {
  const navigate = useNavigate();
  
  // Estado do formulário simplificado
  const [endereco, setEndereco] = useState({
    rua: '',
    bairro: '',
    numero: '',
    complemento: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndereco({ ...endereco, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode salvar o endereço no Contexto se quiser no futuro!
    navigate('/pagamento');
  };

  return (
    <div 
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Inter']"
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

            {/* Passo 1: Carrinho (Concluído/Inativo) */}
            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="black"/>
                </svg>
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Carrinho</span>
            </div>

            {/* Passo 2: Identificação (ATIVO - Com Brilho) */}
            <div className="flex flex-col items-center gap-[15px] z-10 relative">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#FF0000] border-[4px] border-black shadow-[0_0_20px_rgba(255,0,0,0.8)] animate-pulse">
                <img src={iconIdentificacao} alt="Identificação" className="h-[34px] w-[34px] object-contain invert brightness-0" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-bold text-[#FF5555]">Identificação</span>
            </div>

            {/* Passo 3: Pagamento (Inativo) */}
            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <img src={iconPagamento} alt="Pagamento" className="h-[34px] w-[34px] object-contain" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Pagamento</span>
            </div>

            {/* Passo 4: Confirmação (Inativo) */}
            <div className="flex flex-col items-center gap-[15px] z-10 relative opacity-80">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                <img src={iconConfirmacao} alt="Confirmação" className="h-[34px] w-[34px] object-contain" />
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white/70">Confirmação</span>
            </div>

          </div>
        </section>

        {/* Formulário de Endereço */}
        <section className="flex w-full justify-center px-[70px] mt-[60px]">
          {/* Caixa diminuída (max-w-[1050px] alinhada com o stepper) */}
          <div className="w-full max-w-[1050px] bg-gradient-to-b from-[#252222] to-[#413F3F] rounded-[7px] px-[80px] py-[50px] shadow-xl">
            
            <h1 className="text-white text-[38px] font-['Iosetka'] font-normal mb-[19px]">
              Endereço de Entrega
            </h1>
            
            <div className="w-full border-t-[2px] border-black mb-[35px]"></div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">

              {/* Linha 1: Rua */}
              <input 
                type="text" 
                name="rua"
                placeholder="Rua"
                value={endereco.rua}
                onChange={handleChange}
                required
                className="w-full h-[85px] bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] rounded-[15px_5px_15px_5px] border border-[#AAAAAA] px-[25px] text-white text-[28px] font-['Inter'] italic outline-none focus:border-[#FF0000] focus:shadow-[0_0_10px_rgba(255,0,0,0.3)] transition-all placeholder:text-white/50"
              />

              {/* Linha 2: Bairro e Número */}
              <div className="flex w-full gap-[30px]">
                <input 
                  type="text" 
                  name="bairro"
                  placeholder="Bairro"
                  value={endereco.bairro}
                  onChange={handleChange}
                  required
                  className="h-[85px] flex-[2] bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] rounded-[15px_5px_15px_5px] border border-[#AAAAAA] px-[25px] text-white text-[28px] font-['Inter'] italic outline-none focus:border-[#FF0000] transition-all placeholder:text-white/50"
                />
                <input 
                  type="text" 
                  name="numero"
                  placeholder="Número"
                  value={endereco.numero}
                  onChange={handleChange}
                  required
                  className="h-[85px] flex-1 bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] rounded-[15px_5px_15px_5px] border border-[#AAAAAA] px-[25px] text-white text-[28px] font-['Inter'] italic outline-none focus:border-[#FF0000] transition-all placeholder:text-white/50"
                />
              </div>

              {/* Linha 3: Complemento */}
              <div className="w-full h-[85px] bg-[linear-gradient(117deg,#2F2F2F_0%,#959595_100%)] rounded-[15px_5px_15px_5px] border border-[#AAAAAA] px-[25px] flex flex-col justify-center focus-within:border-[#FF0000] transition-all">
                <span className="text-[#CCCCCC] text-[13px] font-['Inter'] italic leading-none">Complemento (Opcional)</span>
                <input 
                  type="text" 
                  name="complemento"
                  placeholder="Apto, Bloco, Casa..."
                  value={endereco.complemento}
                  onChange={handleChange}
                  className="w-full bg-transparent text-white text-[24px] font-['Inter'] italic font-semibold outline-none placeholder:text-white/50 mt-1"
                />
              </div>

              {/* Botões Voltar e Continuar - Separados e centralizados */}
              <div className="flex w-full justify-between gap-[50px] mt-[50px]">
                <Link to="/carrinho" className="flex-1 max-w-[400px] h-[90px] bg-[#444444] border border-black rounded-[10px] flex items-center justify-center text-white text-[30px] font-['Inter'] font-bold hover:bg-[#333333] transition-transform active:scale-95 cursor-pointer">
                  VOLTAR
                </Link>
                
                <button type="submit" className="flex-1 max-w-[400px] h-[90px] bg-[#FF0000] rounded-[10px] flex items-center justify-center text-white text-[30px] font-['Inter'] font-bold hover:bg-[#cc0000] transition-transform active:scale-95 cursor-pointer">
                  CONTINUAR
                </button>
              </div>

            </form>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}