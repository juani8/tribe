const axios = require('axios');

export const getCityFromCoordinates = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await axios.get(url);
    const address = response.data.address;

    if (address) {
      const city = address.city || address.town || address.village;
      return city;
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching city:', error);
    return null;
  }
};
