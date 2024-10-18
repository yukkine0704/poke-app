import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput, Card, Title, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

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
    <Card style={styles.card}>
      {item.sprites && item.sprites.front_default ? (
        <Card.Cover source={{ uri: item.sprites.front_default }} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <Card.Content>
        <Title>{item.name}</Title>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar Pokémon"
        value={pokemonName}
        onChangeText={setPokemonName}
        accessibilityLabel="Nombre del Pokémon"
        mode="outlined"
      />
      <Button
        mode='contained'
        onPress={handleSearch}
      >
        Buscar
      </Button>
      <FlatList
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
  card: {
    marginBottom: 16,
  },
  placeholder: {
    width: '100%',
    height: 150, // Altura estándar para el placeholder
    backgroundColor: '#ccc',
  },
});

export default HomeScreen;