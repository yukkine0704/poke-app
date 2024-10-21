import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Searchbar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import PokemonCard from '../components/pokeCard';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const HomeScreen = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');
  const navigation = useNavigation();
  const flatListRef = useRef(null); // Reference for FlatList
  const scrollY = useSharedValue(0); // Shared value for scroll position
  const fabVisible = useSharedValue(0); // Shared value for FAB visibility

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

  const handleCardPress = (name) => {
    navigation.navigate('PokemonDetails', { name });
  };

  const renderItem = ({ item }) => (
    <PokemonCard pokemon={item} onPress={() => handleCardPress(item.name)} />
  );

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 }); // Scroll to the top
  };

  // Animated style for FAB
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fabVisible.value,
      transform: [{ translateY: fabVisible.value === 1 ? 0 : 100 }],
    };
  });

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
        ref={flatListRef} // Attach the reference to FlatList
        style={{ marginTop: 10 }}
        data={pokemonList}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        onEndReached={loadPokemons}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y; // Update scroll position
          fabVisible.value = scrollY.value > 600 ? withTiming(1) : withTiming(0); // Show or hide FAB based on scroll position
        }}
        scrollEventThrottle={16} // Control the frequency of the scroll event
      />
      <Animated.View style={[styles.fabContainer, animatedStyle]}>
        <FAB
          style={styles.fab}
          icon="arrow-up-drop-circle"
          onPress={scrollToTop} // Call scrollToTop function
        />
      </Animated.View>
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
  fabContainer: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;