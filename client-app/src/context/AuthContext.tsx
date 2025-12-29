import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// 1. Cria o Contexto
const AuthContext = createContext<any>(null);

// 2. Cria o Provedor do Contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se o usuário já tem um token ao iniciar o app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
          // Se tiver um token, consideramos autenticado
          // Uma verificação real com a API aqui seria ainda melhor
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const authContext = {
    // Função que as telas de Login/Registro chamarão
    login: async (response: any) => {
      const { accessToken, refreshToken } = response;
      await AsyncStorage.setItem('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      setIsAuthenticated(true); // Apenas atualiza o estado
    },
    // Função para o botão de logout
    logout: async () => {
      await AsyncStorage.removeItem('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      setIsAuthenticated(false); // Apenas atualiza o estado
    },
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook customizado para usar o contexto facilmente
export const useAuth = () => {
  return useContext(AuthContext);
};
