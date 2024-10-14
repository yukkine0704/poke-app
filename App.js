import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, Card, Text,Button,TextInput, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useColorScheme } from 'react-native';
import merge from 'deepmerge';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [pokemonName, setPokemonName] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
        style={styles.input}
        placeholder="Buscar Pokémon"
        value={pokemonName}
        onChangeText={setPokemonName}
      />
      <Button mode='contained' onPress={() => navigation.navigate('PokemonDetails', { name: pokemonName })}>
        Buscar
      </Button>
    </SafeAreaView>
  );
};

const PokemonDetailsScreen = ({ route }) => {
  const { name } = route.params;
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
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
        <Card.Title title={pokemonData.name.toUpperCase()} />
        <Card.Content>
          <View style={styles.infoContainer}>
            <Icon name="height" size={24} color="#FF6214"/>
            <Text style={styles.infoText}>Altura: {pokemonData.height}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="fitness-center" size={24} color="#FF6214" />
            <Text style={styles.infoText}>Peso: {pokemonData.weight}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="star" size={24} color="#FF6214" />
            <Text style={styles.infoText}>Habilidades: {pokemonData.abilities.map(ab => ab.ability.name).join(', ')}</Text>
          </View>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
};

export default function App() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: '#FF6214' });

  const paperTheme = useMemo(
    () =>
      colorScheme === 'dark'
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme]
  );

  const CombinedLightTheme = merge(MD3LightTheme, NavigationDefaultTheme);
  const CombinedDarkTheme = merge(MD3DarkTheme, NavigationDarkTheme);

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PokemonDetails" component={PokemonDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
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
  infoText: {
    marginLeft: 8,
    fontSize: 16,
  },
});