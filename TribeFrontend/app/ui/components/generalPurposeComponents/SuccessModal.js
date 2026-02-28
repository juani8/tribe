import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import CustomTextNunito from './CustomTextNunito';
import CustomButton from './CustomButton';
import { useTheme } from 'context/ThemeContext';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const SuccessModal = ({ 
  visible, 
  title, 
  message, 
  buttonText = 'OK',
  onClose,
  autoClose = true,
  autoCloseDelay = 2000 
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      if (autoClose) {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.iconContainer}>
            <View style={styles.checkCircle}>
              <CustomTextNunito weight="Bold" style={styles.checkMark}>✓</CustomTextNunito>
            </View>
          </View>
          
          <CustomTextNunito weight="Bold" style={styles.title}>
            {title}
          </CustomTextNunito>
          
          {message && (
            <CustomTextNunito style={styles.message}>
              {message}
            </CustomTextNunito>
          )}
          
          <View style={styles.buttonContainer}>
            <CustomButton 
              title={buttonText} 
              onPress={onClose}
              fullSize
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width - 60,
    backgroundColor: theme.colors.card || theme.colors.background,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 40,
    color: '#FFF',
  },
  title: {
    fontSize: 22,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: theme.colors.detailText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default SuccessModal;
