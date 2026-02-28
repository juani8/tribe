import { View, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from 'context/ThemeContext'

const Separator = ({ color, style, variant = 'default', spacing = 'md', visible = false }) => {
  const { theme } = useTheme();

  // Si no es visible, no renderizar nada
  if (!visible) return null;

  const colorApplied = color ? color : (theme.colors.border || 'rgba(0,0,0,0.1)');
  
  const spacingValues = {
    sm: 8,
    md: 16,
    lg: 24,
  };

  const marginValue = spacingValues[spacing] || spacingValues.md;

  const getHorizontalMargin = () => {
    switch (variant) {
      case 'full':
        return 0;
      case 'inset':
        return 20;
      default:
        return 20;
    }
  };

  return (
    <View 
      style={[
        styles.separator, 
        { 
          backgroundColor: colorApplied,
          marginVertical: variant === 'section' ? marginValue : 4,
          marginHorizontal: getHorizontalMargin(),
        },
        style
      ]}
    />
  )
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
  }
});

export default Separator