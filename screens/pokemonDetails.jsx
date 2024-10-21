import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { ActivityIndicator, Button, Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/footer';
import colors from '../constants/colors';
import icons from '../constants/typeIcons';
import { TabView, SceneMap } from 'react-native-tab-view';

const InfoTab = ({ pokemonData }) => (
  <View style={styles.tabContainer}>
    <Text style={styles.infoText}>Altura: {pokemonData.height}</Text>
    <Text style={styles.infoText}>Peso: {pokemonData.weight}</Text>
    <Text style={styles.infoText}>
      Habilidades: {pokemonData.abilities.map(ab => ab.ability.name).join(', ')}
    </Text>
  </View>
);

const TypesTab = ({ pokemonData }) => (
  <View style={styles.tabContainer}>
    <View style={styles.chipContainer}>
      {pokemonData.types.map((typeInfo) => (
        <Chip
          key={typeInfo.type.name}
          style={[styles.chip, { backgroundColor: colors[typeInfo.type.name]}]}
          icon={() => (
            <Icon name={icons[typeInfo.type.name]} color='#FFFFFF' size={16} />
          )}
          textStyle={styles.chipText}
        >
          {typeInfo.type.name.toUpperCase()}
        </Chip>
      ))}
    </View>
  </View>
);

const CustomTabBar = ({ routes, index, setIndex }) => (
  <View style={styles.tabBar}>
    {routes.map((route, i) => (
      <Button
        key={route.key}
        mode={index === i ? 'contained' : 'outlined'}
        onPress={() => setIndex(i)}
        style={styles.tabButton}
        labelStyle={index === i ? styles.activeTabButtonText : styles.tabButtonText}
      >
        {route.title}
      </Button>
    ))}
  </View>
);

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

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'info', title: 'Información' },
    { key: 'types', title: 'Tipos' },
    { key: 'stats', title: 'Estadísticas' },
  ]);

  const renderScene = SceneMap({
    info: () => pokemonData && <InfoTab pokemonData={pokemonData} />,
    types: () => pokemonData && <TypesTab pokemonData={pokemonData} />,
    stats: () => (
      <View style={styles.tabContainer}>
        <Text style={styles.infoText}>Esta pestaña puede mostrar estadísticas.</Text>
      </View>
    ),
  });

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
      <View style={styles.header}>
        <Image
          source={{ uri: pokemonData.sprites.front_default }}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>{pokemonData.name.toUpperCase()}</Text>
      </View>
      <CustomTabBar routes={routes} index={index} setIndex={setIndex} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: '100%' }}
        renderTabBar={() => null} // Elimina la barra de pestañas predeterminada
      />
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  tabButtonText: {
    color: '#000',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  tabContainer: {
    padding: 16,
  },
  infoText: {
    fontSize: 16,
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
  footerContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
});

export default PokemonDetailsScreen;