// Agregado por mrosariopresedo para la integración de los anuncios.
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Clipboard, Alert, Linking, Dimensions } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { Copy } from 'assets/images';
import { useTheme } from 'context/ThemeContext';

import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';

const AdComponent = ({ ad }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const copyToClipboard = (url) => {
    Clipboard.setString(url);
    Alert.alert('Link copiado', 'El link del anuncio ha sido copiado al portapapeles.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => Linking.openURL(ad.Url)}>
        <View style={styles.postHeader}>
          <Image
            source={ad.imagePath[0].landscape ? { uri: ad.imagePath[0].landscape } : theme.UserCircleLight}
            style={{ width: 65, height: 65, borderRadius: 100 }}
            resizeMode="cover"
          />
          <View style={styles.header}>
            <CustomTextNunito style={styles.username}>{ad.commerce}</CustomTextNunito>
            <CustomTextNunito weight={'Bold'} style={{ color: theme.colors.ads }}>{I18n.t(TextKey.sponsored)}</CustomTextNunito>
          </View>
        </View>
        
        <CustomTextNunito style={styles.description}>{I18n.t(TextKey.redirectAdvertisement)}</CustomTextNunito>
        
        {ad.imagePath[0]?.landscape && <Image source={{ uri: ad.imagePath[0].landscape }} style={styles.image} resizeMode="cover" />}
      </TouchableOpacity>
      <TouchableOpacity style={{flexDirection: 'row', gap: 4, alignItems: 'center', marginTop: 10}} onPress={() => copyToClipboard(ad.url)}>
        <Image source={Copy} style={{ width: 24, height: 24, marginTop: -8 }} />
        <CustomTextNunito weight={'SemiBold'} style={{ color: theme.colors.ads, marginTop: -10}}>{I18n.t(TextKey.copyAdvertisement)}</CustomTextNunito>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 16,
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
  description: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.text,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    borderRadius: 8,
    marginVertical: 12,
  },
  description: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.text,
  },
  link: {
    color: 'blue',
    marginTop: 8,
  },
});

export default AdComponent;