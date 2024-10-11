import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Separator = ({ theme, color, style }) => {

  const colorApplied = color ? color : theme.colors.primary; 
  const styles = createStyles(colorApplied);

  return (
    <View style={[styles.separator, style]}></View>
  )
}

const createStyles = (colorApplied) => StyleSheet.create({
  separator : {
      borderBottomWidth: 1,
      borderBottomColor: colorApplied,
      marginHorizontal: 16,
  }
});

export default Separator