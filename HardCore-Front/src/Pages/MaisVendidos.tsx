import HeaderSimples from '../Componentes/HeaderSimples/HeaderSimples';
import CaixaProdutos from '../Componentes/CaixaProdutos/CaixaProdutos';
import Footer from '../Componentes/Footer/FooterPagamento';
import { useProdutos } from '../Context/ProdutoContext';

export default function MaisVendidos() {
  const { produtos, carregando } = useProdutos();

  const maisVendidos = [...produtos]
    .filter((p) => p.status === 'Publicado' && (p.totalAvaliacoes ?? 0) > 0)
    .sort((a, b) => {
      const diffMedia = (b.mediaAvaliacoes ?? 0) - (a.mediaAvaliacoes ?? 0);
      if (diffMedia !== 0) return diffMedia;
      return (b.totalAvaliacoes ?? 0) - (a.totalAvaliacoes ?? 0);
    });

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black font-['Inter'] text-white"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(158, 158, 158, 0.3) 0%, rgba(7, 7, 7, 0.3) 100%)',
      }}
    >
      <HeaderSimples />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 sm:px-8 lg:px-12 pb-20 pt-[170px]">
        <div className="mb-8 border-b border-[#2A0A0A] pb-6">
          <span className="font-['Iosevka_Charon'] text-[12px] font-bold tracking-widest text-[#FFB26B]">
            RANKING HARDCORE • MELHORES AVALIADOS
          </span>
          <h1 className="mt-1 font-['Iosevka_Charon'] text-3xl sm:text-4xl lg:text-[46px] font-bold text-white">
            MAIS VENDIDOS
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {carregando ? (
            <span className="col-span-full text-white/60 text-[18px] italic font-['Iosevka_Charon']">
              Carregando ranking...
            </span>
          ) : maisVendidos.length > 0 ? (
            maisVendidos.map((prod) => (
              <CaixaProdutos
                key={prod.id}
                id={prod.id}
                nota={(prod.mediaAvaliacoes ?? 0).toFixed(1)}
                imagemProduto={prod.imagemPrincipal || 'https://placehold.co/200x200'}
                nomeProduto={prod.nome}
                preco={`R$ ${prod.precoVenda.toFixed(2).replace('.', ',')}`}
                parcelamento={`No PIX ou 10x de R$ ${(prod.precoVenda / 10).toFixed(2).replace('.', ',')}`}
              />
            ))
          ) : (
            <span className="col-span-full text-white/50 text-[18px] italic font-['Iosevka_Charon']">
              Ainda não há produtos avaliados. Assim que os clientes avaliarem suas compras, o ranking aparece aqui!
            </span>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}