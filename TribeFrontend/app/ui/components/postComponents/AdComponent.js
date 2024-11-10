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

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <Image
          source={ad.imagePath[0].landscape ? { uri: ad.imagePath[0].landscape } : theme.UserCircleLight}
          style={{ width: 65, height: 65, borderRadius: 100 }}
          resizeMode="stretch"
        />
        <View style={styles.header}>
          <CustomTextNunito style={styles.username}>{ad.commerce}</CustomTextNunito>
        </View>
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