import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Image, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { getFollowing, unfollowUser } from 'networking/api/usersApi';
import { useNavigation } from '@react-navigation/native';

const FollowingScreen = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingUnfollow, setLoadingUnfollow] = useState({});
  const { theme } = useTheme();
  const navigation = useNavigation();

  const fetchFollowing = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await getFollowing();
      setFollowing(data);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  const handleUnfollow = async (userId) => {
    if (loadingUnfollow[userId]) return;
    
    setLoadingUnfollow(prev => ({ ...prev, [userId]: true }));
    
    // Optimistically remove from list
    const previousFollowing = [...following];
    setFollowing(prev => prev.filter(f => f._id !== userId));
    
    try {
      await unfollowUser(userId);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      // Revert on error
      setFollowing(previousFollowing);
    } finally {
      setLoadingUnfollow(prev => ({ ...prev, [userId]: false }));
    }
  };

  const confirmUnfollow = (userId, nickName) => {
    if (loadingUnfollow[userId]) return;
    
    Alert.alert(
      'Dejar de seguir',
      `¿Estás seguro de que quieres dejar de seguir a ${nickName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Dejar de seguir', 
          onPress: () => handleUnfollow(userId),
          style: 'destructive'
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => navigation.navigate('UserProfile', { userId: item._id })}
      activeOpacity={0.7}
    >
      <Image 
        source={item.profileImage ? { uri: item.profileImage } : theme.UserCircle} 
        style={styles.avatar} 
      />
      <View style={styles.userInfo}>
        <CustomTextNunito style={styles.nickname} fontWeight="Bold">
          {item.nickName}
        </CustomTextNunito>
        {item.fullName && (
          <CustomTextNunito style={[styles.fullName, { color: theme.colors.textSecondary }]}>
            {item.fullName}
          </CustomTextNunito>
        )}
      </View>
      <TouchableOpacity 
        style={[styles.unfollowButton, { borderColor: theme.colors.textSecondary }, loadingUnfollow[item._id] && styles.buttonDisabled]}
        onPress={(e) => { e.stopPropagation(); confirmUnfollow(item._id, item.nickName); }}
        disabled={loadingUnfollow[item._id]}
      >
        {loadingUnfollow[item._id] ? (
          <ActivityIndicator size="small" color={theme.colors.text} />
        ) : (
          <CustomTextNunito style={[styles.unfollowButtonText, { color: theme.colors.text }]} fontWeight="SemiBold">
            Siguiendo
          </CustomTextNunito>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <CustomTextNunito style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        No sigues a nadie aún
      </CustomTextNunito>
      <CustomTextNunito style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
        Explora y encuentra personas interesantes
      </CustomTextNunito>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={following}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          following.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchFollowing(true)}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  nickname: {
    fontSize: 16,
  },
  fullName: {
    fontSize: 14,
    marginTop: 2,
  },
  unfollowButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  unfollowButtonText: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FollowingScreen;