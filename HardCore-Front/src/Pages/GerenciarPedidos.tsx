import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoHardcore from '../assets/HomeAsset/Hardocre 1.png';
import { usePedidos } from '../Context/PedidoContext'; 

export default function GerenciarPedidos() {
  const { pedidos, atualizarEntrega } = usePedidos();
  
  const [motoristaInput, setMotoristaInput] = useState<Record<string, string>>({});
  const [veiculoInput, setVeiculoInput] = useState<Record<string, string>>({});

  const handleDespachar = (id: string) => {
    const motorista = motoristaInput[id];
    const veiculo = veiculoInput[id];
    
    if (!motorista || !veiculo) {
      alert("Por favor, informe o Motorista e o Veículo para despachar a entrega.");
      return;
    }

    atualizarEntrega(id, motorista, veiculo, 'Em rota');
    alert("Pedido despachado! O cliente já pode ver no rastreio.");
  };

  const handleFinalizarEntrega = (id: string, p: any) => {
    atualizarEntrega(id, p.motorista, p.veiculo, 'Entregue');
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
              <p className="text-[#B7B7BF] text-[14px] font-normal mt-1">Aloque motoristas para os pedidos aguardando entrega.</p>
            </div>
          </div>

          <div className="flex flex-col w-full bg-gradient-to-br from-[#292729] to-[#1C1C1F] rounded-[8px] border border-[#414144] overflow-hidden">
            
            <div className="flex items-center w-full bg-[#29292B] px-[20px] py-[16px] gap-[16px]">
              <div className="w-[150px] text-[#B7B7BF] text-[11px] font-normal">PEDIDO / DATA</div>
              <div className="w-[200px] text-[#B7B7BF] text-[11px] font-normal">ITENS / TOTAL</div>
              <div className="w-[120px] text-[#B7B7BF] text-[11px] font-normal">STATUS</div>
              <div className="flex-1 text-[#B7B7BF] text-[11px] font-normal">ATRIBUIÇÃO DE MOTORISTA</div>
              <div className="w-[150px] text-[#B7B7BF] text-[11px] font-normal text-right">AÇÕES</div>
            </div>

            {pedidos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-[#B7B7BF]">
                <span className="text-[14px]">Nenhum pedido recebido ainda. Faça uma compra na loja!</span>
              </div>
            ) : (
              [...pedidos].reverse().map((prod) => (
                <div key={prod.id} className="flex items-center w-full min-h-[100px] px-[20px] py-[20px] border-b border-[#414144] gap-[16px]">
                  
                  <div className="flex flex-col w-[150px] gap-1">
                    <span className="text-white text-[14px] font-bold">{prod.id}</span>
                    <span className="text-[#B7B7BF] text-[11px]">{new Date(prod.dataCriacao).toLocaleTimeString()}</span>
                  </div>

                  <div className="flex flex-col w-[200px] gap-1">
                    <span className="text-white text-[13px] font-medium line-clamp-1">{prod.itens.length} produto(s)</span>
                    <span className="text-[#00C016] text-[14px] font-bold">R$ {prod.valorTotal.toFixed(2).replace('.', ',')}</span>
                  </div>

                  <div className="flex flex-col w-[120px]">
                    <div className={`flex items-center justify-center py-[5px] rounded-[4px] border 
                      ${prod.status === 'Confirmado' ? 'bg-[#391719] border-[#FF7070] text-[#FF7070]' : 
                        prod.status === 'Em rota' ? 'bg-[#1C3026] border-[#8FDEB1] text-[#8FDEB1]' : 
                        'bg-[#1a2b3c] border-[#4dabf7] text-[#4dabf7]'}`}
                    >
                      <span className="text-[11px] font-semibold">{prod.status}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center gap-[10px]">
                    {prod.status === 'Confirmado' ? (
                      <>
                        <input 
                          type="text" 
                          placeholder="Nome do Motorista"
                          value={motoristaInput[prod.id] || ''}
                          onChange={(e) => setMotoristaInput(prev => ({...prev, [prod.id]: e.target.value}))}
                          className="flex-1 h-[40px] bg-black/50 border border-[#8C8C90] rounded-[4px] px-3 text-white text-[13px] outline-none focus:border-[#FF7070]"
                        />
                        <input 
                          type="text" 
                          placeholder="Placa / Veículo"
                          value={veiculoInput[prod.id] || ''}
                          onChange={(e) => setVeiculoInput(prev => ({...prev, [prod.id]: e.target.value}))}
                          className="w-[120px] h-[40px] bg-black/50 border border-[#8C8C90] rounded-[4px] px-3 text-white text-[13px] outline-none focus:border-[#FF7070]"
                        />
                      </>
                    ) : (
                      <div className="flex flex-col text-[#B7B7BF] text-[12px]">
                        <span><b className="text-white">Resp:</b> {prod.motorista}</span>
                        <span><b className="text-white">Veículo:</b> {prod.veiculo}</span>
                      </div>
                    )}
                  </div>

                  <div className="w-[150px] flex justify-end">
                    {prod.status === 'Confirmado' && (
                      <button onClick={() => handleDespachar(prod.id)} className="px-4 py-2 bg-[#FF0000] text-white text-[12px] font-bold rounded-[4px] hover:bg-[#cc0000] transition-colors cursor-pointer">
                        DESPACHAR
                      </button>
                    )}
                    {prod.status === 'Em rota' && (
                      <button onClick={() => handleFinalizarEntrega(prod.id, prod)} className="px-4 py-2 bg-[#00C016] text-white text-[12px] font-bold rounded-[4px] hover:bg-[#009911] transition-colors cursor-pointer">
                        MARCAR ENTREGUE
                      </button>
                    )}
                    {prod.status === 'Entregue' && (
                      <span className="text-[#B7B7BF] text-[12px] italic">Finalizado</span>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}