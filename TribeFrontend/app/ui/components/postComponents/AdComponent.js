// Agregado por mrosariopresedo para la integración de los anuncios.
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Clipboard, Alert } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

const AdComponent = ({ ad }) => {
  const copyToClipboard = (url) => {
    Clipboard.setString(url);
    Alert.alert('Link copiado', 'El link del anuncio ha sido copiado al portapapeles.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <CustomTextNunito style={styles.username}>{ad.commerce}</CustomTextNunito>
      </View>
      {ad.image && <Image source={{ uri: ad.image }} style={styles.image} />}
      {ad.video && <Video source={{ uri: ad.video }} style={styles.video} />}
      <CustomTextNunito style={styles.description}>{ad.description}</CustomTextNunito>
      <TouchableOpacity onPress={() => copyToClipboard(ad.url)}>
        <CustomTextNunito style={styles.link}>Copiar link del anuncio</CustomTextNunito>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ccc',
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