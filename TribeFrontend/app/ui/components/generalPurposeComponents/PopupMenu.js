import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import CustomTextNunito from './CustomTextNunito';
import { useTheme } from 'context/ThemeContext';

// Get screen dimensions
const { height } = Dimensions.get('window');

const PopupMenu = ({ visible, onClose, options }) => {
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
          <Animated.View
            entering={FadeInDown.duration(400)}
            exiting={FadeOutUp.duration(500)}
            style={styles.container}
          >
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() => {
                    item.onPress();
                    onClose(); // Close after selecting an option
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
                      {item.icon && <Image source={item.icon} style={{ width: 24, height: 24, resizeMode: 'contain', marginLeft: 6, marginRight: 12 }} />}
                      <CustomTextNunito style={{ color: theme.colors.options, fontSize: 18 }}>{item.label}</CustomTextNunito>
                    </View>
                    {item.complement && <item.complement />}
                  </View>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        )}
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});

export default PopupMenu;
