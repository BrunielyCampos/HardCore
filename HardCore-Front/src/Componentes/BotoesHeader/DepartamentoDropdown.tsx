import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DepartamentoDropdownProps {
  isOpen: boolean;
  onClose?: () => void;
}

const departamentosData = [
  {
    categoria: "HARDWARE",
    itens: [
      "Processadores", "Placas de vídeo", "Placas-mãe", "Memórias RAM",
      "SSDs", "HDs", "Armazenamento externo", "Fontes de alimentação",
      "Gabinetes", "Coolers e water coolers", "Ventoinhas", "Pasta térmica"
    ]
  },
  {
    categoria: "INFORMÁTICA E PERIFÉRICOS",
    itens: [
      "Computadores e PCs gamer", "Notebooks", "Monitores", "Teclados",
      "Mouses", "Mousepads", "Headsets", "Fones de ouvido", "Caixas de som",
      "Microfones", "Webcams", "Redes e Wi-Fi", "Impressoras e suprimentos"
    ]
  },
  {
    categoria: "GAMES E ACESSÓRIOS",
    itens: [
      "Consoles", "Jogos", "Controles", "Acessórios para consoles",
      "Volantes e simuladores", "Óculos e acessórios VR", "Captura e streaming",
      "Cadeiras gamer", "Mesas gamer", "Cabos e adaptadores", "Hubs e docks",
      "Nobreaks e filtros de linha", "Mochilas e suportes"
    ]
  }
];

export default function DepartamentoDropdown({ isOpen, onClose }: DepartamentoDropdownProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const selecionarCategoria = (nomeCategoria: string) => {
    onClose?.();
    navigate(`/categoria/${encodeURIComponent(nomeCategoria)}`);
  };

  return (
    <div className="absolute left-0 top-[45px] z-50 w-[600px] rounded-[8px] border border-[#525252] bg-[#0E0E0E] p-[20px] shadow-2xl overflow-hidden cursor-default pointer-events-auto">
      <div className="flex flex-col">
        <h2 className="font-['PoetsenOne',sans-serif] text-[20px] font-normal text-white leading-none">
          Todas as categorias
        </h2>
        <p className="mt-[5px] font-['Inter',sans-serif] text-[13px] font-normal text-[#B3B3B3]">
          Encontre produtos por departamento
        </p>
      </div>

      <div className="mt-[15px] grid grid-cols-3 gap-[15px]">
        {departamentosData.map((coluna, index) => (
          <div key={index} className="flex flex-col gap-[4px]">
            <h3
              onClick={() => selecionarCategoria(coluna.categoria)}
              className="font-['PoetsenOne',sans-serif] text-[14px] font-normal text-[#FF1F1F] mb-[4px] cursor-pointer hover:underline"
            >
              {coluna.categoria}
            </h3>
            {coluna.itens.map((item, itemIndex) => (
              <div
                key={itemIndex}
                onClick={() => selecionarCategoria(item)}
                className="flex h-[28px] items-center px-[6px] rounded hover:bg-[#202020] cursor-pointer transition-colors"
              >
                <span className="font-['Inter',sans-serif] text-[13px] font-normal text-white">
                  {item}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-[15px] h-[1px] w-full bg-[#333333]" />

      <div className="mt-[10px]">
        <span className="font-['Inter',sans-serif] text-[11px] font-normal text-[#B3B3B3]">
          HARDCORE  •  Departamentos da loja
        </span>
      </div>
    </div>
  );
}