import React, { useState } from 'react';
import { View, Image, StyleSheet, Modal, Pressable, Dimensions, StatusBar, Animated, PanResponder } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { FullAlt, TouchDouble, PinchZoom } from 'assets/images';
import { useTheme } from 'context/ThemeContext';
import { BlurView } from '@react-native-community/blur';
import Video from 'react-native-video-controls';
import I18n from 'assets/localization/i18n';

const { width, height } = Dimensions.get('window');

export default function FullSizeImage({ isModalVisible, uri, type = 'image', toggleModal }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [scale, setScale] = useState(1);
  const [lastScale, setLastScale] = useState(1);
  const scaleAnim = new Animated.Value(1);
  
  // Pan responder for pinch-to-zoom
  const [isPinching, setIsPinching] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);

  const getDistance = (touches) => {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.nativeEvent.touches.length === 2) {
      setIsPinching(true);
      setInitialDistance(getDistance(e.nativeEvent.touches));
    }
  };

  const handleTouchMove = (e) => {
    if (isPinching && e.nativeEvent.touches.length === 2) {
      const currentDistance = getDistance(e.nativeEvent.touches);
      const newScale = Math.max(1, Math.min(4, lastScale * (currentDistance / initialDistance)));
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    if (isPinching) {
      setLastScale(scale);
      setIsPinching(false);
      // Reset to 1 if scale is close to 1
      if (scale < 1.1) {
        setScale(1);
        setLastScale(1);
      }
    }
  };

  // Double tap to zoom
  const [lastTap, setLastTap] = useState(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // Double tap detected
      if (scale > 1) {
        setScale(1);
        setLastScale(1);
      } else {
        setScale(2);
        setLastScale(2);
      }
    }
    setLastTap(now);
  };

  const resetZoom = () => {
    setScale(1);
    setLastScale(1);
  };

  return (
    <Modal
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => { resetZoom(); toggleModal(); }}
      animationType="fade"
      statusBarTranslucent={true}
    >
      {/* Fondo oscuro semitransparente que siempre se mantiene */}
      <View style={styles.overlay}>
        {/* BlurView como capa adicional */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.9)"
        />

        {/* Contenido del modal */}
        <Pressable style={styles.modalContainer} onPress={() => { resetZoom(); toggleModal(); }}>
          <Pressable 
            style={styles.modalContent} 
            onPress={(e) => { e.stopPropagation(); handleDoubleTap(); }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {type === 'image' ? (
              <Animated.Image 
                source={{ uri }} 
                style={[styles.fullScreenMedia, { transform: [{ scale }] }]} 
                resizeMode="contain" 
              />
            ) : (
              <Video
                source={{ uri }}
                style={styles.fullScreenMedia}
                useNativeControls
                resizeMode="contain"
                disableFullscreen
                disableBack
              />
            )}
          </Pressable>

          {/* Zoom indicator */}
          {scale > 1 && (
            <View style={styles.zoomIndicator}>
              <CustomTextNunito weight="SemiBold" style={styles.zoomText}>
                {Math.round(scale * 100)}%
              </CustomTextNunito>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionRow}>
              <Image source={scale > 1 ? TouchDouble : PinchZoom} style={styles.instructionIcon} />
              <CustomTextNunito style={styles.instructionsText}>
                {scale > 1 
                  ? (I18n.locale?.startsWith('es') ? 'Doble tap para restablecer' : 'Double tap to reset')
                  : (I18n.locale?.startsWith('es') ? 'Doble tap o pellizca para zoom' : 'Double tap or pinch to zoom')}
              </CustomTextNunito>
            </View>
          </View>

          {/* Botón de cerrar */}
          <Pressable onPress={() => { resetZoom(); toggleModal(); }} style={styles.closeButton}>
            <View style={styles.closeButtonInner}>
              <Image source={FullAlt} style={styles.closeIcon} />
            </View>
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
}

const createStyles = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 0,
  },
  modalContent: {
    width: width * 0.95,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  fullScreenMedia: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  closeButtonInner: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 10,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  instructionIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFF',
    marginRight: 8,
  },
  instructionsText: {
    color: '#FFF',
    fontSize: 13,
    textAlign: 'center',
  },
  zoomIndicator: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  zoomText: {
    color: '#FFF',
    fontSize: 14,
  },
});
