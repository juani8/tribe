import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import MockUpData from 'models/MockUpPostData'; // Import mock data
import PostTimeline from 'ui/components/postComponents/PostTimeline'; // Import PostTimeline
import { useUiContext } from 'context/UiContext';
import PopupMenu from 'ui/components/generalPurposeComponents/PopupMenu';
import { useTheme } from 'context/ThemeContext';

export default function TimelineScreen() {
  const [data, setData] = useState([]); // Initial empty array for posts
  const [page, setPage] = useState(1); // Pagination page number
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false); // Loader for infinite scroll
  const [refreshing, setRefreshing] = useState(false); // Refresh state

  const { theme } = useTheme();

  const styles = createStyles(theme);

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
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: theme.colors.background,
  },
  loader: {
    padding: 16,
    alignItems: 'center',
  },
});

