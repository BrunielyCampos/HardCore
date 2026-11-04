import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DepartamentoButton from '../BotoesHeader/DepartamentoButton';
import CuponsButton from '../BotoesHeader/CuponsButton';
import MaisVendidoButton from '../BotoesHeader/MaisVendidosButton';
import DepartamentoDropdown from '../BotoesHeader/DepartamentoDropdown';

import logoHardcore from './HeaderAnimadoAssets/Hardocre 1.png';
import manchaPreta from './HeaderAnimadoAssets/image 8.png';
import iconLocal from './HeaderAnimadoAssets/icon-park-outline_local.svg';
import iconSearch from './HeaderAnimadoAssets/andrsrxn_search.svg';
import iconUser from './HeaderAnimadoAssets/healthicons_ui-user-profile.svg';
import iconCart from './HeaderAnimadoAssets/ant-design_shopping-cart-outlined.svg';

import iconDeptWhite from '../BotoesHeader/AssetsBotao/flowbite_bars-from-left-outline-1.svg';
import iconDeptBlack from '../BotoesHeader/AssetsBotao/flowbite_bars-from-left-outline.svg';
import iconCupomWhite from '../BotoesHeader/AssetsBotao/fluent-mdl2_coupon-1.svg';
import iconCupomBlack from '../BotoesHeader/AssetsBotao/fluent-mdl2_coupon.svg';
import iconVendidosWhite from '../BotoesHeader/AssetsBotao/iconmind_best-seller-outline-thin-1.svg';
import iconVendidosBlack from '../BotoesHeader/AssetsBotao/iconmind_best-seller-outline-thin.svg';

const gradients = {
  1: 'linear-gradient(168deg, #131313 0%, #3D0000 28%, #200000 50%, #030000 92%)',
  2: 'linear-gradient(169deg, #131313 9%, #052B42 25%, #0C202D 50%, #030000 92%)',
  3: 'linear-gradient(168deg, #131313 0%, #6A4B07 24%, #886210 40%, #031431 80%, #000103 98%)',
};

export default function HeaderAnimado() {
  const [isDepartamentoOpen, setIsDepartamentoOpen] = useState(false);
  const [variant, setVariant] = useState<1 | 2 | 3>(1);

  // Efeito para trocar o banner automaticamente a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setVariant((prev) => (prev === 3 ? 1 : (prev + 1) as 1 | 2 | 3));
    }, 5000);
    return () => clearInterval(timer); // Limpa o timer ao desmontar
  }, []);

  return (
    <header className="relative w-full h-[326px] z-50 bg-white shrink-0">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute left-0 top-0 w-full h-[326px]">
          <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${variant === 1 ? 'opacity-100' : 'opacity-0'}`} style={{ background: gradients[1] }} />
          <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${variant === 2 ? 'opacity-100' : 'opacity-0'}`} style={{ background: gradients[2] }} />
          <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${variant === 3 ? 'opacity-100' : 'opacity-0'}`} style={{ background: gradients[3] }} />
        </div>

        <img src={manchaPreta} alt="" className="absolute" style={{ width: '500px', height: '445px', left: '250px', top: '163px', transform: 'translate(-50%, -50%) rotate(-0deg)', transformOrigin: 'center center', objectFit: 'contain' }} />
        <img src={logoHardcore} alt="Logo Hardcore" className="absolute" style={{ width: '428px', height: '297px', left: '-6px', top: '30px', transform: 'rotate(-1deg)', transformOrigin: 'top left' }} />
      </div>

      {/* Inputs e Botões do Header (mantidos nas posições originais) */}
      <div className="absolute left-[456px] top-[97px] flex items-center gap-[10px] z-20">
        <div className="flex h-[46px] w-[46px] items-center justify-center overflow-hidden">
          <img src={iconLocal} alt="Local" className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-['Inter'] text-[22.40px] font-semibold text-white leading-tight">Enviar para:</span>
          <span className="font-['Inter'] text-[18.77px] font-light italic text-white leading-tight">Digite o CEP</span>
        </div>
      </div>

      <div className="absolute left-[660px] top-[90px] flex h-[56px] w-[426.36px] items-center gap-[14px] rounded-tl-[24.18px] rounded-br-[26.73px] rounded-bl-[5.09px] bg-white px-[10.18px] shadow-lg z-20">
        <div className="flex h-[30.55px] w-[30.55px] items-center justify-center overflow-hidden">
          <img src={iconSearch} alt="Buscar" className="h-full w-full object-contain opacity-70" />
        </div>
        <input type="text" placeholder="Buscar produtos" className="w-full bg-transparent font-['Inter'] text-[28.51px] font-extralight italic text-black placeholder:text-black/40 focus:outline-none" />
      </div>

      <div className="absolute left-[1108px] top-[80px] flex items-center gap-[15px] z-20">
        <div className="flex h-[62px] w-[62px] items-center justify-center overflow-hidden">
          <img src={iconUser} alt="Perfil" className="h-full w-full object-contain" />
        </div>
        <span className="font-['Inter'] text-[18.85px] font-bold text-white leading-tight">
          <Link to="/login" className="hover:text-[#B3B3B3] transition-colors cursor-pointer pointer-events-auto">Entre</Link> ou<br />
          <Link to="/cadastro" className="hover:text-[#B3B3B3] transition-colors cursor-pointer pointer-events-auto">Cadastre-se</Link>
        </span>
      </div>

      <div className="absolute left-[1308px] top-[71px] flex h-[66px] w-[66px] items-center justify-center overflow-hidden z-20 cursor-pointer pointer-events-auto">
        <img src={iconCart} alt="Carrinho" className="h-full w-full object-contain" />
        <div className="absolute top-[0px] right-[0px] flex h-[31px] w-[31px] items-center justify-center rounded-full shadow-md" style={{ background: 'linear-gradient(180deg, #FEFEFE 41%, black 100%)' }}>
          <span className="font-['Iosevka_Charon'] text-[18px] font-normal text-[#00174F] pt-[2px]">0</span>
        </div>
      </div>

      <div className="absolute left-[470px] top-[186.22px] flex items-center gap-[20px] z-30">
        <div className="relative">
          <DepartamentoButton label="Departamento" iconWhite={iconDeptWhite} iconBlack={iconDeptBlack} isOpen={isDepartamentoOpen} onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)} />
          <DepartamentoDropdown isOpen={isDepartamentoOpen} />
        </div>
        <CuponsButton label="Cupons" iconWhite={iconCupomWhite} iconBlack={iconCupomBlack} />
        <MaisVendidoButton label="Mais vendidos" iconWhite={iconVendidosWhite} iconBlack={iconVendidosBlack} />
      </div>
    </header>
  );
}