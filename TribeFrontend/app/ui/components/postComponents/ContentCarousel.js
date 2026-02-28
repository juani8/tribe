import {SafeAreaView, FlatList, View, StyleSheet, Dimensions} from 'react-native';
import React, {useState, useRef} from 'react';

import ContentCarouselListItem from './ContentCarouselListItem';
import {useSharedValue} from 'react-native-reanimated';
import { useTheme } from 'context/ThemeContext';

const { width } = Dimensions.get('window');

// Material Design 3 Carousel Specs
const M3_SPECS = {
  ITEM_GAP: 8,           // Padding between elements: 8dp
  CORNER_RADIUS: 28,     // Item corner radius: 28dp
  SIDE_PADDING: 16,      // Leading/trailing padding: 16dp
};

const ContentCarousel = ({ multimedia }) => {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const flatListRef = useRef(null);

  // Calculate item width based on content count
  const getItemWidth = () => {
    if (multimedia.length === 1) {
      return width - (M3_SPECS.SIDE_PADDING * 2);
    }
    // Multi-item: show peek of next item
    return width * 0.82;
  };

  const ITEM_WIDTH = getItemWidth();
  const SNAP_INTERVAL = ITEM_WIDTH + M3_SPECS.ITEM_GAP;

  const onScroll = e => {
    scrollX.value = e.nativeEvent.contentOffset.x;
    const index = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    if (index !== activeIndex && index >= 0 && index < multimedia.length) {
      setActiveIndex(index);
    }
  };

  // Handle pagination dot press
  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToOffset({
      offset: index * SNAP_INTERVAL,
      animated: true,
    });
  };

  if (!multimedia || multimedia.length === 0) {
    return null;
  }

  return (
    <SafeAreaView>
      <FlatList
        ref={flatListRef}
        data={multimedia}
        horizontal
        style={styles.flatList}
        contentContainerStyle={{
          paddingHorizontal: M3_SPECS.SIDE_PADDING,
          gap: M3_SPECS.ITEM_GAP,
        }}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <ContentCarouselListItem
            uri={item.url !== undefined ? item.url : item}
            type={item.type !== undefined ? item.type : 'image'}
            scrollX={scrollX}
            index={index}
            dataLength={multimedia.length}
            images={multimedia}
            itemWidth={ITEM_WIDTH}
            cornerRadius={M3_SPECS.CORNER_RADIUS}
          />
        )}
      />
      {/* M3 Pagination Indicators */}
      {multimedia.length > 1 && (
        <View style={styles.paginationContainer}>
          {multimedia.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === activeIndex 
                    ? theme.colors.primary || '#6366f1' 
                    : theme.colors.detailText + '30',
                  width: index === activeIndex ? 24 : 8,
                  transform: [{ scale: index === activeIndex ? 1 : 0.9 }],
                }
              ]}
            />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatList: {
    marginVertical: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
});

export default ContentCarousel