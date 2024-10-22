import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Searchbar, FAB, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import PokemonCard from '../components/pokeCard';
import CustomBottomSheet from '../components/bottomSheet';

const HomeScreen = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');
  const [filteredPokemons, setFilteredPokemons] = useState([]); // Cambiado a array vacío
  const [selectedTypes, setSelectedTypes] = useState([]);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const scrollY = useSharedValue(0);
  const fabVisible = useSharedValue(0);
  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleFilter = (type) => {
    setSelectedTypes(prev => {
      const newSelectedTypes = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];

      const filtered = pokemonList.filter(pokemon =>
        newSelectedTypes.length === 0 ||
        pokemon.types.some((pokemonType) => newSelectedTypes.includes(pokemonType.type.name))
      );

      setFilteredPokemons(filtered);
      return newSelectedTypes;
    });
  };

  const handleClearFilters = () => {
    setSelectedTypes([]); 
    setFilteredPokemons(pokemonList);
  };

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
        setFilteredPokemons(prev => [...prev, ...detailedPokemons]); // Carga inicial
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
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fabVisible.value,
      transform: [{ translateY: fabVisible.value === 1 ? 0 : 100 }],
    };
  });

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <Searchbar
          style={styles.input}
          placeholder="Buscar Pokémon"
          value={pokemonName}
          onChangeText={setPokemonName}
          accessibilityLabel="Nombre del Pokémon"
          mode="bar"
          icon={'filter'}
          onIconPress={handlePresentModalPress}
        />
        <Button mode='contained' onPress={handleSearch}>
          Buscar
        </Button>
        <FlatList
          ref={flatListRef}
          style={{ marginTop: 10 }}
          data={filteredPokemons.length > 0 ? filteredPokemons : pokemonList}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          onEndReached={loadPokemons}
          onEndReachedThreshold={0.1}
          ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
          onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y;
            fabVisible.value = scrollY.value > 600 ? withTiming(1) : withTiming(0);
          }}
          scrollEventThrottle={16}
        />
        <Animated.View style={[styles.fabContainer, animatedStyle]}>
          <FAB
            style={styles.fab}
            icon="arrow-up-drop-circle"
            onPress={scrollToTop}
          />
        </Animated.View>
        <CustomBottomSheet
          refModal={bottomSheetModalRef}
          onChange={() => {}}
          selectedTypes={selectedTypes}
          onFilter={handleFilter}
          onClearFilters={handleClearFilters} 
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
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