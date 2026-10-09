import { useAuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const { user, isAuthenticated, login, loginWithGoogle, logout, loading } = useAuthContext();
  
  return {
    user,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    loading,
  };
};
