import {SafeAreaView, FlatList} from 'react-native';
import React from 'react';

import ContentCarouselListItem from './ContentCarouselListItem';
import {useSharedValue} from 'react-native-reanimated';

const ContentCarousel = ({ multimedia }) => {
  const scrollX = useSharedValue(0);

  const onScroll = e => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  return (
    <SafeAreaView>
      <FlatList
        data={multimedia}
        horizontal
        style={{marginVertical: 16}}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={18}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <ContentCarouselListItem
            uri={item}
            scrollX={scrollX}
            index={index}
            dataLength={multimedia.length}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ContentCarousel