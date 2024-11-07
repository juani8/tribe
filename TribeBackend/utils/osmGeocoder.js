/**
 * La API de Nominatim de OpenStreetMap (OSM) realiza geocodificación y geocodificación inversa. Permite obtener información de 
 * ubicación (como el nombre de la ciudad, dirección, país, etc.) a partir de coordenadas de latitud y longitud.
 * 
 * Tiene limitaciones en cuanto al número de solicitudes por segundo.
 * 
 * Documentación oficial: 
 *  https://operations.osmfoundation.org/policies/nominatim/
 *  https://nominatim.org/release-docs/latest/api/Search/
 */
require("dotenv").config();
const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'https://nominatim.openstreetmap.org',
    headers: {
      'User-Agent': 'MyApp/1.0 (myemail@example.com)',
      'Referer': process.env.HOST || 'http://localhost',
    },
    timeout: 5000, // Tiempo de espera de 5 segundos
});

/**
 * Valida las coordenadas proporcionadas.
 * @param {number} latitude - La latitud para validar.
 * @param {number} longitude - La longitud para validar.
 * @returns {boolean} - True si las coordenadas son válidas, false en caso contrario.
 */
function validateCoordinates(latitude, longitude) {
    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
}

/**
 * Obtiene el nombre de la ciudad basado en la latitud y longitud proporcionadas utilizando la API de Nominatim OSM.
 * @param {number} latitude - La latitud para hacer la geocodificación inversa.
 * @param {number} longitude - La longitud para hacer la geocodificación inversa.
 * @returns {Promise<string>} - El nombre de la ciudad.
 */
async function getCityFromCoordinates(latitude, longitude) {
    if (!validateCoordinates(latitude, longitude)) {
      throw new Error('Coordenadas inválidas');
    }
  
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await axiosInstance.get('/reverse', {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
        },
      });
  
      console.log('Respuesta OSM:', response.data);
  
      if (response.data && response.data.address && response.data.address.city) {
        return response.data.address.city;
      } else {
        console.warn('Ciudad no encontrada para las coordenadas:', latitude, longitude);
        return 'Ciudad desconocida'; // Fallback value
      }
    } catch (error) {
        console.error('Error al obtener la ciudad desde OSM:', error);
        
        if (error.response) {
            // El servidor respondió con un estado fuera del rango 2xx
            throw new Error(`Error en el servidor OSM: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            throw new Error('No se recibió respuesta del servidor OSM');
        } else {
            // Algo pasó al configurar la solicitud
            throw new Error(`Error al configurar la solicitud: ${error.message}`);
        }
    }
}


module.exports = {
    getCityFromCoordinates,
};