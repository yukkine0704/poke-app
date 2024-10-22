import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Avatar, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import icons from '../constants/typeIcons';
import colors from '../constants/colors'; // Asegúrate de que este archivo contenga los colores según el tipo

const types = Object.keys(icons); // Obtiene los tipos de Pokémon desde el objeto icons


const CustomBottomSheet = ({ refModal, onChange, selectedTypes, onFilter, onClearFilters }) => {
  const theme = useTheme();
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    if (onChange) {
      onChange(index);
    }
  }, [onChange]);

  const handleAvatarPress = (type) => {
    if (onFilter) {
      onFilter(type); // Llama a la función de filtrado
      console.log("Tipos filtrados:", selectedTypes);
    }
  };

  return (
    <BottomSheetModal
    backgroundStyle={{backgroundColor: theme.colors.background}}
    handleIndicatorStyle={{backgroundColor: theme.colors.onSurface}}
      ref={refModal}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.avatarContainer}>
          {types.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <TouchableOpacity key={type} onPress={() => handleAvatarPress(type)}>
                <Avatar.Icon
                  size={56}
                  icon={() => (
                    <Icon name={icons[type]} size={25} color={theme.colors.onSurface} />
                  )}
                  style={{
                    backgroundColor: isSelected ? colors[type] : 'transparent', // Color de fondo según selección
                  }}
                  color={isSelected ? '#ffffff' : colors[type]} // Color del icono
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <Button onPress={onClearFilters} mode='text'>
          Show all
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  clearButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default CustomBottomSheet;