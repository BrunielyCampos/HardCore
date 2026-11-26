import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { usePedidos, type Pedido } from '../Context/PedidoContext';
import { useAuth } from '../Context/AuthContext';
import {
  type EntregaResponseDTO,
  buscarEntregaPorPedido,
  confirmarRecebimento,
} from '../Services/entregaService';

const ENDERECO_CHECKOUT_KEY = '@hardcore:endereco_checkout';

export default function MeusPedidos() {
  const navigate = useNavigate();
  const { pedidos, buscarPedidoBackend, cancelarPedido, estornarPedido, setPedidoAtivo } = usePedidos();
  const { token } = useAuth();

  const [entregasPorPedido, setEntregasPorPedido] = useState<Record<string, EntregaResponseDTO | null>>({});
  const [idBusca, setIdBusca] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [processandoId, setProcessandoId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const carregarEntregas = useCallback(async () => {
    const mapa: Record<string, EntregaResponseDTO | null> = {};
    await Promise.all(
      pedidos.map(async (p) => {
        try {
          mapa[p.id] = await buscarEntregaPorPedido(p.id, token);
        } catch {
          mapa[p.id] = null;
        }
      })
    );
    setEntregasPorPedido(mapa);
  }, [pedidos, token]);

  useEffect(() => {
    if (pedidos.length > 0) {
      carregarEntregas();
    }
  }, [pedidos, carregarEntregas]);

  const handleBuscarPedido = async (e: FormEvent) => {
    e.preventDefault();
    if (!idBusca.trim()) return;
    try {
      setBuscando(true);
      setFeedback(null);
      const encontrado = await buscarPedidoBackend(idBusca.trim());
      if (!encontrado) {
        setFeedback(`Pedido #${idBusca.trim()} não encontrado.`);
      } else {
        try {
          const entrega = await buscarEntregaPorPedido(encontrado.id, token);
          setEntregasPorPedido((prev) => ({ ...prev, [encontrado.id]: entrega }));
        } catch {
          setEntregasPorPedido((prev) => ({ ...prev, [encontrado.id]: null }));
        }
        setIdBusca('');
      }
    } finally {
      setBuscando(false);
    }
  };

  const handleConfirmar = async (idPedido: string, idEntrega: number, recebeu: boolean) => {
    try {
      setProcessandoId(idPedido);
      setFeedback(null);
      await confirmarRecebimento(idEntrega, recebeu, token);
      setFeedback(
        recebeu
          ? `Recebimento do pedido #${idPedido} confirmado com sucesso!`
          : `Aviso registrado no pedido #${idPedido}: a entrega voltou para "Em rota de entrega".`
      );
      await carregarEntregas();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao confirmar recebimento.');
    } finally {
      setProcessandoId(null);
    }
  };

  const handleConcluirPagamento = (pedido: Pedido) => {
    setPedidoAtivo(pedido);
    navigate('/pagamento', { state: { retomarPagamento: true, pedido } });
  };

  const handleCancelarPedido = async (idPedido: string, pagamentoPendente: boolean) => {
    const mensagem = pagamentoPendente
      ? `Deseja realmente cancelar o pagamento do pedido #${idPedido}?`
      : `Deseja realmente cancelar o pedido #${idPedido}?`;
    if (!window.confirm(mensagem)) return;
    try {
      setProcessandoId(idPedido);
      setFeedback(null);
      await cancelarPedido(idPedido);
      setFeedback(
        pagamentoPendente
          ? `Pagamento do pedido #${idPedido} cancelado com sucesso!`
          : `Pedido #${idPedido} cancelado com sucesso!`
      );
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao cancelar pedido.');
    } finally {
      setProcessandoId(null);
    }
  };

  const handleEstornarPedido = async (idPedido: string) => {
    const motivo = window.prompt(`Informe o motivo do reembolso para o pedido #${idPedido}:`);
    if (!motivo || !motivo.trim()) return;
    try {
      setProcessandoId(idPedido);
      setFeedback(null);
      await estornarPedido(idPedido, motivo.trim());
      setFeedback(`Reembolso do pedido #${idPedido} solicitado com sucesso!`);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao solicitar reembolso.');
    } finally {
      setProcessandoId(null);
    }
  };

  const enderecoFallback = localStorage.getItem(ENDERECO_CHECKOUT_KEY);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Iosevka_Charon'] text-white"
      style={{ backgroundImage: 'linear-gradient(180deg, rgba(158, 158, 158, 0.3) 0%, rgba(7, 7, 7, 0.3) 100%)' }}
    >
      <HeaderSimples />

      <main className="mx-auto flex w-full max-w-[1150px] flex-1 flex-col gap-6 px-8 pb-20 pt-[170px]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#2A0A0A] pb-6">
          <div>
            <span className="text-[12px] font-bold tracking-widest text-[#FFB26B]">
              ÁREA DO CLIENTE • RASTREIO
            </span>
            <h1 className="text-[42px] font-normal leading-none text-white mt-1">
              Meus Pedidos
            </h1>
          </div>

          <form onSubmit={handleBuscarPedido} className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              min="1"
              value={idBusca}
              onChange={(e) => setIdBusca(e.target.value)}
              placeholder="Buscar pedido por ID"
              className="h-[46px] w-[190px] rounded-[5px] border border-[#2A0A0A] bg-[#141414] px-3 text-[14px] text-white outline-none focus:border-[#FF0000]"
            />
            <button
              type="submit"
              disabled={buscando}
              className="h-[46px] cursor-pointer rounded-[5px] bg-[#FF0000] px-5 text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-[#cc0000] disabled:opacity-50"
            >
              {buscando ? 'BUSCANDO...' : 'LOCALIZAR'}
            </button>
            <button
              type="button"
              onClick={carregarEntregas}
              className="h-[46px] cursor-pointer rounded-[5px] bg-[#444444] px-5 text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-[#555555]"
            >
              ATUALIZAR
            </button>
          </form>
        </div>

        {feedback && (
          <div className="rounded-[8px] border border-[#2A0A0A] bg-[#1D1D1D] px-4 py-3 text-[14px] text-[#FFB26B]">
            {feedback}
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[12px] border border-[#2A0A0A] bg-[#141414] p-12 text-center">
            <p className="text-[18px] text-[#B3B3B3]">
              Nenhum pedido carregado nesta sessão. Você pode localizar pelo ID acima ou fazer uma nova compra.
            </p>
            <Link
              to="/"
              className="flex h-[46px] items-center justify-center rounded-[5px] bg-[#FF0000] px-6 text-[13px] font-bold tracking-wide text-white hover:bg-[#cc0000]"
            >
              IR PARA A LOJA
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {[...pedidos].reverse().map((pedido) => {
              const entrega = entregasPorPedido[pedido.id];
              const estado = entrega?.estadoEntrega;
              const pedidoCancelado = pedido.status === 'Cancelado';
              const entregaEfetuada = estado === 'ENTREGA_FEITA' || pedido.status === 'Entregue';
              const cancelada = estado === 'CANCELADA' || pedidoCancelado;
              const pagamentoPendente =
                !pedidoCancelado &&
                !entregaEfetuada &&
                Boolean(pedido.urlPagamento) &&
                (!pedido.estadoPagamento || pedido.estadoPagamento.toUpperCase() === 'PENDENTE');

              const enderecoExibicao =
                entrega?.enderecoDestino ||
                pedido.enderecoDestino ||
                enderecoFallback ||
                'Endereço não informado';

              const labelStatus = pedidoCancelado
                ? 'Pedido cancelado'
                : estado === 'EM_ENTREGA'
                  ? 'Em rota de entrega'
                  : estado === 'ENTREGA_FEITA'
                    ? 'Entrega efetuada'
                    : estado === 'CANCELADA'
                      ? 'Entrega cancelada'
                      : pedido.status === 'Confirmado'
                        ? 'Em separação'
                        : pedido.status;

              return (
                <div
                  key={pedido.id}
                  className="flex flex-col gap-4 rounded-[10px] border-[2px] border-[#2A0A0A] bg-[#141414] p-6 shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A0A0A] pb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-bold text-[#FFB26B]">
                        PEDIDO #{pedido.id} • {new Date(pedido.dataCriacao).toLocaleString()}
                        {pedido.estadoPagamento ? ` • PAGAMENTO: ${pedido.estadoPagamento}` : ''}
                      </span>
                      <span className="text-[24px] text-white">
                        R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-[5px] border px-3 py-1.5 text-[13px] font-bold ${
                          cancelada
                            ? 'border-[#FF5555] bg-[#3F0909] text-[#FF6666]'
                            : estado === 'ENTREGA_FEITA'
                              ? 'border-[#4ADE80] bg-[#123524] text-[#4ADE80]'
                              : 'border-[#FFB26B] bg-[#2A0A0A] text-[#FFB26B]'
                        }`}
                      >
                        {labelStatus}
                      </span>

                      {!pagamentoPendente && (
                        <Link
                          to={`/confirmacao/${pedido.id}`}
                          className="flex h-[38px] items-center justify-center rounded-[5px] bg-[#333333] px-4 text-[12px] font-bold tracking-wide text-white transition-colors hover:bg-[#444444]"
                        >
                          VER RASTREIO
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-bold text-[#FFB26B]">ENDEREÇO DE DESTINO</span>
                      <span className="text-[18px] text-white">{enderecoExibicao}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-bold text-[#FFB26B]">STATUS DA ENTREGA</span>
                      <span className="text-[15px] text-[#B3B3B3]">
                        {entrega
                          ? `Entrega #${entrega.id} • Entregador #${entrega.idEntregador} • Confirmação: ${
                              entrega.confirmacaoCliente === true
                                ? 'Recebido'
                                : entrega.confirmacaoCliente === false
                                  ? 'Não recebido'
                                  : 'Pendente'
                            }`
                          : 'Aguardando o gerente atribuir um entregador.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2A0A0A] pt-4">
                    <div className="flex flex-wrap gap-3">
                      {pagamentoPendente && (
                        <button
                          disabled={processandoId === pedido.id}
                          onClick={() => handleConcluirPagamento(pedido)}
                          className="h-[40px] cursor-pointer rounded-[5px] bg-[#00C016] px-4 text-[12px] font-bold tracking-wide text-black transition-colors hover:bg-[#00a613] disabled:opacity-50"
                        >
                          CONCLUIR PAGAMENTO
                        </button>
                      )}

                      {!pedidoCancelado && !entregaEfetuada && (
                        <button
                          disabled={processandoId === pedido.id}
                          onClick={() => handleCancelarPedido(pedido.id, pagamentoPendente)}
                          className="h-[40px] cursor-pointer rounded-[5px] border border-[#FF5555] bg-[#2A0A0A] px-4 text-[12px] font-bold tracking-wide text-[#FF7070] transition-colors hover:bg-[#3F0909] disabled:opacity-50"
                        >
                          {processandoId === pedido.id
                            ? 'PROCESSANDO...'
                            : pagamentoPendente
                              ? 'CANCELAR PAGAMENTO'
                              : 'CANCELAR PEDIDO'}
                        </button>
                      )}

                      {!pedidoCancelado && entregaEfetuada && (
                        <button
                          disabled={processandoId === pedido.id}
                          onClick={() => handleEstornarPedido(pedido.id)}
                          className="h-[40px] cursor-pointer rounded-[5px] border border-[#FFB26B] bg-[#2A1A0A] px-4 text-[12px] font-bold tracking-wide text-[#FFB26B] transition-colors hover:bg-[#3D250E] disabled:opacity-50"
                        >
                          {processandoId === pedido.id ? 'PROCESSANDO...' : 'SOLICITAR REEMBOLSO'}
                        </button>
                      )}
                    </div>

                    {entrega && !cancelada && entrega.confirmacaoCliente !== true && (
                      <div className="flex gap-3">
                        <button
                          disabled={processandoId === pedido.id}
                          onClick={() => handleConfirmar(pedido.id, entrega.id, true)}
                          className="h-[40px] cursor-pointer rounded-[5px] bg-[#FF0000] px-5 text-[12px] font-bold tracking-wide text-white transition-colors hover:bg-[#cc0000] disabled:opacity-50"
                        >
                          {processandoId === pedido.id ? 'ENVIANDO...' : 'CONFIRMAR RECEBIMENTO'}
                        </button>
                        <button
                          disabled={processandoId === pedido.id}
                          onClick={() => handleConfirmar(pedido.id, entrega.id, false)}
                          className="h-[40px] cursor-pointer rounded-[5px] border border-[#555555] bg-[#222222] px-5 text-[12px] font-bold tracking-wide text-white transition-colors hover:bg-[#333333] disabled:opacity-50"
                        >
                          NÃO RECEBI
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}