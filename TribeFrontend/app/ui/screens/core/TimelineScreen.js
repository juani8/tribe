  import React, { useState, useEffect, useCallback } from 'react';
  import { View, FlatList, RefreshControl, StyleSheet, ActivityIndicator, Animated } from 'react-native';
  import PostMainContent from 'ui/components/postComponents/PostMainContent';
  import AdComponent from 'ui/components/postComponents/AdComponent';
  import { useTheme } from 'context/ThemeContext';
  import { getTimelinePosts, getAds } from 'networking/api/postsApi';
  import NetInfo from '@react-native-community/netinfo';
  import LottieView from 'lottie-react-native';
  import I18n from 'assets/localization/i18n';
  import TextKey from 'assets/localization/TextKey';
  import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
  import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
  
  export default function TimelineScreen({ flatListRef }) {
    const [data, setData] = useState([]);
    const [ads, setAds] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [isConnected, setIsConnected] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
  
    const pageSize = 10;
  
    const checkInternetConnection = async () => {
      const netInfo = await NetInfo.fetch();
      setIsConnected(netInfo.isConnected);
    };
  
  const fetchData = async (nextPage = 1, refreshing = false) => {
      if (!hasMorePosts && !refreshing) return;

      const offset = (nextPage - 1) * pageSize;

      try {
        const response = await getTimelinePosts(offset, pageSize);
        // La API puede devolver { posts: [...], hasMore: bool } o directamente un array
        const newPosts = Array.isArray(response) ? response : (response.posts || []);
        const hasMore = response.hasMore !== undefined ? response.hasMore : newPosts.length === pageSize;
        
        setData(prevData => (refreshing ? newPosts : [...prevData, ...newPosts]));
        setPage(nextPage);
        setHasMorePosts(hasMore);
      } catch (error) {
        console.error('Error fetching timeline posts:', error);
      } finally {
        setIsLoadingNextPage(false);
        setRefreshing(false);
        setIsLoading(false);
      }
    };    const fetchAdsData = async () => {
      try {
        const adsData = await getAds();
        setAds(adsData);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };
  
    const fetchNextPage = () => {
      if (!isLoadingNextPage && hasMorePosts) {
        setIsLoadingNextPage(true);
        fetchData(page + 1);
      }
    };
  
    const onRefresh = () => {
      setRefreshing(true);
      setHasMorePosts(true);
      fetchData(1, true);
    };
  
    useFocusEffect(
      useCallback(() => {
        if (route.params?.refresh) {
          fetchData(1, true);
        }
      }, [route.params?.refresh])
    );
  
    useEffect(() => {
      fetchData();
      fetchAdsData();
      checkInternetConnection();
    }, []);
  
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected);
      });
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    if (!isConnected) {
      return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
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
            </View>
          </View>
        </View>
      );
    }
  
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
          ref={flatListRef}
          data={combinedData}
          renderItem={({ item }) => item.commerce ? <AdComponent ad={item} /> : <PostMainContent post={item} />}
          keyExtractor={(item, index) => `${item.userId}-${index}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.8}
          ListHeaderComponent={<View style={styles.listHeaderSpacing} />}
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
      paddingHorizontal: 8,
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listHeaderSpacing: {
      height: 12,
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
    noMorePostsContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    noMorePostsText: {
      textAlign: 'center',
      color: theme.colors.detailText,
      fontSize: 14,
    },
    listContentContainer: {
      paddingBottom: 20,
    },
  });