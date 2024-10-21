import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const InfoTab = ({ pokemonData }) => {
  const abilities = pokemonData.abilities.map(ab => 
    `${ab.ability.name}${ab.is_hidden ? ' (Hidden)' : ''}`
  ).join(', ');

  const heightInMeters = (pokemonData.height / 10).toFixed(2);
  const weightInKg = (pokemonData.weight / 10).toFixed(2);

  return (
    <ScrollView style={styles.tabContainer}>
      <Text style={styles.infoText}>Height: {heightInMeters} m</Text>
      <Text style={styles.infoText}>Weight: {weightInKg} kg</Text>
      <Text style={styles.infoText}>Base experience: {pokemonData.base_experience}</Text>
      <Text style={styles.infoText}>Habilities: {abilities}</Text>
      
      <Text style={styles.infoTextBold}>Statistics:</Text>
      {pokemonData.stats && pokemonData.stats.length > 0 ? (
        pokemonData.stats.map(stat => (
          <View key={stat.name} style={styles.statContainer}>
            <View style={styles.progressContainer}>
              <Text style={styles.statText}>
                {stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}: {stat.base}
              </Text>
              <View style={styles.progressBarContainer}>
                <ProgressBar 
                  progress={stat.base / 300}  
                  style={styles.progressBar}
                />
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.infoText}>No hay estadísticas disponibles.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    padding: 16,
    marginBottom:8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statContainer: {
    marginBottom: 16,
  },
  statText: {
    fontSize: 16,
    marginBottom: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    marginLeft: 8, // Espacio entre el texto y la barra
    overflow: 'hidden', // Asegura que la barra no se salga del contenedor
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default InfoTab;