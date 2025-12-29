import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import api from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePet'>;

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  temperament: string;
}

export default function CreatePetScreen({ navigation, route }: Props) {
  const petId = route.params?.petId;
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [temperament, setTemperament] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (petId) {
      loadPet();
    }
  }, [petId]);

  const loadPet = async () => {
    try {
      const pet = await api.getPet(petId!) as Pet;
      setName(pet.name);
      setBreed(pet.breed);
      setAge(pet.age.toString());
      setTemperament(pet.temperament || '');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao carregar pet');
    }
  };

  const handleSave = async () => {
    if (!name || !breed || !age) {
      Alert.alert('Erro', 'Por favor, preencha nome, raça e idade');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0) {
      Alert.alert('Erro', 'Idade inválida');
      return;
    }

    setLoading(true);
    try {
      if (petId) {
        await api.updatePet(petId, { name, breed, age: ageNum, temperament });
      } else {
        await api.createPet({ name, breed, age: ageNum, temperament });
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao salvar pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {petId ? 'Editar Pet' : 'Novo Pet'}
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do pet"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Raça *</Text>
            <TextInput
              style={styles.input}
              placeholder="Raça do pet"
              value={breed}
              onChangeText={setBreed}
            />

            <Text style={styles.label}>Idade *</Text>
            <TextInput
              style={styles.input}
              placeholder="Idade em anos"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Temperamento</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o temperamento do pet"
              value={temperament}
              onChangeText={setTemperament}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

