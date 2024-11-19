// TimelineScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import PostMainContent from 'ui/components/postComponents/PostMainContent';
// Agregado por mrosariopresedo para la integración de los anuncios.
import AdComponent from 'ui/components/postComponents/AdComponent';
import { useTheme } from 'context/ThemeContext';
// Modificado por mrosariopresedo para la integración de los anuncios.
import { getTimelinePosts, checkServerStatus, getAds } from 'networking/api/postsApi';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

export default function TimelineScreen() {
  const [data, setData] = useState([]);
  // Agregado por mrosariopresedo para la integración de los anuncios.
  const [ads, setAds] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);  // New state to track if more posts are available
  const [isLoading, setIsLoading] = useState(true); // State to track initial loading
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
    if (!hasMorePosts && !refreshing) return;  // Stop fetching if no more posts are available

    const offset = (nextPage - 1) * pageSize;

    try {
      const newPosts = await getTimelinePosts(offset, pageSize);

      // If refreshing, replace data; otherwise, append new posts
      setData(prevData => (refreshing ? newPosts : [...prevData, ...newPosts]));
      setPage(nextPage);

      // Update `hasMorePosts` based on response size
      setHasMorePosts(newPosts.length === pageSize);
    } catch (error) {
      console.error('Error fetching timeline posts:', error);
    } finally {
      setIsLoadingNextPage(false);
      setRefreshing(false);
      setIsLoading(false); // Set loading to false when data is fetched
    }
  };

  // Fetch ads
  // Agregado por mrosariopresedo para la integración de los anuncios.
  const fetchAdsData = async () => {
    try {
      const adsData = await getAds();
      setAds(adsData);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  // Fetch next page on reaching end
  const fetchNextPage = () => {
    if (!isLoadingNextPage && hasMorePosts) {
      setIsLoadingNextPage(true);
      fetchData(page + 1);
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    setHasMorePosts(true); // Reset to allow re-fetching from the start
    fetchData(1, true);
  };

  useEffect(() => {
    fetchData();
    // Agregado por mrosariopresedo para la integración de los anuncios.
    fetchAdsData();
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

  // Agregado por mrosariopresedo para la integración de los anuncios.
  const combinedData = [];
  let adIndex = 0;

  data.forEach((post, index) => {
    combinedData.push(post);
    if ((index + 1) % 3 === 0 && adIndex < ads.length) {
      combinedData.push(ads[adIndex]);
      adIndex++;
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        // Modificado por mrosariopresedo para la integración de los anuncios.
        data={combinedData}
        renderItem={({ item }) => item.commerce ? <AdComponent ad={item} /> : <PostMainContent post={item} />}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          <>
            {isLoadingNextPage && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}
            {!hasMorePosts && (
              <>
                <View style={styles.bottomSpacing} />
                <CustomTextNunito style={{ textAlign: 'center', color: theme.colors.detailText }}>{I18n.t(TextKey.timelineNoMorePosts)}</CustomTextNunito>
                <View style={styles.bottomSpacing} />
              </>
            )}
          </>
        }
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: 40,
  },
  bottomSpacing: {
    height: 25,
  },
});