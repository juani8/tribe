import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import { ProgressBar } from 'react-native-paper';
import { navigateToGamificationActivity } from 'helper/navigationHandlers/UserNavigationHandlers';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { Analytics, Lamp, GlobeLocation, CameraGoogle, FavoriteFill, ChartPin, Edit, Chat, UserFill, SearchGoogle, Lock } from 'assets/images';
import I18n from 'assets/localization/i18n';

// Level configuration with icon images
const LEVEL_CONFIG = [
  { level: 1, name: 'Novato', requiredPosts: 0, iconImage: Lamp, color: '#94A3B8' },
  { level: 2, name: 'Explorador', requiredPosts: 5, iconImage: GlobeLocation, color: '#3B82F6' },
  { level: 3, name: 'Creador', requiredPosts: 15, iconImage: CameraGoogle, color: '#8B5CF6' },
  { level: 4, name: 'Influencer', requiredPosts: 30, iconImage: FavoriteFill, color: '#F59E0B' },
  { level: 5, name: 'Leyenda', requiredPosts: 50, iconImage: ChartPin, color: '#EF4444' },
];

const GamificationProgressScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user } = useUserContext();
  const styles = createStyles(theme);

  // Mock data - in real app, get from user context or API
  const userStats = {
    totalPosts: user?.posts?.length || 2,
    totalLikes: 47,
    totalComments: 23,
    followers: user?.followers?.length || 15,
    following: user?.following?.length || 28,
  };

  // Calculate current level
  const getCurrentLevel = () => {
    let currentLevel = LEVEL_CONFIG[0];
    for (const config of LEVEL_CONFIG) {
      if (userStats.totalPosts >= config.requiredPosts) {
        currentLevel = config;
      }
    }
    return currentLevel;
  };

  const getNextLevel = () => {
    const current = getCurrentLevel();
    const nextIndex = LEVEL_CONFIG.findIndex(l => l.level === current.level) + 1;
    return nextIndex < LEVEL_CONFIG.length ? LEVEL_CONFIG[nextIndex] : null;
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  
  const postsToNextLevel = nextLevel 
    ? nextLevel.requiredPosts - userStats.totalPosts 
    : 0;
  
  const progress = nextLevel 
    ? (userStats.totalPosts - currentLevel.requiredPosts) / (nextLevel.requiredPosts - currentLevel.requiredPosts)
    : 1;

  const renderLevelCard = (levelConfig, index) => {
    const isCurrentLevel = levelConfig.level === currentLevel.level;
    const isUnlocked = userStats.totalPosts >= levelConfig.requiredPosts;
    
    return (
      <View 
        key={levelConfig.level}
        style={[
          styles.levelCard,
          isCurrentLevel && styles.levelCardActive,
          !isUnlocked && styles.levelCardLocked,
        ]}
      >
        <View style={[styles.levelIconContainer, { backgroundColor: isUnlocked ? levelConfig.color + '20' : '#E5E5E5' }]}>
          <Image source={levelConfig.iconImage} style={[styles.levelIconImage, { tintColor: isUnlocked ? levelConfig.color : '#999' }]} />
        </View>
        <View style={styles.levelInfo}>
          <CustomTextNunito 
            weight="Bold" 
            style={[styles.levelName, !isUnlocked && styles.lockedText]}
          >
            {I18n.locale?.startsWith('es') ? 'Nivel' : 'Level'} {levelConfig.level}: {levelConfig.name}
          </CustomTextNunito>
          <CustomTextNunito style={[styles.levelRequirement, !isUnlocked && styles.lockedText]}>
            {levelConfig.requiredPosts} {I18n.locale?.startsWith('es') ? 'publicaciones' : 'posts'}
          </CustomTextNunito>
        </View>
        {isCurrentLevel && (
          <View style={[styles.currentBadge, { backgroundColor: levelConfig.color }]}>
            <CustomTextNunito style={styles.currentBadgeText}>
              {I18n.locale?.startsWith('es') ? 'Actual' : 'Current'}
            </CustomTextNunito>
          </View>
        )}
        {!isUnlocked && (
          <Image source={Lock} style={styles.lockIconImage} />
        )}
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <CustomTextNunito weight="Bold" style={styles.screenTitle}>
          {I18n.locale?.startsWith('es') ? 'Tu progreso' : 'Your Progress'}
        </CustomTextNunito>
        <CustomTextNunito style={styles.screenSubtitle}>
          {I18n.locale?.startsWith('es') 
            ? 'Sigue publicando para subir de nivel' 
            : 'Keep posting to level up'}
        </CustomTextNunito>
      </View>

      {/* Current Level Card */}
      <View style={[styles.mainCard, { backgroundColor: theme.colors.secondary }]}>
        <View style={styles.mainCardHeader}>
          <View style={styles.mainLevelBadge}>
            <Image source={currentLevel.iconImage} style={styles.mainLevelIconImage} />
            <View>
              <CustomTextNunito weight="Bold" style={styles.mainLevelText}>
                {I18n.locale?.startsWith('es') ? 'Nivel' : 'Level'} {currentLevel.level}
              </CustomTextNunito>
              <CustomTextNunito style={styles.mainLevelName}>
                {currentLevel.name}
              </CustomTextNunito>
            </View>
          </View>
          
          <CustomButton 
            title={I18n.locale?.startsWith('es') ? 'Ver actividad' : 'View activity'} 
            onPress={() => navigateToGamificationActivity(navigation)} 
            smallHeight={true}
            style={styles.activityButton}
          />
        </View>

        {nextLevel && (
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <CustomTextNunito style={styles.progressLabel}>
                {I18n.locale?.startsWith('es') 
                  ? `${postsToNextLevel} publicaciones más para ${nextLevel.name}` 
                  : `${postsToNextLevel} more posts to ${nextLevel.name}`}
              </CustomTextNunito>
              <CustomTextNunito weight="Bold" style={styles.progressPercent}>
                {Math.round(progress * 100)}%
              </CustomTextNunito>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.progressStats}>
              <CustomTextNunito style={styles.progressStatText}>
                {userStats.totalPosts}/{nextLevel.requiredPosts}
              </CustomTextNunito>
            </View>
          </View>
        )}
        
        {!nextLevel && (
          <View style={styles.maxLevelContainer}>
            <Image source={ChartPin} style={styles.maxLevelIcon} />
            <CustomTextNunito weight="Bold" style={styles.maxLevelText}>
              {I18n.locale?.startsWith('es') ? '¡Nivel máximo alcanzado!' : 'Max level reached!'}
            </CustomTextNunito>
          </View>
        )}
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <CustomTextNunito weight="Bold" style={styles.sectionTitle}>
          {I18n.locale?.startsWith('es') ? 'Tus estadísticas' : 'Your stats'}
        </CustomTextNunito>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Image source={Edit} style={[styles.statIcon, { tintColor: theme.colors.primary }]} />
            <CustomTextNunito weight="Bold" style={styles.statNumber}>{userStats.totalPosts}</CustomTextNunito>
            <CustomTextNunito style={styles.statLabel}>
              {I18n.locale?.startsWith('es') ? 'Publicaciones' : 'Posts'}
            </CustomTextNunito>
          </View>
          
          <View style={styles.statCard}>
            <Image source={FavoriteFill} style={[styles.statIcon, { tintColor: '#EF4444' }]} />
            <CustomTextNunito weight="Bold" style={styles.statNumber}>{userStats.totalLikes}</CustomTextNunito>
            <CustomTextNunito style={styles.statLabel}>Likes</CustomTextNunito>
          </View>
          
          <View style={styles.statCard}>
            <Image source={Chat} style={[styles.statIcon, { tintColor: '#10B981' }]} />
            <CustomTextNunito weight="Bold" style={styles.statNumber}>{userStats.totalComments}</CustomTextNunito>
            <CustomTextNunito style={styles.statLabel}>
              {I18n.locale?.startsWith('es') ? 'Comentarios' : 'Comments'}
            </CustomTextNunito>
          </View>
          
          <View style={styles.statCard}>
            <Image source={UserFill} style={[styles.statIcon, { tintColor: '#8B5CF6' }]} />
            <CustomTextNunito weight="Bold" style={styles.statNumber}>{userStats.followers}</CustomTextNunito>
            <CustomTextNunito style={styles.statLabel}>
              {I18n.locale?.startsWith('es') ? 'Seguidores' : 'Followers'}
            </CustomTextNunito>
          </View>
        </View>
      </View>

      {/* Levels List */}
      <View style={styles.levelsSection}>
        <CustomTextNunito weight="Bold" style={styles.sectionTitle}>
          {I18n.locale?.startsWith('es') ? 'Todos los niveles' : 'All levels'}
        </CustomTextNunito>
        
        <View style={styles.levelsList}>
          {LEVEL_CONFIG.map((level, index) => renderLevelCard(level, index))}
        </View>
      </View>

      {/* Animation */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require('assets/lottie/levelUpLottie.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    color: theme.colors.text,
  },
  screenSubtitle: {
    fontSize: 15,
    color: theme.colors.detailText,
    marginTop: 4,
  },
  mainCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainLevelIconImage: {
    width: 40,
    height: 40,
    tintColor: '#FFFFFF',
  },
  mainLevelText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  mainLevelName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  activityButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressSection: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  progressPercent: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressStats: {
    alignItems: 'flex-end',
  },
  progressStatText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  maxLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  maxLevelIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  maxLevelText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.card || theme.colors.surface || '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 28,
    height: 28,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginTop: 4,
  },
  levelsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  levelsList: {
    gap: 12,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || theme.colors.surface || '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  levelCardActive: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  levelCardLocked: {
    opacity: 0.6,
  },
  levelIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelIconImage: {
    width: 24,
    height: 24,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 16,
    color: theme.colors.text,
  },
  levelRequirement: {
    fontSize: 13,
    color: theme.colors.detailText,
    marginTop: 2,
  },
  lockedText: {
    color: theme.colors.detailText,
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  lockIconImage: {
    width: 20,
    height: 20,
    tintColor: '#999',
  },
  animationContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  lottie: {
    width: 150,
    height: 150,
  },
});

export default GamificationProgressScreen;