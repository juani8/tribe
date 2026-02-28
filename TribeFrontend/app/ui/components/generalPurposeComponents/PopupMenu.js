import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import CustomTextNunito from './CustomTextNunito';
import { useTheme } from 'context/ThemeContext';

const PopupMenu = ({ visible, onClose, options, title, children }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme, isDarkMode);
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.dismissArea} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        {visible && (
          <Animated.View
            entering={FadeInDown.duration(350).springify()}
            exiting={FadeOutUp.duration(300)}
            style={styles.container}
          >
            {/* Handle Bar */}
            <TouchableOpacity onPress={onClose} activeOpacity={1}>
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            </TouchableOpacity>
            
            {/* Content Wrapper */}
            <View style={styles.contentWrapper}>
              {title && (
                <>
                  <CustomTextNunito
                    weight={'Bold'}
                    style={styles.title}
                  >
                    {title}
                  </CustomTextNunito>
                  {children}
                </>
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  overlay: { 
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dismissArea: {
    flex: 0.3,
  },  
  container: {
    flex: 0.7,
    width: '100%',
    backgroundColor: isDarkMode ? theme.colors.background : '#FFFFFF',
    paddingBottom: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
    borderRadius: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.text,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  optionContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
});

export default PopupMenu;
