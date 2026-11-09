import React from 'react';
import { Link } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useCarrinho } from '../Context/CarrinhoContext';

export default function Carrinho() {
  const { itens, valorTotal, alterarQuantidade, removerDoCarrinho, limparCarrinho } = useCarrinho();

  return (
    <div 
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Inter']"
      style={{ backgroundImage: 'linear-gradient(180deg, rgba(158, 158, 158, 0.3) 0%, rgba(7, 7, 7, 0.3) 100%)' }}
    >
      <HeaderSimples />

      <main className="mx-auto flex w-full max-w-[1509px] flex-col relative pb-20 pt-[140px]">
        
        {/* Barra de Progresso do Checkout */}
        <section 
          className="w-full h-[245px] flex justify-center items-center relative z-10"
          style={{ background: 'linear-gradient(135deg, #1C1C1C 0%, #3F0909 30%, #121212 100%)' }}
        >
          <div className="flex items-center justify-between w-full max-w-[1050px] relative">
            <div className="absolute top-[35px] left-[70px] w-[280px] h-[3px] bg-black z-0" />
            <div className="absolute top-[35px] left-[390px] w-[280px] h-[3px] bg-black z-0" />
            <div className="absolute top-[35px] left-[710px] w-[280px] h-[3px] bg-black z-0" />

            {/* Passo 1: Carrinho */}
            <div className="flex flex-col items-center gap-[15px] z-10 relative">
              <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#FF0000] border-[4px] border-black">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="black"/>
                </svg>
              </div>
              <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white">Carrinho</span>
            </div>

            {/* Passos Inativos */}
            {["Identificação", "Pagamento", "Confirmação"].map((passo, i) => (
              <div key={i} className="flex flex-col items-center gap-[15px] z-10 relative">
                <div className="flex h-[71px] w-[71px] items-center justify-center rounded-full bg-[#D9D9D9] border-[4px] border-black">
                  <div className="w-[15px] h-[15px] bg-black rounded-full" />
                </div>
                <span className="font-['Iosevka_Charon'] text-[25px] font-normal text-white">{passo}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Área Central */}
        <section className="flex w-full justify-center gap-[30px] px-[70px] mt-[60px]">
          
          {/* Lado Esquerdo: Lista de Produtos */}
          <div className="flex flex-col w-[900px]">
            <div className="flex justify-between items-center bg-[#3D3D3D] px-[25px] py-[15px] rounded-t-[5px]">
              <span className="font-['Inter'] text-[16px] font-medium text-white">Carrinho ({itens.length} itens)</span>
              
              {itens.length > 0 && (
                <button onClick={limparCarrinho} className="flex items-center gap-[5px] cursor-pointer hover:opacity-80 transition-opacity">
                  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 3.5V2.33333C10.5 1.68899 9.97766 1.16666 9.33333 1.16666H4.66667C4.02234 1.16666 3.5 1.68899 3.5 2.33333V3.5M1.75 3.5H12.25M2.91667 3.5V12.8333C2.91667 13.4777 3.43901 14 4.08333 14H9.91667C10.561 14 11.0833 13.4777 11.0833 12.8333V3.5" stroke="#FF0000" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="font-['Inter'] text-[14px] font-bold text-[#FF0000]">REMOVER TODOS OS PRODUTOS</span>
                </button>
              )}
            </div>

            {itens.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-[#5C5C5C] px-[25px] py-[60px] rounded-b-[5px] border-t border-black/30">
                <span className="text-white text-[20px] font-medium mb-4">O seu carrinho está vazio!</span>
                <Link to="/" className="text-[#FF0000] underline">Voltar às compras</Link>
              </div>
            ) : (
              <div className="flex flex-col">
                {itens.map((produto) => (
                  <div key={produto.id} className="flex items-center justify-between bg-[#5C5C5C] px-[25px] py-[25px] border-b border-black/30 last:border-b-0 last:rounded-b-[5px]">
                    
                    <div className="flex items-center gap-[20px] w-[500px]">
                      <div className="flex h-[110px] w-[110px] items-center justify-center bg-white rounded-[5px] p-2 relative">
                        <button 
                          onClick={() => removerDoCarrinho(produto.id)}
                          className="absolute -top-2 -left-2 bg-[#FF0000] rounded-full p-1 hover:scale-110 transition-transform"
                          title="Remover Item"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
                          </svg>
                        </button>
                        <img src={produto.imagem} alt={produto.nome} className="max-h-full max-w-full object-contain" />
                      </div>
                      <h3 className="font-['Inter'] text-[15px] font-medium text-white leading-tight">
                        {produto.nome}
                      </h3>
                    </div>

                    <div className="flex items-center h-[35px] bg-[#D9D9D9] rounded-[3px] overflow-hidden">
                      <button 
                        onClick={() => alterarQuantidade(produto.id, -1)}
                        className="flex items-center justify-center w-[35px] h-full hover:bg-black/10 transition-colors"
                      >
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M2.5 6.5H9.5" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <div className="flex items-center justify-center w-[40px] h-full bg-[#F5F5F5] font-['Inter'] font-bold text-black text-[16px]">
                        {produto.quantidade}
                      </div>
                      <button 
                        onClick={() => alterarQuantidade(produto.id, 1)}
                        className="flex items-center justify-center w-[35px] h-full hover:bg-black/10 transition-colors"
                      >
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 3V10M2.5 6.5H9.5" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    <div className="flex justify-end w-[150px]">
                      <span className="font-['Inter'] text-[24px] font-bold text-[#00C016]">
                        R$ {(produto.precoNumero * produto.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lado Direito: Resumo */}
          <div className="flex flex-col gap-[20px] w-[350px]">
            <div className="flex flex-col bg-[#5C5C5C] rounded-[5px] p-[25px]">
              <div className="flex items-center gap-[10px] mb-[25px]">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4H14V2C14 0.9 13.1 0 12 0H6C4.9 0 4 0.9 4 2V4H2C0.89 4 0 4.89 0 6V18C0 19.1 0.89 20 2 20H16C17.11 20 18 19.1 18 18V6C18 4.89 17.11 4 16 4ZM6 2H12V4H6V2ZM16 18H2V6H16V18Z" fill="#FF0000"/>
                  <path d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z" fill="#FF0000"/>
                </svg>
                <span className="font-['Inter'] text-[16px] font-bold text-white">Resumo do pedido</span>
              </div>

              <div className="flex justify-between items-center mb-[10px]">
                <span className="font-['Inter'] text-[13px] text-white/80">Valor dos produtos:</span>
                <span className="font-['Inter'] text-[13px] text-white/80">
                  R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center mb-[20px]">
                <span className="font-['Inter'] text-[13px] text-white/80">Frete:</span>
                <span className="font-['Inter'] text-[13px] text-[#00C016] font-semibold">Grátis</span>
              </div>

              <div className="w-full h-[1px] bg-black/40 mb-[20px]" />

              <div className="flex justify-between items-end">
                <span className="font-['Inter'] text-[15px] font-bold text-white">Total:</span>
                <span className="font-['Inter'] text-[24px] font-bold text-[#00C016] leading-none">
                  R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-[15px]">
              <button 
                disabled={itens.length === 0}
                className="w-full h-[55px] bg-[#FF0000] text-white font-['Inter'] font-bold text-[18px] rounded-[5px] hover:bg-[#cc0000] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONTINUAR
              </button>
              <Link to="/">
                <button className="w-full h-[55px] bg-[#3D3D3D] border-[2px] border-[#5C5C5C] text-white font-['Inter'] font-bold text-[18px] rounded-[5px] hover:bg-[#2D2D2D] transition-colors shadow-md">
                  VOLTAR
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}