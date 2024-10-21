import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { ActivityIndicator, Button, Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/footer';
import colors from '../constants/colors'; // Importa tu archivo de colores
import icons from '../constants/typeIcons';
import { TabView, SceneMap } from 'react-native-tab-view';

const InfoTab = ({ pokemonData }) => {
  const abilities = pokemonData.abilities.map(ab => 
    `${ab.ability.name}${ab.is_hidden ? ' (Oculta)' : ''}`
  ).join(', ');

  // Conversión de altura y peso
  const heightInMeters = (pokemonData.height / 10).toFixed(2); // Convertir de decímetros a metros
  const weightInKg = (pokemonData.weight / 10).toFixed(2); // Convertir de hectogramos a kilogramos

  return (
    <ScrollView>
    <View style={styles.tabContainer}>
    <Text style={styles.infoTextBold}>Informacion:</Text>
      <Text style={styles.infoText}>Altura: {heightInMeters} m</Text>
      <Text style={styles.infoText}>Peso: {weightInKg} kg</Text>
      <Text style={styles.infoText}>Experiencia Base: {pokemonData.base_experience}</Text>
      <Text style={styles.infoText}>Habilidades: {abilities}</Text>
      
      {/* Mostrar estadísticas */}
      <Text style={styles.infoTextBold}>Estadísticas:</Text>
      {pokemonData.stats && pokemonData.stats.length > 0 ? (
        pokemonData.stats.map(stat => (
          <Text key={stat.name} style={styles.infoText}>
            {stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}: {stat.base}
          </Text>
        ))
      ) : (
        <Text style={styles.infoText}>No hay estadísticas disponibles.</Text>
      )}
    </View>
    </ScrollView>
  );
};

const StatsTab = ({ speciesData }) => {
  return (
    <View style={styles.tabContainer}>
    <View style={styles.rowContainer}>
      <Text style={styles.infoTextBold}>Color:</Text>
      <View style={[styles.colorBox, { backgroundColor: speciesData.color.name }]} />
    </View>
    <View style={styles.rowContainer}>
      <Text style={styles.infoTextBold}>Hábitat:</Text>
      <Text style={styles.infoText}>{speciesData.habitat?.name || 'Desconocido'}</Text>
    </View>
    <View style={styles.rowContainer}>
      <Text style={styles.infoTextBold}>¿Forma Cambiante?:</Text>
      {speciesData.forms_switchable ? (
        <Icon name="check-circle" color="green" size={20} />
      ) : (
        <Icon name="cancel" color="red" size={20} />
      )}
    </View>
    <View style={styles.rowContainer}>
      <Text style={styles.infoTextBold}>Tasa de Captura:</Text>
      <Text style={styles.infoText}>{speciesData.capture_rate}</Text>
    </View>
    <View style={styles.rowContainer}>
      <Text style={styles.infoTextBold}>Tasa de Crecimiento:</Text>
      <Text style={styles.infoText}>{speciesData.growth_rate.name}</Text>
    </View>
  </View>
  );
};

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
      <Text style={styles.infoText}>Tipos:</Text>
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

      <Text style={styles.infoText}>Debilidades:</Text>
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

const CustomTabBar = ({ routes, index, setIndex }) => (
  <View style={styles.tabBar}>
    {routes.map((route, i) => (
      <Button
        key={route.key}
        mode={index === i ? 'contained' : 'outlined'}
        onPress={() => setIndex(i)}
        style={styles.tabButton}
        labelStyle={index === i ? styles.activeTabButtonText : styles.tabButtonText}
      >
        {route.title}
      </Button>
    ))}
  </View>
);

const PokemonDetailsScreen = ({ route }) => {
  const { name } = route.params;
  const [pokemonData, setPokemonData] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPokemon = async () => {
      if (name.trim()) {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
          const data = await response.json();
          const speciesResponse = await fetch(data.species.url);
          const speciesData = await speciesResponse.json();
          
          // Almacenar las estadísticas
          const stats = data.stats.map(stat => ({
            name: stat.stat.name,
            base: stat.base_stat,
          }));
    
          setPokemonData({ ...data, stats }); // Añadir las estadísticas a pokemonData
          setSpeciesData(speciesData);
        } catch (error) {
          console.error(error);
          setPokemonData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'info', title: 'Información' },
    { key: 'stats', title: 'Estadísticas' },
    { key: 'types', title: 'Tipos' },
  ]);

  const renderScene = SceneMap({
    info: () => pokemonData && <InfoTab pokemonData={pokemonData} />,
    stats: () => speciesData && <StatsTab speciesData={speciesData} />,
    types: () => pokemonData && <TypesTab pokemonData={pokemonData} />, // Llamada a TypesTab
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!pokemonData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se encontró el Pokémon.</Text>
      </View>
    );
  }

  const headerColor = colors[pokemonData.types[0].type.name] || '#fff'; // Color por defecto

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Image
          source={{ uri: pokemonData.sprites.front_default }}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>{pokemonData.name.toUpperCase()}</Text>
      </View>
      <CustomTabBar routes={routes} index={index} setIndex={setIndex} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: '100%' }}
        renderTabBar={() => null} // Elimina la barra de pestañas predeterminada
      />
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, 
  },
  tabContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Color del texto en el encabezado
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  tabButtonText: {
    color: '#000',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  chip: {
    margin: 4,
    padding: 8,
  },
  chip_w:{
    margin: 4,
    padding: 4,
  },
  chipText: {
    color: '#FFFFFF',
  },
  footerContainer: {
    justifyContent: 'flex-end',
    flex: 0.5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTextBold: {
    fontSize: 18, // Aumentar tamaño de fuente
    fontWeight: 'bold', // Negrita
    marginRight: 8, // Espacio entre texto y valor
    width: 150, // Ancho fijo para alinear
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 3, // Bordes ligeramente redondeados
    marginLeft: 8,
  },
  switchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default PokemonDetailsScreen;