import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoHardcore from '../assets/HomeAsset/Hardocre 1.png';
import { useProdutos } from '../Context/ProdutoContext';

export default function PrecosEstoque() {
  const { produtos, atualizarProduto } = useProdutos();

  // Estados de Busca e Seleção
  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState<string[]>([]);

  // Estados de Rascunho (Prévia)
  const [percentualDesconto, setPercentualDesconto] = useState('5');
  const [novosPrecos, setNovosPrecos] = useState<Record<string, number>>({});
  const [ajustesEstoque, setAjustesEstoque] = useState<Record<string, string>>({});

  // Filtrar produtos
  const produtosExibidos = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    p.sku.toLowerCase().includes(busca.toLowerCase())
  );

  // Lógica de Seleção
  const handleToggleSelect = (id: string) => {
    setSelecionados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selecionados.length === produtosExibidos.length) {
      setSelecionados([]);
    } else {
      setSelecionados(produtosExibidos.map(p => p.id));
    }
  };

  // Gerar Prévia de Preços (aplica % de redução aos selecionados)
  const handleGerarPrevia = () => {
    const desconto = parseFloat(percentualDesconto);
    if (isNaN(desconto) || desconto <= 0) return;

    const novos = { ...novosPrecos };
    selecionados.forEach(id => {
      const prod = produtos.find(p => p.id === id);
      if (prod) {
        novos[id] = prod.precoVenda * (1 - desconto / 100);
      }
    });
    setNovosPrecos(novos);
  };

  // Atualizar inputs de estoque
  const handleAjusteEstoqueChange = (id: string, valor: string) => {
    setAjustesEstoque(prev => ({ ...prev, [id]: valor }));
  };

  // Identificar quais produtos têm alterações pendentes para o Sumário
  const produtosAlterados = produtos.filter(p => {
    const temNovoPreco = novosPrecos[p.id] !== undefined && novosPrecos[p.id] !== p.precoVenda;
    const ajusteEstoqueVal = parseInt(ajustesEstoque[p.id] || '0');
    const temNovoEstoque = !isNaN(ajusteEstoqueVal) && ajusteEstoqueVal !== 0;
    return temNovoPreco || temNovoEstoque;
  });

  // Ações Finais
  const handleDescartar = () => {
    setNovosPrecos({});
    setAjustesEstoque({});
    setSelecionados([]);
  };

  const handleAplicarAlteracoes = () => {
    produtosAlterados.forEach(p => {
      const novoPreco = novosPrecos[p.id] !== undefined ? novosPrecos[p.id] : p.precoVenda;
      const ajusteEstoqueVal = parseInt(ajustesEstoque[p.id] || '0');
      const estoqueFinal = Math.max(0, p.estoque + (isNaN(ajusteEstoqueVal) ? 0 : ajusteEstoqueVal)); // Impede estoque negativo
      
      atualizarProduto(p.id, {
        ...p,
        precoVenda: novoPreco,
        estoque: estoqueFinal
      });
    });
    
    // Limpa a prévia após salvar
    handleDescartar();
    alert("Alterações aplicadas com sucesso!");
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#121214] font-['Inter']">
      
      {/* ================= BARRA SUPERIOR ================= */}
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

      {/* ================= CORPO PRINCIPAL ================= */}
      <div className="flex flex-1 w-full">
        
        {/* ------ MENU LATERAL ------ */}
        <aside className="w-[224px] bg-[#09090A] border-r border-[#414144] flex flex-col py-7 px-4 gap-6 shrink-0">
          <div className="flex flex-col gap-2">
            <span className="text-[#85858E] text-[10px] font-semibold tracking-[1.6px] mb-2 px-3">OPERAÇÃO DA LOJA</span>
            
            <Link to="/gerenciador" className="flex items-center gap-[10px] h-[48px] px-3 bg-transparent border-l-[3px] border-transparent hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] font-normal transition-colors">Visão geral</span>
            </Link>

            <Link to="/gerenciar-produtos" className="flex items-center gap-[10px] h-[48px] px-3 bg-transparent border-l-[3px] border-transparent hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] font-normal transition-colors">Gerenciar produtos</span>
            </Link>

            <Link to="/cadastrar-produto" className="flex items-center gap-[10px] h-[48px] px-3 bg-transparent border-l-[3px] border-transparent hover:bg-[#1A1A1C] rounded-[12px] transition-colors group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" className="group-hover:stroke-white transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span className="text-[#B7B7BF] group-hover:text-white text-[12px] font-normal transition-colors">Cadastrar produto</span>
            </Link>

            {/* ATIVO */}
            <Link to="/precos-estoque" className="flex items-center gap-[10px] h-[48px] px-3 bg-[#391719] border-l-[3px] border-[#FF0000] rounded-r-[2px] rounded-l-[12px] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              <span className="text-white text-[12px] font-semibold">Preços e estoque</span>
            </Link>
          </div>

          <div className="flex flex-col bg-[#202022] p-[14px] rounded-[6px] gap-[10px]">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
             <span className="text-white text-[12px] font-semibold leading-[18px]">Ambiente de gestão</span>
             <span className="text-[#B7B7BF] text-[11px] font-normal leading-[16.5px]">Catálogo e estoque sob o seu controle.</span>
          </div>
        </aside>

        {/* ------ CONTEÚDO PRINCIPAL ------ */}
        <main className="flex-1 p-[32px] flex flex-col gap-6 overflow-y-auto">
          
          {/* Header da Seção */}
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[#B7B7BF] text-[11px] font-normal tracking-[1.2px] uppercase">
                GERENCIADOR / CATÁLOGO
              </span>
              <h1 className="text-white text-[38px] font-['Iosevka_Charon'] font-normal leading-none mt-1">
                Preços e estoque
              </h1>
              <p className="text-[#B7B7BF] text-[14px] font-normal mt-1 leading-[21px]">
                Ajuste por produto ou em lote. Confira a prévia antes de confirmar.
              </p>
            </div>
            
            {produtosAlterados.length > 0 && (
              <div className="flex items-center gap-1.5 px-[9px] py-[5px] bg-[#391719] rounded-[4px]">
                <div className="w-[5px] h-[5px] bg-[#FF7070] rounded-[2px]"></div>
                <span className="text-[#FF7070] text-[11px] font-semibold">{produtosAlterados.length} alterações pendentes</span>
              </div>
            )}
          </div>

          {/* Filtros e Busca */}
          <div className="flex items-center gap-[16px]">
            <div className="flex w-[480px] h-[48px] px-3 bg-white rounded-[19px_21px_4px_4px] items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou SKU" 
                className="flex-1 text-black text-[15px] italic font-light outline-none bg-transparent placeholder:text-black/60"
              />
            </div>
            
            <div className="flex flex-col justify-center w-[260px] h-[64px] px-[13px] bg-gradient-to-br from-[#2F2F2F] to-[#959595] rounded-[21.33px_5px_23.57px_7px] border border-[#AAAAAA]">
              <span className="text-[#CCCCCC] text-[10px] italic">Categoria</span>
              <div className="flex justify-between items-center w-full">
                <span className="text-white text-[14px] italic font-semibold">Todas as categorias</span>
                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 6 5 11 1"></polyline></svg>
              </div>
            </div>

            <div className="flex flex-col justify-center w-[220px] h-[64px] px-[13px] bg-gradient-to-br from-[#2F2F2F] to-[#959595] rounded-[21.33px_5px_23.57px_7px] border border-[#AAAAAA]">
              <span className="text-[#CCCCCC] text-[10px] italic">Status</span>
              <div className="flex justify-between items-center w-full">
                <span className="text-white text-[14px] italic font-semibold">Todos</span>
                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 6 5 11 1"></polyline></svg>
              </div>
            </div>
          </div>

          {/* ====== Painel Ajuste em Lote ====== */}
          <div className="w-full bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[24px] rounded-[8px] border border-[#414144] flex flex-col gap-[20px]">
            <h2 className="text-white text-[22px] font-['Iosevka_Charon'] font-bold">Ajuste em lote</h2>
            
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center gap-1.5 px-[9px] py-[5px] bg-[#29292B] rounded-[4px]">
                <div className="w-[5px] h-[5px] bg-[#B7B7BF] rounded-[2px]"></div>
                <span className="text-[#B7B7BF] text-[11px] font-semibold">{selecionados.length} selecionados</span>
              </div>

              <div className="flex flex-col justify-center w-[220px] h-[64px] px-[13px] bg-gradient-to-br from-[#2F2F2F] to-[#959595] rounded-[21.33px_5px_23.57px_7px] border border-[#AAAAAA]">
                <span className="text-[#CCCCCC] text-[10px] italic">O que alterar</span>
                <div className="flex justify-between items-center w-full">
                  <span className="text-white text-[14px] italic font-semibold">Preço de venda</span>
                  <svg width="12" height="6" viewBox="0 0 12 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 6 5 11 1"></polyline></svg>
                </div>
              </div>

              <div className="flex flex-col justify-center w-[208px] h-[64px] px-[13px] bg-gradient-to-br from-[#2F2F2F] to-[#959595] rounded-[21.33px_5px_23.57px_7px] border border-[#AAAAAA]">
                <span className="text-[#CCCCCC] text-[10px] italic">Operação</span>
                <div className="flex justify-between items-center w-full">
                  <span className="text-white text-[14px] italic font-semibold">Reduzir em %</span>
                  <svg width="12" height="6" viewBox="0 0 12 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 6 5 11 1"></polyline></svg>
                </div>
              </div>

              <div className="flex flex-col w-[128px] gap-2">
                <span className="text-white text-[12px] font-semibold">Percentual</span>
                <input 
                  type="number" 
                  value={percentualDesconto}
                  onChange={(e) => setPercentualDesconto(e.target.value)}
                  className="w-full bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] p-[13px_14px] text-white text-[13px] outline-none focus:border-[#FF7070]"
                />
              </div>

              <button 
                onClick={handleGerarPrevia}
                disabled={selecionados.length === 0}
                className="h-[51px] w-[182px] mt-[26px] bg-[#444444] border border-[#09090A] rounded-[5px] text-white text-[13px] font-bold hover:bg-[#555] transition-colors disabled:opacity-50 cursor-pointer"
              >
                GERAR PRÉVIA
              </button>
            </div>
            
            <span className="text-[#B7B7BF] text-[11px] leading-[16.5px]">
              Selecione os produtos na tabela abaixo e clique em gerar prévia. O estoque pode ser ajustado individualmente.
            </span>
          </div>

          {/* ====== TABELA DE PRODUTOS ====== */}
          <div className="flex flex-col w-full bg-gradient-to-br from-[#292729] to-[#1C1C1F] rounded-[8px] border border-[#414144] overflow-hidden">
            
            <div className="flex items-center w-full bg-[#29292B] px-[18px] py-[16px] gap-[16px]">
              <div 
                onClick={handleToggleSelectAll}
                className={`w-[20px] h-[20px] rounded-[6px_3px_6px_3px] border border-[#CCCCCC] flex items-center justify-center cursor-pointer transition-colors ${selecionados.length === produtosExibidos.length && produtosExibidos.length > 0 ? 'bg-[#FB0000]' : 'bg-transparent'}`}
              >
                {selecionados.length === produtosExibidos.length && produtosExibidos.length > 0 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
              <div className="w-[300px] text-[#B7B7BF] text-[10px] font-normal">PRODUTO / SKU</div>
              <div className="w-[128px] text-[#B7B7BF] text-[10px] font-normal">PREÇO ATUAL</div>
              <div className="w-[158px] text-[#B7B7BF] text-[10px] font-normal">NOVO PROPOSTO</div>
              <div className="w-[90px] text-[#B7B7BF] text-[10px] font-normal">ESTOQUE ATUAL</div>
              <div className="w-[116px] text-[#B7B7BF] text-[10px] font-normal">AJUSTE (+ ou -)</div>
              <div className="flex-1 text-[#B7B7BF] text-[10px] font-normal">NOVO ESTOQUE</div>
            </div>

            {produtosExibidos.length === 0 ? (
              <div className="p-8 text-center text-[#B7B7BF]">Nenhum produto encontrado.</div>
            ) : (
              produtosExibidos.map((prod) => {
                const isSelected = selecionados.includes(prod.id);
                const novoPreco = novosPrecos[prod.id] !== undefined ? novosPrecos[prod.id] : prod.precoVenda;
                const ajusteValor = parseInt(ajustesEstoque[prod.id] || '0');
                const novoEstoque = Math.max(0, prod.estoque + (isNaN(ajusteValor) ? 0 : ajusteValor));

                return (
                  <div key={prod.id} className="flex items-center w-full px-[18px] py-[18px] border-b border-[#414144] gap-[16px] hover:bg-[#1A1A1C]">
                    <div 
                      onClick={() => handleToggleSelect(prod.id)}
                      className={`w-[20px] h-[20px] rounded-[6px_3px_6px_3px] border border-[#CCCCCC] flex items-center justify-center cursor-pointer transition-colors ${isSelected ? 'bg-[#FB0000]' : 'bg-[#2F2F2F]'}`}
                    >
                      {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    
                    <div className="flex items-center w-[300px] gap-[12px]">
                      <img src={prod.imagemPrincipal || "https://placehold.co/56x56"} alt={prod.nome} className="w-[56px] h-[56px] rounded-[4px] object-cover bg-white" />
                      <div className="flex flex-col flex-1 gap-[5px]">
                        <span className="text-white text-[12px] font-semibold leading-[18px] line-clamp-1">{prod.nome}</span>
                        <span className="text-[#B7B7BF] text-[10px] leading-[15px]">{prod.sku}</span>
                        <span className="text-[#8FDEB1] text-[10px] leading-[15px]">{prod.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col w-[128px] gap-[5px]">
                      <span className="text-white text-[12px] font-normal leading-[18px]">R$ {prod.precoVenda.toFixed(2).replace('.', ',')}</span>
                      <span className="text-[#85858E] text-[10px] leading-[15px]">Valor na loja</span>
                    </div>
                    
                    <div className="flex flex-col w-[158px] gap-[8px]">
                      <span className="text-white text-[12px] font-semibold leading-[18px]">Novo preço</span>
                      <input 
                        type="number"
                        step="0.01" 
                        value={novoPreco.toFixed(2)} 
                        onChange={(e) => setNovosPrecos(prev => ({ ...prev, [prod.id]: parseFloat(e.target.value) || prod.precoVenda }))}
                        className="w-full h-[48px] bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] px-[14px] text-white text-[13px] outline-none focus:border-[#FF7070]"
                      />
                    </div>
                    
                    <div className="flex flex-col w-[90px] gap-[5px]">
                      <span className="text-white text-[14px] font-semibold leading-[21px]">{prod.estoque} un.</span>
                      <span className="text-[#85858E] text-[10px] leading-[15px]">Disponível</span>
                    </div>
                    
                    <div className="flex flex-col w-[116px] gap-[8px]">
                      <span className="text-white text-[12px] font-semibold leading-[18px]">Ajuste (un.)</span>
                      <input 
                        type="text" 
                        value={ajustesEstoque[prod.id] || ''}
                        onChange={(e) => handleAjusteEstoqueChange(prod.id, e.target.value)}
                        placeholder="0"
                        className="w-full h-[48px] bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] px-[14px] text-white text-[13px] outline-none focus:border-[#FF7070]"
                      />
                    </div>
                    
                    <div className="flex flex-col flex-1 gap-[5px] pl-[10px]">
                      <span className={`text-[14px] font-semibold leading-[21px] ${novoEstoque !== prod.estoque ? 'text-[#8FDEB1]' : 'text-white'}`}>
                        {novoEstoque} un.
                      </span>
                      <span className="text-[#85858E] text-[10px] leading-[15px]">Após aplicar</span>
                    </div>
                  </div>
                );
              })
            )}

            <div className="flex items-center w-full px-[18px] py-[18px] gap-[10px]">
              <div className="w-[16px] h-[16px] flex items-center justify-center opacity-70">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B7B7BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <span className="text-[#B7B7BF] text-[11px] leading-[16.5px]">
                Use + para entrada e − para saída (ex: -5). Deixe em branco para manter o estoque atual.
              </span>
            </div>
          </div>

          {/* ====== Painel de Confirmação Final ====== */}
          <div className="w-full bg-[#391719] p-[24px] rounded-[8px] border border-[#783236] flex flex-col gap-[18px]">
            
            <div className="flex items-start gap-[12px] w-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div className="flex flex-col flex-1 gap-[4px]">
                <span className="text-white text-[14px] font-semibold leading-[21px]">Prévia pronta para confirmação</span>
                <span className="text-[#B7B7BF] text-[12px] leading-[18px]">
                  {produtosAlterados.length === 0 
                    ? "Nenhuma alteração foi detectada. Os valores atuais continuam na loja."
                    : "Analise o sumário das alterações abaixo antes de aplicar na loja."}
                </span>
              </div>
              {produtosAlterados.length > 0 && (
                <div className="flex items-center gap-1.5 px-[9px] py-[5px] bg-[#391719] rounded-[4px] border border-[#FF7070]/20">
                  <div className="w-[5px] h-[5px] bg-[#FF7070] rounded-[2px]"></div>
                  <span className="text-[#FF7070] text-[11px] font-semibold">Aguardando confirmação</span>
                </div>
              )}
            </div>

            {produtosAlterados.length > 0 && (
              <div className="flex flex-wrap w-full gap-[24px]">
                {produtosAlterados.map(p => {
                  const nPreco = novosPrecos[p.id] !== undefined ? novosPrecos[p.id] : p.precoVenda;
                  const deltaEstoque = parseInt(ajustesEstoque[p.id] || '0');
                  const nEstoque = Math.max(0, p.estoque + (isNaN(deltaEstoque) ? 0 : deltaEstoque));
                  const descPerc = p.precoVenda > 0 ? ((p.precoVenda - nPreco) / p.precoVenda) * 100 : 0;

                  return (
                    <div key={p.id} className="min-w-[300px] flex-1 bg-[#202022] p-[16px] rounded-[4px] flex flex-col gap-[8px]">
                      <span className="text-white text-[12px] font-semibold leading-[18px] line-clamp-1">{p.nome}</span>
                      <span className="text-white text-[12px] font-normal leading-[18px]">
                        R$ {p.precoVenda.toFixed(2).replace('.', ',')} → R$ {nPreco.toFixed(2).replace('.', ',')} 
                        {nPreco !== p.precoVenda && ` (${descPerc > 0 ? '-' : '+'}${Math.abs(descPerc).toFixed(1)}%)`}
                      </span>
                      <span className="text-[#B7B7BF] text-[11px] leading-[16.5px]">
                        Estoque: {p.estoque} → {nEstoque} unidades • {deltaEstoque === 0 || isNaN(deltaEstoque) ? 'sem alteração' : deltaEstoque > 0 ? `entrada de ${deltaEstoque}` : `saída de ${Math.abs(deltaEstoque)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {produtosAlterados.length > 0 && (
              <div className="flex items-center gap-[16px] w-full pt-[10px]">
                <div className="flex flex-1 items-center gap-[10px]">
                  <div className="w-[20px] h-[20px] bg-[#FB0000] rounded-[6px_3px_6px_3px] border border-[#CCCCCC] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-white text-[12px] font-normal">Revisei os novos preços e os ajustes de estoque.</span>
                </div>

                <button 
                  onClick={handleDescartar}
                  className="h-[51px] w-[160px] bg-[#444444] border border-[#09090A] rounded-[5px] text-white text-[13px] font-bold hover:bg-[#555] transition-colors cursor-pointer"
                >
                  DESCARTAR
                </button>
                <button 
                  onClick={handleAplicarAlteracoes}
                  className="h-[51px] w-[230px] bg-[#FF0000] rounded-[5px] text-white text-[13px] font-bold hover:bg-[#cc0000] transition-colors shadow-[0_0_10px_rgba(255,0,0,0.3)] cursor-pointer"
                >
                  APLICAR ALTERAÇÕES
                </button>
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}