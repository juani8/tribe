import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { useTheme } from 'context/ThemeContext';

const DeleteAccountScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteAccount = () => {
    console.log('Account deleted');
    // Aquí iría la lógica para eliminar la cuenta
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <CustomTextNunito style={styles.title} weight="Bold">
          {I18n.t(TextKey.deleteAccountTitle)}
        </CustomTextNunito>
        <CustomTextNunito style={styles.description}>
          {I18n.t(TextKey.deleteAccountMessage)}
        </CustomTextNunito>
        <CustomTextNunito style={styles.description}>
          {I18n.t(TextKey.deleteAccountDetails)}
        </CustomTextNunito>
      </View>
      <CustomButton
        title={I18n.t(TextKey.deleteAccountButton)}
        onPress={() => setModalVisible(true)}
        color={theme.colors.danger}
        fullSize={true}
        style={styles.deleteButton}
      />

      {/* Modal de confirmación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CustomTextNunito style={styles.modalTitle} weight="Bold">
              {I18n.t(TextKey.confirmationTitle)}
            </CustomTextNunito>
            <View style={styles.modalButtonsContainer}>
              <CustomButton
                title={I18n.t(TextKey.confirmButton)}
                onPress={handleDeleteAccount}
                color={theme.colors.danger}
                style={styles.modalButton}
              />
              <CustomButton
                title={I18n.t(TextKey.cancelButton)}
                onPress={() => setModalVisible(false)}
                color={theme.colors.secondary}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
      justifyContent: 'flex-start',
      paddingTop: 100,
      alignItems: 'center',
    },
    textContainer: {
      marginBottom: 40,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    deleteButton: {
      marginTop: 20,
      backgroundColor: theme.colors.danger,
      height: 50,
      borderRadius: 8,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '100%',
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
      paddingVertical: 30,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      color: theme.colors.text,
      marginBottom: 20,
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    modalButton: {
      flex: 1,
      marginHorizontal: 10,
      height: 45,
    },
  });

export default DeleteAccountScreen;
