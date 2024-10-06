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
          "@navigation": "./app/navigation",
          "@redux": "./app/redux",
          "@ui": "./app/ui",
        },
      },
    ],
  ],
};
