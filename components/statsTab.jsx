import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Paragraph, Title, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StatsTab = ({ speciesData }) => {
  const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
  const theme = useTheme();

  return (
    <View style={styles.tabContainer}>
      <View style={styles.rowContainer}>
        <Title style={styles.title}>Description:</Title>
      </View>
      <View style={styles.rowContainer}>
        <Paragraph style={styles.description}>
          {descriptionEntry ? descriptionEntry.flavor_text : 'Descripción no disponible'}
        </Paragraph>
      </View>

      <View style={styles.rowContainer}>
        <Icon name="palette" size={24} color={theme.colors.onSurface} />
        <Paragraph style={styles.infoParagraphBold}>Color:</Paragraph>
        <View style={[styles.colorBox, { backgroundColor: speciesData.color.name }]} />
      </View>

      <View style={styles.rowContainer}>
        <Icon name="nature" size={24} color={theme.colors.onSurface}/>
        <Paragraph style={styles.infoParagraphBold}>Habitat:</Paragraph>
        <Paragraph style={styles.infoParagraph}>{speciesData.habitat?.name || 'Desconocido'}</Paragraph>
      </View>

      <View style={styles.rowContainer}>
        <Icon name="coronavirus" size={24} color={theme.colors.onSurface}/>
    <Paragraph style={styles.infoParagraphBold}>Can transform?:</Paragraph>
    {speciesData.forms_switchable ? (
      <Icon name="check-circle" color="green" size={20} />
    ) : (
      <Icon name="cancel" color="red" size={20} />
    )}
  </View>

      <View style={styles.rowContainer}>
        <Icon name="star-border" size={24} color={theme.colors.onSurface}/>
        <Paragraph style={styles.infoParagraphBold}>Capture rate:</Paragraph>
        <Paragraph style={styles.infoParagraph}>{speciesData.capture_rate}</Paragraph>
      </View>

      <View style={styles.rowContainer}>
        <Icon name="trending-up" size={24} color={theme.colors.onSurface}/>
        <Paragraph style={styles.infoParagraphBold}>Growth rate:</Paragraph>
        <Paragraph style={styles.infoParagraph}>{speciesData.growth_rate.name}</Paragraph>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    padding: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 16,
  },
  infoParagraphBold: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10,
    width: 150,
  },
  infoParagraph: {
    fontSize: 16,
    flex: 1,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    marginLeft: 8,
  },
});

export default StatsTab;