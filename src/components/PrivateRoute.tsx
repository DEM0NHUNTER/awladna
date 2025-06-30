import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
  const { token } = useAuthStore();

  return token ? children : <Navigate to="/login" />;
}