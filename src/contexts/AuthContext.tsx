import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'contributor' | 'learner' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'contributor'
  });

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    setUser({
      id: '1',
      name: 'Priya Sharma',
      email,
      role: 'contributor'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};