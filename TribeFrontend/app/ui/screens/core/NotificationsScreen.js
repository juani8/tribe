import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import { BellFill, Favorite, Chat, UserFill, CheckFill } from 'assets/images';
import I18n from 'assets/localization/i18n';

const NotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useUserContext();
  const styles = createStyles(theme);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'like',
      user: { name: 'María García', avatar: 'https://i.pravatar.cc/150?img=5' },
      message: I18n.locale?.startsWith('es') ? 'le gustó tu publicación' : 'liked your post',
      time: '2m',
      read: false,
      postImage: 'https://picsum.photos/100/100?random=1',
    },
    {
      id: '2',
      type: 'comment',
      user: { name: 'Carlos López', avatar: 'https://i.pravatar.cc/150?img=8' },
      message: I18n.locale?.startsWith('es') ? 'comentó: "¡Increíble foto!"' : 'commented: "Amazing photo!"',
      time: '15m',
      read: false,
      postImage: 'https://picsum.photos/100/100?random=2',
    },
    {
      id: '3',
      type: 'follow',
      user: { name: 'Ana Martínez', avatar: 'https://i.pravatar.cc/150?img=9' },
      message: I18n.locale?.startsWith('es') ? 'comenzó a seguirte' : 'started following you',
      time: '1h',
      read: true,
    },
    {
      id: '4',
      type: 'like',
      user: { name: 'Pedro Sánchez', avatar: 'https://i.pravatar.cc/150?img=12' },
      message: I18n.locale?.startsWith('es') ? 'le gustó tu publicación' : 'liked your post',
      time: '2h',
      read: true,
      postImage: 'https://picsum.photos/100/100?random=3',
    },
    {
      id: '5',
      type: 'comment',
      user: { name: 'Laura Fernández', avatar: 'https://i.pravatar.cc/150?img=16' },
      message: I18n.locale?.startsWith('es') ? 'comentó: "Me encanta 💕"' : 'commented: "Love it 💕"',
      time: '3h',
      read: true,
      postImage: 'https://picsum.photos/100/100?random=4',
    },
    {
      id: '6',
      type: 'follow',
      user: { name: 'Miguel Torres', avatar: 'https://i.pravatar.cc/150?img=33' },
      message: I18n.locale?.startsWith('es') ? 'comenzó a seguirte' : 'started following you',
      time: '5h',
      read: true,
    },
    {
      id: '7',
      type: 'like',
      user: { name: 'Sofia Ruiz', avatar: 'https://i.pravatar.cc/150?img=20' },
      message: I18n.locale?.startsWith('es') ? 'y 5 más les gustó tu publicación' : 'and 5 others liked your post',
      time: '1d',
      read: true,
      postImage: 'https://picsum.photos/100/100?random=5',
    },
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return Favorite;
      case 'comment':
        return Chat;
      case 'follow':
        return UserFill;
      default:
        return BellFill;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'like':
        return '#EF4444';
      case 'comment':
        return '#3B82F6';
      case 'follow':
        return theme.colors.primary;
      default:
        return theme.colors.secondary;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  const FilterButton = ({ title, value }) => (
    <TouchableOpacity 
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
      activeOpacity={0.7}
    >
      <CustomTextNunito 
        weight={filter === value ? 'Bold' : 'Regular'}
        style={[styles.filterButtonText, filter === value && styles.filterButtonTextActive]}
      >
        {title}
      </CustomTextNunito>
    </TouchableOpacity>
  );

  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      activeOpacity={0.7}
    >
      <View style={styles.notificationLeft}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={[styles.typeIconContainer, { backgroundColor: getIconColor(item.type) }]}>
            <Image source={getNotificationIcon(item.type)} style={styles.typeIcon} />
          </View>
        </View>
      </View>

      <View style={styles.notificationContent}>
        <CustomTextNunito style={styles.notificationText}>
          <CustomTextNunito weight="Bold" style={styles.userName}>
            {item.user.name}
          </CustomTextNunito>
          {' '}{item.message}
        </CustomTextNunito>
        <CustomTextNunito style={styles.timeText}>{item.time}</CustomTextNunito>
      </View>

      {item.postImage && (
        <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
      )}

      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.headerSection}>
      {/* Filters */}
      <View style={styles.filtersRow}>
        <FilterButton 
          title={I18n.locale?.startsWith('es') ? 'Todas' : 'All'} 
          value="all" 
        />
        <FilterButton 
          title={I18n.locale?.startsWith('es') ? `Sin leer (${unreadCount})` : `Unread (${unreadCount})`} 
          value="unread" 
        />
      </View>

      {/* Mark all as read */}
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markReadButton} onPress={markAllAsRead}>
          <Image source={CheckFill} style={styles.markReadIcon} />
          <CustomTextNunito weight="SemiBold" style={styles.markReadText}>
            {I18n.locale?.startsWith('es') ? 'Marcar todo como leído' : 'Mark all as read'}
          </CustomTextNunito>
        </TouchableOpacity>
      )}
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Image source={BellFill} style={styles.emptyIcon} />
      </View>
      <CustomTextNunito weight="Bold" style={styles.emptyTitle}>
        {I18n.locale?.startsWith('es') ? 'No hay notificaciones' : 'No notifications'}
      </CustomTextNunito>
      <CustomTextNunito style={styles.emptySubtitle}>
        {I18n.locale?.startsWith('es') 
          ? 'Cuando tengas actividad, aparecerá aquí' 
          : 'When you have activity, it will appear here'}
      </CustomTextNunito>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  headerSection: {
    padding: 16,
    paddingBottom: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.card || theme.colors.surface,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterButtonText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: theme.colors.buttonText || '#000',
  },
  markReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 6,
  },
  markReadIcon: {
    width: 16,
    height: 16,
    tintColor: theme.colors.primary,
    marginRight: 6,
  },
  markReadText: {
    color: theme.colors.primary,
    fontSize: 13,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  unreadNotification: {
    backgroundColor: theme.colors.primary + '10',
  },
  notificationLeft: {
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  typeIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  typeIcon: {
    width: 10,
    height: 10,
    tintColor: '#FFF',
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  userName: {
    color: theme.colors.text,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.detailText || '#666',
    marginTop: 4,
  },
  postThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  unreadDot: {
    position: 'absolute',
    left: 8,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    width: 36,
    height: 36,
    tintColor: theme.colors.primary,
  },
  emptyTitle: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.detailText || '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;