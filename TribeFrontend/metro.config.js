/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const {
    resolver: { sourceExts, assetExts },
} = getDefaultConfig(__dirname);

const config = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
        assetExts: [...assetExts.filter(ext => ext !== 'svg'), 'lottie'],
        sourceExts: [...sourceExts, 'svg'],
        // Excluir módulos de Node.js que no funcionan en React Native
        blockList: [/node_modules\/react-native-dotenv\/index\.js$/],
        extraNodeModules: {
            path: require.resolve('path-browserify'),
            fs: require.resolve('react-native-fs'),
        },
    },
};

module.exports = mergeConfig(defaultConfig, config);