import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../navigation/types';
import { MainTabParamList } from '../navigation/types';
import api from '../services/api';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'CreateBooking'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
}

export default function CreateBookingScreen({ navigation }: Props) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [allowPrevisit, setAllowPrevisit] = useState<boolean>(true);
  const [previsitStartDate, setPrevisitStartDate] = useState<string>('');
  const [previsitEndDate, setPrevisitEndDate] = useState<string>('');
  const [careDescription, setCareDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [showPrevisitStartCalendar, setShowPrevisitStartCalendar] = useState(false);
  const [showPrevisitEndCalendar, setShowPrevisitEndCalendar] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const data = await api.getPets() as Pet[];
      setPets(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao carregar pets');
    }
  };

  const togglePetSelection = (petId: string) => {
    if (selectedPets.includes(petId)) {
      setSelectedPets(selectedPets.filter((id) => id !== petId));
    } else {
      setSelectedPets([...selectedPets, petId]);
    }
  };

  const handleGetLocation = () => {
    Alert.alert(
      'Localização',
      'Funcionalidade de mapa será implementada. Por enquanto, insira manualmente as coordenadas ou use um endereço.',
      [
        {
          text: 'OK',
          onPress: () => {
            setLatitude(-23.5505);
            setLongitude(-46.6333);
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (selectedPets.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um pet');
      return;
    }

    if (!startDate || !endDate || !startTime || !endTime) {
      Alert.alert('Erro', 'Preencha data e horário de início e fim');
      return;
    }

    if (!address) {
      Alert.alert('Erro', 'Informe o endereço');
      return;
    }

    if (allowPrevisit && (!previsitStartDate || !previsitEndDate)) {
      Alert.alert('Erro', 'Preencha as datas para visita prévia');
      return;
    }

    const startDatetime = `${startDate}T${startTime}:00`;
    const endDatetime = `${endDate}T${endTime}:00`;

    setLoading(true);
    try {
      await api.createBooking({
        pet_ids: selectedPets,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        latitude,
        longitude,
        address_text: address,
        allow_previsit: allowPrevisit,
        previsit_start_date: allowPrevisit ? previsitStartDate : undefined,
        previsit_end_date: allowPrevisit ? previsitEndDate : undefined,
        care_description: careDescription,
      });
      Alert.alert('Sucesso', 'Agendamento criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Novo Agendamento</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecione os Pets *</Text>
        {pets.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum pet cadastrado. Cadastre um pet primeiro.
          </Text>
        ) : (
          pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petOption,
                selectedPets.includes(pet.id) && styles.petOptionSelected,
              ]}
              onPress={() => togglePetSelection(pet.id)}
            >
              <View style={styles.petOptionContent}>
                <Text style={styles.petOptionName}>{pet.name}</Text>
                <Text style={styles.petOptionDetails}>
                  {pet.breed} • {pet.age} {pet.age === 1 ? 'ano' : 'anos'}
                </Text>
              </View>
              {selectedPets.includes(pet.id) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data e Horário *</Text>

        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeColumn}>
            <Text style={styles.label}>Início</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartCalendar(!showStartCalendar)}
            >
              <Text style={styles.dateButtonText}>
                {startDate || 'Selecione a data'}
              </Text>
            </TouchableOpacity>
            {showStartCalendar && (
              <Calendar
                onDayPress={(day) => {
                  setStartDate(day.dateString);
                  setShowStartCalendar(false);
                }}
                markedDates={{
                  [startDate]: { selected: true, selectedColor: '#007AFF' },
                }}
              />
            )}
            <TextInput
              style={styles.timeInput}
              placeholder="HH:MM"
              value={startTime}
              onChangeText={setStartTime}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.dateTimeColumn}>
            <Text style={styles.label}>Fim</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndCalendar(!showEndCalendar)}
            >
              <Text style={styles.dateButtonText}>
                {endDate || 'Selecione a data'}
              </Text>
            </TouchableOpacity>
            {showEndCalendar && (
              <Calendar
                onDayPress={(day) => {
                  setEndDate(day.dateString);
                  setShowEndCalendar(false);
                }}
                markedDates={{
                  [endDate]: { selected: true, selectedColor: '#007AFF' },
                }}
              />
            )}
            <TextInput
              style={styles.timeInput}
              placeholder="HH:MM"
              value={endTime}
              onChangeText={setEndTime}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localização *</Text>
        <TextInput
          style={styles.input}
          placeholder="Endereço completo"
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleGetLocation}
        >
          <Text style={styles.locationButtonText}>Usar Localização Atual</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.switchContent}>
            <Text style={styles.sectionTitle}>Permitir Visita Prévia</Text>
            <Text style={styles.switchDescription}>
              Permite que o pet sitter visite antes do agendamento
            </Text>
          </View>
          <Switch
            value={allowPrevisit}
            onValueChange={setAllowPrevisit}
            trackColor={{ false: '#ccc', true: '#007AFF' }}
          />
        </View>

        {allowPrevisit && (
          <View style={styles.previsitDates}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.label}>Data Início Visita</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPrevisitStartCalendar(!showPrevisitStartCalendar)}
              >
                <Text style={styles.dateButtonText}>
                  {previsitStartDate || 'Selecione'}
                </Text>
              </TouchableOpacity>
              {showPrevisitStartCalendar && (
                <Calendar
                  onDayPress={(day) => {
                    setPrevisitStartDate(day.dateString);
                    setShowPrevisitStartCalendar(false);
                  }}
                  markedDates={{
                    [previsitStartDate]: { selected: true, selectedColor: '#007AFF' },
                  }}
                />
              )}
            </View>

            <View style={styles.dateTimeColumn}>
              <Text style={styles.label}>Data Fim Visita</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPrevisitEndCalendar(!showPrevisitEndCalendar)}
              >
                <Text style={styles.dateButtonText}>
                  {previsitEndDate || 'Selecione'}
                </Text>
              </TouchableOpacity>
              {showPrevisitEndCalendar && (
                <Calendar
                  onDayPress={(day) => {
                    setPrevisitEndDate(day.dateString);
                    setShowPrevisitEndCalendar(false);
                  }}
                  markedDates={{
                    [previsitEndDate]: { selected: true, selectedColor: '#007AFF' },
                  }}
                />
              )}
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descrição dos Cuidados</Text>
        <Text style={styles.label}>
          Informe problemas de saúde, medicamentos, rotina, etc.
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex: Cachorro toma remédio às 8h e 20h. Gosta de brincar no parque às 17h..."
          value={careDescription}
          onChangeText={setCareDescription}
          multiline
          numberOfLines={6}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Criando...' : 'Criar Agendamento'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
  petOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  petOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  },
  petOptionContent: {
    flex: 1,
  },
  petOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  petOptionDetails: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dateTimeColumn: {
    flex: 1,
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  timeInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  locationButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchContent: {
    flex: 1,
    marginRight: 15,
  },
  switchDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  previsitDates: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

