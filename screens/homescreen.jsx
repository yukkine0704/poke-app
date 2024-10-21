import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import PokemonCard from '../components/pokeCard';

const HomeScreen = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');
  const navigation = useNavigation();

  useEffect(() => {
    loadPokemons();
  }, []);

  const loadPokemons = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const response = await fetch(nextUrl);
        const data = await response.json();
        const detailedPokemons = await Promise.all(data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          return detailResponse.json();
        }));
        setPokemonList(prev => [...prev, ...detailedPokemons]);
        setNextUrl(data.next);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    if (!pokemonName.trim()) {
      Alert.alert("Error", "Por favor, ingresa un nombre de Pokémon.");
      return;
    }
    navigation.navigate('PokemonDetails', { name: pokemonName });
  };

  const renderItem = ({ item }) => (
    <PokemonCard pokemon={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        style={styles.input}
        placeholder="Buscar Pokémon"
        value={pokemonName}
        onChangeText={setPokemonName}
        accessibilityLabel="Nombre del Pokémon"
        mode="bar"
      />
      <Button
        mode='contained'
        onPress={handleSearch}
      >
        Buscar
      </Button>
      <FlatList
      style={{marginTop: 10,}}
        data={pokemonList}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        onEndReached={loadPokemons}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default HomeScreen;