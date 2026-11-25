import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export type PerfilRole = "CLIENTE" | "ENTREGADOR" | "GERENCIADOR" | "ADMINISTRADOR";

interface ProtectedRouteProps {
  allowedRoles: PerfilRole[];
  redirectTo?: string;
}

function normalizarRole(perfil?: string | null): PerfilRole | null {
  if (!perfil) return null;
  const limpo = perfil.trim().toUpperCase().replace(/^ROLE_/, "");

  if (limpo === "ADMIN" || limpo === "ADMINISTRADOR" || limpo === "ADMNISTRADOR") {
    return "ADMINISTRADOR";
  }
  if (limpo === "GERENTE" || limpo === "GERENCIADOR") {
    return "GERENCIADOR";
  }
  if (limpo === "ENTREGADOR") {
    return "ENTREGADOR";
  }
  if (limpo === "CLIENTE") {
    return "CLIENTE";
  }
  return null;
}

export function ProtectedRoute({
  allowedRoles,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { isAuthenticated, usuario } = useAuth();
  const userRole = normalizarRole(usuario?.perfil);

  if (!isAuthenticated || !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}