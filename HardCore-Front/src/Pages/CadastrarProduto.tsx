import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoHardcore from '../assets/HomeAsset/Hardocre 1.png';
import { useProdutos, type Produto } from '../Context/ProdutoContext';

export default function CadastrarProduto() {
  const navigate = useNavigate();
  const { adicionarProduto } = useProdutos();

  // ================= ESTADOS DO FORMULÁRIO =================
  const [nome, setNome] = useState('');
  const [sku, setSku] = useState('');
  const [categoria, setCategoria] = useState('Processadores');
  const [descricao, setDescricao] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [precoPromocional, setPrecoPromocional] = useState('');
  const [estoque, setEstoque] = useState('0');
  const [controlarEstoque, setControlarEstoque] = useState(true);

  // ================= FUNÇÃO DE SALVAR =================
  const handleSalvar = (statusDesejado: 'Publicado' | 'Rascunho') => {
    // Validação básica
    if (!nome || !sku || !precoVenda || !estoque) {
      alert("Por favor, preenche todos os campos obrigatórios (*).");
      return;
    }

    // Criar o objeto do novo produto
    const novoProduto: Produto = {
      id: Math.random().toString(36).substr(2, 9), // Gera um ID aleatório
      nome,
      sku,
      categoria,
      descricao,
      precoVenda: parseFloat(precoVenda.replace(',', '.')),
      precoPromocional: precoPromocional ? parseFloat(precoPromocional.replace(',', '.')) : undefined,
      estoque: parseInt(estoque, 10),
      status: statusDesejado,
      imagemPrincipal: "https://placehold.co/116x116" // Placeholder como padrão para o teste
    };

    // Salvar no Contexto Global
    adicionarProduto(novoProduto);

    // Voltar para a lista de produtos
    navigate('/gerenciar-produtos');
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

            {/* ATIVO */}
            <Link to="/cadastrar-produto" className="flex items-center gap-[10px] h-[48px] px-3 bg-[#391719] border-l-[3px] border-[#FF0000] rounded-r-[2px] rounded-l-[12px] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span className="text-white text-[12px] font-semibold">Cadastrar produto</span>
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

        {/* ------ CONTEÚDO PRINCIPAL ------ */}
        <main className="flex-1 p-[32px] flex flex-col gap-6 overflow-y-auto">
          
          {/* Header da Seção */}
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[#B7B7BF] text-[11px] font-normal tracking-[1.2px] uppercase">
                GERENCIADOR / CATÁLOGO
              </span>
              <h1 className="text-white text-[38px] font-['Iosevka_Charon'] font-normal leading-none mt-1">
                Cadastrar produto
              </h1>
              <p className="text-[#B7B7BF] text-[14px] font-normal mt-1">
                Insira as informações, imagens e os dados comerciais do seu novo produto.
              </p>
            </div>
            {/* Tag visual de rascunho por padrão no cadastro */}
            <div className="flex items-center gap-1.5 px-[9px] py-[5px] bg-[#391719] rounded-[4px]">
              <div className="w-[5px] h-[5px] bg-[#FF7070] rounded-[2px]"></div>
              <span className="text-[#FF7070] text-[11px] font-semibold">Novo Cadastro</span>
            </div>
          </div>

          <div className="flex justify-between items-start w-full">
            <Link to="/gerenciar-produtos" className="text-[#FF7070] text-[12px] font-normal hover:underline">
              ← Voltar para gerenciar produtos
            </Link>
            <span className="text-[#B7B7BF] text-[11px] font-normal">
              Campos com * são obrigatórios
            </span>
          </div>

          <div className="flex gap-[24px] w-full items-start">
            
            {/* ====== COLUNA ESQUERDA: INFORMAÇÕES ====== */}
            <div className="flex flex-col flex-1 gap-[24px]">
              
              <div className="bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[24px] rounded-[8px] border border-[#414144] flex flex-col gap-[20px]">
                <h2 className="text-white text-[22px] font-['Iosevka_Charon'] font-bold">Informações do produto</h2>
                
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-white text-[12px] font-semibold">Nome do produto *</label>
                  <input 
                    type="text" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Placa de Vídeo RTX 4060..." 
                    className="w-full bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] p-[13px_14px] text-white text-[13px] outline-none focus:border-[#FF7070] placeholder:text-white/50"
                  />
                </div>

                <div className="flex gap-[16px] w-full">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-white text-[12px] font-semibold">SKU *</label>
                    <input 
                      type="text" 
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="Ex: HC-GPU-001" 
                      className="w-full bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] p-[13px_14px] text-white text-[13px] outline-none focus:border-[#FF7070] placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2 w-[300px]">
                    <label className="text-white text-[12px] font-semibold">Categoria *</label>
                    {/* Transformado num Select Nativo Funcional */}
                    <div className="relative w-full h-[48px]">
                      <select 
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="w-full h-full bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] p-[0_14px] text-white text-[13px] outline-none focus:border-[#FF7070] appearance-none cursor-pointer"
                      >
                        <option value="Processadores">Processadores</option>
                        <option value="Placas de Vídeo">Placas de Vídeo</option>
                        <option value="Memória RAM">Memória RAM</option>
                        <option value="Placas Mãe">Placas Mãe</option>
                        <option value="Jogos">Jogos</option>
                        <option value="Periféricos">Periféricos</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 6 5 11 1"></polyline></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="text-white text-[12px] font-semibold">Descrição do produto *</label>
                  <textarea 
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Detalha as especificações do produto aqui..."
                    className="w-full min-h-[128px] bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] p-[13px_14px] text-white text-[13px] outline-none focus:border-[#FF7070] resize-none placeholder:text-white/50"
                  ></textarea>
                  <span className="text-[#B7B7BF] text-[11px] leading-[16.5px]">Use uma descrição clara e confira as especificações antes de publicar.</span>
                </div>
              </div>

              {/* Imagens do Produto (Visual Mockado para Upload) */}
              <div className="bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[24px] rounded-[8px] border border-[#414144] flex flex-col gap-[20px]">
                <h2 className="text-white text-[22px] font-['Iosevka_Charon'] font-bold">Imagens do produto</h2>
                
                <div className="flex items-start gap-[18px] w-full overflow-x-auto pb-2 custom-scrollbar">
                  {/* Adicionar Imagem Principal */}
                  <button className="flex-1 min-w-[200px] h-[116px] rounded-[6px] border border-dashed border-[#85858E] flex flex-col items-center justify-center gap-[10px] hover:bg-[#1A1A1C] transition-colors cursor-pointer">
                    <div className="w-[24px] h-[24px] relative">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF7070" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <span className="text-white text-[12px] font-semibold">Adicionar imagens</span>
                    <span className="text-[#B7B7BF] text-[10px]">JPG ou PNG • até 5 MB</span>
                  </button>
                </div>
                
                <span className="text-[#B7B7BF] text-[11px] leading-[16.5px]">A primeira imagem é a capa exibida no catálogo.</span>
              </div>
            </div>

            {/* ====== COLUNA DIREITA: PREÇO E ESTOQUE ====== */}
            <div className="w-[360px] flex flex-col gap-[24px]">
              
              <div className="bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[24px] rounded-[8px] border border-[#414144] flex flex-col gap-[20px]">
                <h2 className="text-white text-[22px] font-['Iosevka_Charon'] font-bold">Preço e estoque</h2>
                
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-white text-[12px] font-semibold">Preço de venda (R$) *</label>
                  <input 
                    type="number"
                    step="0.01" 
                    value={precoVenda}
                    onChange={(e) => setPrecoVenda(e.target.value)}
                    placeholder="Ex: 1199.99" 
                    className="w-full bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] p-[13px_14px] text-white text-[13px] outline-none focus:border-[#FF7070] placeholder:text-white/50"
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="text-white text-[12px] font-semibold">Preço promocional (R$)</label>
                  <input 
                    type="number"
                    step="0.01"  
                    value={precoPromocional}
                    onChange={(e) => setPrecoPromocional(e.target.value)}
                    placeholder="Não definido" 
                    className="w-full bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] p-[13px_14px] text-white text-[13px] outline-none focus:border-[#FF7070] placeholder:text-white/50"
                  />
                  <span className="text-[#B7B7BF] text-[11px]">Opcional. Deve ser menor que o preço de venda.</span>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="text-white text-[12px] font-semibold">Quantidade inicial *</label>
                  <input 
                    type="number" 
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                    className="w-full bg-gradient-to-br from-[#2F2F2F] to-[#767679] border border-[#8C8C90] rounded-[12px_3px_13px_4px] p-[13px_14px] text-white text-[13px] outline-none focus:border-[#FF7070]"
                  />
                </div>

                <label className="flex items-center gap-[10px] cursor-pointer group" onClick={() => setControlarEstoque(!controlarEstoque)}>
                  <div className={`w-[20px] h-[20px] rounded-[6px_3px_6px_3px] border border-[#CCCCCC] flex items-center justify-center transition-colors ${controlarEstoque ? 'bg-[#FB0000]' : 'bg-[#2F2F2F]'}`}>
                     {controlarEstoque && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <span className="text-white text-[11px] group-hover:text-[#B7B7BF] transition-colors">Controlar estoque deste produto</span>
                </label>
              </div>

              {/* Status Visual (Será decidido pelos botões finais) */}
              <div className="bg-gradient-to-br from-[#292729] to-[#1C1C1F] p-[24px] rounded-[8px] border border-[#414144] flex flex-col gap-[20px]">
                <h2 className="text-white text-[22px] font-['Iosevka_Charon'] font-bold">Publicação</h2>
                
                <div className="flex flex-col justify-center w-full h-[64px] px-[13px] bg-gradient-to-br from-[#2F2F2F] to-[#959595] rounded-[21.33px_5px_23.57px_7px] border border-[#AAAAAA] opacity-70 cursor-not-allowed">
                  <span className="text-[#CCCCCC] text-[10px] italic">Status definido ao salvar</span>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-white text-[14px] italic font-semibold">Automático</span>
                  </div>
                </div>
                
                <span className="text-[#B7B7BF] text-[11px] leading-[16.5px]">Selecione "Salvar Rascunho" ou "Salvar e Publicar" no rodapé para finalizar a ação.</span>
              </div>
            </div>

          </div>

          {/* ====== BARRA FIXA INFERIOR - AÇÕES FINAIS ====== */}
          <div className="w-full bg-[#202022] p-[20px] rounded-[8px] border border-[#414144] flex items-center justify-between gap-[16px] mt-4 shadow-xl">
            <div className="flex flex-col flex-1 gap-1">
              <span className="text-white text-[13px] font-semibold">Pronto para criar o produto?</span>
              <span className="text-[#B7B7BF] text-[11px]">As alterações só aparecem na loja se publicares.</span>
            </div>
            
            <div className="flex gap-[12px]">
              <button 
                onClick={() => navigate('/gerenciar-produtos')}
                className="h-[51px] w-[150px] bg-[#444444] border border-[#09090A] rounded-[5px] text-white text-[13px] font-bold hover:bg-[#555] transition-colors cursor-pointer"
              >
                CANCELAR
              </button>
              
              <button 
                onClick={() => handleSalvar('Rascunho')}
                className="h-[51px] w-[198px] bg-[#444444] border border-[#09090A] rounded-[5px] text-white text-[13px] font-bold hover:bg-[#555] transition-colors cursor-pointer"
              >
                SALVAR RASCUNHO
              </button>
              
              <button 
                onClick={() => handleSalvar('Publicado')}
                className="h-[51px] w-[220px] bg-[#FF0000] rounded-[5px] text-white text-[13px] font-bold hover:bg-[#cc0000] transition-colors shadow-[0_0_10px_rgba(255,0,0,0.3)] cursor-pointer"
              >
                SALVAR E PUBLICAR
              </button>
            </div>
          </div>

          <div className="flex justify-between items-start pt-2 mt-4">
             <span className="text-[#85858E] text-[10px] leading-[15px]">HARDCORE • Gerenciador da loja</span>
             <span className="text-[#85858E] text-[10px] leading-[15px]">Ambiente totalmente funcional</span>
          </div>

        </main>
      </div>
    </div>
  );
}