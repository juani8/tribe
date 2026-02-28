import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import I18n from 'assets/localization/i18n';

const GamificationBar = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const level = 2;
  const current = 2;
  const total = 5;
  const progress = current / total;

  const NavigateToGamificationProgress = () => {
    navigation.navigate('GamificationProgress');
  };

  return (
    <TouchableOpacity 
      onPress={NavigateToGamificationProgress} 
      style={styles.container}
      activeOpacity={0.9}
    >
      <View style={styles.headerRow}>
        <View style={styles.levelBadge}>
          <CustomTextNunito weight="Bold" style={styles.levelText}>
            {I18n.locale?.startsWith('es') ? 'Nivel' : 'Level'} {level}
          </CustomTextNunito>
        </View>
        <View style={styles.chevronContainer}>
          <CustomTextNunito style={styles.viewDetails}>
            {I18n.locale?.startsWith('es') ? 'Ver detalles' : 'View details'}
          </CustomTextNunito>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBarContainer}>
          <ProgressBar 
            progress={progress} 
            color="#FFF" 
            style={styles.progressBar} 
          />
        </View>
        <View style={styles.statsRow}>
          <CustomTextNunito style={styles.statsText}>
            {current}/{total} {I18n.locale?.startsWith('es') ? 'publicaciones' : 'posts'}
          </CustomTextNunito>
          <CustomTextNunito weight="Bold" style={styles.percentText}>
            {Math.round(progress * 100)}%
          </CustomTextNunito>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetails: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  progressSection: {
    gap: 8,
  },
  progressBarContainer: {
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  percentText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
});

export default GamificationBar;