import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingHistoryScreen from '../screens/BookingHistoryScreen';

const Drawer = createDrawerNavigator();

const DrawerApp = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: '#0d0d0d' },
        headerTintColor: '#FFA500',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },

        drawerStyle: {
          backgroundColor: '#1a1a1a',
          width: 260,
        },
        drawerActiveTintColor: '#FFA500',
        drawerInactiveTintColor: '#ccc',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -10,
        },
        drawerItemStyle: {
          marginVertical: 5,
        },
        drawerIcon: ({ focused, size, color }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Profile') iconName = 'person-circle-outline';
          else if (route.name === 'Booking History') iconName = 'book-outline';

          return (
            <Ionicons
              name={iconName}
              size={22}
              color={focused ? '#FFA500' : '#ccc'}
            />
          );
        },
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Booking History" component={BookingHistoryScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerApp;