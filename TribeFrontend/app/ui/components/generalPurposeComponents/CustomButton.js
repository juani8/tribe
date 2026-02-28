import React, { useState } from 'react';
import { Text, TouchableOpacity, Animated, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from './CustomTextNunito';

const CustomButton = ({ title, color, normalizedSize, fullSize, smallHeight, onPress, textWeight, locked, showLoading, variant = 'primary', icon }) => {
  const { theme } = useTheme();
  const [scale] = useState(new Animated.Value(1));
  const [isLoading, setIsLoading] = useState(false);

  const colorApplied = color ? color : theme.colors.primary;
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

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

  const getBackgroundColor = () => {
    if (locked || (showLoading && isLoading)) return theme.colors.disabled;
    if (isOutline) return 'transparent';
    if (isSecondary) return theme.colors.card || theme.colors.surface;
    return colorApplied;
  };

  const getTextColor = () => {
    if (isOutline) return colorApplied;
    if (isSecondary) return theme.colors.text;
    return theme.colors.buttonText;
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, styles.shadowContainer]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[
          styles.button,
          {
            paddingVertical: smallHeight ? 8 : 14,
            paddingHorizontal: smallHeight ? 16 : 28,
            minWidth: normalizedSize ? 250 : fullSize ? '100%' : 'auto',
            backgroundColor: getBackgroundColor(),
            borderWidth: isOutline ? 2 : 0,
            borderColor: isOutline ? colorApplied : 'transparent',
          }
        ]}
        disabled={locked || (showLoading && isLoading)}
      >
        {showLoading && isLoading ? (
          <ActivityIndicator size="small" color={getTextColor()} />
        ) : (
          <View style={styles.contentContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <CustomTextNunito 
              weight={textWeight ? textWeight : 'SemiBold'} 
              style={[styles.buttonText, { color: getTextColor() }]}
            >
              {title}
            </CustomTextNunito>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 15,
    letterSpacing: 0.3,
  },
});

export default CustomButton;