import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

const TicketDetailsScreen = ({ route, navigation }) => {
  const {
    selectedSeats,
    snacks,
    movieId,
    theaterId,
    date,
    showTime,
    city,
    totalAmount,
  } = route.params;

  const bookingId = `BOOK-${Math.floor(Math.random() * 1000000)}`;

  useEffect(() => {
    const saveBooking = async () => {
      try {
        const userData = await AsyncStorage.getItem('localUser');
        if (!userData) {
          console.warn('No user logged in, cannot save booking');
          return;
        }
        const user = JSON.parse(userData);
        const bookingsKey = `bookings_${user.email}`;

        const existingBookingsJson = await AsyncStorage.getItem(bookingsKey);
        const existingBookings = existingBookingsJson ? JSON.parse(existingBookingsJson) : [];

        const newBooking = {
          id: bookingId,
          movie: movieId,
          theater: theaterId,
          city,
          date,
          time: showTime,
          seats: selectedSeats,
          snacks: snacks || [],
          totalAmount,
        };

        const updatedBookings = [newBooking, ...existingBookings];

        await AsyncStorage.setItem(bookingsKey, JSON.stringify(updatedBookings));
        console.log('Booking saved successfully');
      } catch (error) {
        console.error('Error saving booking:', error);
      }
    };

    saveBooking();
  }, []);

  const handleDownload = () => {
    Alert.alert('📥 Ticket Downloaded', 'Your ticket has been saved!');
  };

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🎟️ Booking Confirmed</Text>

      <View style={styles.card}>
        <Text style={styles.label}>🆔 Booking ID</Text>
        <Text style={styles.value}>{bookingId}</Text>

        <Text style={styles.label}>🎬 Movie</Text>
        <Text style={styles.value}>{movieId}</Text>

        <Text style={styles.label}>🏢 Theater</Text>
        <Text style={styles.value}>{theaterId}</Text>

        <Text style={styles.label}>📍 City</Text>
        <Text style={styles.value}>{city}</Text>

        <Text style={styles.label}>📅 Date</Text>
        <Text style={styles.value}>{date}</Text>

        <Text style={styles.label}>⏰ Show Time</Text>
        <Text style={styles.value}>{showTime}</Text>

        <Text style={styles.label}>💺 Seats</Text>
        <Text style={styles.value}>{selectedSeats.join(', ')}</Text>

        {snacks?.length > 0 && (
          <>
            <Text style={styles.label}>🍿 Snacks</Text>
            <Text style={styles.value}>
              {snacks.map((s) => s.name).join(', ')}
            </Text>
          </>
        )}

        <Text style={styles.label}>💰 Total Paid</Text>
        <Text style={styles.value}>₹{totalAmount}</Text>
      </View>

      <View style={styles.qrBlock}>
        <QRCode value={bookingId} size={180} color="#000" backgroundColor="#fff" />
        <Text style={styles.qrText}>🎫 Scan this at Entry</Text>
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadText}>⬇️ Download Ticket</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneText}>✅ Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TicketDetailsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d0d0d',
    padding: 24,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFA500',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFA500',
  },
  qrBlock: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
  },
  qrText: {
    marginTop: 10,
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  downloadButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 20,
  },
  downloadText: {
    color: '#0d0d0d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 40,
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});