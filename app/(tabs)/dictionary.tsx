import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FontTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.defaultText}>This is default font</Text>
      <Text style={styles.irishText}>This should be Irish Grover</Text>
      <Text style={{ fontFamily: 'IrishGrover', fontSize: 20 }}>
        Direct style test
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultText: {
    fontSize: 18,
    marginBottom: 20,
  },
  irishText: {
    fontFamily: 'IrishGrover',
    fontSize: 24,
    color: 'red', // Make it obvious
  },
});