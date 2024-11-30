import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useTheme } from 'context/ThemeContext';
import { getFollowing, unfollowUser } from 'networking/api/usersApi';

const FollowingScreen = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const fetchFollowing = useCallback(async () => {
    setLoading(true);
    try {
      const following = await getFollowing();
      setFollowing(following);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUser(userId);
      fetchFollowing();
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const confirmUnfollow = (userId, nickName) => {
    Alert.alert(
      'Confirm Unfollow',
      `Are you sure you want to unfollow ${nickName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unfollow', onPress: () => handleUnfollow(userId) },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={item.profileImage ? { uri: item.profileImage } : theme.UserCircleLight} style={{ width: 50, height: 50, borderRadius: 25 }} />
        <CustomTextNunito style={{ marginLeft: 10 }}>{item.nickName}</CustomTextNunito>
      </View>
      <CustomButton title="Dejar de seguir" style={{ marginLeft: 'auto' }} onPress={() => confirmUnfollow(item._id, item.nickName)} />    
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={following}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
    />
  );
};

export default FollowingScreen;