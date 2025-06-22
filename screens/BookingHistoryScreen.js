import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your movie list with id-title mapping
const movies = [
  { id: '1', title: 'Avengers: Endgame' },
  { id: '2', title: 'Oppenheimer' },
  // add more movies here
];

const BookingHistoryScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const userData = await AsyncStorage.getItem('localUser');
        if (!userData) {
          setBookings([]);
          setLoading(false);
          return;
        }
        const user = JSON.parse(userData);
        const bookingsKey = `bookings_${user.email}`;
        const savedBookings = await AsyncStorage.getItem(bookingsKey);
        setBookings(savedBookings ? JSON.parse(savedBookings) : []);
      } catch (e) {
        console.error('Error loading bookings:', e);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.noBookingText}>No bookings found.</Text>
      </View>
    );
  }

  // Helper to get movie title by id
  const getMovieTitle = (id) => {
    const movie = movies.find((m) => m.id === id);
    return movie ? movie.title : id;
  };

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.movieTitle}>🎬 {getMovieTitle(item.movie)}</Text>
      <Text style={styles.infoLine}>📍 {item.city}</Text>
      <Text style={styles.infoLine}>🏢 {item.theater}</Text>
      <Text style={styles.infoLine}>📅 {item.date}</Text>
      <Text style={styles.infoLine}>⏰ {item.time}</Text>
      <Text style={styles.infoLine}>💺 Seats: {item.seats.join(', ')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📚 Booking History</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderBooking}
      />
    </View>
  );
};

export default BookingHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: '#FFA500',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 8,
  },
  infoLine: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  noBookingText: {
    color: '#fff',
    fontSize: 18,
  },
});
