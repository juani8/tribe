import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const EnableBiometricsScreen = ({ navigation }) => {
  const enableBiometrics = () => {
    // Logic to enable biometrics
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable Biometrics</Text>
      <Button title="Enable" onPress={enableBiometrics} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default EnableBiometricsScreen;