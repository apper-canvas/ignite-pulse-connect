import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';

const LoadingSpinner = getIcon('Loader');

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  
  return children;
};
export default ProtectedRoute;