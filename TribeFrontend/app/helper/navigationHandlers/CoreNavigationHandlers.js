let lastTapTime = 0;

export const navigateToHome = (navigation, flatListRef) => {
  const currentTab = navigation.getState().routes[navigation.getState().index].state?.routes[navigation.getState().routes[navigation.getState().index].state.index].name;
  const currentTime = Date.now();
  const DOUBLE_TAP_DELAY = 300; 

  if (currentTab === 'Home') {
    if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
      // Double-tap detected
      navigation.navigate('Home', { refresh: true });
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      // Trigger pull-to-refresh by setting the refreshing state to true
      flatListRef.current?.props.refreshControl.props.onRefresh();
    } else {
      // Single-tap detected
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }
  } else {
    navigation.navigate('Home');
  }

  lastTapTime = currentTime;
};

export const navigateToHomeRefresh = (navigation) => {
  navigation.navigate('Home', { refresh: true });
}

export const navigateToSearch = (navigation) => {
  navigation.navigate('Search');
}

export const navigateToUpload = (navigation) => {
  navigation.navigate('Upload');
} 

export const navigateToNotifications = (navigation) => {
  navigation.navigate('Notifications');
} 

export const navigateToUserProfile = (navigation) => {
  navigation.navigate('UserProfile');
} 

export const navigateToWelcome = (navigation) => {
  navigation.navigate('Welcome');
} 

export const navigateToSpecificPost = (navigation, post) => {
  navigation.navigate('PostDetail', { post });
};