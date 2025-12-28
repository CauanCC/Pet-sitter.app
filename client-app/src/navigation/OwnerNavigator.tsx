import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OwnerHomeScreen from '../screens/OwnerHomeScreen';

const Stack = createNativeStackNavigator();

export default function OwnerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OwnerHome"
        component={OwnerHomeScreen}
        options={{ title: 'Área do Dono' }}
      />
    </Stack.Navigator>
  );
}
