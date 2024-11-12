import React, { createContext, useState, useContext } from 'react';
import { likePost, unlikePost, bookmarkPost, unbookmarkPost } from 'networking/api/postsApi';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  // State to manage the liked and bookmarked status of each post
  const [likedPosts, setLikedPosts] = useState(new Map());
  const [bookmarkStatus, setBookmarkStatus] = useState(new Map());
  const [likeCounts, setLikeCounts] = useState(new Map());

  // Function to handle toggling the like status for each post
  const handleFavoriteToggle = async (isLiked, likeCount, postId) => {
    const currentLikeStatus = likedPosts.get(postId) ?? isLiked;
    const currentLikeCount = likeCounts.get(postId) ?? likeCount;

    try {
      if (currentLikeStatus) {
        setLikedPosts(new Map(likedPosts.set(postId, false)));
        setLikeCounts(new Map(likeCounts.set(postId, currentLikeCount - 1)));
        await unlikePost(postId);
      } else {
        setLikedPosts(new Map(likedPosts.set(postId, true)));
        setLikeCounts(new Map(likeCounts.set(postId, currentLikeCount + 1)));
        await likePost(postId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Function to handle toggling the bookmark status for each post
  const handleBookmarkToggle = async (isBookmarked, postId) => {
    const currentBookmarkStatus = bookmarkStatus.get(postId) ?? isBookmarked;

    try {
      if (currentBookmarkStatus) {
        setBookmarkStatus(new Map(bookmarkStatus.set(postId, false)));
        await unbookmarkPost(postId);
      } else {
        setBookmarkStatus(new Map(bookmarkStatus.set(postId, true)));
        await bookmarkPost(postId);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        likedPosts,
        likeCounts,
        bookmarkStatus,
        handleFavoriteToggle,
        handleBookmarkToggle,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
