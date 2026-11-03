import React from 'react';

interface DepartamentoButtonProps {
  label: string;
  iconWhite: string;
  iconBlack: string;
  isOpen?: boolean;
  onClick?: () => void;
}

export default function DepartamentoButton({ 
  label, 
  iconWhite, 
  iconBlack, 
  isOpen = false, 
  onClick 
}: DepartamentoButtonProps) {
  
  return (
    <button
      onClick={onClick}
      className={`
        group flex h-[68px] w-[300px] items-center justify-center gap-[10px] 
        rounded-tl-[23px] rounded-br-[22px] 
        border-[3px] border-solid outline-none
        transition-all duration-300 ease-out
        ${isOpen 
          ? 'bg-[#F5F5F5] border-black translate-y-0' 
          : 'bg-black border-white hover:bg-[#202020] hover:-translate-y-[3px] active:bg-[#F5F5F5] active:border-black active:translate-y-0'
        }
      `}
    >
      <div className="flex h-[47px] w-[47px] items-center justify-center overflow-hidden">
        <img 
          src={isOpen ? iconBlack : iconWhite} 
          alt={`${label} icon`} 
          className="h-full w-full object-contain"
        />
      </div>

      <span className={`
        font-['PoetsenOne',sans-serif] text-[32px] font-normal 
        transition-colors duration-300
        ${isOpen ? 'text-[#070707]' : 'text-white group-active:text-[#070707]'}
      `}>
        {label}
      </span>
    </button>
  );
}