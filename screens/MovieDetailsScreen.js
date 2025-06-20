import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native';

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const renderItem = ({ item }) => (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{item}</Text>
    </View>
  );
  const castArray = Array.isArray(movie.cast)
  ? movie.cast
  : typeof movie.cast === 'string'
  ? movie.cast.split(',')
  : [];

const crewArray = Array.isArray(movie.crew)
  ? movie.crew
  : typeof movie.crew === 'string'
  ? movie.crew.split(',')
  : [];


  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.poster }} style={styles.poster} />
      <Text style={styles.title}>{movie.title}</Text>

      <Text style={styles.releaseDate}>📅 {movie.releaseDate}</Text>

      <View style={styles.metaContainer}>
        <Text style={styles.meta}>⭐ {movie.rating}</Text>
        <Text style={styles.genre}>🎬 {movie.genre}</Text>
      </View>
      <TouchableOpacity
        style={styles.bookButton} onPress={() => {
        console.log('Book Tickets Pressed');
        navigation.navigate('Book', { movie });
      }}>
      <Text style={styles.bookButtonText}>🎟️ Book Tickets</Text>
      </TouchableOpacity>


      <Text style={styles.sectionTitle}>📝 Description</Text>
      <Text style={styles.description}>{movie.description || "No description available."}</Text>

      <Text style={styles.sectionTitle}>👥 Cast</Text>
      <FlatList
        data={castArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => `cast-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />

      <Text style={styles.sectionTitle}>🎥 Crew</Text>
      <FlatList
        data={crewArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => `crew-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d0d0d',
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  poster: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
    borderColor: '#FFA500',
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 6,
    textAlign: 'center',
  },
  releaseDate: {
    fontSize: 18,
    color: '#bbb',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  meta: {
    fontSize: 16,
    color: '#FF8C00',
    fontWeight: '600',
    backgroundColor: '#1a1a1a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  genre: {
    fontSize: 18,
    color: '#FFA500',
    fontWeight: 'bold',
    backgroundColor: '#1a1a1a',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFA500',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 22,
  },
  flatList: {
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#222',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  chipText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: '500',
  },
  bookButton: {
  backgroundColor: '#FFA500',
  paddingVertical: 14,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 24,
  marginHorizontal: 32,
  shadowColor: '#FFA500',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},
bookButtonText: {
  color: '#0d0d0d',
  fontSize: 18,
  fontWeight: 'bold',
},

});

export default MovieDetailsScreen;
