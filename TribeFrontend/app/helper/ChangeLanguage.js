import React, { useState } from 'react';
import { Button } from 'react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const ChangeLanguage = () => {
    const [language, setLanguage] = useState(I18n.locale);

    const changeLanguage = () => {
        const newLanguage = language === 'en' ? 'es' : 'en';
        I18n.locale = newLanguage;
        setLanguage(newLanguage);
    };

    return (
        <Button title={I18n.t(TextKey.changeLanguage)} onPress={changeLanguage} />
    );
};

export default ChangeLanguage;
