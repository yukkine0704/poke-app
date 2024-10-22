import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import icons from '../constants/typeIcons';

const PokemonCard = ({ pokemon, onPress }) => {
 
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Title style={styles.pokedexNumber}>#{pokemon.id}</Title>
            <Paragraph style={styles.pokemonName}>
              {capitalizeFirstLetter(pokemon.name)}
            </Paragraph>

            <View style={styles.chipContainer}>
              {pokemon.types.map((typeInfo, index) => {
                const typeName = typeInfo.type.name; 
                const iconName = icons[typeName] || 'help'; 

                return (
                  <Chip
                    key={index}
                    mode="flat"
                    style={[styles.chip, { backgroundColor: colors[typeName] }]} 
                    textStyle={styles.chipText} 
                  >
                    <View style={styles.chipContent}>
                      <Icon name={iconName} size={20} color="#FFFFFF" />
                      <Paragraph style={styles.chipText}>{typeName}</Paragraph>
                    </View>
                  </Chip>
                );
              })}
            </View>
          </View>
          {pokemon.sprites && pokemon.sprites.front_default ? (
            <Image
              source={{ uri: pokemon.sprites.front_default }}
              style={styles.pokemonImage}
            />
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    marginHorizontal: 8,
    padding: 8,
    minHeight: 100, 
  },
  cardContent: {
    flexDirection: 'row', 
    alignItems: 'center',  
  },
  pokemonImage: {
    width: '33%', 
    height: '100%', 
    marginRight: 8, 
  },
  placeholder: {
    width: 100,
    height: 100,
    marginRight: 8, 
  },
  textContainer: {
    flex: 1, 
  },
  pokedexNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pokemonName: {
    fontSize: 26,
    marginBottom: 8,
    paddingTop:8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    color: '#FFFFFF',
    marginLeft: 4,
  },
});

export default PokemonCard;