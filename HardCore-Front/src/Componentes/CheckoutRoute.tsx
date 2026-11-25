import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCarrinho } from '../Context/CarrinhoContext';

interface CheckoutRouteProps {
  exigirCarrinho?: boolean;
  exigirConfirmacao?: boolean;
  redirectTo?: string;
}

export function CheckoutRoute({
  exigirCarrinho = false,
  exigirConfirmacao = false,
  redirectTo = '/',
}: CheckoutRouteProps) {
  const { itens, carregando } = useCarrinho();
  const location = useLocation();

  if (exigirCarrinho && carregando) {
    return null;
  }

  if (exigirCarrinho && itens.length === 0) {
    return <Navigate to={redirectTo} replace />;
  }

  if (exigirConfirmacao && !location.state?.pedidoConfirmado) {
    return <Navigate to="/meus-pedidos" replace />;
  }

  return <Outlet />;
}