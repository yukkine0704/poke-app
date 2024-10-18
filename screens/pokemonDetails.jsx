import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, ActivityIndicator, Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/footer';
import colors from '../constants/colors';
import icons from '../constants/typeIcons';

const PokemonDetailsScreen = ({ route }) => {
  const { name } = route.params;
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
        <Card.Cover source={{ uri: pokemonData.sprites.front_default }} />
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
          <View style={styles.chipContainer}>
            {pokemonData.types.map((typeInfo) => (
              <Chip
                key={typeInfo.type.name}
                style={[styles.chip, { backgroundColor: colors[typeInfo.type.name]}]}
                icon={() => (
                  <Icon name={icons[typeInfo.type.name]} color='#FFFFFF' size={16} />
                )}
                textStyle={styles.chipText} // Agrega este estilo para el texto del chip
              >
                {typeInfo.type.name.toUpperCase()}
              </Chip>
            ))}
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  chip: {
    margin: 4,
    padding: 8,
  },
  chipText: {
    color: '#FFFFFF',
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