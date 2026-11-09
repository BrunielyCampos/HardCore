import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../../Context/CarrinhoContext'; // <-- Importe o contexto (ajuste os '../../' se necessário)
import DepartamentoButton from '../BotoesHeader/DepartamentoButton';
import CuponsButton from '../BotoesHeader/CuponsButton';
import MaisVendidoButton from '../BotoesHeader/MaisVendidosButton';
import DepartamentoDropdown from '../BotoesHeader/DepartamentoDropdown';

import logoHardcore from './HeaderSimplesAssets/Hardocre 1.png';
import manchaPreta from './HeaderSimplesAssets/image 8.png';
import iconLocal from './HeaderSimplesAssets/icon-park-outline_local.svg';
import iconSearch from './HeaderSimplesAssets/andrsrxn_search.svg';
import iconUser from './HeaderSimplesAssets/healthicons_ui-user-profile.svg';
import iconCart from './HeaderSimplesAssets/ant-design_shopping-cart-outlined.svg';

import iconDeptWhite from '../BotoesHeader/AssetsBotao/flowbite_bars-from-left-outline-1.svg';
import iconDeptBlack from '../BotoesHeader/AssetsBotao/flowbite_bars-from-left-outline.svg';
import iconCupomWhite from '../BotoesHeader/AssetsBotao/fluent-mdl2_coupon-1.svg';
import iconCupomBlack from '../BotoesHeader/AssetsBotao/fluent-mdl2_coupon.svg';
import iconVendidosWhite from '../BotoesHeader/AssetsBotao/iconmind_best-seller-outline-thin-1.svg';
import iconVendidosBlack from '../BotoesHeader/AssetsBotao/iconmind_best-seller-outline-thin.svg';

export default function HeaderSimples() {
  const [isDepartamentoOpen, setIsDepartamentoOpen] = useState(false);
  const { quantidadeCarrinho } = useCarrinho(); // <-- Puxa a quantidade dinâmica do contexto

  return (
    <header className="fixed top-0 left-0 w-full h-[140px] z-50 bg-white shrink-0 shadow-md flex justify-center items-center">
      
      {/* Background e Logos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Fundo Estático Vermelho */}
        <div 
          className="absolute inset-0 w-full h-[140px]"
          style={{ background: 'linear-gradient(168deg, #131313 0%, #3D0000 28%, #200000 50%, #030000 92%)' }}
        />

        {/* Link com tamanho fixo atuando como contêiner absoluto */}
        <Link 
          to="/home" 
          className="absolute left-0 top-0 w-[250px] h-[140px] block cursor-pointer pointer-events-auto z-30 transition-transform hover:scale-105"
        >
          <img
            src={manchaPreta}
            alt=""
            className="absolute w-[250px] h-[222px] left-[220px] top-[70px] -translate-x-1/2 -translate-y-1/2 object-contain"
          />
          <img 
            src={logoHardcore} 
            alt="Logo Hardcore" 
            className="absolute w-[190px] h-[132px] left-[110px] top-[5px] -rotate-1 origin-top-left"
          />
        </Link>
      </div>

      {/* Container Central Flexível */}
      <div className="relative z-20 flex flex-col justify-center items-center gap-[15px] w-full max-w-[1000px] ml-[150px]">
        
        {/* Linha 1: Input e Acessos */}
        <div className="flex items-center justify-center gap-[30px] w-full">
          <div className="flex items-center gap-[10px]">
            <img src={iconLocal} alt="Local" className="h-[36px] w-[36px] object-contain" />
            <div className="flex flex-col">
              <span className="font-['Inter'] text-[15px] font-semibold text-white leading-tight">Enviar para:</span>
              <span className="font-['Inter'] text-[13px] font-light italic text-white leading-tight">Digite o CEP</span>
            </div>
          </div>

          <div className="flex h-[40px] w-[380px] items-center gap-[14px] rounded-tl-[20px] rounded-br-[20px] rounded-bl-[5px] bg-white px-[15px] shadow-lg">
            <img src={iconSearch} alt="Buscar" className="h-[20px] w-[20px] object-contain opacity-70" />
            <input 
              type="text" 
              placeholder="Buscar produtos" 
              className="w-full bg-transparent font-['Inter'] text-[16px] font-extralight italic text-black placeholder:text-black/40 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-[10px]">
            <img src={iconUser} alt="Perfil" className="h-[40px] w-[40px] object-contain" />
            <span className="font-['Inter'] text-[14px] font-bold text-white leading-tight">
              <Link to="/login" className="hover:text-[#B3B3B3] transition-colors cursor-pointer pointer-events-auto">Entre</Link> ou<br />
              <Link to="/cadastro" className="hover:text-[#B3B3B3] transition-colors cursor-pointer pointer-events-auto">Cadastre-se</Link>
            </span>
          </div>

          {/* Carrinho Dinâmico */}
          <div className="relative flex h-[46px] w-[46px] items-center justify-center pointer-events-auto">
            {quantidadeCarrinho > 0 ? (
              <Link to="/carrinho" className="hover:scale-105 transition-transform cursor-pointer h-full w-full flex items-center justify-center">
                <img src={iconCart} alt="Carrinho" className="h-full w-full object-contain" />
              </Link>
            ) : (
              <div className="h-full w-full opacity-70 cursor-not-allowed flex items-center justify-center">
                <img src={iconCart} alt="Carrinho" className="h-full w-full object-contain" />
              </div>
            )}
            
            <div className="absolute top-0 right-0 flex h-[20px] w-[20px] items-center justify-center rounded-full shadow-md bg-gradient-to-b from-[#FEFEFE] to-black pointer-events-none">
              <span className="font-['Iosevka_Charon'] text-[12px] font-normal text-[#00174F] pt-[2px]">
                {quantidadeCarrinho}
              </span>
            </div>
          </div>
        </div>

        {/* Linha 2: Botões */}
        <div className="flex items-center justify-center gap-[20px] w-full mr-[120px]">
          <div className="relative">
            <DepartamentoButton 
              label="Departamento" 
              iconWhite={iconDeptWhite} 
              iconBlack={iconDeptBlack}
              isOpen={isDepartamentoOpen} 
              onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)}
            />
            <DepartamentoDropdown isOpen={isDepartamentoOpen} />
          </div>

          <CuponsButton 
            label="Cupons" 
            iconWhite={iconCupomWhite} 
            iconBlack={iconCupomBlack} 
          />

          <MaisVendidoButton 
            label="Mais vendidos" 
            iconWhite={iconVendidosWhite} 
            iconBlack={iconVendidosBlack} 
          />
        </div>
      </div>
    </header>
  );
}