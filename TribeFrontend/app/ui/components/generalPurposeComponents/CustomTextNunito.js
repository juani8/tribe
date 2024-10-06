import React from 'react';
import { Text } from 'react-native';

const CustomTextNunito = ({ style, children, weight = 'Regular', ...props }) => {
  const fontStyle = {
    fontFamily: `Nunito-${weight}`,
  };

  return (
    <Text style={[fontStyle, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomTextNunito;