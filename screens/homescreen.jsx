// screens/HomeScreen.jsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [pokemonName, setPokemonName] = useState('');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar Pokémon"
        value={pokemonName}
        onChangeText={setPokemonName}
      />
      <Button
        mode='contained'
        onPress={() => navigation.navigate('PokemonDetails', { name: pokemonName })}
      >
        Buscar
      </Button>
    </SafeAreaView>
  );
};

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
});

export default HomeScreen;