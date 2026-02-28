// CameraScreen.js - Modern camera component using react-native-vision-camera
// Allows capturing photos and videos in a unified interface
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from 'context/ThemeContext';
import I18n from 'assets/localization/i18n';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Camera mode constants
const MODES = {
  PHOTO: 'photo',
  VIDEO: 'video',
};

const CameraScreen = ({ visible, onClose, onCapture }) => {
  const { theme, isDarkMode } = useTheme();
  const camera = useRef(null);
  
  // Permissions
  const { hasPermission: hasCameraPermission, requestPermission: requestCameraPermission } = useCameraPermission();
  const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
  
  // State
  const [mode, setMode] = useState(MODES.PHOTO);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [isRecording, setIsRecording] = useState(false);
  const [flash, setFlash] = useState('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  // Animation values
  const modeIndicatorPosition = useSharedValue(0);
  const captureButtonScale = useSharedValue(1);
  const recordingProgress = useSharedValue(0);
  
  // Timer ref for recording
  const recordingTimer = useRef(null);
  
  // Get camera device
  const device = useCameraDevice(cameraPosition);
  
  // Request permissions on mount
  useEffect(() => {
    if (visible) {
      requestPermissions();
    }
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, [visible]);
  
  const requestPermissions = async () => {
    const cameraGranted = await requestCameraPermission();
    const micGranted = await requestMicPermission();
    
    if (!cameraGranted || !micGranted) {
      Alert.alert(
        I18n.locale?.startsWith('es') ? 'Permisos requeridos' : 'Permissions Required',
        I18n.locale?.startsWith('es') 
          ? 'Se necesitan permisos de cámara y micrófono para usar esta función'
          : 'Camera and microphone permissions are required to use this feature',
        [
          { text: 'OK', onPress: onClose }
        ]
      );
    }
  };
  
  // Mode switch animation
  const switchMode = (newMode) => {
    setMode(newMode);
    modeIndicatorPosition.value = withSpring(newMode === MODES.PHOTO ? 0 : 1, {
      damping: 15,
      stiffness: 150,
    });
  };
  
  // Animated styles
  const modeIndicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(modeIndicatorPosition.value, [0, 1], [0, 80]) }
    ],
  }));
  
  const captureButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureButtonScale.value }],
  }));
  
  // Toggle camera position
  const toggleCamera = () => {
    setCameraPosition(prev => prev === 'back' ? 'front' : 'back');
  };
  
  // Toggle flash
  const toggleFlash = () => {
    setFlash(prev => {
      switch (prev) {
        case 'off': return 'on';
        case 'on': return 'auto';
        default: return 'off';
      }
    });
  };
  
  // Capture photo
  const capturePhoto = async () => {
    if (!camera.current || isCapturing) return;
    
    try {
      setIsCapturing(true);
      captureButtonScale.value = withSpring(0.9, {}, () => {
        captureButtonScale.value = withSpring(1);
      });
      
      const photo = await camera.current.takePhoto({
        flash: flash,
        qualityPrioritization: 'balanced',
      });
      
      const asset = {
        uri: `file://${photo.path}`,
        type: 'image/jpeg',
        fileName: `photo_${Date.now()}.jpg`,
        width: photo.width,
        height: photo.height,
      };
      
      onCapture([asset]);
      onClose();
    } catch (error) {
      console.error('Photo capture error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsCapturing(false);
    }
  };
  
  // Start video recording
  const startRecording = async () => {
    if (!camera.current || isRecording) return;
    
    try {
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration timer
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Animate button
      captureButtonScale.value = withTiming(1.2, { duration: 300 });
      recordingProgress.value = withTiming(1, { duration: 300 });
      
      camera.current.startRecording({
        flash: flash,
        onRecordingFinished: (video) => {
          const asset = {
            uri: `file://${video.path}`,
            type: 'video/mp4',
            fileName: `video_${Date.now()}.mp4`,
            duration: video.duration,
          };
          
          onCapture([asset]);
          onClose();
        },
        onRecordingError: (error) => {
          console.error('Recording error:', error);
          Alert.alert('Error', error.message);
          setIsRecording(false);
        },
      });
    } catch (error) {
      console.error('Start recording error:', error);
      setIsRecording(false);
    }
  };
  
  // Stop video recording
  const stopRecording = async () => {
    if (!camera.current || !isRecording) return;
    
    try {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      
      captureButtonScale.value = withSpring(1);
      recordingProgress.value = withTiming(0, { duration: 200 });
      
      await camera.current.stopRecording();
      setIsRecording(false);
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };
  
  // Handle capture button press
  const handleCapturePress = () => {
    if (mode === MODES.PHOTO) {
      capturePhoto();
    } else {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };
  
  // Format recording duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Flash icon based on state
  const getFlashIcon = () => {
    switch (flash) {
      case 'on': return '⚡';
      case 'auto': return '⚡A';
      default: return '⚡✕';
    }
  };
  
  if (!visible) return null;
  
  if (!hasCameraPermission || !hasMicPermission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.permissionText}>
          {I18n.locale?.startsWith('es') 
            ? 'Solicitando permisos...' 
            : 'Requesting permissions...'}
        </Text>
      </View>
    );
  }
  
  if (!device) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          {I18n.locale?.startsWith('es') 
            ? 'Cámara no disponible' 
            : 'Camera not available'}
        </Text>
        <TouchableOpacity style={styles.closeButtonAlt} onPress={onClose}>
          <Text style={styles.closeButtonText}>
            {I18n.locale?.startsWith('es') ? 'Cerrar' : 'Close'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Camera Preview */}
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={visible}
        photo={mode === MODES.PHOTO}
        video={mode === MODES.VIDEO}
        audio={mode === MODES.VIDEO}
        enableZoomGesture
      />
      
      {/* Top Controls */}
      <SafeAreaView style={styles.topControls}>
        <TouchableOpacity style={styles.controlButton} onPress={onClose}>
          <Text style={styles.controlIcon}>✕</Text>
        </TouchableOpacity>
        
        <View style={styles.topRight}>
          {/* Recording indicator */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTime}>{formatDuration(recordingDuration)}</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Text style={styles.controlIcon}>{getFlashIcon()}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Bottom Controls */}
      <SafeAreaView style={styles.bottomControls}>
        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          <Animated.View style={[styles.modeIndicator, modeIndicatorStyle]} />
          <TouchableOpacity 
            style={styles.modeButton} 
            onPress={() => !isRecording && switchMode(MODES.PHOTO)}
          >
            <Text style={[
              styles.modeText, 
              mode === MODES.PHOTO && styles.modeTextActive
            ]}>
              {I18n.locale?.startsWith('es') ? 'Foto' : 'Photo'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modeButton} 
            onPress={() => !isRecording && switchMode(MODES.VIDEO)}
          >
            <Text style={[
              styles.modeText, 
              mode === MODES.VIDEO && styles.modeTextActive
            ]}>
              {I18n.locale?.startsWith('es') ? 'Video' : 'Video'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Capture Controls */}
        <View style={styles.captureControls}>
          {/* Spacer for centering */}
          <View style={styles.sideButton} />
          
          {/* Capture Button */}
          <TouchableOpacity 
            onPress={handleCapturePress} 
            activeOpacity={0.8}
            disabled={isCapturing}
          >
            <Animated.View style={[styles.captureButtonOuter, captureButtonAnimatedStyle]}>
              <View style={[
                styles.captureButtonInner,
                mode === MODES.VIDEO && styles.captureButtonVideo,
                isRecording && styles.captureButtonRecording,
              ]} />
            </Animated.View>
          </TouchableOpacity>
          
          {/* Toggle Camera Button */}
          <TouchableOpacity 
            style={styles.sideButton} 
            onPress={toggleCamera}
            disabled={isRecording}
          >
            <Text style={styles.toggleIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  permissionContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Nunito-Regular',
  },
  closeButtonAlt: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 8,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 20,
    color: '#fff',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
  recordingTime: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
  },
  modeIndicator: {
    position: 'absolute',
    width: 76,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    top: 4,
    left: 4,
  },
  modeButton: {
    width: 76,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
  },
  modeTextActive: {
    color: '#fff',
  },
  captureControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  sideButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 28,
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  captureButtonVideo: {
    backgroundColor: '#FF3B30',
  },
  captureButtonRecording: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
});

export default CameraScreen;
