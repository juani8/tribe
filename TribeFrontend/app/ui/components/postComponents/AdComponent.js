// Componente de anuncios mejorado
import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Clipboard, Alert, Linking, Dimensions, ActivityIndicator } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { Copy } from 'assets/images';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';

const { width } = Dimensions.get('window');

// Colores de fondo para fallback según el comercio
const COMMERCE_COLORS = {
  'Mercado Libre': '#FFE600',
  'Amazon': '#FF9900',
  'eBay': '#E53238',
  'AliExpress': '#FF4747',
  'default': null, // Usará theme.colors.ads
};

const AdComponent = ({ ad }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageRetryCount, setImageRetryCount] = useState(0);

  const imageUrl = ad.imagePath?.[0]?.landscape;
  
  // Si la URL contiene dominios problemáticos, usar fallback directamente
  const isProblematicUrl = imageUrl && (
    imageUrl.includes('ibb.co') || 
    imageUrl.includes('imgbb.com') ||
    !imageUrl.startsWith('http')
  );

  // Resetear error si cambia la imagen
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
    setImageRetryCount(0);
  }, [imageUrl]);

  const copyToClipboard = (url) => {
    Clipboard.setString(url);
    Alert.alert(
      I18n.locale?.startsWith('es') ? 'Link copiado' : 'Link copied',
      I18n.locale?.startsWith('es') 
        ? 'El link del anuncio ha sido copiado al portapapeles.' 
        : 'The ad link has been copied to clipboard.'
    );
  };

  const handleImageError = (error) => {
    console.log(`[Ad] Error cargando imagen para ${ad.commerce}:`, error?.nativeEvent?.error || 'Unknown error');
    if (imageRetryCount < 1) {
      setImageRetryCount(prev => prev + 1);
      setImageLoading(true);
    } else {
      setImageError(true);
      setImageLoading(false);
    }
  };

  const shouldShowFallback = !imageUrl || imageError || isProblematicUrl;
  const commerceColor = COMMERCE_COLORS[ad.commerce] || COMMERCE_COLORS.default;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => Linking.openURL(ad.Url)}
        activeOpacity={0.9}
      >
        {/* Header con badge de patrocinado */}
        <View style={styles.postHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <CustomTextNunito weight="Bold" style={styles.avatarText}>
                {ad.commerce?.charAt(0)?.toUpperCase() || 'A'}
              </CustomTextNunito>
            </View>
          </View>
          <View style={styles.headerInfo}>
            <CustomTextNunito weight="SemiBold" style={styles.commerceName}>
              {ad.commerce}
            </CustomTextNunito>
            <View style={styles.sponsoredBadge}>
              <CustomTextNunito weight="Bold" style={styles.sponsoredText}>
                {I18n.t(TextKey.sponsored)}
              </CustomTextNunito>
            </View>
          </View>
        </View>
        
        {/* Descripción */}
        <CustomTextNunito style={styles.description}>
          {I18n.t(TextKey.redirectAdvertisement)}
        </CustomTextNunito>
        
        {/* Imagen del anuncio */}
        {!shouldShowFallback ? (
          <View style={styles.imageContainer}>
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={theme.colors.ads} />
              </View>
            )}
            <Image 
              source={{ uri: imageUrl, cache: 'reload' }} 
              style={styles.image} 
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={handleImageError}
            />
            <View style={styles.adOverlay}>
              <CustomTextNunito weight="Bold" style={styles.ctaText}>
                {I18n.locale?.startsWith('es') ? 'Ver más' : 'Learn more'}
              </CustomTextNunito>
            </View>
          </View>
        ) : (
          <View style={[
            styles.fallbackContainer, 
            commerceColor && { backgroundColor: commerceColor + '20' }
          ]}>
            <View style={[
              styles.fallbackIconCircle,
              commerceColor && { backgroundColor: commerceColor }
            ]}>
              <CustomTextNunito weight="Bold" style={styles.fallbackIconText}>
                {ad.commerce?.charAt(0)?.toUpperCase() || '🛒'}
              </CustomTextNunito>
            </View>
            <CustomTextNunito weight="Bold" style={[
              styles.fallbackText,
              commerceColor && { color: commerceColor }
            ]}>
              {ad.commerce}
            </CustomTextNunito>
            <View style={styles.fallbackCta}>
              <CustomTextNunito weight="SemiBold" style={styles.fallbackCtaText}>
                {I18n.locale?.startsWith('es') ? '👆 Toca para visitar' : '👆 Tap to visit'}
              </CustomTextNunito>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Botón copiar link */}
      <TouchableOpacity 
        style={styles.copyButton}
        onPress={() => copyToClipboard(ad.url)}
        activeOpacity={0.7}
      >
        <Image source={Copy} style={styles.copyIcon} />
        <CustomTextNunito weight="SemiBold" style={styles.copyText}>
          {I18n.t(TextKey.copyAdvertisement)}
        </CustomTextNunito>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.ads + '30',
    shadowColor: theme.colors.ads,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.ads,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.ads,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  commerceName: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  sponsoredBadge: {
    backgroundColor: theme.colors.ads + '20',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  sponsoredText: {
    fontSize: 11,
    color: theme.colors.ads,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: theme.colors.detailText,
    lineHeight: 20,
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.card || theme.colors.surface,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  adOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFF',
    fontSize: 14,
  },
  fallbackContainer: {
    height: 200,
    borderRadius: 12,
    backgroundColor: theme.colors.ads + '15',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  fallbackIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.ads,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  fallbackIconText: {
    color: '#FFF',
    fontSize: 28,
  },
  fallbackText: {
    fontSize: 22,
    color: theme.colors.ads,
    marginBottom: 8,
  },
  fallbackCta: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  fallbackCtaText: {
    fontSize: 13,
    color: theme.colors.text,
    opacity: 0.8,
  },
  fallbackSubtext: {
    fontSize: 14,
    color: theme.colors.ads,
    opacity: 0.8,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.ads + '10',
  },
  copyIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: theme.colors.ads,
  },
  copyText: {
    color: theme.colors.ads,
    fontSize: 14,
  },
});

export default AdComponent;