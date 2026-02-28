import React, { useState, useRef, useEffect } from 'react';
import { TextInput, View, StyleSheet, Animated } from 'react-native';
import { useTheme } from 'context/ThemeContext';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from './CustomTextNunito';

const CustomInputNunito = ({ inputText, setInputText, maxLength = 140, placeholder, label, ...props }) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const animatedBorder = useRef(new Animated.Value(0)).current;

  const isNearLimit = inputText.length >= maxLength * 0.9;
  const isAtLimit = inputText.length >= maxLength;

  useEffect(() => {
    Animated.timing(animatedBorder, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleTextChange = (newInputText) => {
    setInputText(newInputText);
  };

  const borderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.colors.border || 'rgba(0,0,0,0.1)',
      isAtLimit ? '#ef4444' : theme.colors.primary
    ],
  });

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {label && (
        <CustomTextNunito weight="SemiBold" style={styles.label}>
          {label}
        </CustomTextNunito>
      )}
      
      <Animated.View 
        style={[
          styles.inputWrapper,
          {
            borderColor: borderColor,
            backgroundColor: isFocused 
              ? (theme.colors.card || theme.colors.surface) 
              : (theme.colors.background),
          }
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              height: isFocused && maxLength > 50 ? 100 : 48,
              color: theme.colors.text,
            }
          ]}
          onChangeText={handleTextChange}
          value={inputText}
          multiline={maxLength > 50}
          numberOfLines={isFocused && maxLength > 50 ? 4 : 1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder || theme.colors.detailText}
          textAlignVertical={maxLength > 50 ? 'top' : 'center'}
          {...props}
        />
      </Animated.View>

      {/* Character counter - always visible when focused */}
      {isFocused && (
        <View style={styles.counterContainer}>
          <CustomTextNunito 
            style={[
              styles.characterCount,
              { color: isAtLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : theme.colors.detailText }
            ]}
          >
            {inputText.length}/{maxLength}
          </CustomTextNunito>
          {isAtLimit && (
            <CustomTextNunito style={styles.limitAlert}>
              {I18n.t(TextKey.commentsMaxCharactersReached)}
            </CustomTextNunito>
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 0,
    borderRadius: 12,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  characterCount: {
    fontSize: 12,
  },
  limitAlert: {
    fontSize: 12,
    color: '#ef4444',
  },
});

export default CustomInputNunito;
