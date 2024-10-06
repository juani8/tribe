import React, { useState } from 'react';
import { Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from './CustomTextNunito';

const CustomButton = ({ title, onPress }) => {
  const { theme } = useTheme();
  const [scale] = useState(new Animated.Value(1)); 

  // Function to handle the press in (shrink effect)
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  // Function to handle the press out (grow back effect)
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
      >
        <CustomTextNunito weight='SemiBold' style={{ color: theme.colors.buttonText }}>{title}</CustomTextNunito>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomButton;
