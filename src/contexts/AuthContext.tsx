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
  loginAsDemo: (role: 'contributor' | 'learner') => void;
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

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setUser({
      id: '1',
      name: 'Priya Sharma',
      email,
      role: 'contributor'
    });
  };

  const loginAsDemo = (role: 'contributor' | 'learner') => {
    const demoUsers = {
      contributor: {
        id: '1',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        role: 'contributor' as const
      },
      learner: {
        id: '2', 
        name: 'Raj Kumar',
        email: 'raj@example.com',
        role: 'learner' as const
      }
    };
    setUser(demoUsers[role]);
  };
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      loginAsDemo
    }}>
      {children}
    </AuthContext.Provider>
  );
};