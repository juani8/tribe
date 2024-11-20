import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FollowersScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Followers Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FollowersScreen;