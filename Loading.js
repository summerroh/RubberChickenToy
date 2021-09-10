import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function Loading() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff9137" translucent={true}/>
        <Text style={styles.text}>Loading</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: 30,
      paddingVertical: 100,
      backgroundColor: "#ff9137"
  },
  text: {
    color: "#2c2c2c",
    fontSize: 30
  }
});