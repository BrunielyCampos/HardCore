import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../../Context/CarrinhoContext';

interface CaixaProdutosProps {
  id: string | number;
  nota: string;
  imagemProduto: string;
  nomeProduto: string;
  preco: string;
  parcelamento: string;
}

export default function CaixaProdutos({ id, nota, imagemProduto, nomeProduto, preco, parcelamento }: CaixaProdutosProps) {
  const { adicionarAoCarrinho } = useCarrinho();

  const handleCarrinhoClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    // Adiciona o produto com os dados reais ao contexto
    adicionarAoCarrinho({
      id: id,
      nome: nomeProduto,
      imagem: imagemProduto,
      precoString: preco
    });
  };

  return (
    <Link 
      to={`/produto/${id}`}
      className="flex h-[426px] w-[302px] flex-col rounded-[15px] bg-[#464545] p-[25px] shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      <div className="flex w-full justify-between items-center mb-[20px]">
        <div className="flex items-center gap-[6px]">
          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.5L12.63 7.09L18.5 7.95L14.25 12.09L15.25 18L10 15.24L4.75 18L5.75 12.09L1.5 7.95L7.37 7.09L10 1.5Z" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[15.82px] font-medium text-white">{nota}</span>
        </div>
        
        <div className="flex items-center gap-[15px]">
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M11 19.3499L9.40498 17.8986C4.16487 13.1537 1.05433 10.3344 1.05433 6.94508C1.05433 4.12574 3.26428 1.91577 6.08362 1.91577C7.68233 1.91577 9.21528 2.66442 11 3.84074C12.7847 2.66442 14.3177 1.91577 15.9164 1.91577C18.7357 1.91577 20.9457 4.12574 20.9457 6.94508C20.9457 10.3344 17.8351 13.1537 12.595 17.8986L11 19.3499Z" stroke="#B3B3B3" strokeWidth="1.5"/>
          </svg>
          
          <button onClick={handleCarrinhoClick} className="hover:scale-110 transition-transform cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="#B3B3B3"/>
              <circle cx="19" cy="5" r="4" fill="#464545"/>
              <path d="M19 2V8M16 5H22" stroke="#B3B3B3" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex h-[200px] w-full items-center justify-center bg-white mb-[25px] rounded-[5px]">
        <img src={imagemProduto} alt={nomeProduto} className="max-h-[180px] max-w-[180px] object-contain" />
      </div>

      <div className="flex flex-col gap-[8px] flex-grow">
        <h3 className="font-['Inter'] text-[18.84px] font-semibold text-white leading-tight line-clamp-2">
          {nomeProduto}
        </h3>
        <span className="font-['Inter'] text-[24.6px] font-bold text-white leading-none mt-[4px]">
          {preco}
        </span>
        <span className="font-['Inter'] text-[15.82px] font-light text-[#B3B3B3]">
          {parcelamento}
        </span>
      </div>
    </Link>
  );
}