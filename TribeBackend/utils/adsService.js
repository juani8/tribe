const axios = require('axios');

// Ads estáticos de respaldo para demo
const STATIC_ADS = [
  {
    id: 1,
    commerce: 'TechStore',
    description: 'Las mejores ofertas en tecnología',
    imagePath: [{
      portraite: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=600&fit=crop',
      landscape: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop'
    }],
    Url: 'https://example.com/tech',
    date: { start: Date.now() / 1000, end: Date.now() / 1000 + 30 * 24 * 60 * 60 }
  },
  {
    id: 2,
    commerce: 'FashionHub',
    description: 'Moda para todos los estilos',
    imagePath: [{
      portraite: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop',
      landscape: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop'
    }],
    Url: 'https://example.com/fashion',
    date: { start: Date.now() / 1000, end: Date.now() / 1000 + 30 * 24 * 60 * 60 }
  },
  {
    id: 3,
    commerce: 'SportLife',
    description: 'Equipamiento deportivo de calidad',
    imagePath: [{
      portraite: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop',
      landscape: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop'
    }],
    Url: 'https://example.com/sport',
    date: { start: Date.now() / 1000, end: Date.now() / 1000 + 30 * 24 * 60 * 60 }
  },
  {
    id: 4,
    commerce: 'HomeDecor',
    description: 'Transforma tu hogar',
    imagePath: [{
      portraite: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop',
      landscape: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop'
    }],
    Url: 'https://example.com/home',
    date: { start: Date.now() / 1000, end: Date.now() / 1000 + 30 * 24 * 60 * 60 }
  },
  {
    id: 5,
    commerce: 'TravelDreams',
    description: 'Descubre nuevos destinos',
    imagePath: [{
      portraite: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=600&fit=crop',
      landscape: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop'
    }],
    Url: 'https://example.com/travel',
    date: { start: Date.now() / 1000, end: Date.now() / 1000 + 30 * 24 * 60 * 60 }
  }
];

let monthlyAds = [];
let lastUpdatedMonth = new Date().getMonth();

/**
 * Obtiene los anuncios mensuales.
 * Usa datos estáticos de respaldo para garantizar funcionamiento.
 * @returns {Promise<Object[]>} - Lista de anuncios.
 */
exports.getMonthlyAds = async () => {
  const currentMonth = new Date().getMonth();
  if (currentMonth !== lastUpdatedMonth || monthlyAds.length === 0) {
    // Usar ads estáticos para demo
    monthlyAds = STATIC_ADS;
    lastUpdatedMonth = currentMonth;
  }
  return monthlyAds;
};