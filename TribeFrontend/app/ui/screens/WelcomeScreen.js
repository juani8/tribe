import { StyleSheet, Text, View, ScrollView, SafeAreaView, Dimensions, Image } from 'react-native';
import React, { useState, useRef } from 'react';
import LottieView from 'lottie-react-native';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import { useTheme } from 'context/ThemeContext';

import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';

import { navigateToLogin, navigateToSignup } from 'helper/navigationHandlers/AuthNavigationHandlers';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { theme } = useTheme();
  const scrollRef = useRef(null);
  const totalPages = 4;

  const styles = createStyles(theme);

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(x / width);
    if (pageIndex !== currentPage) {
      setCurrentPage(pageIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Content Slider */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {/* Page 1 */}
        <View style={styles.page}>
          <View style={styles.logoContainer}>
            <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.contentContainer}>
            <CustomTextNunito weight="Bold" style={styles.title}>
              {I18n.t(TextKey.welcomeTitleFirstPage.part1)}
              <Text style={styles.coloredText}>{I18n.t(TextKey.welcomeTitleFirstPage.part2)}</Text>
              {I18n.t(TextKey.welcomeTitleFirstPage.part3)}
            </CustomTextNunito>
            <CustomTextNunito style={styles.description}>
              {I18n.t(TextKey.welcomeDescriptionFirstPage)}
            </CustomTextNunito>
          </View>
        </View>

        {/* Page 2 */}
        <View style={styles.page}>
          <View style={styles.logoContainer}>
            <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.contentContainer}>
            <CustomTextNunito weight="Bold" style={styles.title}>
              {I18n.t(TextKey.welcomeTitleSecondPage.part1)}
              <Text style={styles.coloredText}>{I18n.t(TextKey.welcomeTitleSecondPage.part2)}</Text>
            </CustomTextNunito>
            <CustomTextNunito style={styles.description}>
              {I18n.t(TextKey.welcomeDescriptionSecondPage)}
            </CustomTextNunito>
          </View>
        </View>

        {/* Page 3 */}
        <View style={styles.page}>
          <View style={styles.logoContainer}>
            <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.contentContainer}>
            <CustomTextNunito weight="Bold" style={styles.title}>
              {I18n.t(TextKey.welcomeTitleThirdPage.part1)}
              <Text style={styles.coloredText}>{I18n.t(TextKey.welcomeTitleThirdPage.part2)}</Text>
            </CustomTextNunito>
            <CustomTextNunito style={styles.description}>
              {I18n.t(TextKey.welcomeDescriptionThirdPage.part1)}
              <Text style={styles.coloredText}>{I18n.t(TextKey.welcomeDescriptionThirdPage.part2)}</Text>
              {I18n.t(TextKey.welcomeDescriptionThirdPage.part3)}
            </CustomTextNunito>
          </View>
        </View>

        {/* Page 4 - Final */}
        <View style={styles.page}>
          <View style={styles.logoContainer}>
            <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.contentContainer}>
            <CustomTextNunito weight="Bold" style={styles.title}>
              <Text style={styles.coloredText}>{I18n.t(TextKey.welcomeTitleFourthPage.part1)}</Text>
              {I18n.t(TextKey.welcomeTitleFourthPage.part2)}
            </CustomTextNunito>
            <View style={styles.buttonsContainer}>
              <CustomButton
                title={I18n.t(TextKey.welcomeGotoSignup)}
                onPress={() => navigateToSignup(navigation)}
                fullSize
              />
              <CustomButton
                title={I18n.t(TextKey.welcomeGotoLogin)}
                onPress={() => navigateToLogin(navigation)}
                variant="outline"
                fullSize
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Swipe Animation - only show if not on last page */}
        {currentPage !== totalPages - 1 ? (
          <View style={styles.swipeHintContainer}>
            <LottieView
              source={require('assets/lottie/swipeLeftLottie.json')}
              autoPlay
              loop
              style={styles.swipeAnimation}
            />
            <CustomTextNunito style={styles.swipeText}>
              {I18n.locale?.startsWith('es') ? 'Desliza para continuar' : 'Swipe to continue'}
            </CustomTextNunito>
          </View>
        ) : (
          <View style={styles.swipeHintPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  logo: {
    width: 220,
    height: 160,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  coloredText: {
    color: theme.colors.primary,
  },
  description: {
    fontSize: 16,
    color: theme.colors.detailText,
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonsContainer: {
    marginTop: 30,
    gap: 14,
  },
  bottomSection: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    width: 28,
  },
  dotInactive: {
    backgroundColor: theme.colors.primary,
    opacity: 0.25,
    width: 10,
  },
  swipeHintContainer: {
    alignItems: 'center',
    height: 140,
  },
  swipeHintPlaceholder: {
    height: 140,
  },
  swipeAnimation: {
    width: 130,
    height: 130,
  },
  swipeText: {
    fontSize: 14,
    color: theme.colors.detailText,
    marginTop: -25,
  },
});

export default WelcomeScreen;