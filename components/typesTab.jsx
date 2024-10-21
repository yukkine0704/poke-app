import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import icons from '../constants/typeIcons';

const TypesTab = ({ pokemonData }) => {
  const [weaknesses, setWeaknesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeaknesses = async () => {
      try {
        const typeRequests = pokemonData.types.map(typeInfo =>
          fetch(`https://pokeapi.co/api/v2/type/${typeInfo.type.name}`)
        );
        const responses = await Promise.all(typeRequests);
        const typesData = await Promise.all(responses.map(res => res.json()));

        const allWeaknesses = typesData.flatMap(type =>
          type.damage_relations.double_damage_from.map(weakness => weakness.name)
        );

        const uniqueWeaknesses = [...new Set(allWeaknesses)].slice(0, 4);
        setWeaknesses(uniqueWeaknesses);
      } catch (error) {
        console.error("Error al obtener debilidades: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeaknesses();
  }, [pokemonData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.infoText}>Type:</Text>
      <View style={styles.chipContainer}>
        {pokemonData.types.map(typeInfo => (
          <Chip
            key={typeInfo.type.name}
            style={[styles.chip, { backgroundColor: colors[typeInfo.type.name] }]}
            icon={() => (
              <Icon name={icons[typeInfo.type.name]} color='#FFFFFF' size={16} />
            )}
            textStyle={styles.chipText}
          >
            {typeInfo.type.name.toUpperCase()}
          </Chip>
        ))}
      </View>

      <Text style={styles.infoText}>Weakness:</Text>
      <View style={styles.chipContainer}>
        {weaknesses.length > 0 ? (
          weaknesses.map((weakness, index) => (
            <Chip
              key={index}
              style={[
                styles.chip_w,
                {
                  backgroundColor: colors[weakness],
                  borderRadius: 50,
                  height: 50, 
                  width: 50, 
                  justifyContent: 'center', 
                  alignItems: 'center',
                }
              ]}
              icon={() => (
                <Icon name={icons[weakness]} color='#FFFFFF' size={25} />
              )}
            />
          ))
        ) : (
          <Text style={styles.infoText}>No hay debilidades disponibles.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  chip_w:{
    margin: 4,
    padding: 4,
    },
  chip: {
    margin: 4,
    padding: 8,
  },
  chipText: {
    color: '#FFFFFF',
  },
});

export default TypesTab;