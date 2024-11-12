import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import CustomTextNunito from './CustomTextNunito';
import { useTheme } from 'context/ThemeContext';

const PopupMenu = ({ visible, onClose, options, title, children }) => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {visible && (
          <TouchableWithoutFeedback>
            <Animated.View
              entering={FadeInDown.duration(400)}
              exiting={FadeOutUp.duration(500)}
              style={styles.container}
            >
              {/* Content Wrapper */}
              <View style={styles.contentWrapper}>
                {title && (
                  <>
                    <CustomTextNunito
                      weight={'Bold'}
                      style={{
                        textAlign: 'center',
                        marginVertical: 10,
                        color: theme.colors.options,
                        fontSize: 20,
                      }}
                    >
                      {title}
                    </CustomTextNunito>
                    {children}
                  </>
                )}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  overlay: { 
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // 20% opacity overlay for the background
    transition: 'background-color 0.9s ease', // Adjust the duration and timing function as needed
  },  
  container: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Black with 80% opacity
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    position: 'absolute', // Fix positioning
    bottom: 0, // Start at the bottom of the screen
  },
  optionContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});

export default PopupMenu;
