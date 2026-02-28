import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import PostMainContent from 'ui/components/postComponents/PostMainContent';
import { useTheme } from 'context/ThemeContext';
import { getUserPosts, getUserBookmarks } from 'networking/api/postsApi';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

export default function ProfilePosts({ postView, setIsFetching }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const { theme } = useTheme();
  const isFetching = useRef(false);

  const pageSize = 10;
  const styles = createStyles(theme);

  const fetchData = async (nextPage = 1, isRefresh = false) => {
    if (isFetching.current || (!hasMorePosts && !isRefresh)) return;

    isFetching.current = true;
    setIsFetching(true); // Notifica al componente padre que está cargando

    try {
      const offset = (nextPage - 1) * pageSize;
      let newPosts = [];

      if (postView === 'UserPosts') {
        newPosts = await getUserPosts(offset, pageSize);
      } else if (postView === 'UserBookmarks') {
        newPosts = await getUserBookmarks(offset, pageSize);
      }

      setData(prevData => (isRefresh ? newPosts : [...prevData, ...newPosts]));
      setPage(nextPage);
      setHasMorePosts(newPosts.length === pageSize);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      isFetching.current = false;
      setIsFetching(false); // Notifica que ha terminado la carga
      setRefreshing(false);
    }
  };

  const fetchNextPage = () => {
    if (!isFetching.current && hasMorePosts) {
      fetchData(page + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMorePosts(true);
    fetchData(1, true);
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMorePosts(true);
    fetchData(1, true);
  }, [postView]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <PostMainContent post={item} renderingPostsFromUser={postView === 'UserPosts'} />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          <>
            {isFetching.current && hasMorePosts && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}
            {!hasMorePosts && data.length > 0 && (
              <>
                <View style={styles.bottomSpacing} />
                <CustomTextNunito style={styles.noMorePostsText}>
                  {I18n.t(TextKey.timelineNoMorePosts)}
                </CustomTextNunito>
                <View style={styles.bottomSpacing} />
              </>
            )}
          </>
        }
        ListEmptyComponent={
          !isFetching.current && (
            <View style={styles.emptyContainer}>
              <CustomTextNunito weight="SemiBold" style={styles.emptyTitle}>
                {postView === 'UserPosts' 
                  ? (I18n.locale?.startsWith('es') ? 'Sin publicaciones' : 'No posts yet')
                  : (I18n.locale?.startsWith('es') ? 'Sin favoritos' : 'No favorites yet')}
              </CustomTextNunito>
              <CustomTextNunito style={styles.emptySubtitle}>
                {postView === 'UserPosts'
                  ? (I18n.locale?.startsWith('es') ? 'Comparte tu primer momento' : 'Share your first moment')
                  : (I18n.locale?.startsWith('es') ? 'Guarda publicaciones que te gusten' : 'Save posts you like')}
              </CustomTextNunito>
            </View>
          )
        }
      />
    </View>
  );
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 0,
      marginHorizontal: 8,
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    loader: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    bottomSpacing: {
      height: 25,
    },
    noMorePostsText: {
      textAlign: 'center',
      color: theme.colors.detailText,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 20,
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
    },
  });