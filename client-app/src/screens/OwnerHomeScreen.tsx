import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function OwnerHomeScreen({ navigation }: any) {
  const { logout } = useAuth();
  const [pets, setPets] = useState<any[]>([]);

  const fetchPets = async () => {
    try {
      const fetchedPets = await api.getPets();
      setPets(fetchedPets);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível buscar seus pets.');
    }
  };

  // useFocusEffect é como useEffect, mas roda toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  const renderPetItem = ({ item }: { item: any }) => (
    <View style={styles.petItem}>
      <Text style={styles.petName}>{item.name}</Text>
      <Text>{item.breed}, {item.age} anos</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        renderItem={renderPetItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => <Text style={styles.title}>Meus Pets</Text>}
        ListEmptyComponent={() => <Text style={styles.emptyText}>Você ainda não tem pets cadastrados.</Text>}
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="Adicionar Novo Pet" 
          onPress={() => navigation.navigate('AddPet')} 
        />
        <View style={{marginTop: 10}}/>
        <Button title="Logout" onPress={logout} color="#ff6347" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  petItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    paddingVertical: 10,
  }
});
