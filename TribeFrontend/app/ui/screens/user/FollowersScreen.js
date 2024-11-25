import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, ActivityIndicator } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useTheme } from 'context/ThemeContext';
import { getFollowers } from 'networking/api/usersApi';

const FollowersScreen = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={item.profileImage ? { uri: item.profileImage } : theme.UserCircleLight} style={{ width: 50, height: 50, borderRadius: 25 }} />
        <CustomTextNunito style={{ marginLeft: 10 }}>{item.nickName}</CustomTextNunito>
      </View>
    </View>
  );

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followers = await getFollowers();
        setFollowers(followers);
      } catch (error) {
        console.error('Error fetching followers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={followers}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
    />
  );
};

export default FollowersScreen;