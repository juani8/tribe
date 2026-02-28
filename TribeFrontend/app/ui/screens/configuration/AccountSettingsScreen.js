import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigateToChangePassword, navigateToDeleteAccount, navigateToEditPersonalData, navigateToEnableBiometrics } from 'helper/navigationHandlers/AccountSettingsNavigationHandlers'
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import { Trash, Fingerprint } from 'assets/images';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const AccountSettingsScreen = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();
  const navigation = useNavigation();
  const styles = createStyles(theme);

  // Protección contra user undefined
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <CustomTextNunito>Cargando...</CustomTextNunito>
        </View>
      </SafeAreaView>
    );
  }

  const SettingItem = ({ icon, title, onPress, danger = false }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, danger && styles.iconContainerDanger]}>
        {icon && <Image source={icon} style={[styles.icon, danger && styles.iconDanger]} />}
      </View>
      <View style={styles.settingContent}>
        <CustomTextNunito 
          weight="SemiBold"
          style={[styles.settingTitle, danger && styles.settingTitleDanger]}
        >
          {title}
        </CustomTextNunito>
      </View>
      {(theme.ChevronRight || theme.ArrowRight) && (
        <Image 
          source={theme.ChevronRight || theme.ArrowRight} 
          style={[styles.chevron, danger && styles.iconDanger]} 
        />
      )}
    </TouchableOpacity>
  );

  // Determinar la fuente de la imagen de perfil
  const profileImageSource = user.profileImage && typeof user.profileImage === 'string' && user.profileImage.trim() !== ''
    ? { uri: user.profileImage }
    : theme.UserCircle;
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={profileImageSource} 
              style={styles.avatar} 
            />
            <View style={styles.onlineIndicator} />
          </View>
          <CustomTextNunito weight="Bold" style={styles.userName}>
            {user.name} {user.lastName}
          </CustomTextNunito>
          <CustomTextNunito style={styles.userEmail}>
            {user.email}
          </CustomTextNunito>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <CustomTextNunito weight="SemiBold" style={styles.sectionTitle}>
            {I18n.t(TextKey.accountSettings)}
          </CustomTextNunito>

          <View style={styles.settingsCard}>
            <SettingItem
              icon={theme.Edit}
              title={I18n.t(TextKey.editPersonalData)}
              onPress={() => navigateToEditPersonalData(navigation)}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={theme.Lock}
              title={I18n.t(TextKey.changePassword)}
              onPress={() => navigateToChangePassword(navigation)}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={Fingerprint}
              title={I18n.locale?.startsWith('es') ? 'Biometría' : 'Biometrics'}
              onPress={() => navigateToEnableBiometrics(navigation)}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <CustomTextNunito weight="SemiBold" style={styles.sectionTitleDanger}>
            {I18n.t(TextKey.dangerZone)}
          </CustomTextNunito>

          <View style={styles.settingsCardDanger}>
            <SettingItem
              icon={Trash}
              title={I18n.t(TextKey.deleteAccount)}
              onPress={() => navigateToDeleteAccount(navigation)}
              danger={true}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  userName: {
    fontSize: 22,
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.detailText,
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: theme.colors.detailText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsCard: {
    backgroundColor: theme.colors.card || theme.colors.surface || theme.colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconContainerDanger: {
    backgroundColor: '#fee2e2',
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: theme.colors.primary,
  },
  iconDanger: {
    tintColor: '#dc2626',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: theme.colors.text,
  },
  settingTitleDanger: {
    color: '#dc2626',
  },
  chevron: {
    width: 20,
    height: 20,
    tintColor: theme.colors.detailText,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border || 'rgba(0,0,0,0.05)',
    marginLeft: 74,
  },
  dangerSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitleDanger: {
    fontSize: 13,
    color: '#dc2626',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsCardDanger: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});

export default AccountSettingsScreen;