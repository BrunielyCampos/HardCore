import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useCarrinho, type ProdutoCarrinho } from '../Context/CarrinhoContext';
import { usePedidos, type Pedido } from '../Context/PedidoContext';

import iconIdentificacao from '../assets/InformacoesAsset/Identificacao.svg';
import iconPagamento from '../assets/InformacoesAsset/Pagamento.svg';
import iconConfirmacao from '../assets/InformacoesAsset/Confirmacao.svg';

const STATUS_PAGO = ['PAGO', 'PAID', 'APPROVED', 'APROVADO', 'COMPLETED', 'CONCLUIDO', 'CONFIRMED'];

function pagamentoConfirmado(estadoPagamento?: string): boolean {
  if (!estadoPagamento) return false;
  return STATUS_PAGO.includes(estadoPagamento.trim().toUpperCase());
}

function assinaturaCarrinho(itens: ProdutoCarrinho[], valorTotal: number): string {
  const resumoItens = itens
    .map((item) => `${item.id}:${item.quantidade}:${Number(item.precoNumero).toFixed(2)}`)
    .sort()
    .join('|');
  return `${resumoItens}#${Number(valorTotal).toFixed(2)}`;
}

export default function Pagamento() {
  const navigate = useNavigate();
  const { itens, valorTotal } = useCarrinho();
  const { criarPedido, pedidoAtivo, setPedidoAtivo, buscarPedidoBackend } = usePedidos();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const iniciouGeracaoRef = useRef(false);
  const redirecionouRef = useRef(false);

  const avancarParaConfirmacao = (idPedido: string) => {
    if (redirecionouRef.current) return;
    redirecionouRef.current = true;
    setPedidoAtivo(null);
    navigate(`/confirmacao/${idPedido}`);
  };

  const pedidoCorrespondeAoCarrinhoAtual = (pedido: Pedido | null): boolean => {
    if (!pedido || !pedido.urlPagamento) return false;
    const assinaturaAtual = assinaturaCarrinho(itens, valorTotal);
    const assinaturaDoPedido = assinaturaCarrinho(pedido.itens ?? [], pedido.valorTotal);
    return assinaturaAtual.length > 0 && assinaturaAtual === assinaturaDoPedido;
  };

  const gerarPixAutomatico = async (forcarNovo = false) => {
    if (!forcarNovo && pedidoAtivo && pagamentoConfirmado(pedidoAtivo.estadoPagamento)) {
      avancarParaConfirmacao(pedidoAtivo.id);
      return;
    }

    if (!forcarNovo && pedidoCorrespondeAoCarrinhoAtual(pedidoAtivo)) {
      setCarregando(false);
      return;
    }

    if (itens.length === 0) {
      setErro('O seu carrinho está vazio.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro(null);
    try {
      const novo = await criarPedido(itens, valorTotal);
      if (pagamentoConfirmado(novo.estadoPagamento)) {
        avancarParaConfirmacao(novo.id);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao gerar pagamento Pix.';
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (iniciouGeracaoRef.current) return;
    iniciouGeracaoRef.current = true;
    gerarPixAutomatico(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verifica periodicamente no back-end se o pagamento já foi confirmado
  useEffect(() => {
    if (!pedidoAtivo?.id || carregando || erro) return;

    const intervalo = setInterval(async () => {
      const atualizado = await buscarPedidoBackend(pedidoAtivo.id);
      if (atualizado && pagamentoConfirmado(atualizado.estadoPagamento)) {
        clearInterval(intervalo);
        avancarParaConfirmacao(atualizado.id);
      }
    }, 3000);

    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedidoAtivo?.id, carregando, erro, buscarPedidoBackend]);

  const handleCopiarLink = () => {
    if (!pedidoAtivo?.urlPagamento) return;
    navigator.clipboard.writeText(pedidoAtivo.urlPagamento);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
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
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="black" />
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
          <div className="flex flex-col items-center w-full max-w-[700px] bg-gradient-to-b from-[#252222] to-[#413F3F] rounded-[7px] py-[50px] px-[40px] shadow-xl gap-5">
            <div className="text-center">
              <h2 className="text-white text-[28px] font-['Iosevka_Charon'] font-bold">
                Pagamento via PIX (AbacatePay)
              </h2>
              <p className="text-white/70 text-[15px] mt-1">
                Total do pedido:{' '}
                <strong className="text-[#00C016]">
                  R$ {(pedidoAtivo?.valorTotal ?? valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
              </p>
            </div>

            {carregando && (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="h-10 w-10 rounded-full border-4 border-[#FF0000] border-t-transparent animate-spin" />
                <p className="text-white/80 text-sm">
                  Gerando seu QR Code PIX na AbacatePay...
                </p>
              </div>
            )}

            {!carregando && erro && (
              <div className="w-full rounded-[6px] bg-[#391719] border border-[#FF0000] p-4 text-center text-[#FF7070] text-sm font-semibold">
                {erro}
              </div>
            )}

            {!carregando && pedidoAtivo?.urlPagamento && (
              <div className="flex flex-col items-center w-full gap-5">
                <div className="bg-white p-4 rounded-[10px] shadow-lg flex items-center justify-center">
                  <QRCodeCanvas
                    value={pedidoAtivo.urlPagamento}
                    size={220}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="M"
                  />
                </div>

                <div className="flex items-center gap-2 w-full bg-[#3A3939] rounded-[6px] p-3">
                  <span className="text-white/90 text-xs font-mono truncate flex-1">
                    {pedidoAtivo.urlPagamento}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopiarLink}
                    className="px-3 py-1.5 rounded bg-[#202022] text-white text-xs font-semibold hover:bg-[#FF0000] transition-colors cursor-pointer shrink-0"
                  >
                    {copiado ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>

                <p className="text-white/60 text-xs text-center">
                  Aguardando confirmação do pagamento PIX...
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}