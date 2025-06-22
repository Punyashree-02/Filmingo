import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext'; // Replace with your actual path

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext); // Should be defined in context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      const savedUser = await AsyncStorage.getItem('localUser');

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (
          parsedUser.email === email.trim().toLowerCase() &&
          parsedUser.password === password
        ) {
          if (rememberMe) {
            const accessToken = 'dummy_token'; // or get from your API response
            if (accessToken != null) {
              await AsyncStorage.setItem('access_token', accessToken);
            }
          } else {
            await AsyncStorage.removeItem('access_token');
          }

          login('dummy_token'); // trigger context login

          Alert.alert('Success', 'Logged in!', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Main'), // ✅ navigate to Drawer
            },
          ]);
        } else {
          Alert.alert('Login Failed', 'Incorrect email or password.');
        }
      } else {
        Alert.alert('No User Found', 'Please sign up first.');
      }
    } catch (error) {
      console.error('Login storage error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../assets/film.jpg')} // Replace with valid path
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Login to Filmingo</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.switchContainer}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: '#999', true: '#007AFF' }}
            />
            <Text style={styles.switchLabel}>Remember Me</Text>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
            Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#ff6a00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    color: '#fff',
    fontSize: 15,
  },
  linkBold: {
    color: '#ff6a00',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
