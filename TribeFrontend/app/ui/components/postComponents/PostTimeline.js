import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ContentCarousel from './ContentCarousel';
import { formatDistanceToNow } from 'date-fns'; // Optional: Helps to format the timestamp.
import { useTheme } from 'context/ThemeContext';
import { Favorite, FavoriteFill, Bookmark, BookmarkFill, Chat, PinAltFill } from '../../../assets/images';
import { NavigateToSpecificPost } from 'helper/navigationHandlers/CoreNavigationHandlers';
import { useNavigation } from '@react-navigation/native';
import { getCityFromCoordinates } from 'networking/services/OSMApiService';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomHighlightedTextNunito from 'ui/components/generalPurposeComponents/CustomHighlightedTextNunito';

const PostTimeline = ({ post }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  
  // State to hold city name
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    // Fetch city name based on post location coordinates
    const fetchCityName = async () => {
      if (post.location?.latitude && post.location?.longitude) {
        const city = await getCityFromCoordinates(post.location.latitude, post.location.longitude);
        setCityName(city);
      }
    };
    
    fetchCityName();
  }, [post.location]);

  return (
    <View style={styles.container}>
      {/* User info */}
      <View style={styles.postHeader}>
        <Image
          source={{ uri: post.userProfilePicture }}
          style={{ width: 65, height: 65, borderRadius: 100 }}
          resizeMode="stretch"
        />
        <View style={styles.header}>
          <CustomTextNunito style={styles.username}>{post.userId}</CustomTextNunito>
          <CustomTextNunito style={styles.timeAgo}>
            {formatDistanceToNow(new Date(post.createdAt * 1000))} ago
          </CustomTextNunito>
        </View>
      </View>

      <TouchableOpacity onPress={() => NavigateToSpecificPost(navigation, post.postId)}>
        {/* Post description */}
        <CustomTextNunito style={styles.description}>{post.description}</CustomTextNunito>
        <View>
          <CustomHighlightedTextNunito weight='BoldItalic'>{I18n.t(TextKey.timelineSeePostDetail)}</CustomHighlightedTextNunito>
        </View>
      </TouchableOpacity>

      {/* Post multimedia */}
      <ContentCarousel multimedia={post.multimedia} />

      {/* Post metadata */}
      <View style={styles.metadata}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}> 
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={post.isLiked ? FavoriteFill : Favorite} style={{ width: 24, height: 24 }} />
            <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>{post.likes}</CustomTextNunito>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 }} onPress={() => NavigateToSpecificPost(navigation, post.postId)}>
            <Image source={Chat} style={{ width: 24, height: 24 }} />
            <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>{post.numberOfComments}</CustomTextNunito>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
            <Image source={post.isBookmarked ? BookmarkFill : Bookmark} style={{ width: 24, height: 24 }} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={PinAltFill} style={{ width: 24, height: 24 }} />
          <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>{cityName}</CustomTextNunito>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  header: {
    flexDirection: 'column',
    marginLeft: 16,
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    color: theme.colors.text,
  },
  timeAgo: {
    fontSize: 12,
    color: theme.colors.detailText,
  },
  description: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.text,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 14,
  },
  textOfMetadata: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginLeft: 4,
  },
});

export default PostTimeline;
