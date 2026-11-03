import { useState } from 'react';
import HeaderAnimado from '../Componentes/HeaderAnimado/HeaderAnimado';
import './Home.css';

export default function Home() {
  // Estado para controlar qual variante (cor) o Header está usando
  const [headerVariant, setHeaderVariant] = useState<1 | 2 | 3>(1);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#121214] overflow-x-hidden">
      
      {/* Header importado recebendo o state da variante atual */}
      <HeaderAnimado variant={headerVariant} />

      {/* Conteúdo Provisório para Teste */}
      <main className="flex w-full flex-col items-center justify-center pt-32">
        <h1 className="mb-8 font-['PoetsenOne',sans-serif] text-4xl text-white">
          teste
        </h1>
        
        <div className="flex gap-6">
          <button 
            onClick={() => setHeaderVariant(1)}
            className={`cursor-pointer rounded-md px-6 py-3 font-['Inter'] font-bold transition-all duration-300 ${
              headerVariant === 1 ? 'bg-[#FF1F1F] text-white' : 'bg-[#2F2F2F] text-[#AAAAAA] hover:bg-[#3F3F3F]'
            }`}
          >
            Variante 1 (Vermelho)
          </button>
          
          <button 
            onClick={() => setHeaderVariant(2)}
            className={`cursor-pointer rounded-md px-6 py-3 font-['Inter'] font-bold transition-all duration-300 ${
              headerVariant === 2 ? 'bg-[#052B42] text-white' : 'bg-[#2F2F2F] text-[#AAAAAA] hover:bg-[#3F3F3F]'
            }`}
          >
            Variante 2 (Azul)
          </button>
          
          <button 
            onClick={() => setHeaderVariant(3)}
            className={`cursor-pointer rounded-md px-6 py-3 font-['Inter'] font-bold transition-all duration-300 ${
              headerVariant === 3 ? 'bg-[#886210] text-white' : 'bg-[#2F2F2F] text-[#AAAAAA] hover:bg-[#3F3F3F]'
            }`}
          >
            Variante 3 (Amarelo)
          </button>
        </div>
      </main>

    </div>
  );
}