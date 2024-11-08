import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from 'helper/permissionHandlers/LocationPermission';

const getLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (hasPermission) {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            (error) => {
                console.error('Error getting location:', error);
                reject(error);
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
            );
        });
    }
};

export { getLocation };