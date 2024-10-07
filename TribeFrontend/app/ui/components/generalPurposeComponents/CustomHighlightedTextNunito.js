import React from 'react';
import { Text } from 'react-native';
import { useTheme } from 'context/ThemeContext';

const CustomHighlightedTextNunito = ({ style, children, onPress, ...props }) => {
  const { theme } = useTheme();

  const fontStyle = {
    fontFamily: `Nunito-Bold`,
  };

  const color = { color: theme.colors.primary };

  return (
    <Text onPress={onPress} style={[fontStyle, color, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomHighlightedTextNunito;