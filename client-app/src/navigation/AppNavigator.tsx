import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Screens
import OwnerNavigator from './OwnerNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // Lê o estado de autenticação diretamente do contexto
  const { isAuthenticated, isLoading } = useAuth();

  // Mostra uma tela de loading enquanto o estado de auth é verificado
  if (isLoading) {
    return null; // Idealmente, uma tela de Splash/Loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Se autenticado, mostra o navegador principal
          <Stack.Screen name="Owner" component={OwnerNavigator} />
        ) : (
          // Se não, mostra as telas de login/registro
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
