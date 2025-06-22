import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rows = ['A', 'B', 'C', 'D', 'E'];
const cols = [1, 2, 3, 4, 5, 6, 7, 8];

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const future = new Date(today);
    future.setDate(today.getDate() + i);
    const iso = future.toISOString().slice(0, 10);
    dates.push({ label: future.toDateString().slice(0, 10), value: iso });
  }
  return dates;
};

// 👉 Utility functions for persistent storage
const getBookedSeats = async (key) => {
  try {
    const json = await AsyncStorage.getItem(key);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to get booked seats', e);
    return [];
  }
};

const saveBookedSeats = async (key, seats) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(seats));
  } catch (e) {
    console.error('Failed to save booked seats', e);
  }
};

const SeatSelectionScreen = ({ route, navigation }) => {
  const { theaterId, movieId, date: initialDate, showTime, city } = route.params;

  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const availableDates = generateDates();

  useEffect(() => {
    fetchBookedSeats();
  }, [selectedDate]);

  const fetchBookedSeats = async () => {
    const key = `${theaterId}_${selectedDate}_${showTime}`;
    const seats = await getBookedSeats(key);
    setBookedSeats(seats);
  };

  const handleSelectSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No seats selected', 'Please select at least one seat.');
      return;
    }

    const key = `${theaterId}_${selectedDate}_${showTime}`;
    const alreadyBooked = await getBookedSeats(key);
    const updated = Array.from(new Set([...alreadyBooked, ...selectedSeats]));
    await saveBookedSeats(key, updated);
    setBookedSeats(updated);

    navigation.navigate('PaymentScreen', {
      selectedSeats,
      totalAmount: selectedSeats.length * 150,
      movieId,
      theaterId,
      date: selectedDate,
      showTime,
      city,
    });

    setSelectedSeats([]);
  };

  const renderSeat = (row, col) => {
    const seatId = `${row}${col}`;
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    let seatStyle = styles.seat;
    if (isBooked) seatStyle = { ...seatStyle, ...styles.bookedSeat };
    else if (isSelected) seatStyle = { ...seatStyle, ...styles.selectedSeat };

    return (
      <TouchableOpacity
        key={seatId}
        style={seatStyle}
        onPress={() => handleSelectSeat(seatId)}
        disabled={isBooked}
      >
        <Text style={styles.seatText}>{seatId}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {availableDates.map((d) => (
          <TouchableOpacity
            key={d.value}
            style={[
              styles.dateButton,
              selectedDate === d.value && styles.selectedDateButton,
            ]}
            onPress={() => setSelectedDate(d.value)}
          >
            <Text style={styles.dateText}>{d.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.heading}>Select Seats</Text>
      <Text style={styles.subheading}>
        {`City: ${city}, Theater: ${theaterId}, Date: ${selectedDate}, Time: ${showTime}`}
      </Text>

      <View style={styles.screenLabel}>
        <Text style={styles.screenText}>SCREEN</Text>
      </View>

      <View style={styles.seatMap}>
        {rows.map((row) => (
          <View key={row} style={styles.row}>
            {cols.map((col) => renderSeat(row, col))}
          </View>
        ))}
      </View>

      <View style={styles.legendContainer}>
        <View style={[styles.legend, styles.bookedSeat]} />
        <Text>Booked</Text>
        <View style={[styles.legend, styles.availableSeat]} />
        <Text>Available</Text>
        <View style={[styles.legend, styles.selectedSeat]} />
        <Text>Selected</Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SeatSelectionScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    marginBottom: 12,
    color: 'gray',
    textAlign: 'center',
  },
  screenLabel: {
    backgroundColor: '#ccc',
    padding: 8,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 12,
  },
  screenText: {
    fontSize: 16,
    fontWeight: '600',
  },
  seatMap: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  seat: {
    width: 40,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#999',
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  seatText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookedSeat: {
    backgroundColor: '#d9534f',
  },
  selectedSeat: {
    backgroundColor: '#5cb85c',
  },
  availableSeat: {
    backgroundColor: '#e0e0e0',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 16,
    alignItems: 'center',
  },
  legend: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  confirmButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#eee',
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  selectedDateButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  dateText: {
    color: '#333',
  },
});
