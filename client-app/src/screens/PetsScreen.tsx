import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../navigation/types';
import { MainTabParamList } from '../navigation/types';
import api from '../services/api';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Pets'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  temperament: string;
}

export default function PetsScreen({ navigation }: Props) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPets = useCallback(async () => {
    try {
      const data = await api.getPets() as Pet[];
      setPets(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao carregar pets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPets();
    });
    return unsubscribe;
  }, [navigation, loadPets]);

  const handleDelete = (pet: Pet) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir ${pet.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deletePet(pet.id);
              loadPets();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Falha ao excluir pet');
            }
          },
        },
      ]
    );
  };

  const renderPet = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => navigation.navigate('CreatePet', { petId: item.id })}
    >
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetails}>
          {item.breed} • {item.age} {item.age === 1 ? 'ano' : 'anos'}
        </Text>
        {item.temperament ? (
          <Text style={styles.petTemperament}>{item.temperament}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && pets.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        renderItem={renderPet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={pets.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadPets} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão de cachorro para adicionar um pet
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.getParent()?.navigate('CreatePet')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  petDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  petTemperament: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

