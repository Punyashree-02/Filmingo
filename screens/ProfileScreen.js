import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('localUser');
        if (userData) setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to load user:', e);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
            await AsyncStorage.removeItem('localUser');
          } catch (e) {
            console.error('Error clearing storage on logout:', e);
          }
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={require('../assets/profile.png')}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
      <Text style={styles.email}>{user?.email || 'john.doe@example.com'}</Text>

      <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('Edit Profile', 'Feature coming soon!')}>
        <Ionicons name="create-outline" size={20} color="#0d0d0d" />
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#0d0d0d" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  email: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
  },
  editBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  editText: {
    color: '#0d0d0d',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#0d0d0d',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});