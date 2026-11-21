import { Link } from 'react-router-dom';
import logoHardcore from '../assets/HomeAsset/Hardocre 1.png';
import { useProdutos } from '../Context/ProdutoContext';

export default function TelaInicialGerenciador() {
  const { produtos } = useProdutos();

  const publicados = produtos.filter((p) => p.status === 'Publicado');
  const rascunhos = produtos.filter((p) => p.status === 'Rascunho');
  const totalEstoque = produtos.reduce((acc, curr) => acc + curr.estoque, 0);
  const baixoEstoque = produtos.filter((p) => p.estoque > 0 && p.estoque <= 5);
  const semEstoque = produtos.filter((p) => p.estoque === 0);
  
  const categoriasUnicas = new Set(produtos.map(p => p.categoria)).size;

  const formatarNumero = (num: number) => (num < 10 ? `0${num}` : num);

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
            <Link to="/gerenciador" className="flex items-center gap-[10px] h-[48px] px-3 bg-[#391719] border-l-[3px] border-[#FF0000] rounded-r-[2px] rounded-l-[12px] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span className="text-white text-[12px] font-semibold">Visão geral</span>
            </Link>
            <Link to="/gerenciar-produtos" className="flex items-center gap-[10px] h-[48px] px-3 hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] transition-colors">Gerenciar produtos</span>
            </Link>
            <Link to="/cadastrar-produto" className="flex items-center gap-[10px] h-[48px] px-3 hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] transition-colors">Cadastrar produto</span>
            </Link>
            <Link to="/precos-estoque" className="flex items-center gap-[10px] h-[48px] px-3 hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] transition-colors">Preços e estoque</span>
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <span className="text-[#85858E] text-[10px] font-semibold tracking-[1.6px] mb-2 px-3">LOGÍSTICA</span>
            <Link to="/gerenciar-pedidos" className="flex items-center gap-[10px] h-[48px] px-3 bg-transparent border-l-[3px] border-transparent hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] font-normal transition-colors">Despacho de Pedidos</span>
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-[32px] flex flex-col gap-6 overflow-y-auto">
          
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[#B7B7BF] text-[11px] font-normal tracking-[1.2px] uppercase">GERENCIADOR / CATÁLOGO</span>
              <h1 className="text-white text-[38px] font-['Iosevka_Charon'] font-normal leading-none mt-1">Visão geral</h1>
              <p className="text-[#B7B7BF] text-[14px] font-normal mt-1">Seu catálogo em foco. Veja o que precisa de atenção e siga para a ação.</p>
            </div>
            <Link to="/cadastrar-produto">
              <button className="h-[51px] px-[24px] bg-[#FF0000] rounded-[5px] text-white text-[13px] font-bold tracking-wide hover:bg-[#cc0000] transition-colors shadow-lg cursor-pointer">
                CADASTRAR PRODUTO
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-4 w-full">
            
            <div className="flex flex-col bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[22px] rounded-[8px] border border-[#414144] gap-[13px]">
              <div className="flex justify-between items-start">
                <span className="text-[#B7B7BF] text-[12px] font-normal">Produtos no catálogo</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <span className="text-white text-[40px] font-['Iosevka_Charon'] font-bold leading-none">{formatarNumero(produtos.length)}</span>
              <span className="text-[#B7B7BF] text-[11px]">{categoriasUnicas} categorias cadastradas</span>
            </div>

            <div className="flex flex-col bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[22px] rounded-[8px] border border-[#414144] gap-[13px]">
              <div className="flex justify-between items-start">
                <span className="text-[#B7B7BF] text-[12px] font-normal">Publicados na loja</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <span className="text-white text-[40px] font-['Iosevka_Charon'] font-bold leading-none">{formatarNumero(publicados.length)}</span>
              <span className="text-[#B7B7BF] text-[11px]">{rascunhos.length === 0 ? 'Nenhum produto em rascunho' : `${rascunhos.length} produto(s) em rascunho`}</span>
            </div>

            <div className="flex flex-col bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[22px] rounded-[8px] border border-[#414144] gap-[13px]">
              <div className="flex justify-between items-start">
                <span className="text-[#B7B7BF] text-[12px] font-normal">Unidades em estoque</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <span className="text-white text-[40px] font-['Iosevka_Charon'] font-bold leading-none">{formatarNumero(totalEstoque)}</span>
              <span className="text-[#B7B7BF] text-[11px]">Unidades totais disponíveis</span>
            </div>

            <div className="flex flex-col bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[22px] rounded-[8px] border border-[#713034] gap-[13px]">
              <div className="flex justify-between items-start">
                <span className="text-[#B7B7BF] text-[12px] font-normal">Estoque baixo (≤ 5)</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <span className="text-white text-[40px] font-['Iosevka_Charon'] font-bold leading-none">{formatarNumero(baixoEstoque.length + semEstoque.length)}</span>
              <span className="text-[#FF7070] text-[11px]">{semEstoque.length} esgotado(s) • {baixoEstoque.length} acabando</span>
            </div>

          </div>

          <div className="flex w-full gap-[20px]">
            
            <div className="flex-1 bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[24px] rounded-[8px] border border-[#414144] flex flex-col gap-[20px] max-h-[400px] overflow-y-auto custom-scrollbar">
              <h2 className="text-white text-[22px] font-['Iosevka_Charon'] font-bold">Precisa de atenção</h2>
              
              {baixoEstoque.length === 0 && semEstoque.length === 0 ? (
                <div className="flex items-center justify-center h-[100px] text-[#B7B7BF] italic">Nenhum produto precisando de atenção.</div>
              ) : (
                <>
                  {[...semEstoque, ...baixoEstoque].map((prod) => (
                    <div key={prod.id} className="flex items-center gap-[18px] border-b border-[#414144] pb-4 last:border-0 last:pb-0">
                      <div className="w-[92px] h-[92px] bg-white rounded-[4px] flex items-center justify-center overflow-hidden">
                         <img src={prod.imagemPrincipal || "https://placehold.co/92x92"} alt={prod.nome} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex flex-col flex-1 gap-1">
                        <div className="flex items-center gap-1.5 w-fit px-[9px] py-[3px] bg-[#382D1E] rounded-[4px] mb-1">
                          <div className="w-[5px] h-[5px] bg-[#EBC17D] rounded-[2px]"></div>
                          <span className="text-[#EBC17D] text-[11px] font-semibold">{prod.estoque === 0 ? 'Esgotado' : 'Estoque baixo'}</span>
                        </div>
                        <span className="text-white text-[14px] font-semibold leading-[21px] line-clamp-1">{prod.nome}</span>
                        <span className="text-[#B7B7BF] text-[12px] font-normal leading-[18px]">{prod.sku} • {prod.status}</span>
                        <span className="text-white text-[13px] font-normal leading-[19.5px]">{prod.estoque} unidades disponíveis</span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="flex justify-between items-center w-full mt-auto pt-4">
                <span className="text-[#B7B7BF] text-[12px] font-normal">Revise a reposição antes de esgotar.</span>
                <Link to="/precos-estoque">
                  <button className="h-[40px] px-[20px] bg-[#444444] border border-[#09090A] rounded-[5px] text-white text-[12px] font-bold hover:bg-[#555] transition-colors cursor-pointer">
                    AJUSTAR ESTOQUE
                  </button>
                </Link>
              </div>
            </div>

            <div className="w-[350px] bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[24px] rounded-[8px] border border-[#414144] flex flex-col gap-[20px]">
              <h2 className="text-white text-[22px] font-['Iosevka_Charon'] font-bold">Ações rápidas</h2>
              
              <Link to="/cadastrar-produto" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <div className="flex flex-col flex-1">
                  <span className="text-white text-[13px] font-semibold">Cadastrar produto</span>
                  <span className="text-[#B7B7BF] text-[11px]">Adicione um item ao catálogo</span>
                </div>
              </Link>
              <Link to="/precos-estoque" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <div className="flex flex-col flex-1">
                  <span className="text-white text-[13px] font-semibold">Ajustar preços em lote</span>
                  <span className="text-[#B7B7BF] text-[11px]">Revise antes de aplicar</span>
                </div>
              </Link>
              <Link to="/gerenciar-produtos" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <div className="flex flex-col flex-1">
                  <span className="text-white text-[13px] font-semibold">Gerenciar produtos</span>
                  <span className="text-[#B7B7BF] text-[11px]">Edite e controle a publicação</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex w-full gap-[20px]">
            <div className="flex-1 bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[24px] rounded-[8px] border border-[#414144] flex flex-col gap-[20px] max-h-[400px] overflow-y-auto custom-scrollbar">
              <h2 className="text-white text-[22px] font-['Iosevka_Charon'] font-bold">Catálogo publicado</h2>
              
              {publicados.length === 0 ? (
                <div className="flex items-center justify-center h-[100px] text-[#B7B7BF] italic">Nenhum produto publicado no catálogo.</div>
              ) : (
                <div className="flex flex-col divide-y divide-[#414144]">
                  {publicados.slice(0, 5).map((prod) => (
                    <div key={prod.id} className="flex items-center gap-4 py-3">
                      <div className="w-[64px] h-[64px] bg-white rounded-[4px] flex items-center justify-center overflow-hidden">
                        <img src={prod.imagemPrincipal || "https://placehold.co/64x64"} alt={prod.nome} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col flex-1 gap-1">
                        <span className="text-white text-[13px] font-semibold leading-[19.5px] line-clamp-1">{prod.nome}</span>
                        <span className="text-[#B7B7BF] text-[11px] font-normal leading-[16.5px]">{prod.sku} • {prod.categoria}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-white text-[14px] font-semibold leading-[21px]">R$ {prod.precoVenda.toFixed(2).replace('.', ',')}</span>
                        <span className="text-[#B7B7BF] text-[11px] font-normal leading-[16.5px]">{prod.estoque} un. em estoque</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {publicados.length > 5 && (
                <Link to="/gerenciar-produtos" className="text-[#FF7070] text-[11px] font-normal hover:underline mt-2">
                  Ver todos os {publicados.length} produtos →
                </Link>
              )}
            </div>

            <div className="w-[350px] bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[24px] rounded-[8px] border border-[#414144] flex flex-col gap-[20px]">
              <h2 className="text-white text-[22px] font-['Iosevka_Charon'] font-bold">Saúde do catálogo</h2>
              <div className="flex justify-between items-start">
                <span className="text-[#B7B7BF] text-[12px]">Produtos publicados</span>
                <span className="text-white text-[14px] font-semibold">{publicados.length} de {produtos.length}</span>
              </div>
              <div className="w-full h-[6px] bg-[#333] rounded-[3px] overflow-hidden">
                 <div 
                   className="h-full bg-[#FF0000] rounded-[3px] transition-all" 
                   style={{ width: produtos.length ? `${(publicados.length / produtos.length) * 100}%` : '0%' }}
                 ></div>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex justify-between items-start">
                  <span className="text-[#B7B7BF] text-[12px]">Com estoque disponível</span>
                  <span className="text-white text-[12px]">{produtos.length - semEstoque.length} produtos</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[#B7B7BF] text-[12px]">Aguardando publicação</span>
                  <span className="text-white text-[12px]">{rascunhos.length} produtos</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}