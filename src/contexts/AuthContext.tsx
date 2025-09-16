import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'contributor';
}

interface AuthContextType {
  user: User | null;
  loginAsDemo: (role: 'learner' | 'contributor') => void;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);

  const loginAsDemo = (role: 'learner' | 'contributor') => {
    const demoUser: User = {
      id: '1',
      name: role === 'learner' ? 'Demo Learner' : 'Demo Contributor',
      email: `demo@${role}.com`,
      role
    };
    setUser(demoUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};