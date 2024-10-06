import React from 'react';
import { View, Text, Button } from 'react-native';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import SliderComponent from 'ui/components/welcomeScreenComponents/SliderComponent';

export default function WelcomeScreen({ navigation }) {
    return (
        <SliderComponent/>
    );
}