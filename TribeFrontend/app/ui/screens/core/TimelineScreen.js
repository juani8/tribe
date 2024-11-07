// TimelineScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import PostMainContent from 'ui/components/postComponents/PostMainContent';
import { useTheme } from 'context/ThemeContext';
import { getTimelinePosts, checkServerStatus } from 'networking/api/postsApi';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

export default function TimelineScreen() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [isConnected, setIsConnected] = useState(true);
  
  const pageSize = 10;

  const checkInternetConnection = async () => {
    const netInfo = await NetInfo.fetch();
    setIsConnected(netInfo.isConnected);
  };

  // Function to fetch data with pagination
  const fetchData = async (nextPage = 1, refreshing = false) => {
    const offset = (nextPage - 1) * pageSize;

    try {
      const newPosts = await getTimelinePosts(offset, pageSize);
      console.log(newPosts);

      setData(prevData => (refreshing ? newPosts : [...prevData, ...newPosts]));
      setPage(nextPage);
    } catch (error) {
      console.error('Error fetching timeline posts:', error);
    } finally {
      setIsLoadingNextPage(false);
      setRefreshing(false);
    }
  };

  // Fetch next page on reaching end
  const fetchNextPage = () => {
    if (!isLoadingNextPage) {
      setIsLoadingNextPage(true);
      fetchData(page + 1);
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData(1, true);
  };

  useEffect(() => {
    fetchData();
    checkServerStatus();
  }, []);

  useEffect(() => {
    checkInternetConnection();
  }, [isConnected]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup the listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  if (!isConnected) {
    return (
      <View style={{ backgroundColor: theme.colors.background, flex:1 }}>
        <View style={{ padding: 16, gap: 30, marginTop: 20 }}>
          <View>
            <CustomTextNunito weight={'SemiBold'} style={{ fontSize: 20 }}>{I18n.t(TextKey.noConnectionTitle)}</CustomTextNunito> 
          </View>
          <View>
            <CustomTextNunito weight={'Regular'}>{I18n.t(TextKey.noConnectionFirstMessage)}</CustomTextNunito>
            <CustomTextNunito weight={'Regular'}>• {I18n.t(TextKey.noConnectionFirstMessageFirstItem)}</CustomTextNunito>
            <CustomTextNunito weight={'Regular'}>• {I18n.t(TextKey.noConnectionFirstMessageSecondItem)}</CustomTextNunito>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              source={require('assets/lottie/lostConnectionLottie.json')}
              autoPlay
              loop
              style={{ width: 300, height: 300 }}
            />
            <CustomTextNunito weight={'Regular'}>{I18n.t(TextKey.noConnectionSecondMessage)}</CustomTextNunito> 
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => <PostMainContent post={item} />}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          isLoadingNextPage && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
        }
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: 10,
    backgroundColor: theme.colors.background,
  },
  loader: {
    padding: 16,
    alignItems: 'center',
  },
});
