import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import logoHardcore from '../assets/HomeAsset/Hardocre 1.png';
import { usePedidos } from '../Context/PedidoContext';
import { useAuth } from '../Context/AuthContext';
import {
  type EntregaResponseDTO,
  type EntregadorDTO,
  atribuirEntrega,
  buscarEntregaPorPedido,
  cancelarEntrega,
  listarEntregadores,
} from '../Services/entregaService';

const ENDERECO_CHECKOUT_KEY = '@hardcore:endereco_checkout';

export default function GerenciarPedidos() {
  const { pedidos, atualizarEntrega, cancelarPedido, estornarPedido } = usePedidos();
  const { token } = useAuth();

  const [entregadores, setEntregadores] = useState<EntregadorDTO[]>([]);
  const [entregasPorPedido, setEntregasPorPedido] = useState<Record<string, EntregaResponseDTO | null>>({});
  const [entregadorIdInput, setEntregadorIdInput] = useState<Record<string, string>>({});
  const [enderecoInput, setEnderecoInput] = useState<Record<string, string>>({});
  const [processandoId, setProcessandoId] = useState<string | null>(null);
  const [erroGlobal, setErroGlobal] = useState<string | null>(null);

  const carregarEntregadores = useCallback(async () => {
    try {
      const lista = await listarEntregadores(token);
      setEntregadores(lista);
    } catch (err) {
      setErroGlobal(err instanceof Error ? err.message : 'Erro ao carregar lista de entregadores.');
    }
  }, [token]);

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
    carregarEntregadores();
  }, [carregarEntregadores]);

  useEffect(() => {
    if (pedidos.length > 0) {
      carregarEntregas();
    }
  }, [pedidos, carregarEntregas]);

  const obterEnderecoPadrao = (enderecoPedido?: string) => {
    return enderecoPedido || localStorage.getItem(ENDERECO_CHECKOUT_KEY) || '';
  };

  const handleDespachar = async (idPedido: string, enderecoPedido?: string) => {
    const idEntregador = entregadorIdInput[idPedido]?.trim();
    const enderecoDestino = (enderecoInput[idPedido] ?? obterEnderecoPadrao(enderecoPedido)).trim();

    if (!idEntregador || !enderecoDestino) {
      alert('Selecione um Entregador e confira o Endereço de Destino para despachar.');
      return;
    }

    try {
      setProcessandoId(idPedido);
      setErroGlobal(null);

      const entregaCriada = await atribuirEntrega(
        {
          idPedido: Number(idPedido),
          idEntregador: Number(idEntregador),
          enderecoDestino,
        },
        token
      );

      setEntregasPorPedido((prev) => ({
        ...prev,
        [idPedido]: entregaCriada,
      }));

      atualizarEntrega(idPedido, `Entregador #${idEntregador}`, enderecoDestino, 'Em rota');
      alert(`Entrega #${entregaCriada.id} atribuída ao entregador #${idEntregador}!`);
    } catch (err) {
      setErroGlobal(err instanceof Error ? err.message : 'Erro ao atribuir entrega.');
    } finally {
      setProcessandoId(null);
    }
  };

  const handleCancelarEntrega = async (idPedido: string, idEntrega: number) => {
    try {
      setProcessandoId(idPedido);
      setErroGlobal(null);

      await cancelarEntrega(idEntrega, token);
      const atualizada = await buscarEntregaPorPedido(idPedido, token);

      setEntregasPorPedido((prev) => ({
        ...prev,
        [idPedido]: atualizada,
      }));
    } catch (err) {
      setErroGlobal(err instanceof Error ? err.message : 'Erro ao cancelar entrega.');
    } finally {
      setProcessandoId(null);
    }
  };

  const handleCancelarPedido = async (idPedido: string) => {
    if (!window.confirm(`Cancelar o pedido #${idPedido}?`)) return;
    try {
      setProcessandoId(idPedido);
      setErroGlobal(null);
      await cancelarPedido(idPedido);
    } catch (err) {
      setErroGlobal(err instanceof Error ? err.message : 'Erro ao cancelar pedido.');
    } finally {
      setProcessandoId(null);
    }
  };

  const handleEstornarPedido = async (idPedido: string) => {
    const motivo = window.prompt(`Motivo do estorno para o pedido #${idPedido}:`);
    if (!motivo || !motivo.trim()) return;
    try {
      setProcessandoId(idPedido);
      setErroGlobal(null);
      await estornarPedido(idPedido, motivo.trim());
      alert(`Estorno do pedido #${idPedido} realizado!`);
    } catch (err) {
      setErroGlobal(err instanceof Error ? err.message : 'Erro ao estornar pedido.');
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#121214] font-['Inter']">
      <header className="flex w-full h-[112px] px-8 bg-gradient-to-r from-[#131313] via-[#3D0000] to-[#030000] border-b border-[#520D10] items-center gap-6 shrink-0">
        <div className="w-[180px] h-[100px] flex items-center justify-center overflow-hidden">
          <img src={logoHardcore} alt="Hardcore Logo" className="object-contain w-full h-full" />
        </div>
        <div className="w-[1px] h-[36px] bg-[#6A3436]"></div>
        <div className="flex flex-col flex-1 gap-1">
          <span className="text-white text-[21px] font-['Iosevka_Charon'] font-bold leading-none">GERENCIADOR DA LOJA</span>
          <span className="text-[#B7B7BF] text-[11px] font-normal tracking-[1.3px]">HARDCORE • PAINEL LOGÍSTICO</span>
        </div>
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-white text-[12px] font-normal leading-[18px]">Ver loja</span>
        </Link>
      </header>

      <div className="flex flex-1 w-full">
        <aside className="w-[224px] bg-[#09090A] border-r border-[#414144] flex flex-col py-7 px-4 gap-6 shrink-0">
          <div className="flex flex-col gap-2">
            <span className="text-[#85858E] text-[10px] font-semibold tracking-[1.6px] mb-2 px-3">LOGÍSTICA</span>

            <Link to="/gerenciar-pedidos" className="flex items-center gap-[10px] h-[48px] px-3 bg-[#391719] border-l-[3px] border-[#FF0000] rounded-r-[2px] rounded-l-[12px] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span className="text-white text-[12px] font-semibold">Despacho de Pedidos</span>
            </Link>

            <Link to="/gerenciar-entregas" className="flex items-center gap-[10px] h-[48px] px-3 bg-transparent border-l-[3px] border-transparent hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] font-normal transition-colors">Atribuição Manual</span>
            </Link>

            <Link to="/gerenciador" className="flex items-center gap-[10px] h-[48px] px-3 bg-transparent border-l-[3px] border-transparent hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] font-normal transition-colors">← Voltar ao Catálogo</span>
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-[32px] flex flex-col gap-6 overflow-y-auto">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[#B7B7BF] text-[11px] font-normal tracking-[1.2px] uppercase">LOGÍSTICA / ENTREGAS</span>
              <h1 className="text-white text-[38px] font-['Iosevka_Charon'] font-normal leading-none mt-1">Despacho de Pedidos</h1>
              <p className="text-[#B7B7BF] text-[14px] font-normal mt-1">
                Selecione um entregador cadastrado; o endereço já vem preenchido da etapa de identificação.
              </p>
            </div>
            <button
              onClick={() => {
                carregarEntregadores();
                carregarEntregas();
              }}
              className="h-[42px] px-4 bg-[#29292B] border border-[#414144] text-white text-[12px] font-semibold rounded-[4px] hover:border-[#FF0000] transition-colors cursor-pointer"
            >
              ATUALIZAR STATUS
            </button>
          </div>

          {erroGlobal && (
            <div className="rounded-[6px] border border-[#FF0000] bg-[#391719] px-4 py-3 text-[13px] text-[#FF8888]">
              {erroGlobal}
            </div>
          )}

          <div className="flex flex-col w-full bg-gradient-to-br from-[#292729] to-[#1C1C1F] rounded-[8px] border border-[#414144] overflow-hidden">
            <div className="flex items-center w-full bg-[#29292B] px-[20px] py-[16px] gap-[16px]">
              <div className="w-[130px] text-[#B7B7BF] text-[11px] font-normal">PEDIDO / DATA</div>
              <div className="w-[170px] text-[#B7B7BF] text-[11px] font-normal">ITENS / TOTAL</div>
              <div className="w-[140px] text-[#B7B7BF] text-[11px] font-normal">STATUS</div>
              <div className="flex-1 text-[#B7B7BF] text-[11px] font-normal">ATRIBUIÇÃO DE ENTREGADOR</div>
              <div className="w-[180px] text-[#B7B7BF] text-[11px] font-normal text-right">AÇÕES</div>
            </div>

            {pedidos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-[#B7B7BF]">
                <span className="text-[14px]">Nenhum pedido recebido ainda. Faça uma compra na loja!</span>
              </div>
            ) : (
              [...pedidos].reverse().map((prod) => {
                const entrega = entregasPorPedido[prod.id];
                const estado = entrega?.estadoEntrega;
                const emRota = estado === 'EM_ENTREGA';
                const entregue = estado === 'ENTREGA_FEITA';
                const cancelada = estado === 'CANCELADA';
                const podeAtribuir = !entrega || cancelada;

                const enderecoValor =
                  enderecoInput[prod.id] ?? obterEnderecoPadrao(prod.enderecoDestino);

                const statusLabel =
                  prod.status === 'Cancelado'
                    ? 'Cancelado'
                    : estado
                      ? estado === 'EM_ENTREGA'
                        ? 'Em rota'
                        : estado === 'ENTREGA_FEITA'
                          ? 'Entrega feita'
                          : 'Cancelada'
                      : 'Aguardando';

                const statusStyle = entregue
                  ? 'bg-[#1a2b3c] border-[#4dabf7] text-[#4dabf7]'
                  : emRota
                    ? 'bg-[#1C3026] border-[#8FDEB1] text-[#8FDEB1]'
                    : 'bg-[#391719] border-[#FF7070] text-[#FF7070]';

                return (
                  <div key={prod.id} className="flex items-center w-full min-h-[100px] px-[20px] py-[20px] border-b border-[#414144] gap-[16px]">
                    <div className="flex flex-col w-[130px] gap-1">
                      <span className="text-white text-[14px] font-bold">#{prod.id}</span>
                      <span className="text-[#B7B7BF] text-[11px]">{new Date(prod.dataCriacao).toLocaleTimeString()}</span>
                    </div>

                    <div className="flex flex-col w-[170px] gap-1">
                      <span className="text-white text-[13px] font-medium line-clamp-1">{prod.itens.length} produto(s)</span>
                      <span className="text-[#00C016] text-[14px] font-bold">R$ {prod.valorTotal.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <div className="flex flex-col w-[140px]">
                      <div className={`flex items-center justify-center py-[5px] px-2 rounded-[4px] border ${statusStyle}`}>
                        <span className="text-[11px] font-semibold">{statusLabel}</span>
                      </div>
                    </div>

                    <div className="flex flex-1 items-center gap-[10px]">
                      {podeAtribuir ? (
                        <>
                          <select
                            value={entregadorIdInput[prod.id] || ''}
                            onChange={(e) => setEntregadorIdInput((prev) => ({ ...prev, [prod.id]: e.target.value }))}
                            className="w-[230px] h-[40px] bg-[#141414] border border-[#8C8C90] rounded-[4px] px-3 text-white text-[13px] outline-none focus:border-[#FF7070] cursor-pointer"
                          >
                            <option value="">
                              {entregadores.length > 0 ? 'Selecione um entregador' : 'Nenhum entregador disponível'}
                            </option>
                            {entregadores.map((ent) => (
                              <option key={ent.id} value={String(ent.id)}>
                                #{ent.id} - {ent.nome || ent.email}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Endereço de Destino"
                            value={enderecoValor}
                            onChange={(e) => setEnderecoInput((prev) => ({ ...prev, [prod.id]: e.target.value }))}
                            className="flex-1 h-[40px] bg-black/50 border border-[#8C8C90] rounded-[4px] px-3 text-white text-[13px] outline-none focus:border-[#FF7070]"
                          />
                        </>
                      ) : (
                        <div className="flex flex-col text-[#B7B7BF] text-[12px] gap-0.5">
                          <span>
                            <b className="text-white">Entrega #{entrega.id}</b> • Entregador <b className="text-[#FFB26B]">#{entrega.idEntregador}</b>
                          </span>
                          <span className="line-clamp-1"><b className="text-white">Destino:</b> {entrega.enderecoDestino}</span>
                          <span>
                            <b className="text-white">Cliente:</b>{' '}
                            {entrega.confirmacaoCliente === true
                              ? 'Confirmou recebimento'
                              : entrega.confirmacaoCliente === false
                                ? 'Marcou não recebido'
                                : 'Aguardando confirmação'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="w-[180px] flex flex-col items-end gap-2">
                      {prod.status === 'Cancelado' ? (
                        <span className="text-[#FF7070] text-[12px] font-semibold">Pedido Cancelado</span>
                      ) : (
                        <>
                          {podeAtribuir && (
                            <button
                              disabled={processandoId === prod.id}
                              onClick={() => handleDespachar(prod.id, prod.enderecoDestino)}
                              className="px-4 py-2 bg-[#FF0000] text-white text-[12px] font-bold rounded-[4px] hover:bg-[#cc0000] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {processandoId === prod.id ? 'ENVIANDO...' : 'DESPACHAR'}
                            </button>
                          )}
                          {emRota && entrega && (
                            <button
                              disabled={processandoId === prod.id}
                              onClick={() => handleCancelarEntrega(prod.id, entrega.id)}
                              className="px-4 py-2 border border-[#FF0000] text-[#FF7070] text-[12px] font-bold rounded-[4px] hover:bg-[#391719] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {processandoId === prod.id ? 'CANCELANDO...' : 'CANCELAR ENTREGA'}
                            </button>
                          )}
                          {entregue && (
                            <span className="text-[#4dabf7] text-[12px] font-semibold">Finalizado</span>
                          )}
                          <div className="flex gap-2">
                            <button
                              disabled={processandoId === prod.id}
                              onClick={() => handleCancelarPedido(prod.id)}
                              className="px-2 py-1 border border-[#FF5555] text-[#FF7070] text-[10px] font-bold rounded-[4px] hover:bg-[#391719] cursor-pointer disabled:opacity-50"
                            >
                              CANCELAR PEDIDO
                            </button>
                            <button
                              disabled={processandoId === prod.id}
                              onClick={() => handleEstornarPedido(prod.id)}
                              className="px-2 py-1 border border-[#FFB26B] text-[#FFB26B] text-[10px] font-bold rounded-[4px] hover:bg-[#3D250E] cursor-pointer disabled:opacity-50"
                            >
                              ESTORNAR
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}