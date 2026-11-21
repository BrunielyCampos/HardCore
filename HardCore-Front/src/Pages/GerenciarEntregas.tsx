import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import {
  type EntregaResponseDTO,
  atribuirEntrega,
  buscarEntregaPorPedido,
  cancelarEntrega,
} from '../Services/entregaService';

export default function GerenciarEntregas() {
  const [idPedido, setIdPedido] = useState('');
  const [idEntregador, setIdEntregador] = useState('');
  const [enderecoDestino, setEnderecoDestino] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [idBuscaPedido, setIdBuscaPedido] = useState('');
  const [entregaEncontrada, setEntregaEncontrada] = useState<EntregaResponseDTO | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleAtribuir = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setErro(null);

    try {
      setEnviando(true);
      const criada = await atribuirEntrega({
        idPedido: Number(idPedido),
        idEntregador: Number(idEntregador),
        enderecoDestino: enderecoDestino.trim(),
      });
      setEntregaEncontrada(criada);
      setIdBuscaPedido(String(criada.idPedido));
      setMensagem(`Entrega #${criada.id} atribuída ao entregador #${criada.idEntregador} com sucesso!`);
      setIdPedido('');
      setIdEntregador('');
      setEnderecoDestino('');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao atribuir entrega.');
    } finally {
      setEnviando(false);
    }
  };

  const handleBuscarPorPedido = async (e: FormEvent) => {
    e.preventDefault();
    if (!idBuscaPedido.trim()) return;
    setMensagem(null);
    setErro(null);

    try {
      setBuscando(true);
      const resultado = await buscarEntregaPorPedido(idBuscaPedido.trim());
      setEntregaEncontrada(resultado);
      if (!resultado) {
        setErro(`Nenhuma entrega encontrada para o pedido #${idBuscaPedido}.`);
      }
    } catch (err) {
      setEntregaEncontrada(null);
      setErro(err instanceof Error ? err.message : 'Erro ao consultar entrega.');
    } finally {
      setBuscando(false);
    }
  };

  const handleCancelar = async (idEntrega: number) => {
    setMensagem(null);
    setErro(null);

    try {
      setCancelando(true);
      await cancelarEntrega(idEntrega);
      setMensagem(`Entrega #${idEntrega} cancelada com sucesso.`);
      if (entregaEncontrada) {
        const atualizada = await buscarEntregaPorPedido(entregaEncontrada.idPedido);
        setEntregaEncontrada(atualizada);
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao cancelar entrega.');
    } finally {
      setCancelando(false);
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
              ÁREA DO FUNCIONÁRIO • GERENTE
            </span>
            <h1 className="text-[40px] font-normal leading-tight text-white">
              Gerenciar Entregas
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              to="/gerenciador"
              className="flex h-[46px] items-center justify-center rounded-[5px] bg-[#444444] px-5 text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-[#555555]"
            >
              VOLTAR AO PAINEL
            </Link>
            <Link
              to="/entregador"
              className="flex h-[46px] items-center justify-center rounded-[5px] border border-[#2A0A0A] bg-[#141414] px-5 text-[13px] font-bold tracking-wide text-[#FFB26B] transition-colors hover:border-[#FF0000]"
            >
              VISÃO ENTREGADOR
            </Link>
          </div>
        </div>

        {mensagem && (
          <div className="rounded-[8px] border border-[#22C55E] bg-[#0B2917] p-4 text-[14px] text-[#86EFAC]">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="rounded-[8px] border border-[#FF0000] bg-[#2A0A0A] p-4 text-[14px] text-[#FF8888]">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleAtribuir}
            className="flex flex-col gap-4 rounded-[12px] border border-[#2A0A0A] bg-[#141414] p-6 shadow-xl"
          >
            <div>
              <span className="text-[12px] font-bold text-[#FFB26B]">NOVA ATRIBUIÇÃO</span>
              <h2 className="text-[26px] font-normal text-white">Atribuir Entregador ao Pedido</h2>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-[#B3B3B3]">ID do Pedido</label>
              <input
                type="number"
                required
                min="1"
                value={idPedido}
                onChange={(e) => setIdPedido(e.target.value)}
                placeholder="Ex: 20"
                className="h-[44px] rounded-[5px] border border-[#2A0A0A] bg-[#0B0B0B] px-3 text-[15px] text-white outline-none focus:border-[#FF0000]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-[#B3B3B3]">ID do Entregador</label>
              <input
                type="number"
                required
                min="1"
                value={idEntregador}
                onChange={(e) => setIdEntregador(e.target.value)}
                placeholder="Ex: 3"
                className="h-[44px] rounded-[5px] border border-[#2A0A0A] bg-[#0B0B0B] px-3 text-[15px] text-white outline-none focus:border-[#FF0000]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-[#B3B3B3]">Endereço de Destino</label>
              <input
                type="text"
                required
                value={enderecoDestino}
                onChange={(e) => setEnderecoDestino(e.target.value)}
                placeholder="Rua Exemplo, 123 - Nova Cruz/RN"
                className="h-[44px] rounded-[5px] border border-[#2A0A0A] bg-[#0B0B0B] px-3 text-[15px] text-white outline-none focus:border-[#FF0000]"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 h-[46px] cursor-pointer rounded-[5px] bg-[#FF0000] text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-[#cc0000] disabled:opacity-50"
            >
              {enviando ? 'ATRIBUINDO...' : 'ATRIBUIR ENTREGA'}
            </button>
          </form>

          <div className="flex flex-col gap-4 rounded-[12px] border border-[#2A0A0A] bg-[#141414] p-6 shadow-xl">
            <div>
              <span className="text-[12px] font-bold text-[#FFB26B]">CONSULTA E CONTROLE</span>
              <h2 className="text-[26px] font-normal text-white">Buscar Entrega por Pedido</h2>
            </div>

            <form onSubmit={handleBuscarPorPedido} className="flex gap-3">
              <input
                type="number"
                required
                min="1"
                value={idBuscaPedido}
                onChange={(e) => setIdBuscaPedido(e.target.value)}
                placeholder="Digite o ID do pedido"
                className="h-[44px] flex-1 rounded-[5px] border border-[#2A0A0A] bg-[#0B0B0B] px-3 text-[15px] text-white outline-none focus:border-[#FF0000]"
              />
              <button
                type="submit"
                disabled={buscando}
                className="h-[44px] cursor-pointer rounded-[5px] bg-[#FF0000] px-5 text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-[#cc0000] disabled:opacity-50"
              >
                {buscando ? 'BUSCANDO...' : 'BUSCAR'}
              </button>
            </form>

            {entregaEncontrada ? (
              <div className="mt-2 flex flex-col gap-3 rounded-[8px] border border-[#2A0A0A] bg-[#0B0B0B] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#FFB26B]">
                    ENTREGA #{entregaEncontrada.id} • PEDIDO #{entregaEncontrada.idPedido}
                  </span>
                  <span className="rounded bg-[#2A0A0A] px-2.5 py-1 text-[12px] font-bold text-white">
                    {entregaEncontrada.estadoEntrega}
                  </span>
                </div>

                <p className="text-[14px] text-[#B3B3B3]">
                  Entregador: <strong className="text-white">#{entregaEncontrada.idEntregador}</strong>
                </p>
                <p className="text-[14px] text-[#B3B3B3]">
                  Endereço: <strong className="text-white">{entregaEncontrada.enderecoDestino}</strong>
                </p>
                <p className="text-[14px] text-[#B3B3B3]">
                  Confirmação do cliente:{' '}
                  <strong className="text-white">
                    {entregaEncontrada.confirmacaoCliente === true
                      ? 'Confirmado'
                      : entregaEncontrada.confirmacaoCliente === false
                        ? 'Não recebido'
                        : 'Pendente'}
                  </strong>
                </p>

                <button
                  disabled={cancelando || entregaEncontrada.estadoEntrega === 'CANCELADA'}
                  onClick={() => handleCancelar(entregaEncontrada.id)}
                  className="mt-2 h-[42px] w-full cursor-pointer rounded-[5px] border border-[#FF0000] bg-transparent text-[13px] font-bold tracking-wide text-[#FF5555] transition-colors hover:bg-[#3F0909] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {cancelando
                    ? 'CANCELANDO...'
                    : entregaEncontrada.estadoEntrega === 'CANCELADA'
                      ? 'ENTREGA JÁ CANCELADA'
                      : 'CANCELAR ENTREGA'}
                </button>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-[8px] border border-dashed border-[#2A0A0A] p-6 text-center text-[14px] text-[#777777]">
                Busque um pedido acima para ver o status da entrega ou cancelar.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}