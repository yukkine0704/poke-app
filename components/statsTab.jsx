import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StatsTab = ({ speciesData }) => {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.infoTextBold}>Color:</Text>
        <View style={[styles.colorBox, { backgroundColor: speciesData.color.name }]} />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.infoTextBold}>Habitat :</Text>
        <Text style={styles.infoText}>{speciesData.habitat?.name || 'Desconocido'}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.infoTextBold}>Can transform?:</Text>
        {speciesData.forms_switchable ? (
          <Icon name="check-circle" color="green" size={20} />
        ) : (
          <Icon name="cancel" color="red" size={20} />
        )}
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.infoTextBold}>Capture rate:</Text>
        <Text style={styles.infoText}>{speciesData.capture_rate}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.infoTextBold}>Grouth rate:</Text>
        <Text style={styles.infoText}>{speciesData.growth_rate.name}</Text>
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
    marginBottom: 8,
  },
  infoTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    width: 150,
  },
  infoText: {
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