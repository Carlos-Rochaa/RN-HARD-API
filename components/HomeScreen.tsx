import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { fetchCats, Cat, fetchPetShops, PetShop } from '../api/api';

export default function HomeScreen() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [petShops, setPetShops] = useState<PetShop[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeButton, setActiveButton] = useState<'cats' | 'petshops' | null>(null);

  const handleFetchCats = async () => {
    setActiveButton('cats');
    try {
      const data = await fetchCats();
      setCats(data);
      setPetShops([]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados dos gatos.');
    }
  };

  const handleFetchPetShops = async () => {
    setActiveButton('petshops');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      const data = await fetchPetShops(latitude, longitude);
      setPetShops(data);
      setCats([]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as pet shops próximas.');
    }
  };

  const renderCat = ({ item }: { item: Cat }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.url || '' }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Largura: {item.width}</Text>
        <Text style={styles.text}>Altura: {item.height}</Text>
      </View>
    </View>
  );

  const renderPetShop = ({ item }: { item: PetShop }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name || 'Sem nome'}</Text>
      <Text style={styles.text}>Endereço: {item.address || 'Sem endereço'}</Text>
      <Text style={styles.text}>Distância: {item.distance || 0}m</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {activeButton === 'cats' && (
        <FlatList
          data={cats || []}
          keyExtractor={(item) => item.id}
          renderItem={renderCat}
          contentContainerStyle={styles.list}
        />
      )}
      {activeButton === 'petshops' && (
        <FlatList
          data={petShops || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPetShop}
          contentContainerStyle={styles.list}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeButton === 'cats' ? styles.activeButton : styles.inactiveButton]}
          onPress={handleFetchCats}
        >
          <Text style={styles.buttonText}>Carregar Gatos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, activeButton === 'petshops' ? styles.activeButton : styles.inactiveButton]}
          onPress={handleFetchPetShops}
        >
          <Text style={styles.buttonText}>Pet Shops Próximas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  list: { padding: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  image: { width: '100%', height: 200 },
  infoContainer: { padding: 15 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  text: { fontSize: 14, color: '#666', marginBottom: 10, lineHeight: 20 },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: { flex: 1, marginHorizontal: 5, padding: 15, borderRadius: 5, alignItems: 'center', borderWidth: 1 },
  activeButton: { backgroundColor: '#007bff', borderColor: '#007bff' },
  inactiveButton: { backgroundColor: '#e9ecef', borderColor: '#ced4da' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});