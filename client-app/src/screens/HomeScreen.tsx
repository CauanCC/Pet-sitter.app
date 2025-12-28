import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const handleOwnerPress = () => {
    try {
      navigation.navigate('Owner');
    } catch (error) {
      console.error('Erro ao navegar:', error);
    }
  };

  const handleSitterPress = () => {
    alert('Pet Sitter App em breve');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Sitting App 🐾</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleOwnerPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Sou Dono de Pet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={handleSitterPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
          Sou Pet Sitter
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: '#333',
  },
  button: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#F0F0F0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#333',
  },
});
