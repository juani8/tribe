// Agregado por mrosariopresedo para la integración de los anuncios.
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Clipboard, Alert } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';

const AdComponent = ({ ad }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const copyToClipboard = (url) => {
    Clipboard.setString(url);
    Alert.alert('Link copiado', 'El link del anuncio ha sido copiado al portapapeles.');
  };
  console.log('ad: ', ad);
  console.log('ad.imagePath: ', ad.imagePath);
  console.log('ad.imagePath[0]: ', ad.imagePath[0]);
  console.log('ad.imagePath.portraite: ', ad.imagePath.portraite);

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <CustomTextNunito style={styles.username}>{ad.commerce}</CustomTextNunito>
      </View>
      <CustomTextNunito weight={'Bold'} style={{ color: theme.colors.ads }}>Patrocinado</CustomTextNunito>
      {ad.imagePath[0]?.landscape && <Image source={{ uri: ad.imagePath[0].landscape }} style={styles.image} />}
      {ad.video && <Video source={{ uri: ad.video }} style={styles.video} />}
      <CustomTextNunito style={styles.description}>{ad.description}</CustomTextNunito>
      <TouchableOpacity onPress={() => copyToClipboard(ad.url)}>
        <CustomTextNunito weight={'SemiBold'} style={{ color: theme.colors.ads }}>Copiar link del anuncio</CustomTextNunito>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 16,
    margin: 10,
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  username: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
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