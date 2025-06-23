import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import MovieDetailsScreen from './screens/MovieDetailsScreen';
import BookScreen from './screens/BookScreen';
import SeatSelectionScreen from './screens/SeatSelectionScreen';
import PaymentScreen from './screens/PaymentScreen';
import TicketDetailsScreen from './screens/TicketDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookingHistoryScreen from './screens/BookingHistoryScreen';
import MoodSelectorScreen from './screens/MoodSelectorScreen';

import { AuthProvider } from './context/AuthContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerRoutes = () => (
  <Drawer.Navigator screenOptions={{ headerShown: false }}>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="BookingHistory" component={BookingHistoryScreen} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MoodSelectorScreen" component={MoodSelectorScreen}/>
          <Stack.Screen name="Main" component={DrawerRoutes} />
          <Stack.Screen name="Details" component={MovieDetailsScreen} />
          <Stack.Screen name="Book" component={BookScreen} />
          <Stack.Screen name="SeatSelectionScreen" component={SeatSelectionScreen} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
          <Stack.Screen name="TicketDetailsScreen" component={TicketDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}