import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo for network status
import MockUpData from 'models/MockUpPostData'; // Import mock data
import PostTimeline from 'ui/components/postComponents/PostTimeline'; // Import PostTimeline
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import LottieView from 'lottie-react-native';

export default function TimelineScreen() {
  const [data, setData] = useState([]); // Initial empty array for posts
  const [page, setPage] = useState(1); // Pagination page number
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false); // Loader for infinite scroll
  const [refreshing, setRefreshing] = useState(false); // Refresh state
  const [isConnected, setIsConnected] = useState(true); // Network status

  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Check and monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup the listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Simulate fetching paginated data
  const fetchData = (nextPage = 1, refreshing = false) => {
    const pageSize = 5; // Number of items to load per page
    const newPosts = MockUpData.slice((nextPage - 1) * pageSize, nextPage * pageSize);

    if (refreshing) {
      setData(newPosts); // Refresh and reset data
    } else {
      setData(prevData => [...prevData, ...newPosts]); // Append new posts
    }
    setIsLoadingNextPage(false); // Stop loading after fetching
  };

  // Infinite scroll handler
  const fetchNextPage = () => {
    if (!isLoadingNextPage) {
      setIsLoadingNextPage(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    }
  };

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1); // Reset pagination
    fetchData(1, true); // Fetch fresh data
    setTimeout(() => {
      setRefreshing(false); // Hide refresh control after 1 second
    }, 1000);
  };

  // Initial data load
  useEffect(() => {
    fetchData(); // Load the first page
  }, []);

  const renderItem = ({ item }) => <PostTimeline post={item} />;

  // Footer loader for infinite scroll
  const ListEndLoader = () => {
    return isLoadingNextPage ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : null;
  };

  // If offline, show a message
  if (!isConnected) {
    return (
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
    );
  }

  return (
    <View style={styles.container}>
      {/* FlatList with pull to refresh and infinite scroll */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8} // Trigger load when scrolled 80%
        ListFooterComponent={ListEndLoader} // Loader for infinite scroll
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: theme.colors.background,
  },
  loader: {
    padding: 16,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
