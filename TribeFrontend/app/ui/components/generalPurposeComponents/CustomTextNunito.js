import React from 'react';
import { Text } from 'react-native';
import { useTheme } from 'context/ThemeContext';

const CustomTextNunito = ({ style, children, weight = 'Regular', ...props }) => {
  const { theme } = useTheme();

  const fontStyle = {
    fontFamily: `Nunito-${weight}`,
  };

  const color = { color: theme.colors.text };

  return (
    <Text style={[fontStyle, color, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomTextNunito;