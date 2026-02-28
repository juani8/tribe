import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { getFollowers, followUser } from 'networking/api/usersApi';
import { useNavigation } from '@react-navigation/native';

const FollowersScreen = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState({});
  const { theme } = useTheme();
  const navigation = useNavigation();

  const fetchFollowers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await getFollowers();
      setFollowers(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const handleFollowBack = async (userId) => {
    if (loadingFollow[userId]) return;
    
    setLoadingFollow(prev => ({ ...prev, [userId]: true }));
    
    // Optimistically update UI
    setFollowers(prev => prev.map(f => 
      f._id === userId ? { ...f, isFollowing: true } : f
    ));
    
    try {
      await followUser(userId);
    } catch (error) {
      console.error('Error following user:', error);
      // Revert on error
      setFollowers(prev => prev.map(f => 
        f._id === userId ? { ...f, isFollowing: false } : f
      ));
    } finally {
      setLoadingFollow(prev => ({ ...prev, [userId]: false }));
    }
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
      {!item.isFollowing && (
        <TouchableOpacity 
          style={[styles.followButton, { backgroundColor: theme.colors.primary }, loadingFollow[item._id] && styles.followButtonDisabled]}
          onPress={(e) => { e.stopPropagation(); handleFollowBack(item._id); }}
          disabled={loadingFollow[item._id]}
        >
          {loadingFollow[item._id] ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <CustomTextNunito style={styles.followButtonText} fontWeight="SemiBold">
              Seguir
            </CustomTextNunito>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <CustomTextNunito style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        Aún no tienes seguidores
      </CustomTextNunito>
      <CustomTextNunito style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
        Comparte contenido para ganar seguidores
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
        data={followers}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          followers.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchFollowers(true)}
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
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonDisabled: {
    opacity: 0.7,
  },
  followButtonText: {
    color: '#FFFFFF',
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

export default FollowersScreen;