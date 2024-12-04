import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'context/ThemeContext';
import Search from 'assets/images/icons/Search.png';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { followUser, unfollowUser, searchUsers } from 'networking/api/usersApi';

export default function SearchScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(null); // Inicialmente null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Datos simulados (comentados ahora)
  // const mockUsers = [
  //   { _id: '1', name: 'Juan', lastName: 'Pérez', nickName: 'juampi', isFollowing: false },
  //   { _id: '2', name: 'Ana', lastName: 'López', nickName: 'anita123', isFollowing: true },
  //   { _id: '3', name: 'Carlos', lastName: 'Martínez', nickName: 'charly', isFollowing: false },
  // ];

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchUsers(searchQuery);
      setUsers(results);
    } catch (err) {
      console.error('Error al buscar usuarios:', err);
      setError(I18n.t(TextKey.searchError));
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (userId) => {
    try {
      // Obtener el estado actual del usuario
      const user = users.find((user) => user._id === userId);

      if (user.isFollowing) {
        await unfollowUser(userId); 
      } else {
        await followUser(userId); 
      }

      // Actualizar el estado local para reflejar el cambio
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isFollowing: !user.isFollowing } : user
        )
      );
    } catch (err) {
      console.error('Error al cambiar el estado de seguimiento:', err);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.name} {item.lastName}
        </Text>
        <Text style={styles.userNickName}>@{item.nickName}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          item.isFollowing ? styles.unfollowButton : styles.followButtonActive,
        ]}
        onPress={() => toggleFollow(item._id)}
      >
        <Text style={styles.followButtonText}>
          {item.isFollowing ? I18n.t(TextKey.unfollow) : I18n.t(TextKey.follow)}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={I18n.t(TextKey.searchPlaceholder)}
          placeholderTextColor={theme.colors.detailText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Image source={Search} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>

      {/* Indicador de carga */}
      {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}

      {/* Lista de usuarios */}
      {users === null ? (
        <Text style={styles.emptyText}>{I18n.t(TextKey.startSearch)}</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            !loading && (
              <Text style={styles.emptyText}>{I18n.t(TextKey.searchNoResults)}</Text>
            )
          }
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
      padding: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.detailText,
      borderRadius: 10,
      paddingHorizontal: 10,
      color: theme.colors.text,
    },
    searchButton: {
      marginLeft: 10,
    },
    listContainer: {
      marginTop: 10,
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.detailText,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    userNickName: {
      fontSize: 14,
      color: theme.colors.detailText,
    },
    followButton: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    followButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    unfollowButton: {
      backgroundColor: theme.colors.secondary,
    },
    followButtonText: {
      color: theme.colors.buttonText,
      fontWeight: 'bold',
    },
    errorText: {
      color: theme.colors.danger,
      textAlign: 'center',
      marginTop: 20,
    },
    emptyText: {
      textAlign: 'center',
      color: theme.colors.detailText,
      marginTop: 20,
    },
  });








