import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, IconButton } from 'react-native-paper';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import merge from 'deepmerge';
import HomeScreen from './screens/homescreen';
import PokemonDetailsScreen from './screens/pokemonDetails';

const Stack = createStackNavigator();

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Estado para el tema
  const colorScheme = isDarkTheme ? 'dark' : 'light'; // Determina el color del esquema
  const { theme } = useMaterial3Theme({ fallbackSourceColor: '#FF6214' });

  const paperTheme = useMemo(
    () =>
      colorScheme === 'dark'
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme]
  );

  const CombinedLightTheme = merge(MD3LightTheme, NavigationDefaultTheme);
  const CombinedDarkTheme = merge(MD3DarkTheme, NavigationDarkTheme);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme); // Cambia el estado del tema
  };

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar 
        translucent={true} 
        style={isDarkTheme ? 'light' : 'dark'} // Cambia el estilo de la StatusBar
      />
     <NavigationContainer theme={colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme}>
        <Stack.Navigator initialRouteName="Home" screenOptions={{
          headerRight: () => (
            <View style={styles.switchContainer}>
              <IconButton
              onPress={toggleTheme}
                icon={isDarkTheme ? 'weather-night' : 'white-balance-sunny'}
                iconColor={isDarkTheme ? theme.dark.onSurface : theme.light.onSurface}
                size={24}
              />
            </View>
          ),
        }}>
          <Stack.Screen
            name="PokeDex"
            component={HomeScreen}
          />
          <Stack.Screen
            name="PokemonDetails"
            component={PokemonDetailsScreen}
            options={{
              headerTransparent: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginTop: 20,
    padding: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    marginLeft: 14,
  },
});