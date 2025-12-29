import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OwnerHomeScreen from '../screens/OwnerHomeScreen';
import AddPetScreen from '../screens/AddPetScreen'; // Importa a nova tela

const Stack = createNativeStackNavigator();

export default function OwnerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OwnerHome"
        component={OwnerHomeScreen}
        options={{ title: 'Área do Dono' }}
      />
      {/* Adiciona a tela de Adicionar Pet ao navegador */}
      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
        options={{ title: 'Adicionar Pet' }}
      />
    </Stack.Navigator>
  );
}
