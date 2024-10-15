import React from 'react'
import { StyleSheet, Linking, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Footer = () => {
    const handlePress = () => {
        Linking.openURL('https://github.com/yukkine0704/poke-app');
      };
    
      return (
        <TouchableOpacity style={styles.footer} onPress={handlePress}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name='copyright' size={24}/>
          <Text style={styles.footerText}>2024 yukkine0704- Todos los derechos reservados</Text>
          </View>
        </TouchableOpacity>
      );
}

const styles = StyleSheet.create({
    footer: {
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 'auto',
    },
    footerText: {
      fontSize: 14,
    },
  });
export default Footer;