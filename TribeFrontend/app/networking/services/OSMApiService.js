/**
 * La API de Nominatim de OpenStreetMap (OSM) realiza geocodificación y geocodificación inversa. Permite obtener información de 
 * ubicación (como el nombre de la ciudad, dirección, país, etc.) a partir de coordenadas de latitud y longitud.
 * Tiene limitaciones en cuanto al número de solicitudes por segundo.
 */

import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Obtiene el nombre de la ciudad basado en la latitud y longitud proporcionadas utilizando la API de Nominatim OSM
 * @param {number} latitude - La latitud para hacer la geocodificación inversa
 * @param {number} longitude - La longitud para hacer la geocodificación inversa
 * @returns {Promise<string>} - El nombre de la ciudad
 */
export async function getCityFromCoordinates (latitude, longitude) {
  try {
    // Limitar las solicitudes: 1 solicitud por segundo
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await axios.get(NOMINATIM_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
      },
      headers: {
        'User-Agent': 'MyApp/1.0 (myemail@example.com)', // Usar un marcador de posición por ahora
        'Referer': 'http://localhost', // Marcador de posición para desarrollo local
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

