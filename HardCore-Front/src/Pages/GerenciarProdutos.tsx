import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoHardcore from '../assets/HomeAsset/Hardocre 1.png';
import { useProdutos } from '../Context/ProdutoContext';

export default function GerenciarProdutos() {
  const { produtos, removerProduto } = useProdutos();

  const [abaAtiva, setAbaAtiva] = useState<'Todos' | 'Publicado' | 'Rascunho' | 'Arquivado'>('Todos');
  const [busca, setBusca] = useState('');
  const [filtroVitrine, setFiltroVitrine] = useState<'Todas' | 'Destaque' | 'Oferta' | 'Nenhuma'>('Todas');

  const publicados = produtos.filter((p) => p.status === 'Publicado');
  const rascunhos = produtos.filter((p) => p.status === 'Rascunho');
  const arquivados = produtos.filter((p) => p.status === 'Arquivado');

  let produtosExibidos = produtos;
  if (abaAtiva === 'Publicado') produtosExibidos = publicados;
  if (abaAtiva === 'Rascunho') produtosExibidos = rascunhos;
  if (abaAtiva === 'Arquivado') produtosExibidos = arquivados;

  if (filtroVitrine !== 'Todas') {
    produtosExibidos = produtosExibidos.filter(p => p.secaoVitrine === filtroVitrine);
  }

  if (busca.trim() !== '') {
    produtosExibidos = produtosExibidos.filter(
      (p) => 
        p.nome.toLowerCase().includes(busca.toLowerCase()) || 
        p.sku.toLowerCase().includes(busca.toLowerCase())
    );
  }

  const handleExcluir = (id: string) => {
    if (window.confirm("Deseja realmente remover este produto?")) {
      removerProduto(id);
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
          <span className="text-[#B7B7BF] text-[11px] font-normal tracking-[1.3px]">HARDCORE • PAINEL ADMINISTRATIVO</span>
        </div>
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          <span className="text-white text-[12px] font-normal leading-[18px]">Ver loja</span>
        </Link>
        <div className="w-[1px] h-[32px] bg-[#414144]"></div>
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center overflow-hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#000"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-[13px] font-semibold leading-[19.5px]">Administrador</span>
            <span className="text-[#B7B7BF] text-[11px] font-normal leading-[16.5px]">Equipe HARDCORE</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full">
        <aside className="w-[224px] bg-[#09090A] border-r border-[#414144] flex flex-col py-7 px-4 gap-6 shrink-0">
          <div className="flex flex-col gap-2">
            <span className="text-[#85858E] text-[10px] font-semibold tracking-[1.6px] mb-2 px-3">OPERAÇÃO DA LOJA</span>
            
            <Link to="/gerenciador" className="flex items-center gap-[10px] h-[48px] px-3 bg-transparent border-l-[3px] border-transparent hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] font-normal transition-colors">Visão geral</span>
            </Link>

            <Link to="/gerenciar-produtos" className="flex items-center gap-[10px] h-[48px] px-3 bg-[#391719] border-l-[3px] border-[#FF0000] rounded-r-[2px] rounded-l-[12px] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <span className="text-white text-[12px] font-semibold">Gerenciar produtos</span>
            </Link>

            <Link to="/cadastrar-produto" className="flex items-center gap-[10px] h-[48px] px-3 bg-transparent border-l-[3px] border-transparent hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] font-normal transition-colors">Cadastrar produto</span>
            </Link>

            <Link to="/precos-estoque" className="flex items-center gap-[10px] h-[48px] px-3 bg-transparent border-l-[3px] border-transparent hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] font-normal transition-colors">Preços e estoque</span>
            </Link>
          </div>

          <div className="flex flex-col bg-[#202022] p-[14px] rounded-[6px] gap-[10px]">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
             <span className="text-white text-[12px] font-semibold leading-[18px]">Ambiente de gestão</span>
             <span className="text-[#B7B7BF] text-[11px] font-normal leading-[16.5px]">Catálogo e estoque sob o seu controle.</span>
          </div>
        </aside>

        <main className="flex-1 p-[32px] flex flex-col gap-6 overflow-y-auto">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[#B7B7BF] text-[11px] font-normal tracking-[1.2px] uppercase">
                GERENCIADOR / CATÁLOGO
              </span>
              <h1 className="text-white text-[38px] font-['Metal_Mania'] font-normal leading-none mt-1">
                Gerenciar produtos
              </h1>
              <p className="text-[#B7B7BF] text-[14px] font-normal mt-1">
                Encontre, edite e controle os produtos que aparecem na sua loja.
              </p>
            </div>
            <Link to="/cadastrar-produto">
              <button className="h-[51px] px-[24px] bg-[#FF0000] rounded-[5px] text-white text-[13px] font-bold tracking-wide hover:bg-[#cc0000] transition-colors shadow-lg cursor-pointer">
                CADASTRAR PRODUTO
              </button>
            </Link>
          </div>

          <div className="flex border-b border-[#414144] pb-4 gap-7">
            <button onClick={() => setAbaAtiva('Todos')} className={`text-[13px] transition-colors ${abaAtiva === 'Todos' ? 'text-white font-semibold' : 'text-[#85858E] hover:text-[#B7B7BF] font-normal'}`}>
              Todos os produtos ({produtos.length})
            </button>
            <button onClick={() => setAbaAtiva('Publicado')} className={`text-[13px] transition-colors ${abaAtiva === 'Publicado' ? 'text-white font-semibold' : 'text-[#85858E] hover:text-[#B7B7BF] font-normal'}`}>
              Publicados ({publicados.length})
            </button>
            <button onClick={() => setAbaAtiva('Rascunho')} className={`text-[13px] transition-colors ${abaAtiva === 'Rascunho' ? 'text-white font-semibold' : 'text-[#85858E] hover:text-[#B7B7BF] font-normal'}`}>
              Rascunhos ({rascunhos.length})
            </button>
            <button onClick={() => setAbaAtiva('Arquivado')} className={`text-[13px] transition-colors ${abaAtiva === 'Arquivado' ? 'text-white font-semibold' : 'text-[#85858E] hover:text-[#B7B7BF] font-normal'}`}>
              Arquivados ({arquivados.length})
            </button>
          </div>

          <div className="flex items-center gap-[14px]">
            <div className="flex w-[420px] h-[48px] px-3 bg-white rounded-[19px_21px_4px_4px] items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou SKU" 
                className="flex-1 text-black text-[15px] italic font-light outline-none bg-transparent placeholder:text-black/60"
              />
            </div>

            <div className="relative flex flex-col justify-center w-[240px] h-[64px] px-[13px] bg-gradient-to-br from-[#2F2F2F] to-[#959595] rounded-[21.33px_5px_23.57px_7px] border border-[#AAAAAA]">
              <span className="text-[#CCCCCC] text-[10px] italic z-10 pointer-events-none absolute top-[8px]">Vitrine da Loja</span>
              <select 
                value={filtroVitrine}
                onChange={(e) => setFiltroVitrine(e.target.value as any)}
                className="w-full h-full pt-[14px] bg-transparent text-white text-[14px] italic font-semibold outline-none appearance-none cursor-pointer"
              >
                <option value="Todas" className="bg-[#2F2F2F] not-italic">Todas as seções</option>
                <option value="Destaque" className="bg-[#2F2F2F] not-italic">Em Destaque</option>
                <option value="Oferta" className="bg-[#2F2F2F] not-italic">Em Oferta</option>
                <option value="Nenhuma" className="bg-[#2F2F2F] not-italic">Catálogo Geral (Nenhuma)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 6 5 11 1"></polyline></svg>
              </div>
            </div>

            <button onClick={() => {setBusca(''); setFiltroVitrine('Todas');}} className="text-[#FF7070] text-[12px] font-normal hover:underline ml-2 cursor-pointer">
              Limpar filtros
            </button>
          </div>

          <div className="flex flex-col w-full bg-gradient-to-br from-[#292729] to-[#1C1C1F] rounded-[8px] border border-[#414144] overflow-hidden">
            <div className="flex items-center w-full bg-[#29292B] px-[20px] py-[16px] gap-[16px]">
              <div className="w-[20px] h-[20px] bg-gradient-to-br from-[#2F2F2F] to-[#959595] rounded-[6px_3px_6px_3px] border border-[#CCCCCC] cursor-not-allowed"></div>
              <div className="w-[440px] text-[#B7B7BF] text-[11px] font-normal">PRODUTO / SKU</div>
              <div className="w-[120px] text-[#B7B7BF] text-[11px] font-normal">PREÇO</div>
              <div className="w-[90px] text-[#B7B7BF] text-[11px] font-normal">ESTOQUE</div>
              <div className="w-[115px] text-[#B7B7BF] text-[11px] font-normal">STATUS</div>
              <div className="flex-1 text-[#B7B7BF] text-[11px] font-normal">AÇÕES</div>
            </div>

            {produtosExibidos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-[#B7B7BF]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#414144" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                <span className="text-[14px]">Nenhum produto encontrado.</span>
              </div>
            ) : (
              produtosExibidos.map((prod) => (
                <div key={prod.id} className="flex items-center w-full min-h-[160px] px-[20px] py-[20px] border-b border-[#414144] gap-[16px] hover:bg-[#1A1A1C] transition-colors">
                  <div className="w-[20px] h-[20px] bg-gradient-to-br from-[#2F2F2F] to-[#959595] rounded-[6px_3px_6px_3px] border border-[#CCCCCC] cursor-pointer"></div>
                  
                  <div className="flex items-center w-[440px] gap-[16px]">
                    <img src={prod.imagemPrincipal || "https://placehold.co/76x76"} alt="Produto" className="w-[76px] h-[76px] rounded-[4px] object-cover bg-white" />
                    <div className="flex flex-col flex-1 gap-[6px]">
                      <span className="text-white text-[13px] font-semibold leading-[19.5px] line-clamp-2">{prod.nome}</span>
                      <span className="text-[#B7B7BF] text-[10px] leading-[15px]">{prod.sku}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#85858E] text-[11px]">{prod.categoria}</span>
                        {prod.secaoVitrine === 'Destaque' && (
                          <span className="text-[#EBC17D] text-[9px] font-bold uppercase tracking-wider bg-[#382D1E] px-2 py-0.5 rounded-[4px]">Destaque</span>
                        )}
                        {prod.secaoVitrine === 'Oferta' && (
                          <span className="text-white text-[9px] font-bold uppercase tracking-wider bg-[#FF0000] px-2 py-0.5 rounded-[4px]">Oferta</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-[120px] text-white text-[13px] font-semibold">
                    R$ {prod.precoVenda.toFixed(2).replace('.', ',')}
                  </div>
                  
                  <div className="flex flex-col w-[90px] gap-1">
                    <span className={`text-[14px] font-semibold leading-[21px] ${prod.estoque === 0 ? 'text-[#FF7070]' : 'text-white'}`}>
                      {prod.estoque} un.
                    </span>
                    <span className={`text-[10px] leading-[15px] ${prod.estoque === 0 ? 'text-[#FF7070]' : prod.estoque <= 5 ? 'text-[#EBC17D]' : 'text-[#B7B7BF]'}`}>
                      {prod.estoque === 0 ? 'Esgotado' : prod.estoque <= 5 ? 'Estoque baixo' : 'Disponível'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col w-[115px]">
                    <div className={`flex items-center gap-1.5 w-fit px-[9px] py-[5px] rounded-[4px] ${prod.status === 'Publicado' ? 'bg-[#1C3026]' : 'bg-[#391719]'}`}>
                      <div className={`w-[5px] h-[5px] rounded-[2px] ${prod.status === 'Publicado' ? 'bg-[#8FDEB1]' : 'bg-[#FF7070]'}`}></div>
                      <span className={`text-[11px] font-semibold ${prod.status === 'Publicado' ? 'text-[#8FDEB1]' : 'text-[#FF7070]'}`}>
                        {prod.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 gap-2">
                    <button className="flex items-center gap-1.5 text-[#FF7070] text-[12px] font-normal hover:underline w-fit cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Editar
                    </button>
                    <button onClick={() => handleExcluir(prod.id)} className="text-[#B7B7BF] text-[10px] text-left hover:underline w-fit cursor-pointer">
                      Excluir (Despublicar)
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="flex items-center justify-between w-full px-[20px] py-[20px]">
              <span className="text-[#B7B7BF] text-[12px]">Exibindo {produtosExibidos.length > 0 ? 1 : 0}–{produtosExibidos.length} de {produtosExibidos.length} produtos</span>
              <div className="flex items-center gap-[16px]">
                <button className="w-[16px] h-[16px] flex items-center justify-center opacity-50 cursor-not-allowed">
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="#B7B7BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 1 5 5 1"></polyline></svg>
                </button>
                <div className="w-[30px] h-[30px] flex items-center justify-center bg-[#391719] rounded-[2px] text-white text-[12px]">1</div>
                <button className="w-[16px] h-[16px] flex items-center justify-center opacity-50 cursor-not-allowed">
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="#B7B7BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 9 5 5 1 1"></polyline></svg>
                </button>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}