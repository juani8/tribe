import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useUserContext } from 'context/UserContext';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { UserFill, Favorite, Chat, Analytics, Lamp } from 'assets/images';

const { width } = Dimensions.get('window');

const MetricsScreen = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();
  const styles = createStyles(theme);

  // Calculate engagement rate (mock)
  const totalInteractions = (user.numberOfLikes || 0) + (user.numberOfComments || 0);
  const engagementRate = user.numberOfFollowers > 0 
    ? ((totalInteractions / user.numberOfFollowers) * 100).toFixed(1)
    : 0;

  const StatCard = ({ icon, label, value, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Image source={icon} style={[styles.icon, { tintColor: color }]} />
        </View>
        <CustomTextNunito style={styles.statLabel}>{label}</CustomTextNunito>
      </View>
      <CustomTextNunito weight="Bold" style={styles.statValue}>{value}</CustomTextNunito>
      {subtitle && (
        <CustomTextNunito style={styles.statSubtitle}>{subtitle}</CustomTextNunito>
      )}
    </View>
  );

  const MetricRow = ({ label, value, percentage, isPositive }) => (
    <View style={styles.metricRow}>
      <CustomTextNunito style={styles.metricLabel}>{label}</CustomTextNunito>
      <View style={styles.metricValueContainer}>
        <CustomTextNunito weight="Bold" style={styles.metricValue}>{value}</CustomTextNunito>
        {percentage !== undefined && (
          <View style={[styles.percentageBadge, isPositive ? styles.positiveBadge : styles.negativeBadge]}>
            <CustomTextNunito style={styles.percentageText}>
              {isPositive ? '+' : ''}{percentage}%
            </CustomTextNunito>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Summary */}
      <View style={styles.headerSection}>
        <View style={styles.engagementCard}>
          <View style={styles.engagementIcon}>
            <Image source={Analytics} style={styles.engagementIconImage} />
          </View>
          <View style={styles.engagementContent}>
            <CustomTextNunito style={styles.engagementLabel}>
              {I18n.locale?.startsWith('es') ? 'Tasa de engagement' : 'Engagement Rate'}
            </CustomTextNunito>
            <CustomTextNunito weight="Bold" style={styles.engagementValue}>
              {engagementRate}%
            </CustomTextNunito>
          </View>
        </View>
      </View>

      {/* Main Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard 
          icon={UserFill}
          label={I18n.t(TextKey.numberOfFollowers)}
          value={user.numberOfFollowers || 0}
          color="#6B4EFF"
          subtitle={I18n.locale?.startsWith('es') ? 'seguidores' : 'followers'}
        />
        <StatCard 
          icon={UserFill}
          label={I18n.t(TextKey.numberOfFollowing)}
          value={user.numberOfFollowing || 0}
          color="#3B82F6"
          subtitle={I18n.locale?.startsWith('es') ? 'siguiendo' : 'following'}
        />
        <StatCard 
          icon={Favorite}
          label={I18n.t(TextKey.numberOfLikes)}
          value={user.numberOfLikes || 0}
          color="#EF4444"
          subtitle={I18n.locale?.startsWith('es') ? 'me gusta recibidos' : 'likes received'}
        />
        <StatCard 
          icon={Chat}
          label={I18n.t(TextKey.numberOfComments)}
          value={user.numberOfComments || 0}
          color="#10B981"
          subtitle={I18n.locale?.startsWith('es') ? 'comentarios' : 'comments'}
        />
      </View>

      {/* Detailed Analytics */}
      <View style={styles.detailSection}>
        <CustomTextNunito weight="Bold" style={styles.sectionTitle}>
          {I18n.locale?.startsWith('es') ? 'Resumen de actividad' : 'Activity Summary'}
        </CustomTextNunito>
        
        <View style={styles.metricsCard}>
          <MetricRow 
            label={I18n.locale?.startsWith('es') ? 'Total de publicaciones' : 'Total posts'}
            value={user.numberOfPosts || 3}
            percentage={12}
            isPositive={true}
          />
          <View style={styles.metricDivider} />
          <MetricRow 
            label={I18n.locale?.startsWith('es') ? 'Alcance promedio' : 'Average reach'}
            value={Math.round((user.numberOfFollowers || 0) * 0.6)}
            percentage={8}
            isPositive={true}
          />
          <View style={styles.metricDivider} />
          <MetricRow 
            label={I18n.locale?.startsWith('es') ? 'Interacciones totales' : 'Total interactions'}
            value={totalInteractions}
            percentage={15}
            isPositive={true}
          />
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <CustomTextNunito weight="Bold" style={styles.sectionTitle}>
          {I18n.locale?.startsWith('es') ? 'Consejos' : 'Tips'}
        </CustomTextNunito>
        <View style={styles.tipCard}>
          <View style={styles.tipIconContainer}>
            <Image source={Lamp} style={styles.tipIcon} />
          </View>
          <CustomTextNunito style={styles.tipText}>
            {I18n.locale?.startsWith('es') 
              ? 'Publica regularmente para aumentar tu alcance y engagement con tus seguidores.'
              : 'Post regularly to increase your reach and engagement with your followers.'}
          </CustomTextNunito>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerSection: {
    padding: 20,
    paddingBottom: 10,
  },
  engagementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: 16,
    padding: 20,
  },
  engagementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  engagementIconImage: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
  engagementContent: {
    flex: 1,
  },
  engagementLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  engagementValue: {
    color: '#FFF',
    fontSize: 28,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
    justifyContent: 'center',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 18,
    height: 18,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.detailText || '#666',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 11,
    color: theme.colors.detailText || '#666',
  },
  detailSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 12,
  },
  metricsCard: {
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    color: theme.colors.text,
    marginRight: 8,
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  positiveBadge: {
    backgroundColor: '#10B98120',
  },
  negativeBadge: {
    backgroundColor: '#EF444420',
  },
  percentageText: {
    fontSize: 11,
    color: '#10B981',
  },
  metricDivider: {
    height: 1,
    backgroundColor: theme.colors.border || '#E5E5E5',
  },
  tipsSection: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '15',
    borderRadius: 12,
    padding: 16,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.primary,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
  },
});

export default MetricsScreen;