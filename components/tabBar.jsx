import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

const CustomTabBar = ({ routes, index, setIndex }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
    {routes.map((route, i) => (
      <Button
        key={route.key}
        mode={index === i ? 'contained' : 'outlined'}
        onPress={() => setIndex(i)}
        style={{ flex: 1, marginHorizontal: 4 }}
        labelStyle={index === i ? { color: '#fff' } : { color: '#000' }}
      >
        {route.title}
      </Button>
    ))}
  </View>
);

export default CustomTabBar;