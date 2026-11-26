import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { usePedidos, type Pedido } from '../Context/PedidoContext';
import { useProdutos } from '../Context/ProdutoContext';
import { useAuth } from '../Context/AuthContext';
import {
  type EntregaResponseDTO,
  buscarEntregaPorPedido,
  confirmarRecebimento,
} from '../Services/entregaService';

const ENDERECO_CHECKOUT_KEY = '@hardcore:endereco_checkout';

interface ItemAvaliacaoModal {
  produtoId: number;
  nome: string;
  imagem?: string;
  voto: boolean | null;
  comentario: string;
}

export default function MeusPedidos() {
  const navigate = useNavigate();
  const { pedidos, buscarPedidoBackend, cancelarPedido, setPedidoAtivo } = usePedidos();
  const { produtos, recarregarProdutos } = useProdutos();
  const { token } = useAuth();

  const [entregasPorPedido, setEntregasPorPedido] = useState<Record<string, EntregaResponseDTO | null>>({});
  const [idBusca, setIdBusca] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [processandoId, setProcessandoId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [modalAvaliacaoPedidoId, setModalAvaliacaoPedidoId] = useState<string | null>(null);
  const [itensAvaliacao, setItensAvaliacao] = useState<ItemAvaliacaoModal[]>([]);
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

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

  const abrirModalAvaliacao = async (pedido: Pedido) => {
    let lista: ItemAvaliacaoModal[] = [];

    if (pedido.itens && pedido.itens.length > 0) {
      lista = pedido.itens.map((item) => ({
        produtoId: Number(item.id),
        nome: item.nome,
        imagem: item.imagem,
        voto: null,
        comentario: '',
      }));
    } else {
      try {
        const res = await fetch(`/api/pedidos/pedidos/${pedido.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const dto = await res.json();
          if (Array.isArray(dto?.itens)) {
            lista = dto.itens.map((it: { idProduto: number }) => {
              const prod = produtos.find((p) => Number(p.id) === Number(it.idProduto));
              return {
                produtoId: Number(it.idProduto),
                nome: prod?.nome ?? `Produto #${it.idProduto}`,
                imagem: prod?.imagemPrincipal,
                voto: null,
                comentario: '',
              };
            });
          }
        }
      } catch {
        lista = [];
      }
    }

    const unicos = Array.from(
      new Map(lista.map((item) => [item.produtoId, item])).values()
    );

    if (unicos.length > 0) {
      setItensAvaliacao(unicos);
      setModalAvaliacaoPedidoId(pedido.id);
    }
  };

  const handleEnviarAvaliacoes = async () => {
    const votados = itensAvaliacao.filter((item) => item.voto !== null);
    if (votados.length === 0) {
      setFeedback('Selecione Curtir ou Não curti em pelo menos um produto para enviar.');
      return;
    }

    try {
      setEnviandoAvaliacao(true);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const respostas = await Promise.all(
        votados.map((item) =>
          fetch('/api/produtos/avaliacoes/cadastrar', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              avaliacao: item.voto,
              campoComentario: item.comentario.trim() || null,
              produto_id: item.produtoId,
            }),
          })
        )
      );

      const falhou = respostas.find((r) => !r.ok);
      if (falhou) {
        const msg = await falhou.text();
        throw new Error(msg || 'Não foi possível salvar sua avaliação.');
      }

      await recarregarProdutos();
      setModalAvaliacaoPedidoId(null);
      setItensAvaliacao([]);
      setFeedback('Obrigado! Sua avaliação foi registrada com sucesso.');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao enviar avaliação.');
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

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

  const handleConfirmar = async (pedido: Pedido, idEntrega: number, recebeu: boolean) => {
    try {
      setProcessandoId(pedido.id);
      setFeedback(null);
      await confirmarRecebimento(idEntrega, recebeu, token);
      setFeedback(
        recebeu
          ? `Recebimento do pedido #${pedido.id} confirmado com sucesso!`
          : `Aviso registrado no pedido #${pedido.id}: a entrega voltou para "Em rota de entrega".`
      );
      await carregarEntregas();
      if (recebeu) {
        await abrirModalAvaliacao(pedido);
      }
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
          : `Solicitação de cancelamento do pedido #${idPedido} enviada com sucesso!`
      );
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao cancelar pedido.');
    } finally {
      setProcessandoId(null);
    }
  };

  const handleSolicitarReembolso = async (idPedido: string) => {
    const motivo = window.prompt(`Informe o motivo do reembolso para o pedido #${idPedido}:`);
    if (!motivo || !motivo.trim()) return;
    try {
      setProcessandoId(idPedido);
      setFeedback(null);
      await cancelarPedido(idPedido, motivo.trim());
      setFeedback(`Reembolso do pedido #${idPedido} solicitado! Aguardando aprovação do gerente.`);
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
              const reembolsoPendente =
                pedido.status === 'Reembolso pendente' ||
                pedido.estadoBackend === 'CANCELAMENTO_SOLICITADO';
              const entregaEfetuada = estado === 'ENTREGA_FEITA' || pedido.status === 'Entregue';
              const cancelada = estado === 'CANCELADA' || pedidoCancelado;
              const pagamentoPendente =
                !pedidoCancelado &&
                !reembolsoPendente &&
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
                : reembolsoPendente
                  ? 'Reembolso pendente'
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
                            : reembolsoPendente
                              ? 'border-[#FFB26B] bg-[#2A1A0A] text-[#FFB26B]'
                              : estado === 'ENTREGA_FEITA'
                                ? 'border-[#4ADE80] bg-[#123524] text-[#4ADE80]'
                                : 'border-[#FFB26B] bg-[#2A1A0A] text-[#FFB26B]'
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

                      {!pedidoCancelado && !reembolsoPendente && !entregaEfetuada && (
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

                      {!pedidoCancelado && !reembolsoPendente && entregaEfetuada && (
                        <button
                          disabled={processandoId === pedido.id}
                          onClick={() => handleSolicitarReembolso(pedido.id)}
                          className="h-[40px] cursor-pointer rounded-[5px] border border-[#FFB26B] bg-[#2A1A0A] px-4 text-[12px] font-bold tracking-wide text-[#FFB26B] transition-colors hover:bg-[#3D250E] disabled:opacity-50"
                        >
                          {processandoId === pedido.id ? 'PROCESSANDO...' : 'SOLICITAR REEMBOLSO'}
                        </button>
                      )}
                    </div>

                    {entrega && !cancelada && !reembolsoPendente && entrega.confirmacaoCliente !== true && (
                      <div className="flex gap-3">
                        <button
                          disabled={processandoId === pedido.id}
                          onClick={() => handleConfirmar(pedido, entrega.id, true)}
                          className="h-[40px] cursor-pointer rounded-[5px] bg-[#FF0000] px-5 text-[12px] font-bold tracking-wide text-white transition-colors hover:bg-[#cc0000] disabled:opacity-50"
                        >
                          {processandoId === pedido.id ? 'ENVIANDO...' : 'CONFIRMAR RECEBIMENTO'}
                        </button>
                        <button
                          disabled={processandoId === pedido.id}
                          onClick={() => handleConfirmar(pedido, entrega.id, false)}
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

      {modalAvaliacaoPedidoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="flex w-full max-w-[540px] flex-col gap-5 rounded-[10px] border-[2px] border-[#2A0A0A] bg-[#141414] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#2A0A0A] pb-3">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#FFB26B]">
                  PEDIDO #{modalAvaliacaoPedidoId} RECEBIDO
                </span>
                <h2 className="text-[24px] font-bold text-white">
                  Avalie seus produtos
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalAvaliacaoPedidoId(null)}
                className="cursor-pointer text-[18px] text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex max-h-[360px] flex-col gap-4 overflow-y-auto pr-1">
              {itensAvaliacao.map((item, idx) => (
                <div
                  key={item.produtoId}
                  className="flex flex-col gap-3 rounded-[8px] border border-[#2A0A0A] bg-[#1D1D1D] p-4"
                >
                  <div className="flex items-center gap-3">
                    {item.imagem && (
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="h-12 w-12 rounded bg-white object-contain p-1"
                      />
                    )}
                    <span className="text-[15px] font-bold text-white">{item.nome}</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setItensAvaliacao((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, voto: true } : it))
                        )
                      }
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[5px] border py-2.5 text-[13px] font-bold transition-colors ${
                        item.voto === true
                          ? 'border-[#4ADE80] bg-[#123524] text-[#4ADE80]'
                          : 'border-[#333333] bg-[#262626] text-white/80 hover:border-[#4ADE80]'
                      }`}
                    >
                      👍 CURTIR
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setItensAvaliacao((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, voto: false } : it))
                        )
                      }
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[5px] border py-2.5 text-[13px] font-bold transition-colors ${
                        item.voto === false
                          ? 'border-[#FF5555] bg-[#3F0909] text-[#FF6666]'
                          : 'border-[#333333] bg-[#262626] text-white/80 hover:border-[#FF5555]'
                      }`}
                    >
                      👎 NÃO CURTIR
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={item.comentario}
                    onChange={(e) =>
                      setItensAvaliacao((prev) =>
                        prev.map((it, i) =>
                          i === idx ? { ...it, comentario: e.target.value } : it
                        )
                      )
                    }
                    placeholder="Deixe um comentário opcional sobre o produto..."
                    className="w-full rounded-[5px] border border-[#2A0A0A] bg-[#141414] p-2.5 text-[13px] text-white outline-none focus:border-[#FF0000]"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#2A0A0A] pt-3">
              <button
                type="button"
                onClick={() => setModalAvaliacaoPedidoId(null)}
                className="h-[42px] cursor-pointer rounded-[5px] border border-[#444444] bg-[#222222] px-4 text-[12px] font-bold text-white hover:bg-[#333333]"
              >
                AGORA NÃO
              </button>
              <button
                type="button"
                disabled={enviandoAvaliacao}
                onClick={handleEnviarAvaliacoes}
                className="h-[42px] cursor-pointer rounded-[5px] bg-[#FF0000] px-5 text-[12px] font-bold text-white hover:bg-[#cc0000] disabled:opacity-50"
              >
                {enviandoAvaliacao ? 'ENVIANDO...' : 'ENVIAR AVALIAÇÃO'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}