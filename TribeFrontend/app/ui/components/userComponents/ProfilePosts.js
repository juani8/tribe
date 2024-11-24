import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import PostMainContent from 'ui/components/postComponents/PostMainContent';
import { useTheme } from 'context/ThemeContext';
import { getTimelinePosts } from 'networking/api/postsApi';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

export default function ProfilePosts({postView}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const pageSize = 10;

  const fetchData = async (nextPage = 1, refreshing = false) => {
    if (!hasMorePosts && !refreshing) return;

    const offset = (nextPage - 1) * pageSize;

    try {
      const newPosts = await getTimelinePosts(offset, pageSize);
      setData(prevData => (refreshing ? newPosts : [...prevData, ...newPosts]));
      setPage(nextPage);
      setHasMorePosts(newPosts.length === pageSize);
    } catch (error) {
      console.error('Error fetching timeline posts:', error);
    } finally {
      setIsLoadingNextPage(false);
      setRefreshing(false);
      setIsLoading(false);
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

  useEffect(() => {
    fetchData();
  }, []);

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
        data={data}
        renderItem={({ item }) => <PostMainContent post={item} renderingPostsFromUser={postView === 'UserPosts'} />}
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