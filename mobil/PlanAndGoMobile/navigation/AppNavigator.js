import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="RouteList" 
        component={RouteListScreen} 
        options={{ title: 'Rotalarım' }}
      />
      <Stack.Screen 
        name="RouteCreate" 
        component={RouteCreateScreen} 
        options={{ title: 'Yeni Rota' }}
      />
      <Stack.Screen 
        name="RouteDetail" 
        component={RouteDetailScreen} 
        options={{ title: 'Rota Detayları' }}
      />
    </Stack.Navigator>
  );
}