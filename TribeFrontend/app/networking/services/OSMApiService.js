import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Get the city name based on given latitude and longitude using Nominatim OSM API
 * @param {number} latitude - The latitude to reverse geocode
 * @param {number} longitude - The longitude to reverse geocode
 * @returns {Promise<string>} - The name of the city
 */
export async function getCityFromCoordinates (latitude, longitude) {
  try {
    // Throttle requests: 1 request per second
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await axios.get(NOMINATIM_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
      },
      headers: {
        'User-Agent': 'MyApp/1.0 (myemail@example.com)', // Use a placeholder for now
        'Referer': 'http://localhost', // Placeholder for local development
      }
    });
    console.log('OSM response:', response.data);
    
    if (response.data && response.data.address && response.data.address.city) {
      return response.data.address.city;
    } else {
      return 'City not found';
    }
  } catch (error) {
    console.error('Error fetching city from OSM:', error);
    return 'Error fetching city';
  }
};

