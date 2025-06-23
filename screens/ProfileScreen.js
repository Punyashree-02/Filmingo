import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [profileImageUri, setProfileImageUri] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('localUser');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser(parsed);
          setEditedName(parsed.name);
          setEditedEmail(parsed.email);
        }
        const savedUri = await AsyncStorage.getItem('profile_image');
        if (savedUri) setProfileImageUri(savedUri);
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
            await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
            // Do NOT remove localUser so user can login again
          } catch (e) {
            console.error('Error clearing tokens on logout:', e);
          }
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const saveChanges = async () => {
    const updatedUser = { name: editedName, email: editedEmail, password: user.password };
    setUser(updatedUser);
    await AsyncStorage.setItem('localUser', JSON.stringify(updatedUser));
    if (profileImageUri) {
      await AsyncStorage.setItem('profile_image', profileImageUri);
    }
    setIsEditing(false);
    Alert.alert('Profile Updated');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={isEditing ? pickImage : null}>
        <Image
          source={profileImageUri ? { uri: profileImageUri } : require('../assets/profile.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Name"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            value={editedEmail}
            onChangeText={setEditedEmail}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.editBtn} onPress={saveChanges}>
            <Ionicons name="save-outline" size={20} color="#0d0d0d" />
            <Text style={styles.editText}>Save Changes</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
          <Text style={styles.email}>{user?.email || 'john.doe@example.com'}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={handleEditToggle}>
            <Ionicons name="create-outline" size={20} color="#0d0d0d" />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}

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
  input: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
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