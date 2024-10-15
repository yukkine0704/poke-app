import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/footer';

const PokemonDetailsScreen = ({ route }) => {
  const { name } = route.params;
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (name.trim()) {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
          const data = await response.json();
          setPokemonData(data);
        } catch (error) {
          console.error(error);
          setPokemonData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!pokemonData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se encontró el Pokémon.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: pokemonData.sprites.front_default }}/>
        <Card.Title title={pokemonData.name.toUpperCase()} />
        <Card.Content>
          <View style={styles.infoContainer}>
            <Icon name="height" size={24} />
            <Text style={styles.infoText}>Altura: {pokemonData.height}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="fitness-center" size={24} />
            <Text style={styles.infoText}>Peso: {pokemonData.weight}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="star" size={24} />
            <Text style={styles.infoText}>
              Habilidades: {pokemonData.abilities.map(ab => ab.ability.name).join(', ')}
            </Text>
          </View>
        </Card.Content>
      </Card>
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginTop: 20,
    padding: 16,
  },
  image: {
    width: 100, // Ajusta el tamaño según tus necesidades
    height: 100,
    alignSelf: 'center',
    marginBottom: 16, // Espaciado debajo de la imagen
    borderRadius: 8, // Bordes redondeados (opcional)
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  footerContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
});

export default PokemonDetailsScreen;