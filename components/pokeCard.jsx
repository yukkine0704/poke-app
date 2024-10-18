// PokemonCard.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import icons from '../constants/typeIcons';

const PokemonCard = ({ pokemon }) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Card style={styles.card}>
      {pokemon.sprites && pokemon.sprites.front_default ? (
        <Card.Cover source={{ uri: pokemon.sprites.front_default }} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <Card.Content>
        <Title style={styles.pokedexNumber}>#{pokemon.id}</Title>
        <Text style={styles.pokemonName}>
          {capitalizeFirstLetter(pokemon.name)}
        </Text>

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
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    marginBottom: 16,
    padding: 8,
    minHeight: 200, 
  },
  placeholder: {
    width: '100%',
    height: 150
  },
  cardContent: {
    paddingVertical: 8, 
  },
  pokedexNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pokemonName: {
    fontSize: 26,
    marginBottom: 8, 
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