import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rows = {
  Recliner: ['A', 'B'],
  'Dress Circle': ['C', 'D'],
  Executive: ['E'],
};

const cols = [1, 2, 3, 4, 5, 6, 7, 8];

const prices = {
  Recliner: 300,
  'Dress Circle': 200,
  Executive: 150,
};

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
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
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

    const totalAmount = selectedSeats.reduce((sum, seat) => {
      const row = seat.charAt(0);
      const price =
        rows.Recliner.includes(row)
          ? prices.Recliner
          : rows['Dress Circle'].includes(row)
          ? prices['Dress Circle']
          : prices.Executive;
      return sum + price;
    }, 0);

    navigation.navigate('PaymentScreen', {
      selectedSeats,
      totalAmount,
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

  const renderCategory = (categoryName, rowsArray) => (
    <View style={styles.sectionContainer} key={categoryName}>
      <Text style={styles.categoryHeading}>{`${categoryName} ₹${prices[categoryName]}`}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.seatMap}>
          {rowsArray.map((row) => (
            <View key={row} style={styles.row}>
              {cols.map((col) => renderSeat(row, col))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>📅 Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
        {availableDates.map((d) => (
          <TouchableOpacity
            key={d.value}
            style={[
              styles.dateButton,
              selectedDate === d.value && styles.selectedDateButton,
            ]}
            onPress={() => setSelectedDate(d.value)}
          >
            <Text
              style={[
                styles.dateText,
                selectedDate === d.value && { color: '#0d0d0d' },
              ]}
            >
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
        <Text style={{ fontSize: 16, color: '#FFA500', marginVertical: 10, textAlign: 'center', fontWeight: '600' }}>
  {`City: ${city}, Theater: ${theaterId}, Date: ${selectedDate}, Time: ${showTime}`}
</Text>
      <Text style={styles.heading}>🎟️ Select Seats</Text>

            {Object.entries(rows).map(([category, rowArray]) =>
        renderCategory(category, rowArray)
      )}

      <View style={styles.legendContainer}>
        <View style={[styles.legend, styles.bookedSeat]} />
        <Text style={styles.legendText}>Booked</Text>
        <View style={[styles.legend, styles.availableSeat]} />
        <Text style={styles.legendText}>Available</Text>
        <View style={[styles.legend, styles.selectedSeat]} />
        <Text style={styles.legendText}>Selected</Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>✅ Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SeatSelectionScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d0d0d',
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateList: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  dateButton: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  selectedDateButton: {
    backgroundColor: '#FFA500',
  },
  dateText: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  screenImage: {
    height: 40,
    width: '100%',
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  categoryHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 10,
  },
  seatMap: {
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  seat: {
    width: 38,
    height: 38,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#FFA500',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  seatText: {
    color: '#FFA500',
    fontWeight: '600',
    fontSize: 12,
  },
  bookedSeat: {
    backgroundColor: '#a94442',
    borderColor: '#a94442',
  },
  selectedSeat: {
    backgroundColor: '#5cb85c',
    borderColor: '#5cb85c',
  },
  availableSeat: {
    backgroundColor: '#333',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 16,
  },
  legend: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    color: '#ccc',
    marginRight: 12,
    fontSize: 12,
  },
  confirmButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    alignSelf: 'center',
  },
  confirmText: {
    color: '#0d0d0d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});