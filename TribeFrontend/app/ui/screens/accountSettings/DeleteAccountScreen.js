import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DeleteAccountScreen = ({ navigation }) => {
  const handleDeleteAccount = () => {
    // Add your delete account logic here
    console.log('Account deleted');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Are you sure you want to delete your account?</Text>
      <Button title="Delete Account" onPress={handleDeleteAccount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default DeleteAccountScreen;