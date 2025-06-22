import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { movies } from '../utils/db';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

const HomeScreen = ({ navigation }) => {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = () => {
    try {
      setMovieList(movies);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.poster }} style={styles.banner} />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.meta}>⭐ {item.rating} | {item.genre}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Details', { movie: item })}
          style={styles.detailsButton}
        >
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={28} color="#FFA500" />
        </TouchableOpacity>
        <Text style={styles.header}>🎬 Now Showing</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FFA500" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
        <FlatList
          data={movieList}
          renderItem={renderMovieCard}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    width: cardWidth,
  },
  banner: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  details: {
    padding: 10,
  },
  title: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  meta: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  detailsButton: {
    marginTop: 8,
    backgroundColor: '#FFA500',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;