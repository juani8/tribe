module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        extensions: ['.ios.js', '.android.js', '.js', '.json'],
        alias: {
          "@assets": "./app/assets",
          "@config": "./app/config",
          "@context": "./app/context",
          "@helper": "./app/helper",
          "@hooks": "./app/hooks",
          "@models": "./app/models",
          "@networking": "./app/networking",
          "@redux": "./app/redux",
          "@ui": "./app/ui",
        },
      },
    ],
    'react-native-reanimated/plugin',  // Move this out into its own array
  ],
};
