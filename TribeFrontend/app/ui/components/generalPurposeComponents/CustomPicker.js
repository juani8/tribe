import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, FlatList, Image } from 'react-native';
import CustomTextNunito from './CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { ExpandDown, CheckFill } from 'assets/images';

const CustomPicker = ({ 
  selectedValue, 
  onValueChange, 
  items, 
  placeholder = 'Seleccionar...',
  label 
}) => {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme, isDarkMode);
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View>
      {label && (
        <CustomTextNunito weight="SemiBold" style={styles.label}>
          {label}
        </CustomTextNunito>
      )}
      
      <TouchableOpacity 
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <CustomTextNunito 
          style={[
            styles.pickerText,
            !selectedValue && styles.placeholderText
          ]}
        >
          {selectedItem?.label || placeholder}
        </CustomTextNunito>
        <Image source={ExpandDown} style={styles.chevronIcon} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
            </View>
            
            <CustomTextNunito weight="Bold" style={styles.modalTitle}>
              {placeholder}
            </CustomTextNunito>

            <FlatList
              data={items}
              keyExtractor={(item, index) => item.value || index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    selectedValue === item.value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}
                >
                  <CustomTextNunito 
                    weight={selectedValue === item.value ? 'SemiBold' : 'Regular'}
                    style={[
                      styles.optionText,
                      selectedValue === item.value && styles.selectedOptionText
                    ]}
                  >
                    {item.label}
                  </CustomTextNunito>
                  {selectedValue === item.value && (
                    <Image source={CheckFill} style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card || theme.colors.surface || '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border || 'transparent',
    paddingHorizontal: 16,
    height: 52,
  },
  pickerText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.placeholder || '#A9A9A9',
  },
  chevronIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.detailText || '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: isDarkMode ? theme.colors.background : '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 34,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: theme.colors.primary + '15',
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  selectedOptionText: {
    color: theme.colors.primary,
  },
  checkIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.primary,
  },
});

export default CustomPicker;
