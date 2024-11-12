import { useEffect } from 'react';
import { Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useMagicLinkListener = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      const token = getTokenFromUrl(url); // Extrae el token del URL
      
      if (token) {
        // Navegar a InitialConfiguration y pasar el token
        navigation.navigate('InitialConfiguration', { token });
      } else {
        Alert.alert('Error', 'Invalid or missing token');
      }
    };

    // Escucha el enlace inicial
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Escucha los enlaces entrantes cuando la app está abierta
    const unsubscribe = Linking.addEventListener('url', handleDeepLink);

    return () => unsubscribe.remove();
  }, [navigation]);
};

// Función auxiliar para obtener el token del URL
const getTokenFromUrl = (url) => {
  const params = new URLSearchParams(url.split('?')[1]);
  return params.get('token');
};

export default useMagicLinkListener;