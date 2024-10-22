import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ProgressBar, Paragraph } from 'react-native-paper';

const InfoTab = ({ pokemonData }) => {
  const abilities = pokemonData.abilities.map(ab => 
    `${ab.ability.name}${ab.is_hidden ? ' (Hidden)' : ''}`
  ).join(', ');

  const heightInMeters = (pokemonData.height / 10).toFixed(2);
  const weightInKg = (pokemonData.weight / 10).toFixed(2);

  return (
    <ScrollView style={styles.tabContainer}>
      <Paragraph style={styles.infoParagraph}>Height: {heightInMeters} m</Paragraph>
      <Paragraph style={styles.infoParagraph}>Weight: {weightInKg} kg</Paragraph>
      <Paragraph style={styles.infoParagraph}>Base experience: {pokemonData.base_experience}</Paragraph>
      <Paragraph style={styles.infoParagraph}>Habilities: {abilities}</Paragraph>
      
      <Paragraph style={styles.infoParagraphBold}>Statistics:</Paragraph>
      {pokemonData.stats && pokemonData.stats.length > 0 ? (
        pokemonData.stats.map(stat => (
          <View key={stat.name} style={styles.statContainer}>
            <View style={styles.progressContainer}>
              <Paragraph style={styles.statParagraph}>
                {stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}: {stat.base}
              </Paragraph>
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
        <Paragraph style={styles.infoParagraph}>No hay estadísticas disponibles.</Paragraph>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    padding: 16,
    marginBottom:8,
  },
  infoParagraph: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoParagraphBold: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statContainer: {
    marginBottom: 16,
  },
  statParagraph: {
    fontSize: 16,
    marginBottom: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    marginLeft: 8, // Espacio entre el Paragrapho y la barra
    overflow: 'hidden', // Asegura que la barra no se salga del contenedor
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default InfoTab;