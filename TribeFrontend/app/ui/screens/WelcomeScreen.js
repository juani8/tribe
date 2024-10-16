import { StyleSheet, Text, View, ScrollView, SafeAreaView, Dimensions, Image } from 'react-native';
import React, { useState } from 'react';
import LottieView from 'lottie-react-native';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import { useTheme } from 'context/ThemeContext';

import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomHighlightedTextNunito from 'ui/components/generalPurposeComponents/CustomHighlightedTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';

import { NavigateToLogin, NavigateToSignup }  from 'helper/navigationHandlers/AuthNavigationHandlers';
import { NavigateToHome }  from 'helper/navigationHandlers/CoreNavigationHandlers';

const WelcomeScreen = ({ navigation }) => {
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const { width } = Dimensions.get('window');
  const { theme } = useTheme();
  const totalPages = 4; // Total number of pages in the slider

  const styles = createStyles(theme);

  const setSliderPage = (event) => {
    const { x } = event.nativeEvent.contentOffset;
    // Use Math.round to avoid issues when moving between pages
    const indexOfNextScreen = Math.round(x / width);
    if (indexOfNextScreen !== sliderState.currentPage) {
      setSliderState({ currentPage: indexOfNextScreen });
    }
  };

  const { currentPage: pageIndex } = sliderState;

  return (
    <>
      <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
        <ScrollView
          style={{ flex: 1 }}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={setSliderPage}
        >
          <View style={{ width }}>
            <Logo theme={theme} />
            <FirstPart styles={styles} theme={theme} />
          </View>
          <View style={{ width }}>
            <Logo theme={theme} />
            <SecondPart styles={styles} theme={theme} />
          </View>
          <View style={{ width }}>
            <Logo theme={theme} />
            <ThirdPart styles={styles} theme={theme} />
          </View>
          <View style={{ width }}>
            <Logo theme={theme} />
            <FourthPart styles={styles} theme={theme} navigation={navigation} />
          </View>
        </ScrollView>
        <View style={{marginBottom:20}}>
          <View style={styles.paginationWrapper}>
            {Array.from(Array(totalPages).keys()).map((_, index) => (
              <View
                style={[styles.paginationDots, { opacity: pageIndex === index ? 1 : 0.2 }]}
                key={index}
              />
            ))}
          </View>
          {pageIndex !== totalPages - 1 && (
            <LottieView
              source={require('assets/lottie/swipeLeftLottie.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200, marginLeft: 62 }}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const Logo = ({ theme }) => {
  return (
    <Image
      source={theme.logo}
      style={{ width: 265, height: 200, alignSelf: 'center', marginTop: 50 }}
      resizeMode="contain"
    />
  );
};

const FirstPart = ({ styles, theme }) => {
  return (
    <View style={styles.wrapper}>
      <View style={{height: 100}}>
        <CustomTextNunito weight={'SemiBold'} style={styles.title}>
          {I18n.t(TextKey.welcomeTitleFirstPage.part1)}
          <Text style={styles.coloredWord}>{I18n.t(TextKey.welcomeTitleFirstPage.part2)}</Text>
          {I18n.t(TextKey.welcomeTitleFirstPage.part3)}
        </CustomTextNunito>
      </View>
      <View style={{height: 100}}>
        <CustomTextNunito style={styles.paragraph}>
          {I18n.t(TextKey.welcomeDescriptionFirstPage)}
        </CustomTextNunito>
      </View>
    </View>
  );
};

const SecondPart = ({ styles, theme }) => {
  return (
    <View style={styles.wrapper}>
      <View style={{height: 100}}>
        <CustomTextNunito weight={'SemiBold'} style={styles.title}>
          {I18n.t(TextKey.welcomeTitleSecondPage.part1)}
          <Text style={styles.coloredWord}>{I18n.t(TextKey.welcomeTitleSecondPage.part2)}</Text>
        </CustomTextNunito>
      </View>
      <View style={{height: 100}}>
        <CustomTextNunito style={styles.paragraph}>
          {I18n.t(TextKey.welcomeDescriptionSecondPage)}
        </CustomTextNunito>
      </View>
    </View>
  );
};

const ThirdPart = ({ styles, theme }) => {
  return (
    <View style={styles.wrapper}>
      <View style={{height: 100}}>
        <CustomTextNunito weight={'SemiBold'} style={styles.title}>
          {I18n.t(TextKey.welcomeTitleThirdPage.part1)}
          <Text style={styles.coloredWord}>{I18n.t(TextKey.welcomeTitleThirdPage.part2)}</Text>
        </CustomTextNunito>
      </View>
      <View style={{height: 100}}>
        <CustomTextNunito style={styles.paragraph}>
          {I18n.t(TextKey.welcomeDescriptionThirdPage.part1)}
          <Text style={styles.coloredWord}>{I18n.t(TextKey.welcomeDescriptionThirdPage.part2)}</Text>
          {I18n.t(TextKey.welcomeDescriptionThirdPage.part3)}
        </CustomTextNunito>
      </View>
    </View>
  );
};

const FourthPart = ({ styles, theme, navigation }) => {
  return (
    <View style={styles.wrapper}>
      <View style={{height: 100}}>
        <CustomTextNunito weight={'SemiBold'} style={styles.title}>
          <Text style={styles.coloredWord}>{I18n.t(TextKey.welcomeTitleFourthPage.part1)}</Text>
          {I18n.t(TextKey.welcomeTitleFourthPage.part2)}
        </CustomTextNunito>
      </View>
      <View style={{height: 100, alignItems: 'center', justifyContent: 'center', gap: 12}}>
        <CustomButton title={I18n.t(TextKey.welcomeGotoSignup)} onPress={() => NavigateToSignup(navigation)}/>
        <CustomHighlightedTextNunito style={{ textAlign: 'center' }} onPress={() => NavigateToLogin(navigation)}>{I18n.t(TextKey.welcomeGotoLogin)}</CustomHighlightedTextNunito>
        <CustomHighlightedTextNunito style={{ textAlign: 'center' }} onPress={() => NavigateToHome(navigation)}>Home (atajo)</CustomHighlightedTextNunito>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 60,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: theme.colors.text,
  },
  paragraph: {
    fontSize: 17,
    textAlign: 'center',
    color: theme.colors.text,
    bottom: 0,
  },
  coloredWord: {
    color: theme.colors.primary,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: -10,
  },
  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginLeft: 10,
  },
});

export default WelcomeScreen;