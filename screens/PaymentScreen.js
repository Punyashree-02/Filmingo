import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const snackItems = [
  { id: '1', name: '🍿 Popcorn (Small)', price: 80 },
  { id: '2', name: '🍿 Popcorn (Large)', price: 150 },
  { id: '3', name: '🧀 Nachos', price: 120 },
  { id: '4', name: '🥤 Coke', price: 60 },
  { id: '5', name: '🥤 Pepsi', price: 60 },
  { id: '6', name: '💧 Water Bottle', price: 30 },
  { id: '7', name: '🍔 Burger', price: 100 },
];

const PaymentScreen = ({ route, navigation }) => {
  const {
    selectedSeats,
    totalAmount,
    movieId,
    theaterId,
    date,
    showTime,
    city,
  } = route.params;

  const [selectedSnacks, setSelectedSnacks] = useState([]);

  const handleAddSnack = (item) => {
    setSelectedSnacks((prev) => [...prev, item]);
  };

  const handleRemoveSnack = (itemId) => {
    const index = selectedSnacks.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      const updated = [...selectedSnacks];
      updated.splice(index, 1);
      setSelectedSnacks(updated);
    }
  };

  const getSnackTotal = () =>
    selectedSnacks.reduce((sum, item) => sum + item.price, 0);

  const grandTotal = totalAmount + getSnackTotal();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.heading}>💳 Payment Summary</Text>

      <View style={styles.infoBox}>
        <Text style={styles.info}>
          🎟️ Seats: <Text style={styles.value}>{selectedSeats.join(', ')}</Text>
        </Text>
        <Text style={styles.info}>
          🎫 Ticket Total: <Text style={styles.value}>₹{totalAmount}</Text>
        </Text>
        <Text style={styles.info}>
          🎬 Movie: <Text style={styles.value}>{movieId}</Text>
        </Text>
        <Text style={styles.info}>
          🏢 Theater: <Text style={styles.value}>{theaterId}</Text>
        </Text>
        <Text style={styles.info}>
          📍 City: <Text style={styles.value}>{city}</Text>
        </Text>
        <Text style={styles.info}>
          📅 Date: <Text style={styles.value}>{date}</Text>
        </Text>
        <Text style={styles.info}>
          ⏰ Time: <Text style={styles.value}>{showTime}</Text>
        </Text>
      </View>

      <Text style={styles.snackHeading}>🍿 Snacks & Beverages</Text>

      <FlatList
        data={snackItems}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const quantity = selectedSnacks.filter((s) => s.id === item.id).length;
          return (
            <View style={styles.snackItem}>
              <Text style={styles.snackName}>
                {item.name} - ₹{item.price}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => handleRemoveSnack(item.id)}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => handleAddSnack(item)}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.totalBox}>
        <Text style={styles.total}>🥤 Snacks Total: ₹{getSnackTotal()}</Text>
        <Text style={styles.total}>💰 Grand Total: ₹{grandTotal}</Text>
      </View>

      {/* ✅ Pay Button inside ScrollView */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={() =>
          navigation.navigate('TicketDetailsScreen', {
            selectedSeats,
            snacks: selectedSnacks,
            totalAmount: grandTotal,
            movieId,
            theaterId,
            date,
            showTime,
            city,
          })
        }
      >
        <Text style={styles.payText}>✅ Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40, // to avoid overlap
  },
  heading: {
    fontSize: 24,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: '#FFA500',
    borderWidth: 1,
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 6,
  },
  value: {
    color: '#FFA500',
    fontWeight: '600',
  },
  snackHeading: {
    fontSize: 20,
    color: '#FFA500',
    fontWeight: 'bold',
    marginVertical: 14,
  },
  snackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
  },
  snackName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFA500',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#0d0d0d',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    color: '#FFA500',
    marginHorizontal: 10,
  },
  totalBox: {
    marginTop: 24,
    borderTopColor: '#333',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  total: {
    color: '#FFA500',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  payButton: {
    marginTop: 20,
    backgroundColor: '#FFA500',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  payText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d0d0d',
  },
});
