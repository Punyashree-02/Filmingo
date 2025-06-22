import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const cities = [
  { name: 'Mumbai', icon: 'city' },
  { name: 'Delhi', icon: 'city-variant' },
  { name: 'Bangalore', icon: 'city-variant-outline' },
  { name: 'Chennai', icon: 'city' },
  { name: 'Kolkata', icon: 'city-variant' },
  { name: 'Bhubaneswar', icon: 'city' },
  { name: 'Berhampur', icon: 'city-variant' },
  { name: 'Puri', icon: 'city-variant-outline' },
  { name: 'Cuttack', icon: 'city' },
];

const halls = {
  Mumbai: ['PVR Phoenix', 'INOX Oberoi', 'Cinepolis Andheri'],
  Delhi: ['PVR Select City', 'Delite Cinema', 'Carnival Rohini'],
  Bangalore: ['PVR Orion', 'INOX Garuda Mall', 'Cinepolis Mantri'],
  Chennai: ['Sathyam Cinemas', 'INOX Citi Centre', 'SPI Palazzo'],
  Kolkata: ['INOX South City', 'Navina Cinema', 'Carnival Diamond'],
  Cuttack: ['INOX', 'Sangam Talkies', 'Brundaban Talkies'],
  Bhubaneswar: [
    'Maharaja',
    'PVR Inox,Utkal Galleria',
    'Inox Esplande',
    'Inox,DN Regalia',
    'Keshari Talkies',
  ],
  Berhampur: ['Rukmani Talkies', 'Gautam Cinema', 'Payal Talies'],
  Puri: ['Anapurna Theatre', 'RajMandir', 'Shri Krishna Cinema Hall'],
};

const BookScreen = ({ navigation }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🏙️ Select City</Text>
      <View style={styles.cityContainer}>
        {cities.map((city) => (
          <TouchableOpacity
            key={city.name}
            style={[
              styles.cityButton,
              selectedCity === city.name && styles.citySelected,
            ]}
            onPress={() => setSelectedCity(city.name)}
          >
            <Icon name={city.icon} size={24} color="#FFA500" />
            <Text style={styles.cityText}>{city.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCity && (
        <>
          <Text style={styles.header}>🏟️ Halls in {selectedCity}</Text>
          {halls[selectedCity]?.map((hall, index) => (
            <TouchableOpacity
              key={index}
              style={styles.hallBox}
              onPress={() => {
                const today = new Date();
                const currentDate = today.toISOString().slice(0, 10);
                navigation.navigate('SeatSelectionScreen', {
                  theaterId: hall,
                  city: selectedCity,
                  movieId: 'someMovieId', // Replace with actual movie ID
                  date: currentDate,
                  showTime: '18:00',
                });
              }}
            >
              <Text style={styles.hallText}>{hall}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d0d0d',
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA500',
    marginVertical: 12,
    marginTop: 30,
  },
  cityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cityButton: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    marginVertical: 6,
    borderColor: '#333',
    borderWidth: 1,
  },
  citySelected: {
    borderColor: '#FFA500',
    borderWidth: 2,
  },
  cityText: {
    marginTop: 6,
    color: '#FFA500',
    fontWeight: '600',
  },
  hallBox: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  hallText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BookScreen;