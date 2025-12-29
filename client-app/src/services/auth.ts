import { CommonActions } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A lógica de navigationRef e setNavigationRef foi removida.

/**
 * Lida com o pós-login/registro bem-sucedido.
 * @param response A resposta da API contendo os tokens.
 * @param navigation O objeto de navegação da tela atual.
 */
export async function handleLogin(response: any, navigation: any) {
  const api = require('./api').default; // Lazy import para evitar ciclos

  const { accessToken, refreshToken } = response;
  await AsyncStorage.setItem('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);

  try {
    api.getCurrentUser();
  } catch (e) { /* Ignora erros aqui, o AppNavigator vai lidar */ }

  // Usa o objeto de navegação passado como parâmetro
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Owner' }],
    })
  );
}

/**
 * Lida com o logout do usuário.
 * @param navigation O objeto de navegação da tela atual.
 */
export async function handleLogout(navigation: any) {
  await AsyncStorage.removeItem('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');

  // Usa o objeto de navegação passado como parâmetro
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Login' }], // Leva de volta para a tela de Login
    })
  );
}
