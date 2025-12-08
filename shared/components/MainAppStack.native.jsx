import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/theme';

// Pantallas
import DashboardScreen from './screens/DashboardScreen'; // La crearemos abajo
import StudyScreen from './screens/StudyScreen'; 
import CourseDecksScreen from './screens/CourseDecksScreen';

const Stack = createStackNavigator();

const MainAppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.WHITE,
            elevation: 0, // Quitar sombra en Android
            shadowOpacity: 0, // Quitar sombra en iOS
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0'
          },
          headerTintColor: COLORS.PRIMARY,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: { backgroundColor: COLORS.BACKGROUND } // Fondo consistente con web
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Mis Cursos' }} />
        <Stack.Screen name="CourseDecks" component={CourseDecksScreen} options={{ title: 'Contenido' }} />
        <Stack.Screen name="Study" component={StudyScreen} />
        {/* <Stack.Screen name="Study" component={StudyScreen} options={{ headerShown: false }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainAppStack;