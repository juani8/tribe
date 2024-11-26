const axios = require('axios');

const BASE_URL_ADS = 'https://my-json-server.typicode.com/chrismazzeo/advertising_da1/ads';
const MERCADO_LIBRE_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLA/search?q=zapatillas&limit=10&offset=1';

let monthlyAds = [];
let lastUpdatedMonth = new Date().getMonth();

/**
 * Obtiene los anuncios desde la API externa.
 * @returns {Promise<Object[]>} - Devuelve una promesa que resuelve con una lista de anuncios.
 * @throws {Error} - Lanza un error si la solicitud a la API falla.
 */
const fetchAds = async () => {
    try {
      const response = await axios.get(BASE_URL_ADS);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los anuncios:', error);
      throw error;
    }
};

/**
 * Obtiene un anuncio adicional desde la búsqueda de Mercado Libre.
 * @returns {Promise<Object>} - Devuelve una promesa que resuelve con un anuncio.
 * @throws {Error} - Lanza un error si la solicitud a la API falla.
 */
const fetchAdditionalAd = async () => {
    try {
      const response = await axios.get(MERCADO_LIBRE_SEARCH_URL);
      const items = response.data.results;

      if (items.length > 0) {
        const item = items[0]; // Selecciona el primer producto de la búsqueda
        
        return {
          commerce: 'Mercado Libre',
          date: {
            start: Math.floor(Date.now() / 1000), // Fecha de inicio actual
            end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // Fecha de fin en 30 días
          },
          imagePath: [
            {
              portraite: item.thumbnail,
              landscape: item.thumbnail
            }
          ],
          Url: item.permalink
        };
      } else {
        throw new Error('No se encontraron productos en la búsqueda de Mercado Libre');
      }
    } catch (error) {
      console.error('Error al obtener el anuncio adicional:', error);
      throw error;
    }
};

/**
 * Selecciona 5 anuncios diferentes cada mes.
 * @returns {Promise<Object[]>} - Devuelve una promesa que resuelve con una lista de 5 anuncios.
 */
exports.getMonthlyAds = async () => {
  const currentMonth = new Date().getMonth();
  if (currentMonth !== lastUpdatedMonth || monthlyAds.length === 0) {
    const ads = await fetchAds();
    monthlyAds = ads.slice(0, 5); // Selecciona los primeros 5 anuncios
    lastUpdatedMonth = currentMonth;

    // Si hay menos de 5 anuncios, obtener un anuncio adicional
    if (monthlyAds.length < 5) {
      const additionalAd = await fetchAdditionalAd();
      monthlyAds.push(additionalAd);
    }
  }
  return monthlyAds;
};