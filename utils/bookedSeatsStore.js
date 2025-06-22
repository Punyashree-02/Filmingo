import AsyncStorage from '@react-native-async-storage/async-storage';

const getBookedSeats = async (key) => {
  try {
    const json = await AsyncStorage.getItem(key);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load booked seats', e);
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
