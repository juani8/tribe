import React, { useState } from 'react';
import { Text, TouchableOpacity, Animated, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from './CustomTextNunito';

const CustomButton = ({ title, color, normalizedSize, fullSize, smallHeight, onPress, textWeight, locked, showLoading }) => {
  const { theme } = useTheme();
  const [scale] = useState(new Animated.Value(1));
  const [isLoading, setIsLoading] = useState(false);

  const colorApplied = color ? color : theme.colors.primary;

  // Function to handle the press in (shrink effect)
  const handlePressIn = () => {
    if (!locked && (!showLoading || !isLoading)) {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  // Function to handle the press out (grow back effect)
  const handlePressOut = () => {
    if (!locked && (!showLoading || !isLoading)) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  };

  // Function to handle the button press
  const handlePress = async () => {
    if (!locked && (!showLoading || !isLoading)) {
      if (showLoading) {
        setIsLoading(true);
      }
      try {
        await onPress();
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={{
            paddingVertical: smallHeight ? 4 : 15,
            paddingHorizontal: 25,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: normalizedSize ? 250 : fullSize ? '100%' : 'auto',
            backgroundColor: locked || (showLoading && isLoading) ? theme.colors.disabled : colorApplied,
          }}
        disabled={locked || (showLoading && isLoading)}
      >
        {showLoading && isLoading ? (
          <ActivityIndicator size="small" color={theme.colors.buttonText} />
        ) : (
          <CustomTextNunito weight={textWeight ? textWeight : 'SemiBold'} style={{ color: theme.colors.buttonText }}>
            {title}
          </CustomTextNunito>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CustomButton;