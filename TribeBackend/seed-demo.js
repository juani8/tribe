/**
 * Tribe Demo Seed Script - Enhanced Version
 * Creates comprehensive sample data for portfolio demonstration
 * Includes: users, posts, comments, likes, bookmarks, and activity
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to MongoDB
const uri = process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/tribe_demo';

// ============== SCHEMAS ==============

const userSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    nickName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: String,
    isGoogleUser: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    profileImage: String,
    coverImage: String,
    description: String,
    gender: String,
    gamificationLevel: { type: Object, default: { level: 1, description: 'usuario nuevo' } },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: String,
    multimedia: [{
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true }
    }],
    location: {
        latitude: Number,
        longitude: Number,
        city: String
    },
    likes: { type: Number, default: 0 }
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    comment: { type: String, required: true }
}, { timestamps: true });

const LikeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
}, { timestamps: true });

const BookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const Like = mongoose.model('Like', LikeSchema);
const Bookmark = mongoose.model('Bookmark', BookmarkSchema);

// ============== DEMO DATA ==============

// High quality placeholder images
const DEMO_IMAGES = {
    profiles: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    ],
    covers: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=300&fit=crop',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=300&fit=crop',
        'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=300&fit=crop',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=300&fit=crop',
    ],
    posts: {
        nature: [
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop',
        ],
        travel: [
            'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
        ],
        food: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=400&fit=crop',
        ],
        city: [
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=400&fit=crop',
        ],
        lifestyle: [
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=400&fit=crop',
        ],
        art: [
            'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1501366062246-723b4d3e4eb6?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop',
        ],
    },
    videos: [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    ]
};

// Demo users with detailed profiles
const demoUsers = [
    {
        name: 'Demo',
        lastName: 'User',
        nickName: 'demo_user',
        email: 'demo@tribe.local',
        password: 'Demo123!',
        description: '🌟 Explorando el mundo, una foto a la vez | Amante de la naturaleza y los viajes | 📍 Madrid',
        gender: 'prefiero no decir',
        gamificationLevel: { level: 5, description: 'explorador activo', points: 2450 }
    },
    {
        name: 'María',
        lastName: 'García',
        nickName: 'maria_viajera',
        email: 'maria@tribe.local',
        password: 'Maria123!',
        description: '✈️ Nómada digital | 30 países visitados | Compartiendo aventuras desde cualquier rincón 🌍',
        gender: 'femenino',
        gamificationLevel: { level: 8, description: 'viajero experto', points: 5200 }
    },
    {
        name: 'Carlos',
        lastName: 'López',
        nickName: 'carlos_foto',
        email: 'carlos@tribe.local',
        password: 'Carlos123!',
        description: '📸 Fotógrafo de naturaleza | Capturando momentos únicos | Canon EOS R5',
        gender: 'masculino',
        gamificationLevel: { level: 6, description: 'artista visual', points: 3100 }
    },
    {
        name: 'Ana',
        lastName: 'Martínez',
        nickName: 'ana_foodie',
        email: 'ana@tribe.local',
        password: 'Ana123!',
        description: '🍕 Food blogger | Crítica gastronómica | Descubriendo sabores del mundo',
        gender: 'femenino',
        gamificationLevel: { level: 4, description: 'gourmet', points: 1800 }
    },
    {
        name: 'Pedro',
        lastName: 'Sánchez',
        nickName: 'pedro_adventure',
        email: 'pedro@tribe.local',
        password: 'Pedro123!',
        description: '🏔️ Amante del senderismo | Escalador | La montaña es mi templo 🧗',
        gender: 'masculino',
        gamificationLevel: { level: 7, description: 'aventurero', points: 4100 }
    },
    {
        name: 'Lucía',
        lastName: 'Fernández',
        nickName: 'lucia_art',
        email: 'lucia@tribe.local',
        password: 'Lucia123!',
        description: '🎨 Artista digital | Ilustradora | El arte es mi forma de expresión',
        gender: 'femenino',
        gamificationLevel: { level: 5, description: 'creativo', points: 2700 }
    },
    {
        name: 'Diego',
        lastName: 'Torres',
        nickName: 'diego_urban',
        email: 'diego@tribe.local',
        password: 'Diego123!',
        description: '🏙️ Fotografía urbana | Street photography | Las ciudades cuentan historias',
        gender: 'masculino',
        gamificationLevel: { level: 6, description: 'explorador urbano', points: 3400 }
    },
    {
        name: 'Sofia',
        lastName: 'Ruiz',
        nickName: 'sofia_lifestyle',
        email: 'sofia@tribe.local',
        password: 'Sofia123!',
        description: '✨ Lifestyle & wellness | Yoga instructor | Viviendo en equilibrio 🧘‍♀️',
        gender: 'femenino',
        gamificationLevel: { level: 4, description: 'influencer', points: 1950 }
    }
];

// Comprehensive post templates
const postTemplates = [
    { category: 'nature', descriptions: [
        '¡Qué vista increíble desde aquí! 🏔️ La naturaleza nunca deja de sorprenderme #naturaleza #aventura #hiking',
        'Amanecer en la montaña 🌅 Madrugar valió totalmente la pena #sunrise #nature #photography',
        'Descubriendo cascadas escondidas 💧 La recompensa después de 3 horas de caminata #waterfall #explore',
        'El bosque tiene una magia especial 🌲 Desconectando para reconectar #forest #peace #mindfulness',
        'Lagos de montaña que parecen espejos 💎 La naturaleza es la mejor artista #lake #mountains #reflection',
    ]},
    { category: 'travel', descriptions: [
        'Explorando nuevos horizontes 🌍 Cada viaje es una nueva historia por contar #travel #wanderlust',
        'Perdiéndome por calles desconocidas 🚶 Las mejores aventuras no se planean #exploring #traveler',
        'Atardecer desde el otro lado del mundo 🌅 Los colores del cielo aquí son diferentes #sunset #traveling',
        'Nuevo país, nuevas experiencias ✈️ El mundo es demasiado grande para quedarse en casa #adventure',
        'Mercados locales = autenticidad pura 🛍️ Aquí es donde realmente conoces una cultura #locallife',
    ]},
    { category: 'food', descriptions: [
        'La comida callejera siempre sorprende 🍜 Sabores que no olvidaré nunca #foodie #streetfood',
        'Descubrimiento gastronómico del día 🍽️ Este lugar es una joya escondida #foodporn #restaurant',
        'Cocinando con productos locales 👨‍🍳 La frescura hace toda la diferencia #cooking #homemade',
        'Brunch perfecto para domingo ☕ El equilibrio entre dulce y salado #brunch #sundayvibes',
        'Postres que son obras de arte 🍰 Casi da pena comérselos... casi #dessert #foodart',
    ]},
    { category: 'city', descriptions: [
        'Arquitectura que cuenta historias 🏛️ Cada edificio tiene algo que decir #architecture #urban',
        'La ciudad de noche tiene otra cara 🌃 Luces que transforman todo #nightlife #cityscape',
        'Street art que te hace pensar 🎨 Las paredes son el lienzo de la ciudad #streetart #graffiti',
        'Rascacielos que tocan el cielo 🏙️ La ambición humana en forma de edificios #skyline #downtown',
        'Cafeterías con encanto 🏠 Rincones que invitan a quedarse #cafe #cozy #citylife',
    ]},
    { category: 'lifestyle', descriptions: [
        'Momentos con amigos = recuerdos para siempre 👫 La mejor compañía #friends #goodtimes',
        'Domingo de autocuidado 🧘 Invertir en uno mismo nunca es tiempo perdido #selfcare #wellness',
        'Nuevo espacio de trabajo 💻 Donde la creatividad fluye #workspace #productivity #homeoffice',
        'Celebrando los pequeños logros 🎉 Cada paso cuenta en el camino #milestone #grateful',
        'Atardecer desde casa 🌅 A veces la mejor vista está en tu propio balcón #homesweethome',
    ]},
    { category: 'art', descriptions: [
        'Nueva pieza terminada 🎨 Horas de trabajo en cada detalle #art #digitalart #creative',
        'Inspiración en cada esquina 💡 El arte está en todas partes si sabes mirar #inspiration #artist',
        'Experimentando con nuevas técnicas ✨ Salir de la zona de confort es crecer #artwork #learning',
        'Exposición increíble 🖼️ El arte que te hace sentir es el mejor arte #exhibition #museum',
        'Bocetos de la mañana ✏️ Cada trazo es práctica, cada práctica es progreso #sketch #drawing',
    ]},
];

// Gallery posts
const galleryPosts = [
    { category: 'travel', description: '📸 Mi viaje por la costa mediterránea! Cada parada fue más hermosa que la anterior 🌊 #travelgallery #mediterranean #summer', imageCount: 5 },
    { category: 'food', description: '🍕 Food tour completo por el barrio italiano 🇮🇹 No me arrepiento de nada #foodtour #italianfood #gastronomy', imageCount: 4 },
    { category: 'nature', description: '🏔️ Recorrido por los Alpes en 5 días! Cada montaña con su propia personalidad ✨ #alps #hiking #mountainlovers', imageCount: 6 },
    { category: 'city', description: '🏙️ Contrastes arquitectónicos de la ciudad: lo antiguo y lo moderno conviviendo #architecture #contrast #urbanphoto', imageCount: 4 },
    { category: 'art', description: '🎨 Proceso creativo de mi última ilustración - del boceto al resultado final #artprocess #behindthescenes', imageCount: 3 },
    { category: 'lifestyle', description: '✨ Resumen de una semana perfecta con amigos increíbles 💫 #weekendvibes #friendship #memories', imageCount: 5 },
];

// Video posts
const videoPosts = [
    { description: '🎬 Timelapse del atardecer más increíble que he visto 🌅 5 horas resumidas en 30 segundos #timelapse #sunset #cinematic', videoIndex: 0 },
    { description: '🌊 El sonido de las olas es la mejor terapia 🏖️ Guardando este momento para siempre #beach #relax #oceanvibes', videoIndex: 1 },
    { description: '🎉 Momentos épicos del festival de este fin de semana! 🔥 La energía era increíble #festival #livemusic #goodvibes', videoIndex: 2 },
];

// Comment templates
const commentTemplates = [
    '¡Increíble foto! 📸', 'Me encanta este lugar 😍', '¿Dónde es esto? ¡Necesito ir!',
    'Qué colores tan bonitos ✨', 'Esto es espectacular 🔥', 'Guardado para mi próximo viaje 📍',
    '¡Qué envidia sana! Disfruta mucho 🙌', 'La composición es perfecta 👏', 'Necesito saber más sobre este sitio!',
    'Pura inspiración 💫', 'Wow, simplemente wow 😮', '¡Qué talento tienes! 🎨',
    'Esto merece más likes ❤️', 'Acabo de añadirlo a mi lista de deseos ✅', 'La luz en esta foto es increíble 🌟',
    '¿Con qué cámara tomaste esto?', 'Definitivamente voy a visitar 🗺️', '¡Me alegra tanto que compartas esto! 😊',
    'Siempre sorprendiendo con tu contenido 👌', 'Esta es mi nueva foto favorita tuya 💖', 'El detalle es impresionante 🔍',
    '¡Transmite tanta paz! 🧘', 'Literalmente acabo de guardar esto 📱', 'Tu feed es una obra de arte 🖼️',
    '¿Cuándo organizamos un viaje juntos? ✈️',
];

// Cities
const cities = [
    { city: 'Madrid', latitude: 40.4168, longitude: -3.7038 },
    { city: 'Barcelona', latitude: 41.3851, longitude: 2.1734 },
    { city: 'Valencia', latitude: 39.4699, longitude: -0.3763 },
    { city: 'Sevilla', latitude: 37.3891, longitude: -5.9845 },
    { city: 'Bilbao', latitude: 43.2630, longitude: -2.9350 },
    { city: 'Granada', latitude: 37.1773, longitude: -3.5986 },
    { city: 'San Sebastián', latitude: 43.3183, longitude: -1.9812 },
    { city: 'Málaga', latitude: 36.7213, longitude: -4.4213 },
    { city: 'Lisboa', latitude: 38.7223, longitude: -9.1393 },
    { city: 'París', latitude: 48.8566, longitude: 2.3522 },
    { city: 'Roma', latitude: 41.9028, longitude: 12.4964 },
    { city: 'Ámsterdam', latitude: 52.3676, longitude: 4.9041 },
];

// ============== HELPER FUNCTIONS ==============
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomItems = (arr, count) => [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (daysBack) => new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000);

// ============== SEED FUNCTION ==============
async function seed() {
    try {
        console.log('🚀 Conectando a MongoDB...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000 });
        console.log('✅ Conectado a MongoDB');

        console.log('🧹 Limpiando datos existentes...');
        await Promise.all([User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({}), Like.deleteMany({}), Bookmark.deleteMany({})]);

        // Create users
        console.log('\n👥 Creando usuarios...');
        const createdUsers = [];
        for (let i = 0; i < demoUsers.length; i++) {
            const userData = demoUsers[i];
            const user = new User({
                ...userData,
                password: await bcrypt.hash(userData.password, 10),
                isVerified: true,
                profileImage: DEMO_IMAGES.profiles[i],
                coverImage: DEMO_IMAGES.covers[i % DEMO_IMAGES.covers.length],
            });
            await user.save();
            createdUsers.push(user);
            console.log(`  ✅ ${user.nickName}`);
        }

        // Create following relationships
        console.log('\n🔗 Creando relaciones...');
        for (const user of createdUsers) {
            const others = createdUsers.filter(u => u._id.toString() !== user._id.toString());
            const toFollow = getRandomItems(others, getRandomNumber(3, 5));
            user.following = toFollow.map(u => u._id);
            await user.save();
            for (const followed of toFollow) {
                if (!followed.followers.includes(user._id)) {
                    followed.followers.push(user._id);
                    await followed.save();
                }
            }
        }

        // Create posts
        console.log('\n📝 Creando posts...');
        const createdPosts = [];

        // Single image posts
        for (let i = 0; i < 20; i++) {
            const template = getRandomItem(postTemplates);
            const post = new Post({
                userId: getRandomItem(createdUsers)._id,
                description: getRandomItem(template.descriptions),
                multimedia: [{ url: getRandomItem(DEMO_IMAGES.posts[template.category]), type: 'image' }],
                location: getRandomItem(cities),
                likes: getRandomNumber(10, 300),
                createdAt: getRandomDate(30),
            });
            await post.save();
            createdPosts.push(post);
        }
        console.log('  ✅ 20 posts con imagen');

        // Gallery posts
        for (const gallery of galleryPosts) {
            const images = getRandomItems(DEMO_IMAGES.posts[gallery.category], gallery.imageCount);
            const post = new Post({
                userId: getRandomItem(createdUsers)._id,
                description: gallery.description,
                multimedia: images.map(url => ({ url, type: 'image' })),
                location: getRandomItem(cities),
                likes: getRandomNumber(50, 500),
                createdAt: getRandomDate(20),
            });
            await post.save();
            createdPosts.push(post);
        }
        console.log(`  ✅ ${galleryPosts.length} posts galería`);

        // Video posts
        for (const videoPost of videoPosts) {
            const post = new Post({
                userId: getRandomItem(createdUsers)._id,
                description: videoPost.description,
                multimedia: [{ url: DEMO_IMAGES.videos[videoPost.videoIndex], type: 'video' }],
                location: getRandomItem(cities),
                likes: getRandomNumber(100, 600),
                createdAt: getRandomDate(15),
            });
            await post.save();
            createdPosts.push(post);
        }
        console.log(`  ✅ ${videoPosts.length} posts video`);

        // Create comments
        console.log('\n💬 Creando comentarios...');
        let totalComments = 0;
        for (const post of createdPosts) {
            const commenters = getRandomItems(createdUsers, getRandomNumber(2, 8));
            for (const commenter of commenters) {
                await new Comment({
                    userId: commenter._id,
                    postId: post._id,
                    comment: getRandomItem(commentTemplates),
                    createdAt: new Date(post.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
                }).save();
                totalComments++;
            }
        }
        console.log(`  ✅ ${totalComments} comentarios`);

        // Create likes
        console.log('\n❤️ Creando likes...');
        let totalLikes = 0;
        for (const post of createdPosts) {
            const likers = getRandomItems(createdUsers, getRandomNumber(3, 7));
            for (const liker of likers) {
                await new Like({ userId: liker._id, postId: post._id }).save();
                totalLikes++;
            }
            post.likes = likers.length;
            await post.save();
        }
        console.log(`  ✅ ${totalLikes} likes`);

        // Create bookmarks
        console.log('\n🔖 Creando bookmarks...');
        let totalBookmarks = 0;
        for (const user of createdUsers) {
            const postsToBookmark = getRandomItems(createdPosts, getRandomNumber(3, 8));
            for (const post of postsToBookmark) {
                await new Bookmark({ userId: user._id, postId: post._id }).save();
                totalBookmarks++;
            }
        }
        console.log(`  ✅ ${totalBookmarks} bookmarks`);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('🎉 ¡SEED COMPLETADO!');
        console.log('='.repeat(50));
        console.log(`\n📊 RESUMEN:`);
        console.log(`   👥 Usuarios: ${createdUsers.length}`);
        console.log(`   📝 Posts: ${createdPosts.length}`);
        console.log(`   💬 Comentarios: ${totalComments}`);
        console.log(`   ❤️ Likes: ${totalLikes}`);
        console.log(`   🔖 Bookmarks: ${totalBookmarks}`);
        console.log('\n📋 ACCESO: demo@tribe.local / Demo123!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Desconectado');
    }
}

seed();
