import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserPlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil</Text>
      <Text style={styles.subtext}>Em breve...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

