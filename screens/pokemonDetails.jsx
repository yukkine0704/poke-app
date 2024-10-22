import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { ActivityIndicator, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTabBar from '../components/tabBar';
import InfoTab from '../components/infoTab';
import StatsTab from '../components/statsTab';
import TypesTab from '../components/typesTab';
import Footer from '../components/footer';
import colors from '../constants/colors';

const PokemonDetailsScreen = ({ route }) => {
  const { name } = route.params;
  const [pokemonData, setPokemonData] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPokemon = async () => {
      if (name.trim()) {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
          const data = await response.json();
          const speciesResponse = await fetch(data.species.url);
          const speciesData = await speciesResponse.json();
          const stats = data.stats.map(stat => ({
            name: stat.stat.name,
            base: stat.base_stat,
          }));
          setPokemonData({ ...data, stats });
          setSpeciesData(speciesData);
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

  const [index, setIndex] = useState(0);
  const [routes] = useState([
{ key: 'stats', title: 'Info' },
{ key: 'info', title: 'Statistics' },
    { key: 'types', title: 'Type' },
  ]);

  const renderScene = SceneMap({
    info: () => pokemonData && <InfoTab pokemonData={pokemonData} />,
    stats: () => speciesData && <StatsTab speciesData={speciesData} />,
    types: () => pokemonData && <TypesTab pokemonData={pokemonData} />,
  });

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
        <Card style={styles.card}>
          <Card.Content style={{alignItems: 'center'}}>
            <Title>No se encontró el Pokémon</Title>
            <Paragraph>Verifica que el nombre esté escrito correctamente.</Paragraph>
            <Icon name="info"  color={theme.colors.tertiary} size={40}  />
          </Card.Content>
        </Card>
      </View>
    );
  }

  const headerColor = colors[pokemonData.types[0].type.name] || '#fff';

  return (
    <>
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Image
          source={{ uri: pokemonData.sprites.front_default }}
          style={styles.image}
        />
        <Text style={styles.pokemonName}>{pokemonData.name.toUpperCase()}</Text>
      </View>
      <CustomTabBar routes={routes} index={index} setIndex={setIndex} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: '100%' }}
        renderTabBar={() => null}
      />
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 100,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25, // Bordes redondeados hacia abajo
    borderBottomRightRadius: 25,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    width: '90%',
  },
});

export default PokemonDetailsScreen;