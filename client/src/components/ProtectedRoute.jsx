import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../store/userContext';

const ProtectedRoute = ({ children }) => {
  const userCtx = useContext(UserContext);

  if (userCtx.userId === null) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;