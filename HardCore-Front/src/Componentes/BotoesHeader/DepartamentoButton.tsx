import React from 'react';

interface DepartamentoButtonProps {
  label: string;
  iconWhite: string;
  iconBlack: string;
  isOpen?: boolean;
  onClick?: () => void;
}

export default function DepartamentoButton({ label, iconWhite, iconBlack, isOpen = false, onClick }: DepartamentoButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex h-[36px] w-[150px] items-center justify-center gap-[6px] 
        rounded-tl-[10px] rounded-br-[10px] 
        border-[2px] border-solid outline-none
        transition-all duration-300 ease-out
        ${isOpen ? 'bg-[#F5F5F5] border-black translate-y-0' : 'bg-black border-white hover:bg-[#202020] hover:-translate-y-[2px] active:bg-[#F5F5F5] active:border-black active:translate-y-0'}
      `}
    >
      <div className="flex h-[18px] w-[18px] items-center justify-center overflow-hidden">
        <img src={isOpen ? iconBlack : iconWhite} alt="icon" className="h-full w-full object-contain" />
      </div>
      <span className={`font-['PoetsenOne',sans-serif] text-[14px] font-normal transition-colors duration-300 pt-[2px] ${isOpen ? 'text-[#070707]' : 'text-white group-active:text-[#070707]'}`}>
        {label}
      </span>
    </button>
  );
}