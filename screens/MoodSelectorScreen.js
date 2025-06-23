import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { movies } from '../utils/db';
import { snacks } from '../utils/Snacks';

const moodGenreMap = {
  Happy: ['Comedy', 'Family', 'Adventure', 'Animation'],
  Romantic: ['Romance', 'Drama'],
  Adventurous: ['Action', 'Sci-Fi', 'Thriller'],
  Relaxed: ['Drama', 'Fantasy'],
};

const moodSnackMap = {
  Happy: ['Popcorn', 'Nachos'],
  Romantic: ['Chocolate', 'Cookies'],
  Adventurous: ['Chips', 'Coke'],
  Relaxed: ['Tea', 'Donuts'],
};

const moodOptions = [
  { mood: 'Happy', emoji: '😄' },
  { mood: 'Romantic', emoji: '❤️' },
  { mood: 'Adventurous', emoji: '🔥' },
  { mood: 'Relaxed', emoji: '🌿' },
];

const MoodSelectorScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedSnacks, setRecommendedSnacks] = useState([]);

  const filterMoviesByMood = (mood) => {
    const genres = moodGenreMap[mood];
    return movies.filter((movie) =>
      genres.some((g) => movie.genre.split(', ').includes(g))
    );
  };

  const filterSnacksByMood = (mood) => {
    const snackNames = moodSnackMap[mood];
    return snacks.filter((snack) => snackNames.includes(snack.name));
  };

  const handleGetRecommendations = () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood to continue!');
      return;
    }

    const matchedMovies = filterMoviesByMood(selectedMood);
    const matchedSnacks = filterSnacksByMood(selectedMood);

    if (matchedMovies.length === 0 && matchedSnacks.length === 0) {
      Alert.alert('No recommendations', 'Try selecting a different mood.');
    } else {
      setRecommendations(matchedMovies);
      setRecommendedSnacks(matchedSnacks);
    }
  };

  const renderMovie = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.genre}>🎭 {item.genre}</Text>
      <Text style={styles.desc} numberOfLines={3}>{item.description}</Text>
      <TouchableOpacity
        style={styles.viewBtn}
        onPress={() => navigation.navigate('Details', { movie: item })}
      >
        <Text style={styles.btnText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSnack = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>🍿 {item.name}</Text>
      <Text style={styles.genre}>₹{item.price}</Text>
      <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      <View style={{ marginTop: 10 }}>
  <Text style={styles.heading}>🌈 How Are You Feeling Today.?</Text>
</View>

      <View style={styles.moodRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {moodOptions.map(({ mood, emoji }) => (
            <TouchableOpacity
              key={mood}
              style={[styles.moodButton, selectedMood === mood && styles.selectedMood]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
              <Text style={styles.moodText}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.recommendBtn} onPress={handleGetRecommendations}>
        <Text style={styles.recommendText}>Get Recommendations</Text>
      </TouchableOpacity>

      {recommendations.length > 0 && (
        <>
          <Text style={styles.recommendHeader}>🎬 Movies for "{selectedMood}" mood</Text>
          <FlatList
            data={recommendations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovie}
            scrollEnabled={false}
          />
        </>
      )}

      {recommendedSnacks.length > 0 && (
        <>
          <Text style={styles.recommendHeader}>🍿 Snacks for "{selectedMood}" mood</Text>
          <FlatList
            data={recommendedSnacks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSnack}
            scrollEnabled={false}
          />
        </>
      )}
    </ScrollView>
  );
};

export default MoodSelectorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
    marginBottom: 24,
  },
  moodRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  moodButton: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#1a1a1a',
    marginRight: 12,
    alignItems: 'center',
    width: 90,
    height: 90,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedMood: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  emoji: {
    fontSize: 28,
  },
  moodText: {
    fontSize: 11,
    color: '#fff',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  recommendBtn: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  recommendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recommendHeader: {
    fontSize: 20,
    color: '#FFA500',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#FFA500',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffa50022',
  },
  title: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  genre: {
    color: '#bbb',
    fontSize: 13,
    marginBottom: 4,
  },
  desc: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 10,
  },
  viewBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
