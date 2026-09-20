import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<boolean>;
  removeAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('elvaria_user') || localStorage.getItem('dermavea_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      }
    } catch (e) {
      console.error('Failed to parse user session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUserSession = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('elvaria_user', JSON.stringify(userData));
      localStorage.removeItem('dermavea_user');
    } else {
      localStorage.removeItem('elvaria_user');
      localStorage.removeItem('dermavea_user');
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.login(email, pass);
      if (res.success && res.user) {
        saveUserSession(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Invalid credentials' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    try {
      const res = await api.register(name, email, pass, phone);
      if (res.success && res.user) {
        saveUserSession(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const logout = () => {
    saveUserSession(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return false;
    try {
      const res = await api.updateProfile(user.id, updates);
      if (res.success && res.user) {
        saveUserSession(res.user);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to update user profile:', e);
      return false;
    }
  };

  const addAddress = async (addrData: Omit<Address, 'id'>) => {
    if (!user) return false;
    const newAddress: Address = {
      ...addrData,
      id: 'addr-' + Date.now(),
      isDefault: user.addresses.length === 0 || !!addrData.isDefault,
    };
    const updatedAddresses = [...user.addresses, newAddress];
    return updateUser({ addresses: updatedAddresses });
  };

  const removeAddress = async (addressId: string) => {
    if (!user) return false;
    const updated = user.addresses.filter((a) => a.id !== addressId);
    return updateUser({ addresses: updated });
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!user) return false;
    const updated = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    return updateUser({ addresses: updated });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        updateUser,
        addAddress,
        removeAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
