import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { useTheme } from 'context/ThemeContext';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from './CustomTextNunito';

const CustomInputNunito = ({ inputText, setInputText, maxLength = 140, placeholder,...props }) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);  // Track focus state

  const fontStyle = { fontFamily: `Nunito-Regular` };
  const color = theme.colors.detailText;

  // Function to handle text change and update the character count
  const handleTextChange = (newInputText) => {
    setInputText(newInputText);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
      <View style={{ width: '100%' }}>
        {/* Character counter and alert */}
        {isFocused && (
          <View style={styles.characterCounterContainer}>
            <CustomTextNunito style={[
              styles.characterCount,
              { color: inputText.length >= maxLength ? 'red' : color }  // Change text color to red if max length is reached
            ]}>
              {inputText.length}/{maxLength}
            </CustomTextNunito>
            {inputText.length >= maxLength && (
              <CustomTextNunito style={styles.limitAlert}>{I18n.t(TextKey.commentsMaxCharactersReached)}</CustomTextNunito>
            )}
          </View>
        )}
        <TextInput
            style={[
              fontStyle, 
              {
                borderColor: inputText.length >= maxLength ? 'red' : color,  // Change border color when max is reached
                borderWidth: 1.5, 
                borderRadius: 10, 
                padding: 10,
                height: isFocused && maxLength > 50 ? 100 : 40, // Adjust height when focused
                textAlignVertical: 'top',  // Align text to the top when multiline
                color: theme.colors.text,
              }
            ]}
            onChangeText={handleTextChange}
            value={inputText}
            multiline={true}   // Allow multiline text
            numberOfLines={isFocused ? 4 : 1}  // Change number of lines based on focus
            onFocus={() => setIsFocused(true)}  // Set focus state
            onBlur={() => setIsFocused(false)}  // Remove focus state when not focused
            maxLength={maxLength}  // Set character limit
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text}
            {...props}
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  characterCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    marginHorizontal: 2,
    marginBottom: 2,
  },
  characterCount: {
    fontSize: 12,
  },
  limitAlert: {
    fontSize: 12,
    color: 'red',
    marginLeft: 10,
  },
});

export default CustomInputNunito;
