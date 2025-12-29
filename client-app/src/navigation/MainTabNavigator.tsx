import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import PetsScreen from '../screens/PetsScreen';
import CreateBookingScreen from '../screens/CreateBookingScreen';
import UserPlaceholderScreen from '../screens/UserPlaceholderScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Pets"
        component={PetsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>🐕</Text>
          ),
          tabBarLabel: 'Pets',
        }}
      />
      <Tab.Screen
        name="CreateBooking"
        component={CreateBookingScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <Text style={styles.centerButtonText}>+</Text>
            </View>
          ),
          tabBarLabel: 'Agendar',
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={[props.style, styles.centerButtonContainer]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserPlaceholderScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>👤</Text>
          ),
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centerButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  centerButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});
