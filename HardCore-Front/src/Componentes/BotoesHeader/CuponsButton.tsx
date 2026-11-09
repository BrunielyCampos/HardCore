import React, { useState } from 'react';

interface CuponsButtonProps {
  label: string;
  iconWhite: string;
  iconBlack: string;
  onClick?: () => void;
}

export default function CuponsButton({ label, iconWhite, iconBlack, onClick }: CuponsButtonProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      className="
        group flex h-[36px] w-[130px] items-center justify-center gap-[6px] 
        rounded-tl-[10px] rounded-br-[10px] 
        border-[2px] border-solid border-white outline-none
        bg-black transition-all duration-300 ease-out
        hover:bg-[#202020] hover:-translate-y-[2px]
        active:bg-[#F5F5F5] active:border-black active:translate-y-0
      "
    >
      <div className="flex h-[18px] w-[18px] items-center justify-center overflow-hidden">
        <img src={isActive ? iconBlack : iconWhite} alt="icon" className="h-full w-full object-contain" />
      </div>
      <span className="font-['PoetsenOne',sans-serif] text-[14px] font-normal text-white transition-colors duration-300 group-active:text-[#070707] pt-[2px]">
        {label}
      </span>
    </button>
  );
}