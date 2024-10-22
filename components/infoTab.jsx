import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ProgressBar, Paragraph, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InfoTab = ({ pokemonData }) => {
  const abilities = pokemonData.abilities.map(ab => 
    `${ab.ability.name}${ab.is_hidden ? ' (Hidden)' : ''}`
  ).join(', ');

  const heightInMeters = (pokemonData.height / 10).toFixed(2);
  const weightInKg = (pokemonData.weight / 10).toFixed(2);
  const theme = useTheme();

  return (
    <ScrollView style={styles.tabContainer}>
      <View style={styles.infoContainer}>
        <Icon name="height" size={24} color={theme.colors.onSurface}/>
        <Paragraph style={styles.infoParagraph}>Height: {heightInMeters} m</Paragraph>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="fitness-center" size={24} color={theme.colors.onSurface}/>
        <Paragraph style={styles.infoParagraph}>Weight: {weightInKg} kg</Paragraph>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="star" size={24} color={theme.colors.onSurface}/>
        <Paragraph style={styles.infoParagraph}>Base experience: {pokemonData.base_experience}</Paragraph>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="power" size={24} color={theme.colors.onSurface}/>
        <Paragraph style={styles.infoParagraph}>Abilities: {abilities}</Paragraph>
      </View>
      
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
                  progress={stat.base / 200}  
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
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoParagraph: {
    fontSize: 16,
    marginLeft: 8, // Espacio entre el icono y el texto
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
    marginLeft: 8, // Espacio entre el párrafo y la barra
    overflow: 'hidden', // Asegura que la barra no se salga del contenedor
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default InfoTab;