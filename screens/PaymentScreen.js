import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const snackItems = [
  { id: '1', name: 'Popcorn (Small)', price: 80 },
  { id: '2', name: 'Popcorn (Large)', price: 150 },
  { id: '3', name: 'Nachos', price: 120 },
  { id: '4', name: 'Coke', price: 60 },
  { id: '5', name: 'Pepsi', price: 60 },
  { id: '6', name: 'Water Bottle', price: 30 },
  { id: '7', name: 'Burger', price: 100 },
];

const PaymentScreen = ({ route }) => {
  const { selectedSeats, totalAmount, movieId, theaterId, date, showTime, city } = route.params;

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

  const getSnackTotal = () => {
    return selectedSnacks.reduce((sum, item) => sum + item.price, 0);
  };

  const grandTotal = totalAmount + getSnackTotal();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment Screen</Text>
      <Text style={styles.text}>Seats: {selectedSeats.join(', ')}</Text>
      <Text style={styles.text}>Base Ticket Total: ₹{totalAmount}</Text>
      <Text style={styles.text}>Movie Name: {movieId}</Text>
      <Text style={styles.text}>Theater: {theaterId}</Text>
      <Text style={styles.text}>City: {city}</Text>
      <Text style={styles.text}>Date: {date}</Text>
      <Text style={styles.text}>Show Time: {showTime}</Text>

      <Text style={[styles.heading, { marginTop: 24 }]}>Add Snacks & Beverages</Text>
      <FlatList
        data={snackItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const quantity = selectedSnacks.filter((s) => s.id === item.id).length;
          return (
            <View style={styles.snackItem}>
              <Text style={styles.snackName}>
                {item.name} - ₹{item.price}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleRemoveSnack(item.id)} style={styles.actionButton}>
                  <Text style={styles.actionText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity onPress={() => handleAddSnack(item)} style={styles.actionButton}>
                  <Text style={styles.actionText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Snacks Total: ₹{getSnackTotal()}</Text>
        <Text style={styles.totalText}>Grand Total: ₹{grandTotal}</Text>
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  snackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  snackName: {
    fontSize: 16,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 30,
    height: 30,
    backgroundColor: '#007bff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 18,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
    width: 20,
    textAlign: 'center',
  },
  totalContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
});
