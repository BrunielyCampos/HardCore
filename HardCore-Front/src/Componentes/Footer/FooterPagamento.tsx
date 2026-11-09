import React from 'react';
import pagamentoImg from '../../assets/HomeAsset/Pagamento.png';

export default function Footer() {
  return (
    <footer 
      className="w-full relative mt-[80px]" 
      style={{ background: 'linear-gradient(180deg, #222020 14%, #160202 100%)' }}
    >
      <div className="mx-auto relative h-[424px] w-full max-w-[1509px]">
        
        <div className="absolute left-[70px] top-[52px]">
          <h3 className="mb-[15px] font-['Inter'] text-[19.41px] font-semibold text-white">
            Formas de Pagamento
          </h3>
          <img src={pagamentoImg} alt="Bandeiras de Pagamento" className="h-[94px] w-[668px] object-contain" />
        </div>

        <div className="absolute left-[36px] top-[211px] h-[2px] w-[1419px] bg-[#0A0A0A]" />

        <div className="absolute top-[250px] left-[70px] flex w-[1350px] justify-between text-white font-['Inter']">
          
          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-[18px] font-bold">Institucional</h4>
            <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Sobre a HardCore</a>
            <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Política de Privacidade</a>
            <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Termos e Condições</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-[18px] font-bold">Ajuda e Suporte</h4>
            <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Central de Atendimento</a>
            <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Trocas e Devoluções</a>
            <a href="#" className="text-[15px] text-[#ACACAC] transition-colors hover:text-white">Prazos e Entregas</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-[18px] font-bold">Atendimento</h4>
            <span className="text-[15px] text-[#ACACAC]">Seg. a Sex. das 08h às 18h</span>
            <span className="text-[15px] text-[#ACACAC]">suporte@hardcore.com.br</span>
            <span className="text-[15px] text-[#ACACAC]">WhatsApp: (84) 99999-9999</span>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-[18px] font-bold">Segurança</h4>
            <div className="flex gap-4">
               <div className="flex h-[45px] w-[45px] items-center justify-center rounded bg-white/10 text-[10px] text-[#ACACAC]">SSL</div>
               <div className="flex h-[45px] w-[45px] items-center justify-center rounded bg-white/10 text-[10px] text-[#ACACAC]">Safe</div>
            </div>
          </div>

        </div>

        <div className="absolute bottom-[10px] w-full text-center font-['Inter'] text-[13px] text-[#666666]">
          © 2026 HardCore. Todos os direitos reservados. Nova Cruz - RN.
        </div>

      </div>
    </footer>
  );
}