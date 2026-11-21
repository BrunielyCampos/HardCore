import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import { useAuth } from '../Context/AuthContext';
import {
  type EntregaResponseDTO,
  buscarEntregasPorEntregador,
  notificarEntregaEfetuada,
  obterIdUsuarioLocal,
} from '../Services/entregaService';

export default function PainelEntregador() {
  const { token, usuario } = useAuth();
  const idAuth = (usuario as any)?.id ?? (usuario as any)?.usuarioId ?? obterIdUsuarioLocal();

  const [idEntregador, setIdEntregador] = useState<string>(idAuth ? String(idAuth) : '');
  const [entregas, setEntregas] = useState<EntregaResponseDTO[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  useEffect(() => {
    if (idAuth && !idEntregador) {
      setIdEntregador(String(idAuth));
    }
  }, [idAuth, idEntregador]);

  const carregarEntregas = useCallback(async (idBusca?: string) => {
    const idAlvo = (idBusca ?? idEntregador).trim();
    if (!idAlvo) {
      setEntregas([]);
      return;
    }

    try {
      setCarregando(true);
      setErro(null);
      const lista = await buscarEntregasPorEntregador(idAlvo, token);
      setEntregas(lista);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar entregas.');
      setEntregas([]);
    } finally {
      setCarregando(false);
    }
  }, [idEntregador, token]);

  useEffect(() => {
    if (idAuth && token) {
      carregarEntregas(String(idAuth));
    }
  }, [idAuth, token, carregarEntregas]);

  const handleNotificarEfetuada = async (idEntrega: number) => {
    try {
      setProcessandoId(idEntrega);
      setErro(null);
      await notificarEntregaEfetuada(idEntrega, token);
      await carregarEntregas();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao notificar entrega efetuada.');
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Iosevka_Charon'] text-white"
      style={{ backgroundImage: 'linear-gradient(180deg, rgba(158, 158, 158, 0.25) 0%, rgba(7, 7, 7, 0.4) 100%)' }}
    >
      <HeaderSimples />

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-8 pb-20 pt-[140px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A0A0A] pb-6">
          <div>
            <span className="text-[12px] font-bold tracking-widest text-[#FFB26B]">
              ÁREA DO FUNCIONÁRIO • ENTREGADOR
            </span>
            <h1 className="text-[40px] font-normal leading-tight text-white">
              Painel de Entregas
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              min="1"
              value={idEntregador}
              onChange={(e) => setIdEntregador(e.target.value)}
              placeholder="ID do entregador"
              className="h-[46px] w-[170px] rounded-[5px] border border-[#2A0A0A] bg-[#141414] px-3 text-[14px] text-white outline-none focus:border-[#FF0000]"
            />
            <button
              onClick={() => carregarEntregas()}
              className="h-[46px] cursor-pointer rounded-[5px] bg-[#FF0000] px-5 text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-[#cc0000]"
            >
              ATUALIZAR LISTA
            </button>
            <Link
              to="/"
              className="flex h-[46px] items-center justify-center rounded-[5px] bg-[#444444] px-5 text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-[#555555]"
            >
              VOLTAR À LOJA
            </Link>
          </div>
        </div>

        {erro && (
          <div className="rounded-[8px] border border-[#FF0000] bg-[#2A0A0A] p-4 text-[14px] text-[#FF8888]">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="rounded-[12px] border border-[#2A0A0A] bg-[#141414] p-8 text-center text-[#B3B3B3]">
            Carregando entregas atribuídas...
          </div>
        ) : entregas.length === 0 ? (
          <div className="rounded-[12px] border border-[#2A0A0A] bg-[#141414] p-8 text-center text-[#B3B3B3]">
            {idEntregador
              ? `Nenhuma entrega encontrada para o entregador #${idEntregador}.`
              : 'Informe o ID do entregador e clique em ATUALIZAR LISTA.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {entregas.map((entrega) => {
              const entregue = entrega.estadoEntrega === 'ENTREGA_FEITA';
              const cancelada = entrega.estadoEntrega === 'CANCELADA';
              const bloqueada = entregue || cancelada;

              return (
                <div
                  key={entrega.id}
                  className="flex flex-col justify-between gap-4 rounded-[12px] border border-[#2A0A0A] bg-[#141414] p-6 shadow-xl"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[#FFB26B]">
                        ENTREGA #{entrega.id} • PEDIDO #{entrega.idPedido}
                      </span>
                      <span
                        className={`rounded px-2.5 py-1 text-[12px] font-bold ${
                          cancelada
                            ? 'bg-[#3F0909] text-[#FF6666]'
                            : entregue
                              ? 'bg-[#123524] text-[#4ADE80]'
                              : 'bg-[#2A0A0A] text-[#FFB26B]'
                        }`}
                      >
                        {entrega.estadoEntrega}
                      </span>
                    </div>

                    <div>
                      <span className="text-[12px] text-[#B3B3B3]">ENDEREÇO DE DESTINO</span>
                      <p className="text-[18px] text-white">{entrega.enderecoDestino}</p>
                    </div>

                    <div className="text-[13px] text-[#B3B3B3]">
                      Confirmação do cliente:{' '}
                      <strong className="text-white">
                        {entrega.confirmacaoCliente === true
                          ? 'Confirmado'
                          : entrega.confirmacaoCliente === false
                            ? 'Não recebido'
                            : 'Pendente'}
                      </strong>
                    </div>
                  </div>

                  <button
                    disabled={bloqueada || processandoId === entrega.id}
                    onClick={() => handleNotificarEfetuada(entrega.id)}
                    className={`h-[44px] w-full rounded-[5px] text-[13px] font-bold tracking-wide transition-colors ${
                      bloqueada
                        ? 'cursor-not-allowed bg-[#2A2A2A] text-[#777777]'
                        : 'cursor-pointer bg-[#FF0000] text-white hover:bg-[#cc0000]'
                    }`}
                  >
                    {processandoId === entrega.id
                      ? 'NOTIFICANDO...'
                      : cancelada
                        ? 'ENTREGA CANCELADA'
                        : entregue
                          ? 'ENTREGA JÁ EFETUADA'
                          : 'NOTIFICAR ENTREGA EFETUADA'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}