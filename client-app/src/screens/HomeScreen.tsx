import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Pet Sitting 🐾</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')} // Navega para a tela de Login
        />
        <View style={{ marginVertical: 10 }} />
        <Button
          title="Registrar"
          onPress={() => navigation.navigate('Register')} // Navega para a tela de Registro
        />
      </View>

      <View style={styles.sitterContainer}>
        <Button
          title="Sou um Pet Sitter"
          onPress={() => alert('Funcionalidade para Pet Sitter em breve!')}
          color="#841584"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  buttonContainer: {
    marginHorizontal: 30,
  },
  sitterContainer: {
    marginTop: 60,
    marginHorizontal: 50,
  },
});
