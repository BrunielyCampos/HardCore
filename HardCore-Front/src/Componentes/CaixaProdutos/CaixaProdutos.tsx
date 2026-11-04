import React from 'react';

import iconStar from './CaixaProdutosAssets/akar-icons_star.svg';
import iconHeart from './CaixaProdutosAssets/akar-icons_heart.svg';
import iconCart from './CaixaProdutosAssets/f7_cart-fill-badge-plus.svg';

interface CaixaProdutosProps {
  nota: string;
  imagemProduto: string;
  nomeProduto: string;
  preco: string;
  parcelamento: string;
}

export default function CaixaProdutos({
  nota,
  imagemProduto,
  nomeProduto,
  preco,
  parcelamento
}: CaixaProdutosProps) {
  return (
    <div className="relative flex h-[436px] w-[296px] flex-col overflow-hidden rounded-[20px] bg-[#4B4848] shadow-lg transition-transform duration-300 hover:-translate-y-2">
      
      {/* Topo: Nota, Favorito e Carrinho */}
      <div className="flex w-full items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <img src={iconStar} alt="Avaliação" className="h-6 w-6 object-contain" />
          <span className="font-['Inter'] text-[16.80px] font-normal text-white">
            {nota}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="cursor-pointer transition-transform active:scale-90">
            <img src={iconHeart} alt="Favoritar" className="h-6 w-6 object-contain" />
          </button>
          <button className="cursor-pointer transition-transform active:scale-90">
            <img src={iconCart} alt="Adicionar ao carrinho" className="h-7 w-7 object-contain" />
          </button>
        </div>
      </div>

      {/* Imagem do Produto */}
      <div className="mt-4 flex w-full flex-1 items-center justify-center px-4">
        <img 
          src={imagemProduto} 
          alt={nomeProduto} 
          className="max-h-[222px] max-w-[222px] object-contain drop-shadow-md"
        />
      </div>

      {/* Informações do Produto */}
      <div className="flex w-full flex-col px-4 pb-6">
        <h3 className="line-clamp-2 min-h-[48px] font-['Inter'] text-[19.41px] font-medium leading-tight text-white">
          {nomeProduto}
        </h3>
        
        <div className="mt-3 font-['Inter'] text-[19.41px] font-bold text-white">
          {preco}
        </div>
        
        <div className="mt-1 font-['Inter'] text-[16.24px] font-light text-[#D1D1D1]">
          {parcelamento}
        </div>
      </div>
      
    </div>
  );
}