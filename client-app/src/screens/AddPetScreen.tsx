import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import api from '../services/api';

export default function AddPetScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');

  const handleAddPet = async () => {
    if (!name || !breed || !age) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await api.createPet({ 
        name, 
        breed, 
        age: parseInt(age, 10) 
      });
      // Volta para a tela anterior após o sucesso
      navigation.goBack(); 
    } catch (error: any) {
      Alert.alert('Erro ao adicionar pet', error.message || 'Ocorreu um erro.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Pet</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Pet"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Raça"
        value={breed}
        onChangeText={setBreed}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <Button title="Salvar Pet" onPress={handleAddPet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});
