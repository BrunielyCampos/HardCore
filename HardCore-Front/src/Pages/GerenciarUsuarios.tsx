import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useAuth } from '../Context/AuthContext';
import {
  listarTodosUsuarios,
  promoverParaGerente,
  promoverParaEntregador,
  type UsuarioAdminDTO,
} from '../Services/adminService';

function normalizarPerfil(perfil?: string | null): string {
  if (!perfil) return '';
  return perfil.trim().toUpperCase().replace(/^ROLE_/, '');
}

export default function GerenciarUsuarios() {
  const { token, usuario } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioAdminDTO[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  const perfilUsuario = normalizarPerfil(usuario?.perfil);
  const isAdmin =
    perfilUsuario === 'ADMIN' ||
    perfilUsuario === 'ADMINISTRADOR' ||
    perfilUsuario === 'ADMNISTRADOR';

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      if (!isAdmin) {
        if (ativo) setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro('');
      try {
        const lista = await listarTodosUsuarios(token);
        if (ativo) setUsuarios(lista);
      } catch (err) {
        if (ativo) {
          setErro(err instanceof Error ? err.message : 'Erro ao carregar usuários.');
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregar();

    return () => {
      ativo = false;
    };
  }, [isAdmin, token]);

  const handlePromoverGerente = async (id: number) => {
    setProcessandoId(id);
    setErro('');
    try {
      const atualizado = await promoverParaGerente(id, token);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? atualizado : u)));
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao promover para gerente.');
    } finally {
      setProcessandoId(null);
    }
  };

  const handlePromoverEntregador = async (id: number) => {
    setProcessandoId(id);
    setErro('');
    try {
      const atualizado = await promoverParaEntregador(id, token);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? atualizado : u)));
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao promover para entregador.');
    } finally {
      setProcessandoId(null);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const termo = busca.toLowerCase();
    return (
      u.email.toLowerCase().includes(termo) ||
      (u.nome && u.nome.toLowerCase().includes(termo)) ||
      u.perfil.toLowerCase().includes(termo)
    );
  });

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-black font-['Inter'] text-white">
        <HeaderSimples />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 pt-[160px]">
          <h1 className="text-2xl font-bold text-[#FF0000]">Acesso restrito</h1>
          <p className="text-white/70">Apenas administradores podem gerenciar funções de usuários.</p>
          <Link
            to="/gerenciador"
            className="rounded-[6px] bg-[#FF0000] px-6 py-3 font-bold text-white hover:bg-[#cc0000]"
          >
            Voltar ao Painel
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#121212] font-['Inter'] text-white">
      <HeaderSimples />

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-6 pb-20 pt-[180px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciar Usuários</h1>
            <p className="text-sm text-white/60">Promova contas cadastradas para Gerente ou Entregador.</p>
          </div>
          <Link
            to="/gerenciador"
            className="rounded-[6px] border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Voltar ao Painel
          </Link>
        </div>

        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail ou perfil..."
          className="h-[44px] w-full max-w-[420px] rounded-[6px] border border-white/15 bg-[#1e1e1e] px-4 text-sm text-white placeholder:text-white/40 focus:border-[#FF0000] focus:outline-none"
        />

        {erro && (
          <div className="rounded-[6px] border border-[#FF0000]/50 bg-[#FF0000]/10 px-4 py-3 text-sm text-[#FF7070]">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-white/70">Carregando usuários...</p>
        ) : (
          <div className="overflow-x-auto rounded-[8px] border border-white/10 bg-[#1a1a1a]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-black/40 text-xs uppercase text-white/60">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Nome</th>
                  <th className="px-5 py-4">E-mail</th>
                  <th className="px-5 py-4">Perfil Atual</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {usuariosFiltrados.map((u) => {
                  const perfilLinha = normalizarPerfil(u.perfil);
                  const jaGerente = perfilLinha === 'GERENTE' || perfilLinha === 'GERENCIADOR';
                  const jaEntregador = perfilLinha === 'ENTREGADOR';
                  const jaAdmin =
                    perfilLinha === 'ADMIN' ||
                    perfilLinha === 'ADMINISTRADOR' ||
                    perfilLinha === 'ADMNISTRADOR';
                  const ocupado = processandoId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="px-5 py-4 font-mono text-white/70">#{u.id}</td>
                      <td className="px-5 py-4 font-medium text-white">{u.nome || '—'}</td>
                      <td className="px-5 py-4 text-white/80">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-[4px] bg-white/10 px-2.5 py-1 text-xs font-bold uppercase">
                          {u.perfil}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={ocupado || jaGerente || jaAdmin}
                            onClick={() => handlePromoverGerente(u.id)}
                            className="cursor-pointer rounded-[5px] bg-[#FF0000] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#cc0000] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {ocupado ? 'Salvando...' : 'Promover Gerente'}
                          </button>
                          <button
                            type="button"
                            disabled={ocupado || jaEntregador || jaAdmin}
                            onClick={() => handlePromoverEntregador(u.id)}
                            className="cursor-pointer rounded-[5px] bg-[#FF6B00] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#d95b00] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {ocupado ? 'Salvando...' : 'Promover Entregador'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {usuariosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-white/50">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}