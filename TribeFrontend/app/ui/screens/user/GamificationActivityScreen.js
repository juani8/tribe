import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useNavigation } from '@react-navigation/native';
import I18n from 'assets/localization/i18n';
import { Edit, FavoriteFill, Chat, UserFill, ChartPin, Analytics, Lamp, SearchGoogle } from 'assets/images';

// Activity types with their icons and colors
const ACTIVITY_TYPES = {
  POST: { iconImage: Edit, color: '#3B82F6', label: { es: 'Nueva publicación', en: 'New post' } },
  LIKE_RECEIVED: { iconImage: FavoriteFill, color: '#EF4444', label: { es: 'Like recibido', en: 'Like received' } },
  COMMENT_RECEIVED: { iconImage: Chat, color: '#10B981', label: { es: 'Comentario recibido', en: 'Comment received' } },
  FOLLOWER_NEW: { iconImage: UserFill, color: '#8B5CF6', label: { es: 'Nuevo seguidor', en: 'New follower' } },
  LEVEL_UP: { iconImage: ChartPin, color: '#F59E0B', label: { es: 'Subiste de nivel', en: 'Level up' } },
  ACHIEVEMENT: { iconImage: Analytics, color: '#F97316', label: { es: 'Logro desbloqueado', en: 'Achievement unlocked' } },
};

// Mock activity data - in real app, fetch from API
const mockActivities = [
  { id: 1, type: 'LIKE_RECEIVED', description: '@maria_garcia le dio like a tu publicación', timestamp: new Date(Date.now() - 1000 * 60 * 5), points: 1 },
  { id: 2, type: 'COMMENT_RECEIVED', description: '@carlos_lopez comentó: "¡Excelente foto!"', timestamp: new Date(Date.now() - 1000 * 60 * 30), points: 2 },
  { id: 3, type: 'POST', description: 'Publicaste una nueva foto en tu perfil', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), points: 10 },
  { id: 4, type: 'FOLLOWER_NEW', description: '@ana_martinez comenzó a seguirte', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), points: 5 },
  { id: 5, type: 'LIKE_RECEIVED', description: '@pedro_sanchez le dio like a tu publicación', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), points: 1 },
  { id: 6, type: 'LEVEL_UP', description: '¡Felicitaciones! Alcanzaste el Nivel 2: Explorador', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), points: 50 },
  { id: 7, type: 'ACHIEVEMENT', description: 'Desbloqueaste: "Primera publicación"', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), points: 25 },
  { id: 8, type: 'POST', description: 'Publicaste tu primera foto', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), points: 10 },
  { id: 9, type: 'FOLLOWER_NEW', description: '@demo_user comenzó a seguirte', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), points: 5 },
];

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  const isSpanish = I18n.locale?.startsWith('es');
  
  if (seconds < 60) return isSpanish ? 'Ahora' : 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} ${isSpanish ? 'min' : 'min'}`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return date.toLocaleDateString();
};

const GamificationActivity = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  
  const [activities] = useState(mockActivities);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'points', 'social'

  const totalPointsToday = activities
    .filter(a => new Date() - a.timestamp < 86400000)
    .reduce((sum, a) => sum + a.points, 0);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'points') return ['POST', 'LEVEL_UP', 'ACHIEVEMENT'].includes(activity.type);
    if (filter === 'social') return ['LIKE_RECEIVED', 'COMMENT_RECEIVED', 'FOLLOWER_NEW'].includes(activity.type);
    return true;
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderActivityItem = (activity) => {
    const activityType = ACTIVITY_TYPES[activity.type];
    
    return (
      <View key={activity.id} style={styles.activityItem}>
        <View style={[styles.activityIconContainer, { backgroundColor: activityType.color + '20' }]}>
          <Image source={activityType.iconImage} style={[styles.activityIconImage, { tintColor: activityType.color }]} />
        </View>
        
        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <CustomTextNunito weight="SemiBold" style={styles.activityLabel}>
              {I18n.locale?.startsWith('es') ? activityType.label.es : activityType.label.en}
            </CustomTextNunito>
            <CustomTextNunito style={styles.activityTime}>
              {formatTimeAgo(activity.timestamp)}
            </CustomTextNunito>
          </View>
          <CustomTextNunito style={styles.activityDescription}>
            {activity.description}
          </CustomTextNunito>
          {activity.points > 0 && (
            <View style={styles.pointsBadge}>
              <CustomTextNunito style={styles.pointsText}>+{activity.points} pts</CustomTextNunito>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.headerStats}>
        <View style={styles.statBox}>
          <Image source={Lamp} style={[styles.statIconImage, { tintColor: theme.colors.primary }]} />
          <CustomTextNunito weight="Bold" style={styles.statValue}>{totalPointsToday}</CustomTextNunito>
          <CustomTextNunito style={styles.statLabel}>
            {I18n.locale?.startsWith('es') ? 'Puntos hoy' : 'Points today'}
          </CustomTextNunito>
        </View>
        <View style={styles.statBox}>
          <Image source={Analytics} style={[styles.statIconImage, { tintColor: theme.colors.primary }]} />
          <CustomTextNunito weight="Bold" style={styles.statValue}>{activities.length}</CustomTextNunito>
          <CustomTextNunito style={styles.statLabel}>
            {I18n.locale?.startsWith('es') ? 'Actividades' : 'Activities'}
          </CustomTextNunito>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <CustomTextNunito 
            weight={filter === 'all' ? 'Bold' : 'Regular'}
            style={[styles.filterText, filter === 'all' && styles.filterTextActive]}
          >
            {I18n.locale?.startsWith('es') ? 'Todo' : 'All'}
          </CustomTextNunito>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'points' && styles.filterTabActive]}
          onPress={() => setFilter('points')}
        >
          <CustomTextNunito 
            weight={filter === 'points' ? 'Bold' : 'Regular'}
            style={[styles.filterText, filter === 'points' && styles.filterTextActive]}
          >
            {I18n.locale?.startsWith('es') ? 'Puntos' : 'Points'}
          </CustomTextNunito>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'social' && styles.filterTabActive]}
          onPress={() => setFilter('social')}
        >
          <CustomTextNunito 
            weight={filter === 'social' ? 'Bold' : 'Regular'}
            style={[styles.filterText, filter === 'social' && styles.filterTextActive]}
          >
            {I18n.locale?.startsWith('es') ? 'Social' : 'Social'}
          </CustomTextNunito>
        </TouchableOpacity>
      </View>

      {/* Activity List */}
      <ScrollView 
        style={styles.activityList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.sectionHeader}>
          <CustomTextNunito weight="Bold" style={styles.sectionTitle}>
            {I18n.locale?.startsWith('es') ? 'Actividad reciente' : 'Recent activity'}
          </CustomTextNunito>
        </View>

        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => renderActivityItem(activity))
        ) : (
          <View style={styles.emptyState}>
            <Image source={SearchGoogle} style={[styles.emptyIcon, { tintColor: theme.colors.detailText }]} />
            <CustomTextNunito style={styles.emptyText}>
              {I18n.locale?.startsWith('es') 
                ? 'No hay actividades con este filtro' 
                : 'No activities with this filter'}
            </CustomTextNunito>
          </View>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
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
  statIconImage: {
    width: 28,
    height: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.detailText,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.card || theme.colors.surface || '#F5F5F5',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  activityList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.colors.text,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card || theme.colors.surface || '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  activityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIconImage: {
    width: 22,
    height: 22,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.detailText,
  },
  activityDescription: {
    fontSize: 13,
    color: theme.colors.detailText,
    lineHeight: 18,
  },
  pointsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  pointsText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.detailText,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default GamificationActivity;