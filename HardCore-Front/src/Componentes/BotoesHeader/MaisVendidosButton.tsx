import React, { useState } from 'react';

interface MaisVendidoButtonProps {
  label: string;
  iconWhite: string;
  iconBlack: string;
  onClick?: () => void;
}

export default function MaisVendidoButton({ label, iconWhite, iconBlack, onClick }: MaisVendidoButtonProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      className="
        group flex h-[68px] w-[300px] items-center justify-center gap-[10px] 
        rounded-tl-[23px] rounded-br-[22px] 
        border-[3px] border-solid border-white outline-none
        bg-black transition-all duration-300 ease-out
        hover:bg-[#202020] hover:-translate-y-[3px]
        active:bg-[#F5F5F5] active:border-black active:translate-y-0
      "
    >
      <div className="flex h-[47px] w-[47px] items-center justify-center overflow-hidden">
        <img 
          src={isActive ? iconBlack : iconWhite} 
          alt={`${label} icon`} 
          className="h-full w-full object-contain"
        />
      </div>

      <span className="
        font-['PoetsenOne',sans-serif] text-[32px] font-normal 
        text-white transition-colors duration-300
        group-active:text-[#070707]
      ">
        {label}
      </span>
    </button>
  );
}