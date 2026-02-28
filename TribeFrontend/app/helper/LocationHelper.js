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

// Reverse geocode coordinates to get a human-readable address
const reverseGeocode = async (latitude, longitude) => {
    try {
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'TribeApp/1.0',
                    'Accept-Language': 'es,en',
                },
            }
        );
        
        if (!response.ok) {
            throw new Error('Geocoding failed');
        }
        
        const data = await response.json();
        
        if (data && data.address) {
            const { road, neighbourhood, suburb, city, town, village, state, country } = data.address;
            
            // Build a readable address
            const parts = [];
            if (road) parts.push(road);
            if (neighbourhood || suburb) parts.push(neighbourhood || suburb);
            if (city || town || village) parts.push(city || town || village);
            if (state) parts.push(state);
            
            if (parts.length > 0) {
                return parts.slice(0, 3).join(', '); // Return max 3 parts
            }
            
            return data.display_name?.split(',').slice(0, 3).join(',') || null;
        }
        
        return null;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
};

export { getLocation, reverseGeocode };