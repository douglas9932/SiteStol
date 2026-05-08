import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const auth = sessionStorage.getItem('admin_auth');

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se a sessão expirou (8 horas)
  try {
    const { at } = JSON.parse(auth);
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (Date.now() - at > TWENTY_FOUR_HOURS) {
      sessionStorage.removeItem('admin_auth');
      return <Navigate to="/login" replace />;
    }
  } catch {
    sessionStorage.removeItem('admin_auth');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}