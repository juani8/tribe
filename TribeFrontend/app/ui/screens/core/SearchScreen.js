import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useTheme } from 'context/ThemeContext';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { followUser, unfollowUser, searchUsers } from 'networking/api/usersApi';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { SearchGoogle } from 'assets/images';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingFollow, setLoadingFollow] = useState({}); // Track loading state per user

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const results = await searchUsers(searchQuery);
      setUsers(results || []);
    } catch (err) {
      console.error('Error al buscar usuarios:', err);
      
      // Handle 404 specifically - user not found is not an error, just empty results
      if (err.response?.status === 404) {
        setUsers([]);
        setError(null);
      } else if (err.response?.status === 401) {
        setError(I18n.locale?.startsWith('es') 
          ? 'Sesión expirada. Por favor inicia sesión nuevamente.' 
          : 'Session expired. Please log in again.');
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError(I18n.locale?.startsWith('es') 
          ? 'La búsqueda tardó demasiado. Intenta de nuevo.' 
          : 'Search took too long. Please try again.');
      } else if (!err.response) {
        setError(I18n.locale?.startsWith('es') 
          ? 'Error de conexión. Verifica tu internet.' 
          : 'Connection error. Check your internet.');
      } else {
        setError(I18n.t(TextKey.searchError));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (userId) => {
    // Prevent multiple clicks while loading
    if (loadingFollow[userId]) return;
    
    const user = users.find((user) => user._id === userId);
    if (!user) return;

    // Set loading state for this specific user
    setLoadingFollow(prev => ({ ...prev, [userId]: true }));
    
    // Optimistically update UI
    const newFollowState = !user.isFollowing;
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u._id === userId ? { ...u, isFollowing: newFollowState } : u
      )
    );

    try {
      if (user.isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (err) {
      console.error('Error al cambiar el estado de seguimiento:', err);
      // Revert on error
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, isFollowing: user.isFollowing } : u
        )
      );
    } finally {
      setLoadingFollow(prev => ({ ...prev, [userId]: false }));
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.avatarContainer}>
        <Image
          source={item.profileImage ? { uri: item.profileImage } : theme.UserCircle}
          style={styles.avatar}
        />
        <View style={styles.onlineIndicator} />
      </View>
      
      <View style={styles.userInfo}>
        <CustomTextNunito weight="Bold" style={styles.userName}>
          {item.name} {item.lastName}
        </CustomTextNunito>
        <CustomTextNunito style={styles.userNickName}>@{item.nickName}</CustomTextNunito>
      </View>
      
      <TouchableOpacity
        style={[
          styles.followButton,
          item.isFollowing ? styles.unfollowButton : styles.followButtonActive,
          loadingFollow[item._id] && styles.followButtonDisabled,
        ]}
        onPress={() => toggleFollow(item._id)}
        activeOpacity={0.8}
        disabled={loadingFollow[item._id]}
      >
        {loadingFollow[item._id] ? (
          <ActivityIndicator size="small" color={item.isFollowing ? theme.colors.text : '#FFFFFF'} />
        ) : (
          <CustomTextNunito 
            weight="SemiBold" 
            style={[
              styles.followButtonText,
              item.isFollowing && styles.unfollowButtonText
            ]}
          >
            {item.isFollowing ? I18n.t(TextKey.unfollow) : I18n.t(TextKey.follow)}
          </CustomTextNunito>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconContainer}>
        <Image source={SearchGoogle} style={styles.googleIcon} />
      </View>
      <CustomTextNunito weight="SemiBold" style={styles.emptyTitle}>
        {users === null 
          ? (I18n.locale?.startsWith('es') ? 'Encuentra personas' : 'Find people')
          : (I18n.locale?.startsWith('es') ? 'Sin resultados' : 'No results')}
      </CustomTextNunito>
      <CustomTextNunito style={styles.emptySubtitle}>
        {users === null 
          ? I18n.t(TextKey.startSearch)
          : I18n.t(TextKey.searchNoResults)}
      </CustomTextNunito>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <CustomTextNunito weight="Bold" style={styles.title}>
          {I18n.locale?.startsWith('es') ? 'Buscar' : 'Search'}
        </CustomTextNunito>
        <CustomTextNunito style={styles.subtitle}>
          {I18n.locale?.startsWith('es') 
            ? 'Encuentra y conecta con personas' 
            : 'Find and connect with people'}
        </CustomTextNunito>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={I18n.t(TextKey.searchPlaceholder)}
            placeholderTextColor={theme.colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <CustomTextNunito weight="SemiBold" style={styles.searchButtonText}>
            {I18n.locale?.startsWith('es') ? 'Buscar' : 'Search'}
          </CustomTextNunito>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <CustomTextNunito style={styles.loadingText}>
            {I18n.locale?.startsWith('es') ? 'Buscando...' : 'Searching...'}
          </CustomTextNunito>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <CustomTextNunito style={styles.errorText}>{error}</CustomTextNunito>
        </View>
      )}

      {/* Results List */}
      {!loading && !error && (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerSection: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    title: {
      fontSize: 28,
      color: theme.colors.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.detailText,
      marginTop: 6,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
      gap: 12,
    },
    searchInputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card || theme.colors.surface,
      borderRadius: 14,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: theme.colors.border || 'transparent',
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 16,
      color: theme.colors.text,
      fontFamily: 'Nunito-Regular',
    },
    searchButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchButtonText: {
      color: theme.colors.buttonText,
      fontSize: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      color: theme.colors.detailText,
      fontSize: 14,
    },
    errorContainer: {
      marginHorizontal: 20,
      backgroundColor: '#FEE2E2',
      padding: 14,
      borderRadius: 12,
    },
    errorText: {
      color: '#DC2626',
      fontSize: 14,
      textAlign: 'center',
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card || theme.colors.surface,
      padding: 14,
      borderRadius: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.colors.border || 'transparent',
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.colors.surface,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#22c55e',
      borderWidth: 2,
      borderColor: theme.colors.card || theme.colors.surface,
    },
    userInfo: {
      flex: 1,
      marginLeft: 14,
    },
    userName: {
      fontSize: 16,
      color: theme.colors.text,
    },
    userNickName: {
      fontSize: 14,
      color: theme.colors.detailText,
      marginTop: 2,
    },
    followButton: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 10,
      minWidth: 90,
      alignItems: 'center',
      justifyContent: 'center',
    },
    followButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    unfollowButton: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.colors.border || theme.colors.detailText,
    },
    followButtonDisabled: {
      opacity: 0.7,
    },
    followButtonText: {
      color: theme.colors.buttonText,
      fontSize: 14,
    },
    unfollowButtonText: {
      color: theme.colors.text,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 80,
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
    googleIcon: {
      width: 24,
      height: 24,
      tintColor: theme.colors.primary,
    },
    emptyTitle: {
      fontSize: 18,
      color: theme.colors.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.detailText,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
  });








